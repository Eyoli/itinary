"use client";

import { useSearchParams } from "next/navigation";

export default function Page() {
  const searchParams = useSearchParams();
  const startStopId = searchParams?.get("from");
  const endStopId = searchParams?.get("to");

  if (!startStopId || !endStopId) return;

  return <div className="flex flex-wrap"></div>;
}
