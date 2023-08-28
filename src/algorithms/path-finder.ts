type NeighboursFn<N> = (node: N) => N[];
type NodeKeyFn<N, K> = (node: N) => K;
type CostFn<N> = (node1: N, node2: N) => number | undefined;
type HeuristicCostFn<N> = (node1: N, node2: N) => number;
type EdgeFilterFn<N> = (n1: N, n2: N) => boolean;

export type PathFinderAlgorithmInput<N, K> = {
  startNode: N;
  endNode: N;
  neighboursFn: NeighboursFn<N>;
  nodeKeyFn: NodeKeyFn<N, K>;
  costFn: CostFn<N>;
  heuristicCostFn: HeuristicCostFn<N>;
  edgeFilterFn?: EdgeFilterFn<N>;
};

export type Path<N> = {
  path: N[] | undefined;
  cost: number;
};

type NodeState<N> = {
  tested: boolean;
  cost: number;
  previous: N | undefined;
};

export const NO_PATH = {
  path: undefined,
  cost: Infinity,
};

export class PathFinderAlgorithm<N, K> {
  private readonly startNode: N;
  private readonly endNode: N;
  private readonly neighboursFn: NeighboursFn<N>;
  private readonly nodeKeyFn: NodeKeyFn<N, K>;
  private readonly costFn: CostFn<N>;
  private readonly heuristicCostFn: HeuristicCostFn<N>;
  private readonly edgeFilterFn?: EdgeFilterFn<N>;
  private readonly nodesState: Map<K, NodeState<N>>;

  constructor(input: PathFinderAlgorithmInput<N, K>) {
    this.startNode = input.startNode;
    this.endNode = input.endNode;
    this.neighboursFn = input.neighboursFn;
    this.nodeKeyFn = input.nodeKeyFn;
    this.costFn = input.costFn;
    this.heuristicCostFn = input.heuristicCostFn;
    this.edgeFilterFn = input.edgeFilterFn;
    this.nodesState = new Map();
  }

  private getNodeState = (node: N) => {
    const key = this.nodeKeyFn(node);
    let state = this.nodesState.get(key);
    if (!state) {
      state = {
        tested: false,
        cost: Infinity,
      } as NodeState<N>;
      this.nodesState.set(key, state);
    }
    return state;
  };

  find = (maxIterations: number = 100): Path<N> => {
    const endNodeKey = this.nodeKeyFn(this.endNode);

    let currentNode = this.startNode;
    this.getNodeState(currentNode).cost = 0;
    const candidates: N[] = [];

    let i = 0;
    while (
      currentNode &&
      this.nodeKeyFn(currentNode) !== endNodeKey &&
      i < maxIterations
    ) {
      i++;

      const currentNodeState = this.getNodeState(currentNode);
      currentNodeState.tested = true;
      const cost = currentNodeState.cost;

      let neighbours = this.neighboursFn(currentNode);
      if (this.edgeFilterFn) {
        neighbours = neighbours.filter(
          this.edgeFilterFn.bind(this, currentNode)
        );
      }

      for (const neighbour of neighbours) {
        const state = this.getNodeState(neighbour);
        const costToNode = this.costFn(currentNode, neighbour);
        if (!!costToNode && !state.tested) {
          if (state.cost === Infinity) {
            candidates.push(neighbour);
          }
          if (state.cost > cost + costToNode) {
            state.cost = cost + costToNode;
            state.previous = currentNode;
          }
        }
      }

      let nextEstimatedCost = Infinity;
      let nextIndex = 0;

      candidates.forEach((candidate, i) => {
        const state = this.getNodeState(candidate);
        const estimatedCost =
          state.cost + this.heuristicCostFn(candidate, this.endNode);
        if (nextEstimatedCost > estimatedCost) {
          nextEstimatedCost = estimatedCost;
          nextIndex = i;
        }
      });

      const candidate = candidates.splice(nextIndex, 1);
      currentNode = candidate[0];
    }

    if (currentNode && i < maxIterations) {
      const totalCost = this.getNodeState(currentNode).cost;
      const shortestPath = [];
      shortestPath.push(currentNode);

      let state = this.getNodeState(currentNode);
      while (state.previous) {
        shortestPath.unshift(state.previous);
        state = this.getNodeState(state.previous);
      }

      return { path: shortestPath, cost: totalCost };
    }

    return NO_PATH;
  };
}
