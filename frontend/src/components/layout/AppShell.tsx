"use client";

import Navigation from "./Navigation";

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-bg-primary">
      <Navigation />

      {/* Main content area: offset by sidebar on desktop, by bottom nav on mobile */}
      <main
        className="
          flex-1 overflow-y-auto
          lg:ml-16
          pb-16 lg:pb-0
        "
      >
        {children}
      </main>
    </div>
  );
}
