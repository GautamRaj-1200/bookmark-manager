import React from "react";
import { auth, signIn } from "@/auth";
import { redirect } from "next/navigation";

const Unauthenticated = async ({
  searchParams,
}: {
  searchParams: { callbackUrl?: string };
}) => {
  const session = await auth();

  if (session?.user) {
    redirect(searchParams.callbackUrl || "/profile");
  }

  return (
    <div className="m-2">
      <h2>You need to Log In to view this page.</h2>{" "}
      <form
        action={async () => {
          "use server";
          await signIn("google", {
            redirectTo: searchParams.callbackUrl || "/profile", // pass callbackUrl here
          });
        }}
      >
        <button
          type="submit"
          className="cursor-pointer bg-gray-950 border-1 border-gray-600 rounded-sm px-2 py-1 text-sm"
        >
          Sign in with Google
        </button>
      </form>
    </div>
  );
};

export default Unauthenticated;
