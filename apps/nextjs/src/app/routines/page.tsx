import React from "react";
import Link from "next/link";
import { BsPlusLg } from "react-icons/bs";

export default function Routines() {
  return (
    <main className="h-full w-full overflow-hidden bg-black text-white">
      <div id="heading" className="flex items-center gap-2 p-2">
        <h3>Routines</h3>
        <Link href="/routines/new" className="rounded-lg bg-white/30 p-2">
          <BsPlusLg className="text-2xl" />
        </Link>
      </div>
    </main>
  );
}
