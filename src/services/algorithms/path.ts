export type Path<N> = {
  path: N[] | undefined;
  cost: number;
};

type NodeState<N> = {
  tested: boolean;
  cost: number;
  previous: N | undefined;
};

export type Edge<N> = {
  start: N;
  end: N;
  cost: number;
};

export type PathFinderAlgorithmInput<N, K> = {
  start: N;
  end: N;
  candidatesFn: (node: N) => Edge<N>[];
  nodeKeyFn: (node: N) => K;
  heuristicCostFn: (node1: N, node2: N) => number;
  edgeFilterFn?: (edge: Edge<N>) => boolean;
  maxIterations?: number;
};

export const NO_PATH = {
  path: undefined,
  cost: Infinity,
};

export function getShortestPath<N, K>(
  input: PathFinderAlgorithmInput<N, K>
): Path<N> {
  const {
    end,
    start,
    nodeKeyFn,
    candidatesFn,
    edgeFilterFn,
    heuristicCostFn,
    maxIterations = 100,
  } = input;
  const endNodeKey = nodeKeyFn(end);
  const states = new Map<K, NodeState<N>>();

  const getNodeState = (node: N) => {
    const key = nodeKeyFn(node);
    let state = states.get(key);
    if (!state) {
      state = {
        tested: false,
        cost: Infinity,
      } as NodeState<N>;
      states.set(key, state);
    }
    return state;
  };

  let currentNode = start;
  getNodeState(currentNode).cost = 0;
  const candidates: N[] = [];

  let i = 0;
  while (
    currentNode &&
    nodeKeyFn(currentNode) !== endNodeKey &&
    i < maxIterations
  ) {
    i++;

    const currentNodeState = getNodeState(currentNode);
    currentNodeState.tested = true;
    const cost = currentNodeState.cost;

    let edges = candidatesFn(currentNode);
    if (edgeFilterFn) {
      edges = edges.filter((edge) => edgeFilterFn(edge));
    }

    for (const edge of edges) {
      const endNodeState = getNodeState(edge.end);
      if (!endNodeState.tested) {
        if (endNodeState.cost === Infinity) {
          edges.push(edge);
        }
        if (endNodeState.cost > cost + edge.cost) {
          endNodeState.cost = cost + edge.cost;
          endNodeState.previous = currentNode;
        }
      }
    }

    let nextEstimatedCost = Infinity;
    let nextIndex = 0;

    edges.forEach((edge, i) => {
      const state = getNodeState(edge.end);
      const estimatedCost = state.cost + heuristicCostFn(edge.end, end);
      if (nextEstimatedCost > estimatedCost) {
        nextEstimatedCost = estimatedCost;
        nextIndex = i;
      }
    });

    const chosenEdge = edges.splice(nextIndex, 1);
    currentNode = chosenEdge[0].end;
  }

  if (currentNode && i < maxIterations) {
    const totalCost = getNodeState(currentNode).cost;
    const shortestPath = [];
    shortestPath.push(currentNode);

    let state = getNodeState(currentNode);
    while (state.previous) {
      shortestPath.unshift(state.previous);
      state = getNodeState(state.previous);
    }

    return { path: shortestPath, cost: totalCost };
  }

  return NO_PATH;
}
