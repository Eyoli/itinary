import { cache } from "react";
import {
  ItineraryData,
  ItineraryGraph,
  ItineraryNode,
  RouteData,
  StopData,
  StopTimeData,
  TripData,
  WayData,
} from "@/src/services/types";
import { computeIfAbsent, parseCsv } from "@/src/services/algorithms/utils";
import { getShortestPath } from "@/src/services/algorithms/path";
import { getDistance } from "geolib";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL + "/gtfs";

export const getAllRoutes = cache(async () =>
  parseCsv<RouteData>(baseUrl + "/routes.txt")
);
export const getAllStops = cache(async () => {
  const stops = await parseCsv<StopData>(baseUrl + "/stops.txt");
  return stops.reduce((acc, current) => {
    acc.set(current.stop_id, current);
    return acc;
  }, new Map<string, StopData>());
});
export const getAllTrips = cache(async () =>
  parseCsv<TripData>(baseUrl + "/trips.txt")
);
export const getAllStopTimes = cache(async () =>
  parseCsv<StopTimeData>(baseUrl + "/stop_times.txt")
);
export const getItineraryGraph = cache(async () => {
  const itineraries = await parseCsv<ItineraryData>(
    baseUrl + "/itineraries.txt"
  );
  const stops = await getAllStops();

  return new ItineraryGraph(stops, itineraries);
});

// 1000 m/ms
const UPPER_BOUNDING_SPEED = 1000 / 3600000;

const getLowerBoundingCostBetween = (
  start: ItineraryNode,
  end: ItineraryNode
) =>
  getDistance(
    { lat: start.stop.stop_lat, lon: start.stop.stop_lon },
    { lat: end.stop.stop_lat, lon: end.stop.stop_lon }
  ) / UPPER_BOUNDING_SPEED;

export const getItinerary = async (
  start: string,
  end: string,
  time: string
) => {
  const graph = await getItineraryGraph();
  return getShortestPath({
    start: graph.getOrThrow(start, time),
    end: graph.getOrThrow(end, time),
    candidatesFn: (node) => graph.getSoonestDepartures(node),
    heuristicCostFn: getLowerBoundingCostBetween,
    nodeKeyFn: (node) => node.stop.stop_id,
  });
};

export const getAllEdges = cache(async () => {
  const edges = await parseCsv<WayData>(baseUrl + "/edges.txt");
  return edges.reduce((acc, current) => {
    const route = computeIfAbsent(acc, current.route_id, []);
    route.push(current);
    return acc;
  }, new Map<string, WayData[]>());
});

export const getRoute = (routeId: string) =>
  getAllRoutes().then((routes) => routes.find((r) => r.route_id === routeId));

export const getTrips = (routeId: string) =>
  getAllTrips().then((trips) => trips.filter((t) => t.route_id === routeId));

export const getEdges = (routeId: string) =>
  getAllEdges().then((edges) => edges.get(routeId));

export const getStop = (stopId: string) =>
  getAllStops().then((stops) => stops.get(stopId));

export const getGraph = async (routeId: string) => {
  const edges = await getEdges(routeId);
  if (!edges)
    return {
      edges,
      stops: undefined,
    };

  const stopsFrom = edges.map((e) => e.from_stop_id);
  const stopsTo = edges.map((e) => e.to_stop_id);

  const stops = await getAllStops();
  return {
    edges,
    stops: Array.from(new Set([...stopsFrom, ...stopsTo]).values()).map(
      (id) => stops.get(id)!!
    ),
  };
};
