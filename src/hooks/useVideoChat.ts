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

    if (currentMatchId) {
      try {
        await remove(ref(db, `signals/${currentMatchId}`));
      } catch (e) {
        console.error("Failed to remove signals", e);
      }
    }

    if (informPartner && currentPartnerId) {
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

    // Reset our own status
    try {
      await update(ref(db, `onlineUsers/${userId}`), {
        status: 'waiting',
        matchId: null,
        partnerId: null
      });
    } catch (e) {
      console.error("Failed to reset own status", e);
    }

    setPartnerId(null);
    setMatchId(null);
    setRemoteStream(null);
    setStatus('waiting');
    iceQueueRef.current = [];
  }, [matchId, partnerId, userId, cleanupListeners]);

  const detectLocation = useCallback(async () => {
    try {
      const res = await fetch("https://ipapi.co/json/");
      const data = await res.json();
      const locationLabel = `${data.city || 'Somewhere'}, ${data.country_name || 'Earth'}`;
      
      const userRef = ref(db, `onlineUsers/${userId}`);
      await update(userRef, {
        country: data.country_name || "Unknown",
        city: data.city || "Unknown",
        location: locationLabel
      });
      return locationLabel;
    } catch (error) {
      console.error("Location detection failed", error);
      return "Location unavailable";
    }
  }, [userId]);

  // Presence and initial setup
  useEffect(() => {
    const userRef = ref(db, `onlineUsers/${userId}`);
    set(userRef, {
      status: "idle",
      gender: "Both",
      location: "Detecting...",
      lastActive: Date.now()
    });

    detectLocation();

    const interval = setInterval(() => {
      update(userRef, { lastActive: Date.now() });
    }, 10000);

    const handleDisconnect = () => {
      remove(userRef);
    };

    window.addEventListener('beforeunload', handleDisconnect);
    return () => {
      clearInterval(interval);
      handleDisconnect();
      window.removeEventListener('beforeunload', handleDisconnect);
    };
  }, [userId, detectLocation]);

  // Listen for our own status changes
  useEffect(() => {
    const userRef = ref(db, `onlineUsers/${userId}`);
    const unsubscribe = onValue(userRef, (snapshot) => {
      const data = snapshot.val();
      if (!data) return;

      if (data.status === 'in-call' && data.matchId && data.partnerId) {
        if (data.matchId !== matchId) {
          console.log("Inbound match found!", data.partnerId);
          setMatchId(data.matchId);
          setPartnerId(data.partnerId);
          setStatus('in-call');
        }
      } else if (data.status === 'waiting' && status === 'in-call') {
        console.log("Partner left call.");
        cleanupCall(false);
      }
    });
    return () => unsubscribe();
  }, [userId, matchId, status, cleanupCall]);

  const findMatch = useCallback(async () => {
    console.log("Finding match...");
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

    const userRef = ref(db, `onlineUsers/${userId}`);
    await update(userRef, { status: "waiting", matchId: null, partnerId: null });

    const snap = await get(ref(db, "onlineUsers"));
    const users = snap.val() || {};

    const candidates = Object.keys(users).filter(id =>
      id !== userId && 
      users[id].status === "waiting" &&
      (genderFilter === 'Both' || users[id].gender === genderFilter) &&
      (Date.now() - users[id].lastActive < 45000)
    );

    if (candidates.length === 0) {
      console.log("No candidates, waiting...");
      return;
    }

    const targetId = candidates[Math.floor(Math.random() * candidates.length)];
    const newMatchId = `match_${[userId, targetId].sort().join('_')}`;

    const targetRef = ref(db, `onlineUsers/${targetId}`);
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
      console.log("Matched with:", targetId);
      await update(userRef, { 
        status: "in-call", 
        matchId: newMatchId, 
        partnerId: targetId 
      });
      setMatchId(newMatchId);
      setPartnerId(targetId);
      setStatus('in-call');
    } else {
      console.log("Match race lost, retrying...");
      setTimeout(findMatch, 1500);
    }
  }, [userId, genderFilter]);

  const setupPeerConnection = useCallback(async (mId: string, pId: string) => {
    console.log("Initializing RTCPeerConnection:", mId);
    
    if (pcRef.current) pcRef.current.close();
    const pc = new RTCPeerConnection(ICE_SERVERS);
    pcRef.current = pc;
    iceQueueRef.current = [];

    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => {
        pc.addTrack(track, localStreamRef.current!);
      });
    }

    pc.ontrack = (e) => {
      console.log("Remote track received");
      setRemoteStream(e.streams[0]);
    };

    pc.onicecandidate = (e) => {
      if (e.candidate) {
        push(ref(db, `signals/${mId}/iceCandidates`), {
          candidate: e.candidate.toJSON(),
          senderId: userId
        });
      }
    };

    pc.oniceconnectionstatechange = () => {
      if (pc.iceConnectionState === 'failed' || pc.iceConnectionState === 'closed') {
        if (status === 'in-call') cleanupCall();
      }
    };

    // Correct ICE candidate handling with queue
    const iceRef = ref(db, `signals/${mId}/iceCandidates`);
    const unsubIce = onChildAdded(iceRef, (snapshot) => {
      const data = snapshot.val();
      if (data && data.senderId !== userId) {
        const candidate = new RTCIceCandidate(data.candidate);
        if (pc.remoteDescription) {
          pc.addIceCandidate(candidate).catch(err => console.error("ICE error:", err));
        } else {
          iceQueueRef.current.push(data.candidate);
        }
      }
    });
    unsubsRef.current.push(unsubIce);

    const isCaller = userId < pId;

    if (isCaller) {
      console.log("Mode: CALLER");
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
          // Process queued ICE candidates
          while (iceQueueRef.current.length) {
            const cand = iceQueueRef.current.shift();
            pc.addIceCandidate(new RTCIceCandidate(cand!)).catch(err => console.error("Queued ICE error:", err));
          }
        }
      });
      unsubsRef.current.push(unsubAnswer);
    } else {
      console.log("Mode: CALLEE");
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
          // Process queued ICE candidates
          while (iceQueueRef.current.length) {
            const cand = iceQueueRef.current.shift();
            pc.addIceCandidate(new RTCIceCandidate(cand!)).catch(err => console.error("Queued ICE error:", err));
          }
        }
      });
      unsubsRef.current.push(unsubOffer);
    }
  }, [userId, cleanupCall, status]);

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
    update(ref(db, "onlineUsers/" + userId), { gender });
  };

  useEffect(() => {
    if (status === 'in-call' && partnerId) {
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
