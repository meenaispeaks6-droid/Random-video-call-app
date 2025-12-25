import { useState, useEffect, useRef, useCallback } from 'react';
import { db } from '@/lib/firebase';
import { ref, onValue, set, push, onChildAdded, remove, update, get, runTransaction, off } from 'firebase/database';
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
  const listenersRef = useRef<(() => void)[]>([]);
  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);

  const cleanupListeners = useCallback(() => {
    listenersRef.current.forEach(unsub => unsub());
    listenersRef.current = [];
    
    if (matchId) {
      off(ref(db, `signals/${matchId}/offer`));
      off(ref(db, `signals/${matchId}/answer`));
      off(ref(db, `signals/${matchId}/iceCandidates`));
    }
  }, [matchId]);

  const cleanupCall = useCallback(async (informPartner = true) => {
    console.log("Cleaning up call, informPartner:", informPartner);
    
    const currentPartnerId = partnerId;
    const currentMatchId = matchId;

    cleanupListeners();

    if (pcRef.current) {
      pcRef.current.close();
      pcRef.current = null;
    }

    // Stop remote tracks
    if (remoteStream) {
      remoteStream.getTracks().forEach(track => track.stop());
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

    // Always reset our own status to waiting when skipping
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
  }, [matchId, partnerId, userId, cleanupListeners, remoteStream]);

  const detectLocation = useCallback(async () => {
    try {
      const res = await fetch("https://ipapi.co/json/");
      const data = await res.json();
      const locationLabel = `${data.city}, ${data.country_name}`;
      
      const userRef = ref(db, `onlineUsers/${userId}`);
      await update(userRef, {
        country: data.country_name,
        city: data.city,
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
      location: "detecting...",
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

  // Listen for our own status changes (incoming matches or partner skipping)
  useEffect(() => {
    const userRef = ref(db, `onlineUsers/${userId}`);
    const unsubscribe = onValue(userRef, (snapshot) => {
      const data = snapshot.val();
      if (!data) return;

      if (data.status === 'in-call' && data.matchId && data.partnerId) {
        if (data.matchId !== matchId) {
          console.log("Matched with:", data.partnerId);
          setMatchId(data.matchId);
          setPartnerId(data.partnerId);
          setStatus('in-call');
        }
      } else if (data.status === 'waiting' && status === 'in-call') {
        console.log("Partner ended the call.");
        cleanupCall(false); // Don't inform partner, they already ended it
      }
    });
    return () => unsubscribe();
  }, [userId, matchId, status, cleanupCall]);

  const findMatch = useCallback(async () => {
    console.log("Starting matchmaking...");
    setStatus('waiting');
    
    if (!localStreamRef.current) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        localStreamRef.current = stream;
        setLocalStream(stream);
      } catch (err) {
        console.error("Camera access denied", err);
        alert("Please enable camera/microphone access to start video chat.");
        setStatus('idle');
        return;
      }
    }

    const userRef = ref(db, `onlineUsers/${userId}`);
    await update(userRef, { status: "waiting", matchId: null, partnerId: null });

    const snap = await get(ref(db, "onlineUsers"));
    const users = snap.val() || {};

    const waitingUsers = Object.keys(users).filter(id =>
      id !== userId && 
      users[id].status === "waiting" &&
      (genderFilter === 'Both' || users[id].gender === genderFilter) &&
      (Date.now() - users[id].lastActive < 30000)
    );

    if (waitingUsers.length === 0) {
      console.log("No waiting users found. Waiting for someone to pick me.");
      return;
    }

    const targetId = waitingUsers[Math.floor(Math.random() * waitingUsers.length)];
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
      console.log("Successfully matched with:", targetId);
      await update(userRef, { 
        status: "in-call", 
        matchId: newMatchId, 
        partnerId: targetId 
      });
      setMatchId(newMatchId);
      setPartnerId(targetId);
      setStatus('in-call');
    } else {
      console.log("Transaction failed, target no longer waiting.");
      setTimeout(findMatch, 1000);
    }
  }, [userId, genderFilter]);

  const setupPeerConnection = useCallback(async (mId: string, pId: string) => {
    console.log("Setting up PeerConnection for match:", mId);
    
    if (pcRef.current) {
      pcRef.current.close();
    }

    const pc = new RTCPeerConnection(ICE_SERVERS);
    pcRef.current = pc;

    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => {
        pc.addTrack(track, localStreamRef.current!);
      });
    }

    pc.ontrack = (event) => {
      console.log("Received remote track");
      setRemoteStream(event.streams[0]);
    };

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        push(ref(db, `signals/${mId}/iceCandidates`), {
          candidate: event.candidate.toJSON(),
          senderId: userId
        });
      }
    };

    pc.oniceconnectionstatechange = () => {
      console.log("ICE connection state:", pc.iceConnectionState);
      if (pc.iceConnectionState === 'disconnected' || pc.iceConnectionState === 'failed' || pc.iceConnectionState === 'closed') {
        // Only cleanup if we are still supposedly in a call
        if (status === 'in-call') {
          cleanupCall();
        }
      }
    };

    const iceRef = ref(db, `signals/${mId}/iceCandidates`);
    const unsubIce = onChildAdded(iceRef, (snapshot) => {
      const data = snapshot.val();
      if (data && data.senderId !== userId) {
        pc.addIceCandidate(new RTCIceCandidate(data.candidate)).catch(e => console.error("Error adding ICE candidate", e));
      }
    });
    listenersRef.current.push(() => off(iceRef, 'child_added', unsubIce));

    const isCaller = userId < pId;

    if (isCaller) {
      console.log("Acting as Caller");
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      await set(ref(db, `signals/${mId}/offer`), {
        type: offer.type,
        sdp: offer.sdp,
        senderId: userId
      });

      const answerRef = ref(db, `signals/${mId}/answer`);
      const unsubAnswer = onValue(answerRef, async (snapshot) => {
        const data = snapshot.val();
        if (data && data.senderId !== userId && pc.signalingState === 'have-local-offer') {
          await pc.setRemoteDescription(new RTCSessionDescription(data));
        }
      });
      listenersRef.current.push(() => off(answerRef, 'value', unsubAnswer));
    } else {
      console.log("Acting as Callee");
      const offerRef = ref(db, `signals/${mId}/offer`);
      const unsubOffer = onValue(offerRef, async (snapshot) => {
        const data = snapshot.val();
        if (data && data.senderId !== userId && pc.signalingState === 'stable') {
          await pc.setRemoteDescription(new RTCSessionDescription(data));
          const answer = await pc.createAnswer();
          await pc.setLocalDescription(answer);
          await set(ref(db, `signals/${mId}/answer`), {
            type: answer.type,
            sdp: answer.sdp,
            senderId: userId
          });
        }
      });
      listenersRef.current.push(() => off(offerRef, 'value', unsubOffer));
    }
  }, [userId, cleanupCall, status]);

  useEffect(() => {
    if (status === 'in-call' && matchId && partnerId) {
      setupPeerConnection(matchId, partnerId);
    }
  }, [status, matchId, partnerId, setupPeerConnection]);

  const nextMatch = async () => {
    await cleanupCall(true);
    findMatch();
  };

  const blockUser = async () => {
    if (partnerId) {
      console.log("Blocking user:", partnerId);
    }
    await nextMatch();
  };

  const reportUser = async () => {
    if (partnerId) {
       console.log("Reporting user:", partnerId);
    }
    await nextMatch();
  };

  const applyGenderFilter = (gender: 'Both' | 'Male' | 'Female') => {
    setGenderFilter(gender);
    update(ref(db, "onlineUsers/" + userId), { gender });
  };

  useEffect(() => {
    if (status === 'in-call' && partnerId) {
      const partnerRef = ref(db, `onlineUsers/${partnerId}`);
      get(partnerRef).then(snap => {
        const data = snap.val();
        if (data) {
          setPartnerLocation(data.location || "Unknown");
        }
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
    blockUser,
    reportUser,
    genderFilter,
    setGenderFilter: applyGenderFilter,
    localVideoRef,
    remoteVideoRef
  };
};
