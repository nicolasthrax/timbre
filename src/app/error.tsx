"use client";

import { useEffect } from "react";
import { Button, ButtonLink } from "@/components/Button";
import { ErrorScreen } from "@/components/ErrorScreen";

export default function ErrorPage({ error, retry }: { error: unknown; retry: () => void }) {
  useEffect(() => {
    // TODO(real): report to Sentry.
    console.error(error);
  }, [error]);

  return (
    <ErrorScreen
      code="Error"
      title="Something went wrong"
      body="That's on us, not you. Your data is safe. Try again, or head back to the start."
      actions={
        <>
          <Button onClick={() => retry()}>Try again</Button>
          <ButtonLink href="/" variant="secondary">
            Back to home
          </ButtonLink>
        </>
      }
    />
  );
}
