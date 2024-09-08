"use client";

import { signIn } from "next-auth/react";
import React from "react";

export default function LogIn() {
  return (
    <div className="flex h-screen flex-col items-center bg-black pt-8">
      <div className="flex flex-col items-center gap-4 rounded-lg border-2 border-white/40 px-8 py-4">
        <h3 className="mb-2 text-white">Please sign in</h3>

        <button
          type="button"
          onClick={() => void signIn("github")}
          className="border-gray-300 flex w-full items-center gap-4 rounded bg-white p-3 font-medium text-black">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="images/github-mark.png"
            alt="Google logo"
            className="h-8 w-8"
          />
          Sign in with GitHub
        </button>

        <button
          type="button"
          onClick={() =>
            void signIn("google", { callbackUrl: "http://localhost:3000" })
          }
          className="border-gray-300 flex w-full items-center gap-4 rounded bg-white p-3 font-medium text-black"
          disabled>
          <img
            src="images/google_G.png"
            alt="Google logo"
            className="h-8 w-8"
          />
          Sign in with google
        </button>
      </div>
    </div>
  );
}
