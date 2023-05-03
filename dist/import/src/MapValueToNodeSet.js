//
export default class MapValueToNodeSet extends Map {
    // Metoda rejestrująca węzeł do mapy
    registerToNodeSet(node) {
        const nodesSet = this.get(node.value) ?? new Set();
        if (nodesSet.size == 0)
            this.set(node.value, nodesSet);
        nodesSet.add(node);
    }
    // Metoda Wyrejestrująca węzeł z mapy
    unregisterFromNodeSet(node) {
        const inMapSetOfPresentNodes = this.get(node.value);
        inMapSetOfPresentNodes.delete(node);
        if (inMapSetOfPresentNodes.size == 0)
            this.delete(node.value);
    }
    // Metoda zwracająca z mapy wszystkie węzły o danej wartości
    getNodeSet(value) {
        return this.get(value);
    }
}
