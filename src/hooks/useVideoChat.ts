import { useState, useEffect, useRef, useCallback } from 'react';
import { db } from '@/lib/firebase';
import { ref, onValue, set, push, onChildAdded, remove, update, get, query, orderByChild, equalTo } from 'firebase/database';

const ICE_SERVERS = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
  ],
};

export const useVideoChat = () => {
  const [userId] = useState(() => `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
  const [status, setStatus] = useState<'idle' | 'waiting' | 'matching' | 'in-call'>('idle');
  const [partnerId, setPartnerId] = useState<string | null>(null);
  const [matchId, setMatchId] = useState<string | null>(null);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [genderFilter, setGenderFilter] = useState<'Both' | 'Male' | 'Female'>('Both');
  const [userGender] = useState<'Male' | 'Female' | 'Trans'>(() => {
    const genders: ('Male' | 'Female' | 'Trans')[] = ['Male', 'Female', 'Trans'];
    return genders[Math.floor(Math.random() * genders.length)];
  });

  const pcRef = useRef<RTCPeerConnection | null>(null);
  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);

  const [partnerLocation, setPartnerLocation] = useState<string | null>(null);

  // Initialize User in Firebase
  useEffect(() => {
    const userRef = ref(db, `onlineUsers/${userId}`);
    // Simple mock location for now
    const locations = ['Rohini, India', 'Mumbai, India', 'New York, USA', 'London, UK', 'Tokyo, Japan'];
    const location = locations[Math.floor(Math.random() * locations.length)];
    
    set(userRef, {
      status: 'idle',
      gender: userGender,
      location,
      lastSeen: Date.now(),
    });

    const handleDisconnect = () => {
      remove(userRef);
    };

    window.addEventListener('beforeunload', handleDisconnect);
    return () => {
      handleDisconnect();
      window.removeEventListener('beforeunload', handleDisconnect);
    };
  }, [userId, userGender]);

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
  }, [matchId]);

  const startMatchmaking = useCallback(async () => {
    await cleanupCall();
    setStatus('waiting');
    const userRef = ref(db, `onlineUsers/${userId}`);
    await update(userRef, { status: 'waiting' });

    // Try to find a partner
    const onlineUsersRef = ref(db, 'onlineUsers');
    const snapshot = await get(onlineUsersRef);
    const users = snapshot.val();

    if (users) {
      const waitingUsers = Object.keys(users).filter(id => 
        id !== userId && 
        users[id].status === 'waiting' &&
        (genderFilter === 'Both' || users[id].gender === genderFilter)
      );

      if (waitingUsers.length > 0) {
        const selectedPartnerId = waitingUsers[Math.floor(Math.random() * waitingUsers.length)];
        const newMatchId = `match_${[userId, selectedPartnerId].sort().join('_')}`;
        
        setMatchId(newMatchId);
        setPartnerId(selectedPartnerId);
        
        // Update statuses
        await update(ref(db, `onlineUsers/${userId}`), { status: 'in-call' });
        await update(ref(db, `onlineUsers/${selectedPartnerId}`), { status: 'in-call' });
        
        setStatus('in-call');
      }
    }
  }, [userId, genderFilter, cleanupCall]);

  // Listen for incoming matches if we are "waiting"
  useEffect(() => {
    if (status !== 'waiting') return;

    const userRef = ref(db, `onlineUsers/${userId}`);
    const unsubscribe = onValue(userRef, (snapshot) => {
      const data = snapshot.val();
      if (data && data.status === 'in-call') {
        // Find who matched with us
        const onlineUsersRef = ref(db, 'onlineUsers');
        get(onlineUsersRef).then(snap => {
          const allUsers = snap.val();
          const match = Object.keys(allUsers).find(id => 
            id !== userId && 
            allUsers[id].status === 'in-call' &&
            // This is a bit simplified, ideally we'd have a match record
            true 
          );
          if (match) {
            const newMatchId = `match_${[userId, match].sort().join('_')}`;
            setMatchId(newMatchId);
            setPartnerId(match);
            setStatus('in-call');
          }
        });
      }
    });

    return () => unsubscribe();
  }, [status, userId]);

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
        push(ref(db, `signals/${matchId}/iceCandidates/${userId}`), event.candidate.toJSON());
      }
    };

    // Signaling
    const signalsRef = ref(db, `signals/${matchId}`);
    
    // Check if offer exists
    const snapshot = await get(signalsRef);
    const data = snapshot.val();

    if (!data || !data.offer) {
      // Create Offer
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      await set(ref(db, `signals/${matchId}/offer`), {
        type: offer.type,
        sdp: offer.sdp,
        from: userId
      });
    } else if (data.offer.from !== userId) {
      // Handle Offer, Create Answer
      await pc.setRemoteDescription(new RTCSessionDescription(data.offer));
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      await set(ref(db, `signals/${matchId}/answer`), {
        type: answer.type,
        sdp: answer.sdp,
      });
    }

    // Listen for Answer
    if (!data || !data.answer) {
      onValue(ref(db, `signals/${matchId}/answer`), async (snap) => {
        const answer = snap.val();
        if (answer && pc.signalingState !== 'stable') {
          await pc.setRemoteDescription(new RTCSessionDescription(answer));
        }
      });
    }

    // Listen for ICE Candidates
    onChildAdded(ref(db, `signals/${matchId}/iceCandidates/${partnerId}`), async (snap) => {
      const candidate = snap.val();
      if (candidate) {
        await pc.addIceCandidate(new RTCIceCandidate(candidate));
      }
    });

  }, [matchId, partnerId, userId]);

  useEffect(() => {
    if (status === 'in-call' && matchId) {
      setupWebRTC();
    }
  }, [status, matchId, setupWebRTC]);

  const nextMatch = async () => {
    await cleanupCall();
    startMatchmaking();
  };

  const blockUser = async () => {
    if (partnerId) {
      await remove(ref(db, `onlineUsers/${partnerId}`));
    }
    nextMatch();
  };

  useEffect(() => {
    if (status === 'in-call' && partnerId) {
      const partnerRef = ref(db, `onlineUsers/${partnerId}`);
      get(partnerRef).then(snap => {
        const data = snap.val();
        if (data && data.location) {
          setPartnerLocation(data.location);
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
    startMatchmaking,
    nextMatch,
    blockUser,
    genderFilter,
    setGenderFilter,
    localVideoRef,
    remoteVideoRef
  };
};
