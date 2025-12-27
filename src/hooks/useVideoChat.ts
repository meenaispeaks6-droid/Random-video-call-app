import { useState, useEffect, useRef, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
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
  const [userLocation, setUserLocation] = useState<string | null>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [isMutualMatch, setIsMutualMatch] = useState(false);

  const pcRef = useRef<RTCPeerConnection | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
  const iceQueueRef = useRef<RTCIceCandidateInit[]>([]);
  const signalChannelRef = useRef<any>(null);

  const cleanupCall = useCallback(async (informPartner = true) => {
    console.log("Cleaning up call, informPartner:", informPartner);
    
    const currentPartnerId = partnerId;
    const currentMatchId = matchId;

    if (signalChannelRef.current) {
      supabase.removeChannel(signalChannelRef.current);
      signalChannelRef.current = null;
    }

    if (pcRef.current) {
      pcRef.current.close();
      pcRef.current = null;
    }

    if (currentMatchId && isInitiator) {
      try {
        await supabase.from('signals').delete().eq('match_id', currentMatchId);
      } catch (e) {
        console.error("Failed to remove signals", e);
      }
    }

    if (informPartner && currentPartnerId) {
      try {
        await supabase.from('online_users').update({
          status: 'waiting',
          match_id: null,
          partner_id: null,
          is_initiator: false
        }).eq('id', currentPartnerId);
      } catch (e) {
        console.error("Failed to reset partner status", e);
      }
    }

    try {
      await supabase.from('online_users').update({
        status: 'waiting',
        match_id: null,
        partner_id: null,
        is_initiator: false
      }).eq('id', userId);
    } catch (e) {
      console.error("Failed to reset own status", e);
    }

    setPartnerId(null);
    setMatchId(null);
    setIsInitiator(false);
    setRemoteStream(null);
    setStatus('waiting');
    setIsLiked(false);
    setIsMutualMatch(false);
    iceQueueRef.current = [];
  }, [userId, partnerId, matchId, isInitiator, supabase]);

    const [lastMatchedGender, setLastMatchedGender] = useState<'Male' | 'Female' | null>(null);

    // 1. Initial registration on load
    useEffect(() => {
      const registerUser = async () => {
        if (!userId) return;
        
        let country = "Unknown";
        let city = "Unknown";
        try {
          const res = await fetch('https://ipapi.co/json/');
          const data = await res.json();
          country = data.country_name || "Unknown";
          city = data.city || "Unknown";
        } catch (e) {
          console.error("Location detection failed", e);
        }

        await supabase.from('online_users').upsert({
          id: userId,
          status: 'waiting',
          country,
          city,
          gender: genderFilter,
          last_active: new Date().toISOString()
        });
      };

      registerUser();
    }, [userId, genderFilter, supabase]);

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

      // 3. Find candidates
      const { data: candidates, error } = await supabase
        .from('online_users')
        .select('*')
        .eq('status', 'waiting')
        .neq('id', userId)
        .limit(20);

      if (error || !candidates || candidates.length === 0) {
        console.log("No candidates found.");
        return;
      }

      // 4. Implement 50/50 Match Ratio Rule
      let candidatesToPick = candidates;
      
      if (genderFilter !== 'Both') {
        candidatesToPick = candidates.filter(c => c.gender === genderFilter);
      } else if (lastMatchedGender) {
        // Try to alternate gender if filter is Both
        const preferredGender = lastMatchedGender === 'Male' ? 'Female' : 'Male';
        const diversed = candidates.filter(c => c.gender === preferredGender);
        if (diversed.length > 0) candidatesToPick = diversed;
      }

      if (candidatesToPick.length === 0 && genderFilter === 'Both') {
        candidatesToPick = candidates; // Fallback if preferred gender not found
      }

      if (candidatesToPick.length === 0) {
        console.log("No candidates matching criteria.");
        return;
      }

      const target = candidatesToPick[Math.floor(Math.random() * candidatesToPick.length)];
      const newMatchId = `match_${userId}_${target.id}`;
      const actuallyInitiator = true; 

      // 5. Try to claim the partner
      const { data: updatedTarget, error: updateError } = await supabase
        .from('online_users')
        .update({
          status: 'in-call',
          match_id: newMatchId,
          partner_id: userId,
          is_initiator: false
        })
        .eq('id', target.id)
        .eq('status', 'waiting')
        .select()
        .single();

      if (updatedTarget) {
        console.log("Matched with:", target.id);
        await supabase.from('online_users').update({
          status: 'in-call',
          match_id: newMatchId,
          partner_id: target.id,
          is_initiator: true
        }).eq('id', userId);

        setMatchId(newMatchId);
        setPartnerId(target.id);
        setIsInitiator(true);
        setStatus('in-call');
        if (target.gender === 'Male' || target.gender === 'Female') {
          setLastMatchedGender(target.gender as 'Male' | 'Female');
        }
      } else {
        console.log("Partner taken or update failed, retrying...");
        setTimeout(findMatch, 2000);
      }
    }, [userId, genderFilter, status, lastMatchedGender, supabase]);

  const setupPeerConnection = useCallback(async (mId: string, pId: string, initiator: boolean) => {
    console.log("Setting up WebRTC for match:", mId, "Initiator:", initiator);
    
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

    pc.onicecandidate = async (e) => {
      if (e.candidate) {
        await supabase.from('signals').insert({
          match_id: mId,
          sender_id: userId,
          type: 'ice-candidate',
          payload: e.candidate.toJSON()
        });
      }
    };

    pc.oniceconnectionstatechange = () => {
      if (pc.iceConnectionState === 'failed' || pc.iceConnectionState === 'closed') {
        cleanupCall(false);
      }
    };

    // Listen for signals via Realtime
    const channel = supabase
      .channel(`signals:${mId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'signals',
          filter: `match_id=eq.${mId}`
        },
        async (payload) => {
          const data = payload.new;
          if (data.sender_id === userId) return;

          if (data.type === 'offer' && !initiator) {
            await pc.setRemoteDescription(new RTCSessionDescription(data.payload));
            const answer = await pc.createAnswer();
            await pc.setLocalDescription(answer);
            await supabase.from('signals').insert({
              match_id: mId,
              sender_id: userId,
              type: 'answer',
              payload: { type: answer.type, sdp: answer.sdp }
            });
            // Process queued candidates
            while (iceQueueRef.current.length > 0) {
              const cand = iceQueueRef.current.shift();
              await pc.addIceCandidate(new RTCIceCandidate(cand!));
            }
          } else if (data.type === 'answer' && initiator) {
            await pc.setRemoteDescription(new RTCSessionDescription(data.payload));
            // Process queued candidates
            while (iceQueueRef.current.length > 0) {
              const cand = iceQueueRef.current.shift();
              await pc.addIceCandidate(new RTCIceCandidate(cand!));
            }
          } else if (data.type === 'ice-candidate') {
            const candidate = new RTCIceCandidate(data.payload);
            if (pc.remoteDescription && pc.remoteDescription.type) {
              await pc.addIceCandidate(candidate);
            } else {
              iceQueueRef.current.push(data.payload);
            }
          }
        }
      )
      .subscribe();

    signalChannelRef.current = channel;

    if (initiator) {
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      await supabase.from('signals').insert({
        match_id: mId,
        sender_id: userId,
        type: 'offer',
        payload: { type: offer.type, sdp: offer.sdp }
      });
    }
  }, [userId, cleanupCall, supabase]);

  useEffect(() => {
    const userRef = userId;
    const updatePresence = async () => {
      try {
        await supabase.from('online_users').update({
          last_active: new Date().toISOString(),
          gender: genderFilter,
        }).eq('id', userRef);
      } catch (e) {
        console.error("Presence update failed", e);
      }
    };

    const interval = setInterval(updatePresence, 10000);

    // Subscribe to self for status changes (e.g. if someone matches us)
    const channel = supabase
      .channel(`user:${userId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'online_users',
          filter: `id=eq.${userId}`
        },
        (payload) => {
          const data = payload.new;
          if (data.status === 'in-call' && data.partner_id && data.match_id) {
            if (status !== 'in-call') {
              setPartnerId(data.partner_id);
              setMatchId(data.match_id);
              setIsInitiator(!!data.is_initiator);
              setStatus('in-call');
            }
          } else if (data.status === 'waiting' && status === 'in-call') {
            cleanupCall(false);
          }
        }
      )
      .subscribe();

    return () => {
      clearInterval(interval);
      supabase.removeChannel(channel);
      supabase.from('online_users').delete().eq('id', userId).then(() => {});
    };
  }, [userId, status, genderFilter, cleanupCall, supabase]);

  useEffect(() => {
    if (status === 'waiting' && !partnerId) {
      const interval = setInterval(() => findMatch(), 5000);
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
    supabase.from('online_users').update({ gender }).eq('id', userId);
  };

  useEffect(() => {
    if (status === 'in-call' && partnerId) {
      supabase.from('online_users').select('country, city').eq('id', partnerId).single().then(({ data }) => {
        if (data) setPartnerLocation(`🌍 ${data.country}, 📍 ${data.city}`);
      });
    } else {
      setPartnerLocation(null);
    }
  }, [status, partnerId, supabase]);

  const likePartner = async () => {
    if (!partnerId || !userId || isLiked) return;
    
    setIsLiked(true);
    
    try {
      await supabase.from('likes').upsert({ user_id: userId, target_id: partnerId });
      
      const { data: partnerLike } = await supabase
        .from('likes')
        .select('*')
        .eq('user_id', partnerId)
        .eq('target_id', userId)
        .single();
          
      if (partnerLike) {
        setIsMutualMatch(true);
        const [u1, u2] = [userId, partnerId].sort();
        await supabase.from('friends').upsert({ user_1: u1, user_2: u2 });
      }
    } catch (e) {
      console.error("Failed to like partner", e);
    }
  };

  const blockUser = async () => {
    if (!partnerId) return;
    await supabase.from('online_users').delete().eq('id', partnerId);
    nextMatch();
  };

  const reportUser = async () => {
    if (!partnerId) return;
    // Log report flag (simplified)
    console.log("Reporting user:", partnerId);
    await supabase.from('online_users').delete().eq('id', partnerId);
    nextMatch();
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
    blockUser,
    reportUser,
    genderFilter,
    setGenderFilter: applyGenderFilter,
    localVideoRef,
    remoteVideoRef,
    likePartner,
    isLiked,
    isMutualMatch
  };
};
