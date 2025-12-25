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
  const [selectedGender, setSelectedGender] = useState<'Male' | 'Female'>('Male');
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
      return "Unknown";
    }
  }, [userId]);

  // Add user to online pool on mount
  useEffect(() => {
    const userRef = ref(db, `onlineUsers/${userId}`);
    set(userRef, {
      status: "waiting",
      gender: selectedGender,
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
  }, [userId, selectedGender, detectLocation]);

  const cleanupCall = useCallback(async () => {
    if (pcRef.current) {
      pcRef.current.close();
      pcRef.current = null;
    }
    if (matchId) {
      await remove(ref(db, `signals/${matchId}`));
    }
    setPartnerId(null);
    setMatchId(null);
    setRemoteStream(null);
    setStatus('waiting');
  }, [matchId]);

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
      return;
    }

    // 50/50 gender balancing - try to alternate or pick different gender if possible
    // For now, we'll pick a random one from filtered list
    const partnerUserId = waitingUsers[Math.floor(Math.random() * waitingUsers.length)];
    const newMatchId = `match_${userId}_${partnerUserId}`;

    setMatchId(newMatchId);
    setPartnerId(partnerUserId);

    // Mark both users as in-call
    await update(ref(db, `onlineUsers/${userId}`), { status: "in-call" });
    await update(ref(db, `onlineUsers/${partnerUserId}`), { status: "in-call" });

    setStatus('in-call');
  }, [userId, genderFilter]);

  // Listen for status changes (incoming matches)
  useEffect(() => {
    const userRef = ref(db, `onlineUsers/${userId}`);
    const unsubscribe = onValue(userRef, (snapshot) => {
      const data = snapshot.val();
      if (data && data.status === 'in-call' && status !== 'in-call') {
        // Someone matched with us, find who
        get(ref(db, "onlineUsers")).then(snap => {
          const allUsers = snap.val() || {};
          const match = Object.keys(allUsers).find(id => 
            id !== userId && 
            allUsers[id].status === 'in-call'
            // We'd need a more robust way to know WHICH match we are in, 
            // but for a simple 1:1 matching this works if we listen to signals
          );
          
          if (match) {
            // Check signals to confirm matchId
            // The person who initiates sets the matchId as match_{caller}_{callee}
            // We check both possibilities or wait for the offer signal
          }
        });
      }
    });
    return () => unsubscribe();
  }, [userId, status]);

  // Listen for signals
  useEffect(() => {
    if (status !== 'waiting') return;

    // We listen for offers where we might be the receiver
    // Since matchId is match_{caller}_{callee}, we don't know it yet.
    // A better way is to listen for signals where 'offer' exists and 'matchId' contains our userId
    const signalsRef = ref(db, "signals");
    const unsubscribe = onValue(signalsRef, (snapshot) => {
      const allSignals = snapshot.val();
      if (allSignals) {
        Object.keys(allSignals).forEach(mId => {
          if (mId.includes(userId) && allSignals[mId].offer && !matchId) {
            const parts = mId.split('_');
            const otherId = parts[1] === userId ? parts[2] : parts[1];
            setMatchId(mId);
            setPartnerId(otherId);
            setStatus('in-call');
          }
        });
      }
    });
    return () => unsubscribe();
  }, [userId, status, matchId]);

  const setupWebRTC = useCallback(async () => {
    if (!matchId || !partnerId) return;

    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    setLocalStream(stream);

    const pc = new RTCPeerConnection(ICE_SERVERS);
    pcRef.current = pc;

    stream.getTracks().forEach(track => pc.addTrack(track, stream));

    pc.ontrack = (event) => {
      setRemoteStream(event.streams[0]);
    };

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        push(ref(db, `signals/${matchId}/iceCandidates`), event.candidate.toJSON());
      }
    };

    // Listen for ICE Candidates
    onChildAdded(ref(db, `signals/${matchId}/iceCandidates`), (snap) => {
      const candidate = snap.val();
      if (candidate) {
        pc.addIceCandidate(new RTCIceCandidate(candidate)).catch(e => console.error("Error adding ice candidate", e));
      }
    });

    const isCaller = matchId.startsWith(`match_${userId}_`);

    if (isCaller) {
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      await set(ref(db, `signals/${matchId}/offer`), offer);

      onValue(ref(db, `signals/${matchId}/answer`), async (snap) => {
        const answer = snap.val();
        if (answer && pc.signalingState !== 'stable') {
          await pc.setRemoteDescription(new RTCSessionDescription(answer));
        }
      });
    } else {
      onValue(ref(db, `signals/${matchId}/offer`), async (snap) => {
        const offer = snap.val();
        if (offer && !pc.remoteDescription) {
          await pc.setRemoteDescription(new RTCSessionDescription(offer));
          const answer = await pc.createAnswer();
          await pc.setLocalDescription(answer);
          await set(ref(db, `signals/${matchId}/answer`), answer);
        }
      });
    }

  }, [matchId, partnerId, userId]);

  useEffect(() => {
    if (status === 'in-call' && matchId) {
      setupWebRTC();
    }
  }, [status, matchId, setupWebRTC]);

  const nextMatch = async () => {
    if (pcRef.current) pcRef.current.close();
    await update(ref(db, `onlineUsers/${userId}`), { status: "waiting" });
    if (partnerId) {
      await update(ref(db, `onlineUsers/${partnerId}`), { status: "waiting" });
    }
    await cleanupCall();
    findMatch();
  };

  const blockUser = async () => {
    if (pcRef.current) pcRef.current.close();
    if (partnerId) {
      await remove(ref(db, `onlineUsers/${partnerId}`));
    }
    await update(ref(db, `onlineUsers/${userId}`), { status: "waiting" });
    await cleanupCall();
    findMatch();
  };

  const reportUser = async () => {
    if (pcRef.current) pcRef.current.close();
    if (partnerId) {
      await update(ref(db, `onlineUsers/${partnerId}`), { reported: true });
      await remove(ref(db, `onlineUsers/${partnerId}`));
    }
    await update(ref(db, `onlineUsers/${userId}`), { status: "waiting" });
    await cleanupCall();
    findMatch();
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
    setGenderFilter,
    selectedGender,
    setSelectedGender,
    localVideoRef,
    remoteVideoRef
  };
};
