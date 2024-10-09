import type { Metadata } from "next";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";

import { cn } from "@acme/ui";

import { TRPCReactProvider } from "~/trpc/react";

import "~/app/globals.css";

import { auth } from "@acme/auth";

import { env } from "~/env";
import LogIn from "./_components/logIn";
import SideNav from "./_components/sideNav";

export const metadata: Metadata = {
  metadataBase: new URL(
    env.NODE_ENV === "production"
      ? "https://paratus.illizen.com"
      : "http://localhost:3000",
  ),
  title: "Paratus",
  description: "Habit tracking web app",
  // openGraph: {
  //   title: "Create T3",
  //   description: "Simple monorepo with shared backend for web & mobile apps",
  //   url: "https://create-t3.vercel.app",
  //   siteName: "Create T3",
  // },
  // twitter: {
  //   card: "summary_large_image",
  //   site: "@jullerino",
  //   creator: "@jullerino",
  // },
};

export default async function RootLayout(props: { children: React.ReactNode }) {
  const session = await auth();
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "text-foreground min-h-screen bg-primary font-sans antialiased",
          GeistSans.variable,
          GeistMono.variable,
        )}>
        {session ? <App>{props.children}</App> : <LogIn />}
      </body>
    </html>
  );
}

const App = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  return (
    <TRPCReactProvider>
      <div className="flex h-screen overflow-hidden">
        <SideNav />
        {children}
      </div>
    </TRPCReactProvider>
  );
};
