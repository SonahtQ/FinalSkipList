import Node from "./Node";

//

export default class MapValueToNodeSet<T> extends Map<T, Set<Node<T>>> {
    // Metoda rejestrująca węzeł do mapy
    registerToNodeSet(node: Node<T>) {
        const nodesSet = this.get(node.value) ?? new Set();

        if (nodesSet.size == 0)
            this.set(node.value, nodesSet);

        nodesSet.add(node);
    }

    // Metoda Wyrejestrująca węzeł z mapy
    unregisterFromNodeSet(node: Node<T>) {
        const inMapSetOfPresentNodes = this.get(node.value)!;

        inMapSetOfPresentNodes.delete(node);

        if (inMapSetOfPresentNodes.size == 0)
            this.delete(node.value);
    }

    // Metoda zwracająca z mapy wszystkie węzły o danej wartości
    getNodeSet(value: T) {
        return this.get(value);
    }
}