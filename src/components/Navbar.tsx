import Link from "next/link";
import React from "react";
import SignIn from "./SignInOutButton";

const Navbar = () => {
  return (
    <>
      <nav className="flex justify-between p-2 items-center">
        <h2>
          <Link href="/" className="text-blue-400">
            {" "}
            Home
          </Link>
        </h2>
        <ul className="flex gap-2 items-center">
          <li>
            <Link href="/profile" className="text-blue-400">
              Profile
            </Link>
          </li>
          <li>
            <SignIn />
          </li>
        </ul>
      </nav>
    </>
  );
};

export default Navbar;
