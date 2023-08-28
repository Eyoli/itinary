"use client";

import RouteSearch from "@/src/components/forms/RouteSearch";
import StopSearch from "@/src/components/forms/StopSearch";
import { Card } from "@/src/components/common/Card";
import ItinerarySearch from "@/src/components/forms/ItinerarySearch";
import { useRoutes, useStops } from "@/src/services/hooks";

export default function Page() {
  const stops = useStops();
  const routes = useRoutes();

  return (
    <div className="flex">
      <div className="md:w-1/2">
        <Card title={"Route search"}>
          {routes && <RouteSearch routes={routes} />}
        </Card>
        <Card title={"Stop search"}>
          {stops && <StopSearch stops={stops} />}
        </Card>
      </div>

      <div className="md:w-1/2">
        <Card title={"Itinerary search"}>
          {stops && <ItinerarySearch stops={stops} />}
        </Card>
      </div>
    </div>
  );
}
