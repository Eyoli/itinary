import csv
import os

from graph import Graph, Edge


def read_as_dictionary(file_location: str, index_extractor):
    dictionary = {}
    with open(file_location, newline='') as file:
        content = csv.DictReader(file)

        for row in content:
            dictionary[index_extractor(row)] = row
        return dictionary


def read_graph_from_edges_list(
        file_location: str,
        origin_key_col: str,
        destination_key_col: str,
        tags_cols: set[str]) -> Graph:
    with open(file_location, newline='') as file:
        content = csv.DictReader(file)
        edges = []
        for row in content:
            edges.append(Edge(row[origin_key_col], row[destination_key_col], {
                tag_col: row[tag_col] for tag_col in tags_cols
            }))
        return Graph(edges)


def write_csv(file_location: str, header: list, rows: list):
    os.makedirs(os.path.dirname(file_location), exist_ok=True)
    with open(file_location, 'w', newline='') as outputFile:
        writer = csv.writer(outputFile)
        writer.writerow(header)
        for row in rows:
            writer.writerow(row)
