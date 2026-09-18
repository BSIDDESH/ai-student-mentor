"use client";

import { useEffect, useState } from "react";
import type { Profile } from "@/app/lib/types";
import { getProfile } from "@/app/lib/api";
import DashboardShell from "@/app/components/DashboardShell";
import Onboarding from "@/app/components/Onboarding";
import { SkeletonDashboard } from "@/app/components/ui/Skeleton";

// ── Page Gate: Check profile exists -> Onboarding vs Dashboard ───────────────
export default function Page() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProfile()
      .then(({ exists, profile }) => {
        if (exists && profile) {
          setProfile(profile);
        } else {
          setShowOnboarding(true);
        }
      })
      .catch(() => setShowOnboarding(true))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <SkeletonDashboard />;

  if (showOnboarding) {
    return (
      <Onboarding
        onComplete={(p) => {
          setProfile(p);
          setShowOnboarding(false);
        }}
      />
    );
  }

  if (profile) {
    return <DashboardShell profile={profile} setProfile={setProfile} />;
  }

  return null;
}
