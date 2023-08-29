"use client";

import {useSearchParams} from "next/navigation";
import {useStop} from "@/src/services/hooks";
import {Stop} from "@/src/components/Stop";

export default function Page() {
    const searchParams = useSearchParams();
    const stopId = searchParams?.get("id") ?? undefined;

    const stop = useStop(stopId);

    if (!stop) return;

    return (
        <div className="flex flex-wrap">
            <div className="w-1/2 px-2 h-50">{<Stop stop={stop}/>}</div>
        </div>
    );
}
