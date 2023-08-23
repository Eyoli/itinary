from io import read_as_dictionary, read_graph_from_edges_list

TRAIN_STOP_PREFIX = "StopPoint:OCETrain TER-"


def compute_stop_key(row):
    split_result = row["stop_id"].split(TRAIN_STOP_PREFIX)
    if len(split_result) > 1:
        return split_result[1]
    return row["stop_id"]


routes = read_as_dictionary("../resources/export-ter-gtfs-last/routes.txt", lambda row: row["route_id"])
stops = read_as_dictionary("../resources/export-ter-gtfs-last/stops.txt", compute_stop_key)
graph = read_graph_from_edges_list(
    "../resources/generated/edges.txt",
    "from_stop_id",
    "to_stop_id",
    {"route_id"}
)

start1 = "87415604"
end1 = "87411017"

start2 = "87384008"
end2 = "87381509"

routes_to_explore = {edge.tags["route_id"] for edge in graph.edges[start1]} \
    .intersection({edge.tags["route_id"] for edge in graph.edges[end1]})

print("Routes to explore: " + str(len(routes_to_explore)))

for search in routes_to_explore:
    for path in graph.find_paths(start1, end1,
                                 lambda edge: (edge.tags["route_id"]) == search):
        print(path)
        if {start2, end2}.issubset(path):
            print(stops[start2]["stop_name"] + " -> " + stops[end2]["stop_name"], "sub travel of",
                  stops[start1]["stop_name"] + " -> " + stops[end1]["stop_name"], "(route",
                  routes[search]["route_long_name"], ")")
