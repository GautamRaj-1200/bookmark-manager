import React from "react";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Image from "next/image";

const Profile = async () => {
  const session = await auth();

  if (!session?.user) {
    redirect(`/unauthenticated?callbackUrl=${encodeURIComponent("/profile")}`);
  }
  return (
    <div className="mx-auto max-w-2xl px-4 py-6">
      <div className="p-6 rounded-lg ring-1 ring-white/10 bg-white/5 flex items-center gap-4">
        {session.user.image && (
          <Image
            src={session.user.image}
            alt="Profile"
            width={64}
            height={64}
            className="rounded-full ring-1 ring-white/10"
          />
        )}
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Profile</h1>
          <p className="text-zinc-200">
            {session.user.name || session.user.email}
          </p>
          <p className="text-sm text-zinc-400">{session.user.email}</p>
        </div>
      </div>
    </div>
  );
};

export default Profile;
