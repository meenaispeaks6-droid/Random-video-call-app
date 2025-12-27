"use client";

import { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { createClient } from '@/lib/supabase/client';

export const PresenceTracker = () => {
  const { user } = useAuth();
  const supabase = createClient();

  useEffect(() => {
    if (!user) return;

    const trackPresence = async () => {
      // Get current location
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
        id: user.id,
        status: 'idle',
        country,
        city,
        last_active: new Date().toISOString()
      });
    };

    trackPresence();

    const interval = setInterval(async () => {
      await supabase.from('online_users').update({
        last_active: new Date().toISOString()
      }).eq('id', user.id);
    }, 30000);

    return () => {
      clearInterval(interval);
      supabase.from('online_users').update({ status: 'offline' }).eq('id', user.id).then(() => {});
    };
  }, [user, supabase]);

  return null;
};
