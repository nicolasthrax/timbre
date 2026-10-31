import type { Metadata } from "next";
import { AccountsForm } from "./AccountsForm";
import { PageTransition } from "@/components/PageTransition";

export const metadata: Metadata = { title: "Add your accounts" };

export default function AccountsPage() {
  return (
    <PageTransition>
      <AccountsForm />
    </PageTransition>
  );
}
