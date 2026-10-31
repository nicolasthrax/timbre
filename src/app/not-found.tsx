import type { Metadata } from "next";
import { ButtonLink } from "@/components/Button";
import { ErrorScreen } from "@/components/ErrorScreen";

export const metadata: Metadata = { title: "Page not found" };

export default function NotFound() {
  return (
    <ErrorScreen
      code="404"
      title="Nothing to hear here"
      body="We couldn't find that page. It may have moved, or the link might be wrong."
      actions={
        <>
          <ButtonLink href="/">Back to home</ButtonLink>
          <ButtonLink href="/signin" variant="secondary">
            Sign in
          </ButtonLink>
        </>
      }
    />
  );
}
