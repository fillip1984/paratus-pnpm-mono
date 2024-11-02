"use client";

import { useState } from "react";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { BiLayout } from "react-icons/bi";
import { BsChevronDoubleLeft } from "react-icons/bs";
import { FaSignOutAlt } from "react-icons/fa";
import { FaTimeline } from "react-icons/fa6";

export default function SideNav() {
  const [isMenuCollapsed, setIsMenuCollapsed] = useState(true);

  return (
    <nav
      className={`flex h-full w-1/3 max-w-[300px] flex-shrink-0 flex-col overflow-hidden bg-primary transition-all duration-200 ease-in-out ${isMenuCollapsed ? "w-16" : ""}`}>
      {!isMenuCollapsed && (
        <h3 className="mb-4 text-center font-bold text-white">Paratus</h3>
      )}
      <div id="menu-items" className="flex flex-1 flex-col items-center py-4">
        <div id="main-menu-items" className="flex flex-1 flex-col gap-4 px-1">
          <Link
            href="/"
            className="flex items-center gap-2 rounded-lg bg-white/30 p-2 transition hover:bg-white/50">
            <FaTimeline className="text-4xl text-white" />
            <span
              className={`${isMenuCollapsed ? "hidden" : ""} uppercase text-white`}>
              Timeline
            </span>
          </Link>
          {/* <Link
            href="/tasks"
            className="flex items-center gap-2 rounded-lg bg-white/30 p-2 transition hover:bg-white/50">
            <FaListCheck className="text-4xl text-white" />
            <span
              className={`${isMenuCollapsed ? "hidden" : ""} uppercase text-white`}>
              Tasks
            </span>
          </Link>
          <Link
            href="/routines"
            className="flex items-center gap-2 rounded-lg bg-white/30 p-2 transition hover:bg-white/50">
            <LuCalendarRange className="text-4xl text-white" />
            <span
              className={`${isMenuCollapsed ? "hidden" : ""} uppercase text-white`}>
              Routines
            </span>
          </Link> */}
          <Link
            href="/projects"
            className="flex items-center gap-2 rounded-lg bg-white/30 p-2 transition hover:bg-white/50">
            <BiLayout className="text-4xl text-white" />
            <span
              className={`${isMenuCollapsed ? "hidden" : ""} uppercase text-white`}>
              Projects
            </span>
          </Link>
        </div>
        <div
          id="menu-bottom-items"
          className="flex flex-col items-center gap-4">
          <button
            onClick={() => signOut()}
            className="flex items-center gap-2 rounded-lg bg-white/30 p-2 transition hover:bg-white/50">
            <FaSignOutAlt className="text-4xl text-white" />
            <span
              className={`${isMenuCollapsed ? "hidden" : ""} uppercase text-white`}>
              Sign out
            </span>
          </button>

          <button
            type="button"
            onClick={() => setIsMenuCollapsed((prev) => !prev)}>
            <BsChevronDoubleLeft
              className={`text-4xl text-white transition duration-300 ease-in-out ${isMenuCollapsed ? "rotate-180" : ""}`}
            />
          </button>
        </div>
      </div>
    </nav>
  );
}
