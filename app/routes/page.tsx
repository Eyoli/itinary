"use client";

import Route from "@/src/components/Route";
import { useSearchParams } from "next/navigation";
import RouteFlow from "@/src/components/RouteFlow";
import { useRoute } from "@/src/services/hooks";

export default function Page() {
  const searchParams = useSearchParams();
  const routeId = searchParams?.get("id") ?? undefined;

  const { route, stops, ways } = useRoute(routeId);

  if (!route || !stops || !ways) return;

  return (
    <div className="flex flex-wrap">
      <div className="w-1/2 px-2 h-50">{<Route route={route} />}</div>

      <div className="w-1/2">
        <div style={{ width: "45vw", height: "90vh" }}>
          <RouteFlow stops={stops} ways={ways} />
        </div>
      </div>
    </div>
  );
}
