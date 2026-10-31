import type { Metadata } from "next";
import { AccountsForm } from "./AccountsForm";

export const metadata: Metadata = { title: "Add your accounts" };

export default function AccountsPage() {
  return <AccountsForm />;
}
