import { useState, useEffect, useRef, useCallback } from 'react';
import { db } from '@/lib/firebase';
import { ref, onValue, set, push, onChildAdded, remove, update, get, runTransaction, Unsubscribe } from 'firebase/database';
import { useAuth } from './useAuth';

const ICE_SERVERS = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
    { urls: 'stun:stun2.l.google.com:19302' },
  ],
};

export const useVideoChat = () => {
  const { user: authUser } = useAuth();
  const [userId] = useState(() => authUser?.id || `user_${Math.random().toString(36).substr(2, 9)}`);
  const [status, setStatus] = useState<'idle' | 'waiting' | 'in-call'>('idle');
  const [partnerId, setPartnerId] = useState<string | null>(null);
  const [matchId, setMatchId] = useState<string | null>(null);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [genderFilter, setGenderFilter] = useState<'Both' | 'Male' | 'Female'>('Both');
  const [partnerLocation, setPartnerLocation] = useState<string | null>(null);

  const pcRef = useRef<RTCPeerConnection | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const unsubsRef = useRef<Unsubscribe[]>([]);
  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
  const iceQueueRef = useRef<RTCIceCandidateInit[]>([]);

  // Heartbeat to keep user active in matchmaking pool
  useEffect(() => {
    if (!db) return;
    
    const userRef = ref(db, `onlineUsers/${userId}`);
    
    const updatePresence = async () => {
      try {
        await update(userRef, {
          lastActive: Date.now(),
          gender: genderFilter,
          // Only update status if it's not already in-call
          ...(status !== 'in-call' ? { status: status === 'waiting' ? 'waiting' : 'idle' } : {})
        });
      } catch (e) {
        console.error("Presence update failed", e);
      }
    };

    updatePresence();
    const interval = setInterval(updatePresence, 10000);

    return () => {
      clearInterval(interval);
      // Optional: don't remove immediately on refresh to allow reconnection, 
      // but for matchmaking, we should probably set to offline or remove
      remove(userRef).catch(() => {});
    };
  }, [userId, status, genderFilter]);

  const cleanupListeners = useCallback(() => {
    console.log("Cleaning up listeners...", unsubsRef.current.length);
    unsubsRef.current.forEach(unsub => unsub());
    unsubsRef.current = [];
  }, []);

  const cleanupCall = useCallback(async (informPartner = true) => {
    console.log("Cleaning up call, informPartner:", informPartner);
    
    // Use refs to avoid dependency on matchId/partnerId in the callback identity
    const currentPartnerId = partnerId;
    const currentMatchId = matchId;

    cleanupListeners();

    if (pcRef.current) {
      pcRef.current.close();
      pcRef.current = null;
    }

    if (currentMatchId && db) {
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
          partnerId: null
        });
      } catch (e) {
        console.error("Failed to reset partner status", e);
      }
    }

    // Reset our own status in DB
    if (db) {
      try {
        await update(ref(db, `onlineUsers/${userId}`), {
          status: 'waiting',
          matchId: null,
          partnerId: null
        });
      } catch (e) {
        console.error("Failed to reset own status", e);
      }
    }

    setPartnerId(null);
    setMatchId(null);
    setRemoteStream(null);
    setStatus('waiting');
    iceQueueRef.current = [];
  }, [userId, cleanupListeners, partnerId, matchId]); // Keep these for now but matchId/partnerId are needed to know who to inform

  const findMatch = useCallback(async () => {
    // Avoid multiple concurrent searches
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
    await update(userRef, { 
      status: "waiting", 
      matchId: null, 
      partnerId: null,
      lastActive: Date.now() 
    });

    const snap = await get(ref(db, "onlineUsers"));
    const users = snap.val() || {};

    const now = Date.now();
    const candidates = Object.keys(users).filter(id =>
      id !== userId && 
      users[id].status === "waiting" &&
      (genderFilter === 'Both' || users[id].gender === genderFilter) &&
      (now - (users[id].lastActive || 0) < 60000) // Relaxed to 60s
    );

    if (candidates.length === 0) {
      console.log("No candidates found.");
      return;
    }

    const targetId = candidates[Math.floor(Math.random() * candidates.length)];
    const newMatchId = `match_${[userId, targetId].sort().join('_')}_${Date.now()}`;

    const targetRef = ref(db, `onlineUsers/${targetId}`);
    try {
      const result = await runTransaction(targetRef, (currentData) => {
        if (currentData && currentData.status === "waiting") {
          currentData.status = "in-call";
          currentData.matchId = newMatchId;
          currentData.partnerId = userId;
          return currentData;
        }
        return undefined;
      });

      if (result.committed) {
        console.log("Transaction success, matched with:", targetId);
        await update(userRef, { 
          status: "in-call", 
          matchId: newMatchId, 
          partnerId: targetId 
        });
        setMatchId(newMatchId);
        setPartnerId(targetId);
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

  // Polling for matches
  useEffect(() => {
    if (status !== 'waiting' || partnerId) return;
    
    const interval = setInterval(() => {
      findMatch();
    }, 4000);
    
    return () => clearInterval(interval);
  }, [status, partnerId, findMatch]);


  const setupPeerConnection = useCallback(async (mId: string, pId: string) => {
    console.log("Setting up WebRTC for match:", mId);
    
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
      if (pc.iceConnectionState === 'failed' || pc.iceConnectionState === 'disconnected' || pc.iceConnectionState === 'closed') {
        // Don't immediately cleanup on 'disconnected' as it might reconnect
        if (pc.iceConnectionState === 'failed' || pc.iceConnectionState === 'closed') {
          cleanupCall(false);
        }
      }
    };

    const database = db;
    if (!database) return;

    const iceRef = ref(database, `signals/${mId}/iceCandidates`);
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

    const isCaller = userId < pId;

    if (isCaller) {
      console.log("Role: CALLER");
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      await set(ref(database, `signals/${mId}/offer`), {
        type: offer.type,
        sdp: offer.sdp,
        senderId: userId
      });

      const answerRef = ref(database, `signals/${mId}/answer`);
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
      console.log("Role: CALLEE");
      const offerRef = ref(database, `signals/${mId}/offer`);
      const unsubOffer = onValue(offerRef, async (snap) => {
        const data = snap.val();
        if (data && data.senderId !== userId && pc.signalingState === 'stable') {
          await pc.setRemoteDescription(new RTCSessionDescription(data));
          const answer = await pc.createAnswer();
          await pc.setLocalDescription(answer);
          await set(ref(database, `signals/${mId}/answer`), {
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
    if (status === 'in-call' && matchId && partnerId) {
      setupPeerConnection(matchId, partnerId);
    }
  }, [status, matchId, partnerId, setupPeerConnection]);

  // Handle Video Element Assignment
  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream, status]); // Re-run when status changes (video mounts)

  useEffect(() => {
    if (remoteVideoRef.current && remoteStream) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [remoteStream, status]); // Re-run when status changes (video mounts)

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
    remoteVideoRef
  };
};
