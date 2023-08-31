"use client";

import { useState } from "react";
import { ReactSearchAutocomplete } from "react-search-autocomplete";
import { useRouter } from "next/navigation";
import { StopData } from "@/src/services/types";

export default function ItinerarySearch({ stops }: { stops: StopData[] }) {
  const router = useRouter();

  const [startStopId, setStartStopId] = useState<string>();
  const [endStopId, setEndStopId] = useState<string>();

  const handleOnSelectStartStop = (result: StopData) => {
    result && setStartStopId(result.stop_id);
  };

  const handleOnSelectEndStop = (result: StopData) => {
    result && setEndStopId(result.stop_id);
  };

  const handleOnSearch = () => {
    startStopId &&
      endStopId &&
      router.push(`/itinerary?from=${startStopId}&to=${endStopId}`);
  };

  return (
    <form>
      <div className="flex flex-wrap md:items-center">
        <div className="md:w-1/4 pr-4">
          <label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0">
            From
          </label>
        </div>
        <div className="md:w-2/4 py-2 z-20">
          <ReactSearchAutocomplete
            styling={{ borderRadius: "0.375rem", boxShadow: "none" }}
            items={stops}
            onSelect={handleOnSelectStartStop}
            resultStringKeyName="stop_name"
            autoFocus
            fuseOptions={{
              distance: 0,
              minMatchCharLength: 3,
              keys: ["stop_name"],
            }}
          />
        </div>
        <div className="md:w-1/4"></div>
        <div className="md:w-1/4">
          <label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4">
            To
          </label>
        </div>
        <div className="md:w-2/4 z-10">
          <ReactSearchAutocomplete
            styling={{ borderRadius: "0.375rem", boxShadow: "none" }}
            items={stops}
            onSelect={handleOnSelectEndStop}
            resultStringKeyName="stop_name"
            autoFocus
            fuseOptions={{
              distance: 0,
              minMatchCharLength: 3,
              keys: ["stop_name"],
            }}
          />
        </div>
        <div className="md:w-1/4 pl-5">
          <button
            className="btn btn-primary"
            type="button"
            onClick={handleOnSearch}
          >
            Search
          </button>
        </div>
      </div>
    </form>
  );
}
