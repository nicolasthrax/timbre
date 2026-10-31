"use client";

import "@fontsource-variable/atkinson-hyperlegible-next";
import { useEffect } from "react";
import { Button } from "@/components/Button";
import { ErrorScreen } from "@/components/ErrorScreen";
import "./globals.css";

export default function GlobalError({ error, retry }: { error: unknown; retry: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body className="min-h-dvh">
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
