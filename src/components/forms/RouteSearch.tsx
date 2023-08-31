"use client";

import { useState } from "react";
import { ReactSearchAutocomplete } from "react-search-autocomplete";
import { useRouter } from "next/navigation";
import { RouteData } from "@/src/services/gtfs";

type Item = {
  id: string;
  name: string;
};

const RouteSearch = ({ routes }: { routes: RouteData[] }) => {
  const [routeId, setRouteId] = useState<string>();

  const items = routes.map((r) => ({
    id: r.route_id,
    name: r.route_long_name,
  }));

  const router = useRouter();

  const handleOnSelectRoute = (result: Item) => {
    result && setRouteId(result.id);
  };

  const handleOnSearch = () => {
    routeId && router.push(`/routes?id=${routeId}`);
  };

  return (
    <form>
      <div className="md:flex md:items-center">
        <div className="md:w-1/4">
          <label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4">
            Route name
          </label>
        </div>
        <div className="md:w-2/4 mr-5 z-40">
          <ReactSearchAutocomplete
            styling={{ borderRadius: "0.375rem", boxShadow: "none" }}
            items={items}
            onSelect={handleOnSelectRoute}
            autoFocus
            fuseOptions={{ distance: 50 }}
          />
        </div>
        <div className="md:w-1/4">
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
};

export default RouteSearch;
