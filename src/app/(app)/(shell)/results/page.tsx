import { redirect } from "next/navigation";

// Results and the dashboard were split by plan. With plans removed there is one view.
export default function ResultsPage() {
  redirect("/dashboard");
}
