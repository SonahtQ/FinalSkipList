import Node from "./Node";
export default class MapValueToNodeSet<T> extends Map<T, Set<Node<T>>> {
    registerToNodeSet(node: Node<T>): void;
    unregisterFromNodeSet(node: Node<T>): void;
    getNodeSet(value: T): Set<Node<T>> | undefined;
}
