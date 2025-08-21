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
    <div>
      <h1>Profile Page</h1>
      <p>Welcome, {session.user.name || session.user.email}!</p>
      <p>User ID: {session.user.id}</p>
      <p>Email: {session.user.email}</p>
      {session.user.image && (
        <Image
          src={session.user.image}
          alt="Profile"
          width={50}
          height={50}
          className="rounded-full"
        />
      )}
    </div>
  );
};

export default Profile;
