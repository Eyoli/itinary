"use client";

import {useSearchParams} from "next/navigation";
import {useItinerary} from "@/src/services/hooks";
import RouteFlow from "@/src/components/RouteFlow";
import {WayData} from "@/src/services/types";

export default function Page() {
    const searchParams = useSearchParams();
    const startStopId = searchParams?.get("from") ?? undefined;
    const endStopId = searchParams?.get("to") ?? undefined;

    const itinerary = useItinerary(new Date(), startStopId, endStopId);

    if (!itinerary?.path) return;

    const stops = itinerary.path.map((path) => path.stop);
    const ways: WayData[] = itinerary.path.reduce((acc: WayData[], node, i, array) => {
        if (i === 0) return acc;
        const previous = array[i - 1];
        acc.push({
            from_stop_id: previous.stop.stop_id,
            to_stop_id: node.stop.stop_id,
            route_id: ""
        })
        return acc
    }, []);

    return <div className="flex flex-wrap">
        <div className="w-1/2">
            <div style={{width: "45vw", height: "90vh"}}>
                <RouteFlow stops={stops} ways={ways}/>
            </div>
        </div>
    </div>;
}
