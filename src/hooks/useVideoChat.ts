import { useState, useEffect, useRef, useCallback } from 'react';
import { db } from '@/lib/firebase';
import { ref, onValue, set, push, onChildAdded, remove, update, get, runTransaction, Unsubscribe } from 'firebase/database';
import { useAuth } from './useAuth';
import { createClient } from '@/lib/supabase/client';

const ICE_SERVERS = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
    { urls: 'stun:stun2.l.google.com:19302' },
  ],
};

export const useVideoChat = () => {
  const { user: authUser } = useAuth();
  const supabase = createClient();
  const [userId, setUserId] = useState<string>(() => authUser?.id || `user_${Math.random().toString(36).substr(2, 9)}`);
  
  useEffect(() => {
    if (authUser?.id) {
      setUserId(authUser.id);
    }
  }, [authUser?.id]);

  const [status, setStatus] = useState<'idle' | 'waiting' | 'in-call'>('idle');
  const [partnerId, setPartnerId] = useState<string | null>(null);
  const [matchId, setMatchId] = useState<string | null>(null);
  const [isInitiator, setIsInitiator] = useState(false);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [genderFilter, setGenderFilter] = useState<'Both' | 'Male' | 'Female'>('Both');
  const [partnerLocation, setPartnerLocation] = useState<string | null>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [isMutualMatch, setIsMutualMatch] = useState(false);

  const pcRef = useRef<RTCPeerConnection | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const unsubsRef = useRef<Unsubscribe[]>([]);
  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
  const iceQueueRef = useRef<RTCIceCandidateInit[]>([]);

  const cleanupListeners = useCallback(() => {
    console.log("Cleaning up listeners...", unsubsRef.current.length);
    unsubsRef.current.forEach(unsub => unsub());
    unsubsRef.current = [];
  }, []);

  const cleanupCall = useCallback(async (informPartner = true) => {
    console.log("Cleaning up call, informPartner:", informPartner);
    
    const currentPartnerId = partnerId;
    const currentMatchId = matchId;

    cleanupListeners();

    if (pcRef.current) {
      pcRef.current.close();
      pcRef.current = null;
    }

    if (currentMatchId && db && isInitiator) {
      try {
        await remove(ref(db, `signals/${currentMatchId}`));
      } catch (e) {
        console.error("Failed to remove signals", e);
      }
    }

    if (informPartner && currentPartnerId && db) {
      try {
        await update(ref(db, `onlineUsers/${currentPartnerId}`), {
          status: 'waiting',
          matchId: null,
          partnerId: null,
          isInitiator: false
        });
      } catch (e) {
        console.error("Failed to reset partner status", e);
      }
    }

    if (db) {
      try {
        await update(ref(db, `onlineUsers/${userId}`), {
          status: 'waiting',
          matchId: null,
          partnerId: null,
          isInitiator: false
        });
      } catch (e) {
        console.error("Failed to reset own status", e);
      }
    }

    setPartnerId(null);
    setMatchId(null);
    setIsInitiator(false);
    setRemoteStream(null);
    setStatus('waiting');
    setIsLiked(false);
    setIsMutualMatch(false);
    iceQueueRef.current = [];
  }, [userId, cleanupListeners, partnerId, matchId, isInitiator]);

  const findMatch = useCallback(async () => {
    if (status === 'in-call') return;
    
    console.log("Searching for match...");
    setStatus('waiting');
    
    if (!localStreamRef.current) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        localStreamRef.current = stream;
        setLocalStream(stream);
      } catch (err) {
        console.error("Media error:", err);
        alert("Camera and Microphone access are required.");
        setStatus('idle');
        return;
      }
    }

    if (!db) {
      console.warn("Firebase Database not initialized");
      return;
    }

    const userRef = ref(db, `onlineUsers/${userId}`);
    
    const selfSnap = await get(userRef);
    if (selfSnap.val()?.status === 'in-call') return;

    await update(userRef, { 
      status: "waiting", 
      matchId: null, 
      partnerId: null,
      isInitiator: false,
      lastActive: Date.now() 
    });

    const snap = await get(ref(db, "onlineUsers"));
    const users = snap.val() || {};

    const now = Date.now();
    const candidates = Object.keys(users).filter(id =>
      id !== userId && 
      users[id].status === "waiting" &&
      (genderFilter === 'Both' || users[id].gender === genderFilter) &&
      (now - (users[id].lastActive || 0) < 60000)
    );

    if (candidates.length === 0) {
      console.log("No candidates found.");
      return;
    }

    const targetId = candidates[Math.floor(Math.random() * candidates.length)];
    const newMatchId = `match_${[userId, targetId].sort().join('_')}`;

    const targetRef = ref(db, `onlineUsers/${targetId}`);
    try {
      const result = await runTransaction(targetRef, (currentData) => {
        if (currentData && currentData.status === "waiting") {
          currentData.status = "in-call";
          currentData.matchId = newMatchId;
          currentData.partnerId = userId;
          currentData.isInitiator = false;
          return currentData;
        }
        return undefined;
      });

      if (result.committed) {
        console.log("Transaction success, matched with:", targetId);
        await update(userRef, { 
          status: "in-call", 
          matchId: newMatchId, 
          partnerId: targetId,
          isInitiator: true 
        });
        setMatchId(newMatchId);
        setPartnerId(targetId);
        setIsInitiator(true);
        setStatus('in-call');
      } else {
        console.log("Transaction failed (race), retrying search...");
        setTimeout(findMatch, 1000);
      }
    } catch (e) {
      console.error("Transaction error", e);
      setTimeout(findMatch, 2000);
    }
  }, [userId, genderFilter, status]);

  const setupPeerConnection = useCallback(async (mId: string, pId: string, initiator: boolean) => {
    console.log("Setting up WebRTC for match:", mId, "Initiator:", initiator);
    
    cleanupListeners();
    if (pcRef.current) {
      pcRef.current.close();
    }

    const pc = new RTCPeerConnection(ICE_SERVERS);
    pcRef.current = pc;
    iceQueueRef.current = [];

    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => {
        pc.addTrack(track, localStreamRef.current!);
      });
    }

    pc.ontrack = (e) => {
      console.log("Remote stream received");
      setRemoteStream(e.streams[0]);
    };

    pc.onicecandidate = (e) => {
      if (e.candidate && db) {
        push(ref(db, `signals/${mId}/iceCandidates`), {
          candidate: e.candidate.toJSON(),
          senderId: userId
        });
      }
    };

    pc.oniceconnectionstatechange = () => {
      console.log("ICE State:", pc.iceConnectionState);
      if (pc.iceConnectionState === 'failed' || pc.iceConnectionState === 'closed') {
        cleanupCall(false);
      }
    };

    if (!db) return;

    if (initiator) {
      await remove(ref(db, `signals/${mId}`));
    }

    const iceRef = ref(db, `signals/${mId}/iceCandidates`);
    const unsubIce = onChildAdded(iceRef, (snapshot) => {
      const data = snapshot.val();
      if (data && data.senderId !== userId) {
        const candidate = new RTCIceCandidate(data.candidate);
        if (pc.remoteDescription && pc.remoteDescription.type) {
          pc.addIceCandidate(candidate).catch(e => console.warn("Add ICE failed", e));
        } else {
          iceQueueRef.current.push(data.candidate);
        }
      }
    });
    unsubsRef.current.push(unsubIce);

    if (initiator) {
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      await set(ref(db, `signals/${mId}/offer`), {
        type: offer.type,
        sdp: offer.sdp,
        senderId: userId
      });

      const answerRef = ref(db, `signals/${mId}/answer`);
      const unsubAnswer = onValue(answerRef, async (snap) => {
        const data = snap.val();
        if (data && data.senderId !== userId && pc.signalingState === 'have-local-offer') {
          await pc.setRemoteDescription(new RTCSessionDescription(data));
          while (iceQueueRef.current.length > 0) {
            const cand = iceQueueRef.current.shift();
            pc.addIceCandidate(new RTCIceCandidate(cand!)).catch(e => console.warn("Add queued ICE failed", e));
          }
        }
      });
      unsubsRef.current.push(unsubAnswer);
    } else {
      const offerRef = ref(db, `signals/${mId}/offer`);
      const unsubOffer = onValue(offerRef, async (snap) => {
        const data = snap.val();
        if (data && data.senderId !== userId && pc.signalingState === 'stable') {
          await pc.setRemoteDescription(new RTCSessionDescription(data));
          const answer = await pc.createAnswer();
          await pc.setLocalDescription(answer);
          await set(ref(db, `signals/${mId}/answer`), {
            type: answer.type,
            sdp: answer.sdp,
            senderId: userId
          });
          while (iceQueueRef.current.length > 0) {
            const cand = iceQueueRef.current.shift();
            pc.addIceCandidate(new RTCIceCandidate(cand!)).catch(e => console.warn("Add queued ICE failed", e));
          }
        }
      });
      unsubsRef.current.push(unsubOffer);
    }
  }, [userId, cleanupCall, cleanupListeners]);

  useEffect(() => {
    if (!db) return;
    const userRef = ref(db, `onlineUsers/${userId}`);
    const updatePresence = async () => {
      try {
        await update(userRef, {
          lastActive: Date.now(),
          gender: genderFilter,
          location: "Global",
          ...(status !== 'in-call' ? { status: status === 'waiting' ? 'waiting' : 'idle' } : {})
        });
      } catch (e) {
        console.error("Presence update failed", e);
      }
    };
    updatePresence();
    const interval = setInterval(updatePresence, 10000);
    const unsubStatus = onValue(userRef, (snapshot) => {
      const data = snapshot.val();
      if (data && data.status === 'in-call' && data.partnerId && data.matchId) {
        if (status !== 'in-call') {
          setPartnerId(data.partnerId);
          setMatchId(data.matchId);
          setIsInitiator(!!data.isInitiator);
          setStatus('in-call');
        }
      } else if (data && data.status === 'waiting' && status === 'in-call') {
        cleanupCall(false);
      }
    });
    return () => {
      clearInterval(interval);
      unsubStatus();
      remove(userRef).catch(() => {});
    };
  }, [userId, status, genderFilter, cleanupCall]);

  useEffect(() => {
    if (status === 'waiting' && !partnerId) {
      const interval = setInterval(() => findMatch(), 4000);
      return () => clearInterval(interval);
    }
  }, [status, partnerId, findMatch]);

  useEffect(() => {
    if (status === 'in-call' && matchId && partnerId) {
      setupPeerConnection(matchId, partnerId, isInitiator);
    }
  }, [status, matchId, partnerId, isInitiator, setupPeerConnection]);

  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream, status]);

  useEffect(() => {
    if (remoteVideoRef.current && remoteStream) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [remoteStream, status]);

  const nextMatch = async () => {
    await cleanupCall(true);
    findMatch();
  };

  const applyGenderFilter = (gender: 'Both' | 'Male' | 'Female') => {
    setGenderFilter(gender);
    if (db) {
      update(ref(db, "onlineUsers/" + userId), { gender });
    }
  };

  useEffect(() => {
    if (status === 'in-call' && partnerId && db) {
      get(ref(db, `onlineUsers/${partnerId}`)).then(snap => {
        const data = snap.val();
        if (data) setPartnerLocation(data.location || "Earth");
      });
    } else {
      setPartnerLocation(null);
    }
  }, [status, partnerId]);

  const likePartner = async () => {
    if (!partnerId || !userId || isLiked) return;
    
    setIsLiked(true);
    
    try {
      // 1. Record like in Supabase
      await supabase.from('likes').upsert({ user_id: userId, target_id: partnerId });
      
      // 2. Check if partner liked us
      const { data: partnerLike } = await supabase
        .from('likes')
        .select('*')
        .eq('user_id', partnerId)
        .eq('target_id', userId)
        .single();
        
      if (partnerLike) {
        setIsMutualMatch(true);
        // 3. Record friendship
        const [u1, u2] = [userId, partnerId].sort();
        await supabase.from('friends').upsert({ user_1: u1, user_2: u2 });
      }
    } catch (e) {
      console.error("Failed to like partner", e);
    }
  };

  return {
    userId,
    status,
    partnerId,
    partnerLocation,
    localStream,
    remoteStream,
    startMatchmaking: findMatch,
    nextMatch,
    blockUser: nextMatch,
    reportUser: nextMatch,
    genderFilter,
    setGenderFilter: applyGenderFilter,
    localVideoRef,
    remoteVideoRef,
    likePartner,
    isLiked,
    isMutualMatch
  };
};
