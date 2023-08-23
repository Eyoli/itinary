from typing import Callable


class Edge:
    def __init__(self, origin: str, destination: str, tags: dict[str,]):
        self.origin = origin
        self.destination = destination
        self.tags = tags


class Graph:
    def __init__(self, edges: list[Edge]):
        self.edges: dict[str, set[Edge]] = {}
        for edge in edges:
            self.edges.setdefault(edge.origin, set()).add(edge)

    def find_paths(self, start: str, end: str, edge_filter: Callable[[Edge], bool]):
        # Call the recursive helper function to find all paths
        paths = self.find_path(start, end, set(), [], edge_filter)
        return paths

    def find_path(self, current: str, end: str, visited: set, path, edge_filter: Callable[[Edge], bool]):
        # Mark the current node as visited and store in path
        visited.add(current)
        path.append(current)

        # If current vertex is same as destination, then print
        # current path[]
        paths = []
        if current == end:
            paths.append(path.copy())
        elif current in self.edges.keys():
            # If current vertex is not destination
            # Recur for all the vertices adjacent to this vertex
            for candidate in self.edges.get(current):
                if candidate.destination not in visited and edge_filter(candidate):
                    for path in self.find_path(candidate.destination, end, visited, path, edge_filter):
                        paths.append(path)

        # Remove current vertex from path[] and mark it as unvisited
        path.pop()
        visited.remove(current)
        return paths
