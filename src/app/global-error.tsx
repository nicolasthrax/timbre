"use client";

import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import { useEffect } from "react";
import { Button } from "@/components/Button";
import { ErrorScreen } from "@/components/ErrorScreen";
import "./globals.css";

export default function GlobalError({ error, retry }: { error: unknown; retry: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body className="min-h-dvh antialiased">
        <ErrorScreen
          code="Error"
          title="Timbre couldn't load"
          body="Something went wrong while loading the app. Please try again in a moment."
          actions={<Button onClick={() => retry()}>Try again</Button>}
        />
      </body>
    </html>
  );
}
