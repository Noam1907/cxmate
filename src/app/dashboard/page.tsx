import { redirect } from "next/navigation";

/** Dashboard now redirects to /analysis — the unified hub page. */
export default function DashboardPage() {
  redirect("/analysis");
}
