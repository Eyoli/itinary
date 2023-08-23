from pandas import read_csv

from python.io import read_as_dictionary, write_csv

GTFS_FOLDER = "../public"

stop_times = read_csv(GTFS_FOLDER + "/stop_times.txt", usecols=["trip_id", "stop_id", "arrival_time", "departure_time"])
trips = read_as_dictionary(GTFS_FOLDER + "/trips.txt", lambda row: row["trip_id"])


def iterate_edges():
    for trip_id, group in stop_times.groupby("trip_id"):
        trip = trips[trip_id]
        route_id = trip["route_id"]
        previous_stop_time = None
        for stop_time in group.itertuples(index=False):
            if previous_stop_time:
                yield previous_stop_time.stop_id, stop_time.stop_id, route_id, previous_stop_time.departure_time, stop_time.arrival_time
            previous_stop_time = stop_time


print("Building edges")
edges = list({(start_id, end_id, route_id) for (start_id, end_id, route_id, start_time, end_time) in iterate_edges()})
write_csv(GTFS_FOLDER + "/edges.txt", ["from_stop_id", "to_stop_id", "route_id"], edges)

print("Building itineraries")
itineraries = list(
    {(start_id, end_id, route_id, start_time, end_time) for (start_id, end_id, route_id, start_time, end_time) in
     iterate_edges()})
write_csv(GTFS_FOLDER + "/itineraries.txt", ["from_stop_id", "to_stop_id", "route_id", "start_time", "end_time"],
          itineraries)
