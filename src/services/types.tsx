import { computeIfAbsent } from "@/src/services/algorithms/utils";
import { Edge } from "@/src/services/algorithms/path";

export type RouteData = {
  route_id: string;
  route_long_name: string;
  route_short_name: string;
};

export type StopData = {
  stop_lon: string;
  stop_lat: string;
  stop_name: string;
  stop_id: string;
};

export type TripData = {
  route_id: string;
  trip_id: string;
  service_id: string;
};

export type StopTimeData = {
  stop_id: string;
  trip_id: string;
};

export type WayData = {
  from_stop_id: string;
  to_stop_id: string;
  route_id: string;
};

export type ItineraryData = {
  from_stop_id: string;
  to_stop_id: string;
  route_id: string;
  start_time: string;
  end_time: string;
};

export type ItineraryNode = {
  stop: StopData;
  time: Date;
};

export class ItineraryGraph {
  private graph: Map<string, Map<string, ItineraryData[]>>;
  private stops: Map<string, StopData>;

  constructor(stops: Map<string, StopData>, itineraries: ItineraryData[]) {
    this.stops = stops;

    // Construct graph
    this.graph = itineraries.reduce((result, current) => {
      const destinations = computeIfAbsent(
        result,
        current.from_stop_id,
        new Map<string, ItineraryData[]>()
      );
      const times = computeIfAbsent(destinations, current.to_stop_id, []);
      times.push(current);
      return result;
    }, new Map<string, Map<string, ItineraryData[]>>());

    // Sort groups by start time
    this.graph.forEach((destinations) => {
      destinations.forEach((times) => {
        times.sort((a, b) => a.start_time.localeCompare(b.start_time));
      });
    });
  }

  getOrThrow = (stopId: string, time: Date) => {
    const stop = this.stops.get(stopId);
    if (!stop) {
      throw new Error(`Stop ${stopId} not found`);
    }
    return {
      stop,
      time,
    } as ItineraryNode;
  };

  getSoonestDepartures = (from: ItineraryNode) => {
    const { getOrThrow, graph } = this;
    const destinations = graph.get(from.stop.stop_id)?.values() ?? [];
    return Array.from(destinations)
      .map((times) => times.find((t) => new Date(t.start_time) >= from.time))
      .filter((t) => t !== undefined)
      .map(
        // @ts-ignore
        (departure: ItineraryData) => {
          return {
            start: getOrThrow(
              departure.from_stop_id,
              new Date(departure.start_time)
            ),
            end: getOrThrow(departure.to_stop_id, new Date(departure.end_time)),
            cost: new Date(departure.end_time).getTime() - from.time.getTime(),
          } as Edge<ItineraryNode>;
        }
      );
  };
}
