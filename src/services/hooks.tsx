"use client";

import { useEffect, useState } from "react";
import {
  getAllRoutes,
  getAllStops,
  getGraph,
  getRoute,
  RouteData,
  StopData,
  WayData,
} from "@/src/services/gtfs";

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

export const useRoutes = () => {
  const [routes, setRoutes] = useState<RouteData[]>();

  useEffect(() => {
    getAllRoutes().then((data) => setRoutes(data));
  }, []);

  return routes;
};

export const useStops = () => {
  const [stops, setStops] = useState<StopData[]>();

  useEffect(() => {
    getAllStops().then((data) => setStops(data));
  }, []);

  return stops;
};
