"use client";

import { useEffect, useState } from "react";
import {
  getAllRoutes,
  getAllStops,
  getGraph,
  getItinerary,
  getRoute,
  getStop,
} from "@/src/services/gtfs";
import {
  ItineraryNode,
  RouteData,
  StopData,
  WayData,
} from "@/src/services/types";
import { Path } from "@/src/services/algorithms/path";

export const useRoute = (routeId?: string) => {
  const [route, setRoute] = useState<RouteData>();
  const [stops, setStops] = useState<StopData[]>();
  const [ways, setWays] = useState<WayData[]>();

  useEffect(() => {
    routeId && getRoute(routeId).then((data) => data && setRoute(data));
  }, [routeId]);

  useEffect(() => {
    routeId &&
      getGraph(routeId).then((data) => {
        data.stops && setStops(data.stops);
        data.edges && setWays(data.edges);
      });
  }, [routeId]);

  return { route, stops, ways };
};

export const useStop = (stopId?: string) => {
  const [stop, setStop] = useState<StopData>();

  useEffect(() => {
    stopId && getStop(stopId).then((data) => setStop(data));
  }, []);

  return stop;
};

export const useRoutes = () => {
  const [routes, setRoutes] = useState<RouteData[]>();

  useEffect(() => {
    getAllRoutes().then((data) => {
      console.log("Found", data.length, "routes");
      setRoutes(data);
    });
  }, []);

  return routes;
};

export const useStops = () => {
  const [stops, setStops] = useState<StopData[]>();

  useEffect(() => {
    getAllStops().then((data) => {
      console.log("Found", data.size, "stops");
      setStops(Array.from(data.values()));
    });
  }, []);

  return stops;
};

export const useItinerary = (
  departureDate: Date,
  startStopId?: string,
  endStopId?: string
) => {
  const [itinerary, setItinerary] = useState<Path<ItineraryNode>>();

  useEffect(() => {
    startStopId &&
      endStopId &&
      getItinerary(startStopId, endStopId, departureDate).then((data) =>
        setItinerary(data)
      );
  }, []);

  return itinerary;
};
