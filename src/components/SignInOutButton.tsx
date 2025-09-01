import { signIn, signOut, auth } from "@/auth";

export default async function SignIn() {
  const session = await auth();

  if (!session?.user) {
    return (
      <form
        action={async () => {
          "use server";
          await signIn("google");
        }}
      >
        <button
          type="submit"
          className=" border-1 border-gray-600 cursor-pointer flex w-full items-center justify-center gap-3 rounded-md bg-white px-2 py-1 text-base font-semibold text-gray-800 shadow-sm transition-all hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] focus:ring-offset-2 focus:ring-offset-gray-800"
        >
          <svg
            className="h-5 w-5"
            fill="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M22.56 12.25C22.56 11.42 22.49 10.62 22.35 9.84H12.27V14.4H18.16C17.86 16.03 16.94 17.4 15.48 18.35V20.94H19.34C21.45 19.01 22.56 15.91 22.56 12.25Z"
              fill="#4285F4"
            ></path>
            <path
              d="M12.27 23C15.11 23 17.5 22.12 19.34 20.94L15.48 18.35C14.54 19.01 13.49 19.43 12.27 19.43C9.89 19.43 7.89 17.89 7.11 15.8H3.14V18.39C5.03 21.14 8.42 23 12.27 23Z"
              fill="#34A853"
            ></path>
            <path
              d="M7.11 15.8C6.88 15.14 6.75 14.42 6.75 13.67C6.75 12.92 6.88 12.2 7.11 11.53V8.94H3.14C2.39 10.36 1.94 11.96 1.94 13.67C1.94 15.38 2.39 16.98 3.14 18.39L7.11 15.8Z"
              fill="#FBBC05"
            ></path>
            <path
              d="M12.27 7.9C13.56 7.9 14.63 8.35 15.53 9.2L19.42 5.31C17.5-0.03 15.11 5 12.27 5C8.42 5 5.03 6.86 3.14 8.94L7.11 11.53C7.89 9.44 9.89 7.9 12.27 7.9Z"
              fill="#EA4335"
            ></path>
          </svg>
          <span>Sign in with Google</span>
        </button>
      </form>
    );
  }

  return (
    <form
      action={async () => {
        "use server";
        await signOut();
      }}
    >
      <button
        type="submit"
        className="cursor-pointer bg-gray-950 border-1 border-gray-600 rounded-sm px-2 py-1 text-sm"
      >
        Sign Out
      </button>
    </form>
  );
}
