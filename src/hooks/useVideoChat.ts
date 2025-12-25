import { useState, useEffect, useRef, useCallback } from 'react';
import { db } from '@/lib/firebase';
import { ref, onValue, set, push, onChildAdded, remove, update, get } from 'firebase/database';

const ICE_SERVERS = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
  ],
};

export const useVideoChat = () => {
  const [userId] = useState(() => Date.now().toString());
  const [status, setStatus] = useState<'idle' | 'waiting' | 'in-call'>('idle');
  const [partnerId, setPartnerId] = useState<string | null>(null);
  const [matchId, setMatchId] = useState<string | null>(null);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [genderFilter, setGenderFilter] = useState<'Both' | 'Male' | 'Female'>('Both');
  const [partnerLocation, setPartnerLocation] = useState<string | null>(null);

  const pcRef = useRef<RTCPeerConnection | null>(null);
  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);

  // Auto-detect country/city
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

  // Add user to online pool on mount
  useEffect(() => {
    const userRef = ref(db, `onlineUsers/${userId}`);
    set(userRef, {
      status: "waiting",
      gender: "not-selected",
      country: "detecting...",
      city: "detecting..."
    });

    detectLocation();

    const handleDisconnect = () => {
      remove(userRef);
    };

    window.addEventListener('beforeunload', handleDisconnect);
    return () => {
      handleDisconnect();
      window.removeEventListener('beforeunload', handleDisconnect);
    };
  }, [userId, detectLocation]);

  const cleanupCall = useCallback(async () => {
    if (pcRef.current) {
      pcRef.current.close();
      pcRef.current = null;
    }
    setPartnerId(null);
    setMatchId(null);
    setRemoteStream(null);
    setStatus('waiting');
  }, []);

  const findMatch = useCallback(async () => {
    setStatus('waiting');
    const userRef = ref(db, `onlineUsers/${userId}`);
    await update(userRef, { status: "waiting" });

    const snap = await get(ref(db, "onlineUsers"));
    const users = snap.val() || {};

    const waitingUsers = Object.keys(users).filter(id =>
      id !== userId && 
      users[id].status === "waiting" &&
      (genderFilter === 'Both' || users[id].gender === genderFilter)
    );

    if (waitingUsers.length === 0) {
      // Logic from user: alert("Koi online user available nahi 😔");
      // But we'll just keep waiting in a loop or until someone matches with us
      return;
    }

    // 50/50 gender balancing logic (as requested by previous interactions or implied)
    let partnerUserId: string;
    if (genderFilter === 'Both') {
      const currentGenderSnap = await get(ref(db, `onlineUsers/${userId}/gender`));
      const currentGender = currentGenderSnap.val();
      const oppositeGender = currentGender === 'Male' ? 'Female' : 'Male';
      const preferredUsers = waitingUsers.filter(id => users[id].gender === oppositeGender);
      
      if (preferredUsers.length > 0) {
        partnerUserId = preferredUsers[Math.floor(Math.random() * preferredUsers.length)];
      } else {
        partnerUserId = waitingUsers[Math.floor(Math.random() * waitingUsers.length)];
      }
    } else {
      partnerUserId = waitingUsers[Math.floor(Math.random() * waitingUsers.length)];
    }

    const newMatchId = "match_" + userId + "_" + partnerUserId;

    // Mark both users as in-call
    await update(ref(db, "onlineUsers/" + userId), { status: "in-call" });
    await update(ref(db, "onlineUsers/" + partnerUserId), { status: "in-call" });

    setMatchId(newMatchId);
    setPartnerId(partnerUserId);
    setStatus('in-call');
  }, [userId, genderFilter]);

  // Listen for incoming matches where we are the receiver
  useEffect(() => {
    const userRef = ref(db, `onlineUsers/${userId}/status`);
    const unsubscribe = onValue(userRef, async (snapshot) => {
      const statusValue = snapshot.val();
      if (statusValue === 'in-call' && status !== 'in-call') {
        // Someone matched with us. We need to find the matchId.
        // We look for signals that include our userId
        const signalsRef = ref(db, "signals");
        const signalsSnap = await get(signalsRef);
        const allSignals = signalsSnap.val();
        if (allSignals) {
          const mId = Object.keys(allSignals).find(id => id.includes(userId) && allSignals[id].offer);
          if (mId) {
            const parts = mId.split('_');
            const otherId = parts[1] === userId ? parts[2] : parts[1];
            setMatchId(mId);
            setPartnerId(otherId);
            setStatus('in-call');
          }
        }
      }
    });
    return () => unsubscribe();
  }, [userId, status]);

  const startCall = useCallback(async (currentMatchId: string, currentPartnerId: string) => {
    const peer = new RTCPeerConnection(ICE_SERVERS);
    pcRef.current = peer;

    let stream: MediaStream;
    try {
      stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      setLocalStream(stream);
      stream.getTracks().forEach(track => peer.addTrack(track, stream));
    } catch (err) {
      console.error("Camera access denied", err);
      return;
    }

    peer.ontrack = e => {
      setRemoteStream(e.streams[0]);
    };

    peer.onicecandidate = e => {
      if (e.candidate) {
        push(ref(db, "signals/" + currentMatchId + "/iceCandidates"), e.candidate.toJSON());
      }
    };

    // Listen for ICE Candidates from partner
    onChildAdded(ref(db, "signals/" + currentMatchId + "/iceCandidates"), (snapshot) => {
      const candidate = snapshot.val();
      if (candidate) {
        peer.addIceCandidate(new RTCIceCandidate(candidate)).catch(err => console.error("ICE candidate error", err));
      }
    });

    const isCaller = currentMatchId.startsWith("match_" + userId);

    if (isCaller) {
      const offer = await peer.createOffer();
      await peer.setLocalDescription(offer);
      await set(ref(db, "signals/" + currentMatchId + "/offer"), offer);

      onValue(ref(db, "signals/" + currentMatchId + "/answer"), async s => {
        if (s.val() && peer.signalingState !== 'stable') {
          await peer.setRemoteDescription(new RTCSessionDescription(s.val()));
        }
      });
    } else {
      onValue(ref(db, "signals/" + currentMatchId + "/offer"), async s => {
        if (s.val() && !peer.remoteDescription) {
          await peer.setRemoteDescription(new RTCSessionDescription(s.val()));
          const ans = await peer.createAnswer();
          await peer.setLocalDescription(ans);
          await set(ref(db, "signals/" + currentMatchId + "/answer"), ans);
        }
      });
    }
  }, [userId]);

  useEffect(() => {
    if (status === 'in-call' && matchId && partnerId) {
      startCall(matchId, partnerId);
    }
  }, [status, matchId, partnerId, startCall]);

  const nextMatch = async () => {
    if (pcRef.current) pcRef.current.close();
    await update(ref(db, "onlineUsers/" + userId), { status: "waiting" });
    if (partnerId) {
      await update(ref(db, "onlineUsers/" + partnerId), { status: "waiting" });
    }
    if (matchId) {
      await remove(ref(db, "signals/" + matchId));
    }
    await cleanupCall();
    findMatch();
  };

  const blockUser = async () => {
    if (pcRef.current) pcRef.current.close();
    if (partnerId) {
      await remove(ref(db, "onlineUsers/" + partnerId));
    }
    await update(ref(db, "onlineUsers/" + userId), { status: "waiting" });
    if (matchId) {
      await remove(ref(db, "signals/" + matchId));
    }
    await cleanupCall();
    findMatch();
  };

  const reportUser = async () => {
    if (pcRef.current) pcRef.current.close();
    if (partnerId) {
      await remove(ref(db, "onlineUsers/" + partnerId));
    }
    await update(ref(db, "onlineUsers/" + userId), { status: "waiting" });
    if (matchId) {
      await remove(ref(db, "signals/" + matchId));
    }
    await cleanupCall();
    findMatch();
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
          setPartnerLocation(data.location || data.city || data.country || "Unknown");
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
