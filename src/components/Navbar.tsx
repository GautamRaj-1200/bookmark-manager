import Link from "next/link";
import React from "react";
import SignIn from "./SignInOutButton";

const Navbar = () => {
  return (
    <>
      <nav className="sticky top-0 z-50 backdrop-blur supports-[backdrop-filter]:bg-black/40 border-b border-white/10">
        <div className="mx-auto max-w-3xl px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-zinc-100">
            <span className="text-xl">🔖</span>
            <span className="font-semibold tracking-tight">
              Bookmark Manager
            </span>
          </Link>
          <ul className="flex gap-3 items-center text-sm">
            <li>
              <Link
                href="/bookmarks"
                className="text-zinc-300 hover:text-white"
              >
                Bookmarks
              </Link>
            </li>
            <li>
              <Link href="/profile" className="text-zinc-300 hover:text-white">
                Profile
              </Link>
            </li>
            <li>
              <SignIn />
            </li>
          </ul>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
