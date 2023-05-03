"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const MapValueToNodeSet_1 = __importDefault(require("./MapValueToNodeSet"));
const Node_1 = __importDefault(require("./Node"));
const Pointer_1 = __importDefault(require("./Pointer"));
//
var ParsedArgsMode;
(function (ParsedArgsMode) {
    ParsedArgsMode[ParsedArgsMode["ZERO"] = 0] = "ZERO";
    ParsedArgsMode[ParsedArgsMode["SINGLE"] = 1] = "SINGLE";
    ParsedArgsMode[ParsedArgsMode["RANGE"] = 2] = "RANGE";
})(ParsedArgsMode || (ParsedArgsMode = {}));
//
class FinalSkipList {
    static from(valueScoreTuples, options) {
        return new FinalSkipList(valueScoreTuples, options);
    }
    //
    #config;
    #head;
    #tail;
    #mapValueToNodeSet;
    #size;
    constructor(...args) {
        let valueScoreTuples;
        let options;
        if (args.length == 0) {
            valueScoreTuples = [];
            options = undefined;
        }
        else if (args.length == 1) {
            if (args[0][Symbol.iterator]) {
                valueScoreTuples = args[0];
                options = undefined;
            }
            else {
                valueScoreTuples = [];
                options = args[0];
            }
        }
        else if (args.length == 2) {
            valueScoreTuples = args[0];
            options = args[1];
        }
        else
            throw new Error("Wrong argument list");
        //
        const defaultConfig = {
            maxLevel: 32,
            getLevel: null,
        };
        //
        this.#config = Object.assign(defaultConfig, options ?? {});
        //
        this.#head = new Node_1.default(Number.NEGATIVE_INFINITY, null, this.#config.maxLevel);
        this.#tail = new Node_1.default(Number.POSITIVE_INFINITY, null, this.#config.maxLevel);
        this.#mapValueToNodeSet = new MapValueToNodeSet_1.default();
        this.#size = 0;
        //
        // Inicjalizacja węzłów head i tail.
        for (let i = 0; i < this.#config.maxLevel; i++) {
            this.#head.next[i] = this.#tail;
            this.#tail.prev[i] = this.#head;
            this.#head.forwardSpan[i] = 1;
            this.#tail.backwardSpan[i] = 1;
        }
        //
        for (const tuple of valueScoreTuples)
            this.insert(tuple[0], tuple[1]);
    }
    //
    #reverseRank(backRank) {
        return (this.size - 1) - backRank;
    }
    //
    // Metoda do losowego wyboru poziomu dla nowego węzła.
    #randomLevel() {
        if (this.#config.getLevel)
            return Math.max(1, Math.min(this.#config.maxLevel, this.#config.getLevel(this.#config)));
        //
        // Losujemy poziom; im wyższy poziom, tym mniejsze prawdopodobieństwo jego wyboru.
        let level = 1;
        while (Math.random() < 0.5 && level < this.#config.maxLevel) {
            level++;
        }
        return level;
    }
    // Parsuje listę argumentów do min(rank/score) max(rank/score) i fromTail
    #parseArgs(args) {
        const mode = ((typeof args[0] != "number")
            ?
                ParsedArgsMode.ZERO
            :
                ((typeof args[1] != "number")
                    ?
                        ParsedArgsMode.SINGLE
                    :
                        ParsedArgsMode.RANGE));
        //
        let min;
        let max;
        let options;
        //
        switch (mode) {
            case ParsedArgsMode.ZERO:
                min = max = -1;
                options = args;
                break;
            case ParsedArgsMode.SINGLE:
                min = args[0];
                max = min;
                options = args.slice(1);
                break;
            case ParsedArgsMode.RANGE:
                min = args[0];
                max = args[1];
                options = args.slice(2);
                break;
        }
        //
        return [mode, options, min, max];
    }
    #parseRankArgs(args) {
        const result = this.#parseArgs(args);
        if (result[2] < 0) //minRank
            result[2] = Math.max(-1, this.size + result[2]);
        if (result[3] < 0) //maxRank
            result[3] = Math.max(-1, this.size + result[3]);
        return result;
    }
    //
    #findFrontUpdateArrayAndFrontRankArrayForInserting(score, fromTail) {
        const frontUpdate = new Array(this.#config.maxLevel).fill(null);
        const frontRanks = new Array(this.#config.maxLevel).fill(-1);
        // Znalezienie węzłów do aktualizacji na każdym poziomie.
        if (fromTail) {
            const pointer = new Pointer_1.default(this.#tail, -1);
            for (let i = this.#config.maxLevel - 1; i >= 0; i--) {
                while (pointer.ft_hasFollowing(i) && pointer.ft_peekFollowingScore(i) > score) {
                    pointer.ft_move(i);
                }
                frontRanks[i] = this.#reverseRank(pointer.ft_peekFollowingRank(i));
                frontUpdate[i] = pointer.ft_peekFollowingNode(i);
            }
        }
        else {
            const pointer = new Pointer_1.default(this.#head, -1);
            for (let i = this.#config.maxLevel - 1; i >= 0; i--) {
                while (pointer.fh_hasFollowing(i) && pointer.fh_peekFollowingScore(i) <= score) {
                    pointer.fh_move(i);
                }
                frontRanks[i] = pointer.rank;
                frontUpdate[i] = pointer.node;
            }
        }
        return [frontUpdate, frontRanks];
    }
    #findFrontUpdateArrayAndPointerInFrontOfRank(searchedFrontRank, fromTail) {
        if (fromTail) {
            const searchedBackRank = this.#reverseRank(searchedFrontRank);
            const frontUpdate = new Array(this.#config.maxLevel).fill(null);
            const pointer = new Pointer_1.default(this.#tail, -1);
            for (let i = this.#config.maxLevel - 1; i >= 0; i--) {
                while (pointer.ft_hasFollowing(i) && pointer.ft_peekFollowingRank(i) <= searchedBackRank) {
                    pointer.ft_move(i);
                }
                frontUpdate[i] = pointer.ft_peekFollowingNode(i);
            }
            pointer.ft_move(0);
            pointer.rank = this.#reverseRank(pointer.rank);
            return [pointer, frontUpdate];
        }
        else {
            const frontUpdate = new Array(this.#config.maxLevel).fill(null);
            const pointer = new Pointer_1.default(this.#head, -1);
            for (let i = this.#config.maxLevel - 1; i >= 0; i--) {
                while (pointer.fh_hasFollowing(i) && pointer.fh_peekFollowingRank(i) < searchedFrontRank) {
                    pointer.fh_move(i);
                }
                frontUpdate[i] = pointer.node;
            }
            return [pointer, frontUpdate];
        }
    }
    #findFrontUpdateArrayAndPointerInFrontOfScore(searchedScore, fromTail) {
        if (fromTail) {
            const frontUpdate = new Array(this.#config.maxLevel).fill(null);
            const pointer = new Pointer_1.default(this.#tail, -1);
            for (let i = this.#config.maxLevel - 1; i >= 0; i--) {
                while (pointer.ft_hasFollowing(i) && pointer.ft_peekFollowingScore(i) >= searchedScore) {
                    pointer.ft_move(i);
                }
                frontUpdate[i] = pointer.ft_peekFollowingNode(i);
            }
            pointer.ft_move(0);
            pointer.rank = this.#reverseRank(pointer.rank);
            return [pointer, frontUpdate];
        }
        else {
            const frontUpdate = new Array(this.#config.maxLevel).fill(null);
            const pointer = new Pointer_1.default(this.#head, -1);
            for (let i = this.#config.maxLevel - 1; i >= 0; i--) {
                while (pointer.fh_hasFollowing(i) && pointer.fh_peekFollowingScore(i) < searchedScore) {
                    pointer.fh_move(i);
                }
                frontUpdate[i] = pointer.node;
            }
            return [pointer, frontUpdate];
        }
    }
    #findNodeWithRank(searchedFrontRank, fromTail) {
        if (fromTail) {
            const searchedBackRank = this.#reverseRank(searchedFrontRank);
            const pointer = new Pointer_1.default(this.#tail, -1);
            for (let i = this.#config.maxLevel - 1; i >= 0; i--) {
                while (pointer.ft_hasFollowing(i) && pointer.ft_peekFollowingRank(i) <= searchedBackRank) {
                    pointer.ft_move(i);
                }
            }
            return pointer.node.isTail ? null : pointer.node;
        }
        else {
            const pointer = new Pointer_1.default(this.#head, -1);
            for (let i = this.#config.maxLevel - 1; i >= 0; i--) {
                while (pointer.fh_hasFollowing(i) && pointer.fh_peekFollowingRank(i) <= searchedFrontRank) {
                    pointer.fh_move(i);
                }
            }
            return pointer.node.isHead ? null : pointer.node;
        }
    }
    #getRankByNode(node, fromTail) {
        let pointer;
        //
        if (fromTail) {
            pointer = new Pointer_1.default(this.#tail, -1);
            for (let i = this.#config.maxLevel - 1; i >= 0; i--) {
                while (pointer.ft_hasFollowing(i) && pointer.ft_peekFollowingScore(i) >= node.score) {
                    pointer.ft_move(i);
                }
            }
            pointer.ft_move(0);
            pointer.rank = this.#reverseRank(pointer.rank);
        }
        else {
            pointer = new Pointer_1.default(this.#head, -1);
            for (let i = this.#config.maxLevel - 1; i >= 0; i--) {
                while (pointer.fh_hasFollowing(i) && pointer.fh_peekFollowingScore(i) < node.score) {
                    pointer.fh_move(i);
                }
            }
        }
        //
        while (pointer.fh_hasFollowing(0) && pointer.fh_peekFollowingScore(0) == node.score) {
            pointer.fh_move(0);
            if (pointer.node == node) // Jeśli dotarliśmy do szukanego węzła, zwracamy obecną wartość rank.
                return pointer.rank;
        }
        //
        throw new Error(`Provided node doesn't exist in skiplist at the moment.`);
    }
    //
    get size() {
        return this.#size;
    }
    //
    // Metoda do wstawiania węzła z kluczem (score) i wartością (value).
    insert(value, score, fromTail = false) {
        if (score == Number.NEGATIVE_INFINITY || score == Number.POSITIVE_INFINITY)
            throw new Error("Provide real number score, infinity values are forbidden.");
        //
        // Tworzenie nowego węzła z wylosowanym poziomem.
        const newNodeLevel = this.#randomLevel();
        const newNode = new Node_1.default(score, value, newNodeLevel);
        const [frontUpdate, frontRanks] = this.#findFrontUpdateArrayAndFrontRankArrayForInserting(score, fromTail);
        // Dodanie nowego węzła poprzez aktualizacje węzłów w tablicy "frontUpdate" oraz aktualizacja forwardSpan
        for (let i = 0; i < this.#config.maxLevel; i++) {
            const frontUpdateLeft = frontUpdate[i];
            const frontUpdateRight = frontUpdate[i].next[i];
            if (i < newNodeLevel) {
                newNode.prev[i] = frontUpdateLeft;
                newNode.next[i] = frontUpdateRight;
                frontUpdateLeft.next[i] = newNode;
                frontUpdateRight.prev[i] = newNode;
                //
                const backRankOfLowestUpdateRight = this.#reverseRank(frontRanks[0] + frontUpdate[0].forwardSpan[0]);
                const backRankOfUpdateRight = this.#reverseRank(frontRanks[i] + frontUpdateLeft.forwardSpan[i]);
                const updateLeftToLowestUpdateLeftDistance = (frontRanks[0] - frontRanks[i]);
                const updateRightToLowestUpdateRightDistance = (backRankOfLowestUpdateRight - backRankOfUpdateRight);
                newNode.forwardSpan[i] = frontUpdateLeft.forwardSpan[i] - updateLeftToLowestUpdateLeftDistance;
                frontUpdateLeft.forwardSpan[i] = updateLeftToLowestUpdateLeftDistance + 1;
                newNode.backwardSpan[i] = frontUpdateRight.backwardSpan[i] - updateRightToLowestUpdateRightDistance;
                frontUpdateRight.backwardSpan[i] = updateRightToLowestUpdateRightDistance + 1;
            }
            else {
                frontUpdateLeft.forwardSpan[i]++;
                frontUpdateRight.backwardSpan[i]++;
            }
        }
        //
        this.#mapValueToNodeSet.registerToNodeSet(newNode);
        this.#size++;
    }
    deleteByScore(...args) {
        const [mode, options, minScore, maxScore] = this.#parseArgs(args);
        const [fullResult, fromTail] = options;
        //
        if (minScore > maxScore)
            return [];
        //
        const deletedArr = [];
        const [pointer, frontUpdate] = this.#findFrontUpdateArrayAndPointerInFrontOfScore(minScore, fromTail);
        while (pointer.fh_hasFollowing(0) && pointer.fh_peekFollowingScore(0) <= maxScore) { // Usuwamy wszystkie węzły o kluczu <= maxScore
            pointer.fh_move(0);
            //
            for (let i = 0; i < this.#config.maxLevel; i++) {
                const frontUpdateLeft = frontUpdate[i];
                if (frontUpdateLeft.next[i] == pointer.node) { // jeżeli currentNode istnieje na tym poziomie
                    const frontUpdateRight = pointer.fh_peekFollowingNode(i);
                    frontUpdateLeft.next[i] = frontUpdateRight;
                    frontUpdateRight.prev[i] = frontUpdateLeft;
                    frontUpdateLeft.forwardSpan[i] += pointer.node.forwardSpan[i] - 1;
                    frontUpdateRight.backwardSpan[i] += pointer.node.backwardSpan[i] - 1;
                }
                else {
                    const frontUpdateRight = frontUpdateLeft.next[i];
                    frontUpdateLeft.forwardSpan[i]--;
                    frontUpdateRight.backwardSpan[i]--;
                }
            }
            if (fullResult)
                deletedArr.push({ value: pointer.node.value, score: pointer.node.score, rank: pointer.rank });
            else
                deletedArr.push(pointer.node.value);
        }
        //
        this.#size -= deletedArr.length;
        return deletedArr;
    }
    deleteByRank(...args) {
        const [mode, options, minRank, maxRank] = this.#parseRankArgs(args);
        const [fullResult, fromTail] = options;
        //
        if ((minRank >= this.#size || maxRank >= this.#size) || (minRank == -1 && maxRank == -1) || minRank > maxRank)
            return (mode == ParsedArgsMode.SINGLE) ? null : [];
        //
        let [pointer, frontUpdate] = this.#findFrontUpdateArrayAndPointerInFrontOfRank(minRank, fromTail);
        //
        const deletedArr = [];
        while (pointer.fh_hasFollowing(0) && pointer.fh_peekFollowingRank(0) <= maxRank) {
            pointer.fh_move(0);
            //
            for (let i = 0; i < this.#config.maxLevel; i++) {
                const frontUpdateLeft = frontUpdate[i];
                if (frontUpdateLeft.next[i] == pointer.node) { // jeżeli currentNode istnieje na tym poziomie
                    const frontUpdateRight = pointer.fh_peekFollowingNode(i);
                    frontUpdateLeft.next[i] = frontUpdateRight;
                    frontUpdateRight.prev[i] = frontUpdateLeft;
                    frontUpdateLeft.forwardSpan[i] += pointer.node.forwardSpan[i] - 1;
                    frontUpdateRight.backwardSpan[i] += pointer.node.backwardSpan[i] - 1;
                }
                else {
                    const frontUpdateRight = frontUpdateLeft.next[i];
                    frontUpdateLeft.forwardSpan[i]--;
                    frontUpdateRight.backwardSpan[i]--;
                }
            }
            if (fullResult)
                deletedArr.push({ value: pointer.node.value, score: pointer.node.score, rank: pointer.rank });
            else
                deletedArr.push(pointer.node.value);
        }
        //
        this.#size -= deletedArr.length;
        return (mode == ParsedArgsMode.SINGLE) ? (deletedArr[0] ?? null) : deletedArr;
    }
    deleteByValue(value, fullResult, fromTail) {
        const deleteSet = this.#mapValueToNodeSet.getNodeSet(value);
        if (!deleteSet)
            return [];
        //
        const ranks = !fullResult ? undefined : Array.from(deleteSet).map(node => this.#getRankByNode(node, fromTail));
        this.#size -= deleteSet.size;
        if (ranks) {
            return Array.from(deleteSet).map((node, i) => {
                this.#deleteByNode(node);
                return { value: node.value, score: node.score, rank: ranks[i] };
            });
        }
        else {
            return Array.from(deleteSet).map(node => {
                this.#deleteByNode(node);
                return node.score;
            });
        }
    }
    // Prywatna metoda do usuwania podanego węzła ze SkipListy.
    #deleteByNode(node) {
        let i;
        for (i = 0; i < this.#config.maxLevel; i++) {
            const prevNode = node.prev[i];
            const nextNode = node.next[i];
            if (!prevNode || !nextNode || prevNode.next[i] != node || nextNode.prev[i] != node)
                break;
            //
            prevNode.next[i] = nextNode;
            nextNode.prev[i] = prevNode;
            prevNode.forwardSpan[i] += node.forwardSpan[i] - 1;
            nextNode.backwardSpan[i] += node.backwardSpan[i] - 1;
        }
        // zaktualizuj forwardSpan & backwardSpan na wyższych poziomach niż usuwany node posiada.
        i--;
        if (i < this.#config.maxLevel - 1) {
            let l_current = node;
            let r_current = node;
            for (let j = i; j < this.#config.maxLevel; j++) {
                if (j > i) {
                    l_current.forwardSpan[j]--;
                    r_current.backwardSpan[j]--;
                }
                if (j >= this.#config.maxLevel - 1)
                    break;
                //
                while (l_current != this.#head && !l_current.prev[j + 1]) {
                    l_current = l_current.prev[j];
                }
                while (r_current != this.#tail && !r_current.next[j + 1]) {
                    r_current = r_current.next[j];
                }
            }
        }
        // Wyrejestruj węzeł z mapy
        this.#mapValueToNodeSet.unregisterFromNodeSet(node);
    }
    popFirst(fullResult) {
        const nodeToDelete = this.#head.next[0];
        if (nodeToDelete == this.#tail)
            return null;
        this.#deleteByNode(nodeToDelete);
        this.#size--;
        //
        if (fullResult)
            return { value: nodeToDelete.value, score: nodeToDelete.score, rank: 0 };
        else
            return nodeToDelete.value;
    }
    popLast(fullResult) {
        const nodeToDelete = this.#tail.prev[0];
        if (nodeToDelete == this.#head)
            return null;
        this.#deleteByNode(nodeToDelete);
        this.#size--;
        //
        if (fullResult)
            return { value: nodeToDelete.value, score: nodeToDelete.score, rank: this.#size };
        else
            return nodeToDelete.value;
    }
    getByScore(...args) {
        const [mode, options, minScore, maxScore] = this.#parseArgs(args);
        const [fullResult, fromTail] = options;
        //
        if (minScore > maxScore)
            return [];
        //
        const found = [];
        const [pointer] = this.#findFrontUpdateArrayAndPointerInFrontOfScore(minScore, fromTail);
        while (pointer.fh_hasFollowing(0) && pointer.fh_peekFollowingScore(0) <= maxScore) {
            pointer.fh_move(0);
            if (fullResult)
                found.push({ value: pointer.node.value, score: pointer.node.score, rank: pointer.rank });
            else
                found.push(pointer.node.value);
        }
        return found;
    }
    getByRank(...args) {
        const [mode, options, minRank, maxRank] = this.#parseRankArgs(args);
        const [fullResult, fromTail] = options;
        //
        if ((minRank == -1 && maxRank == -1) || minRank > maxRank)
            return (mode == ParsedArgsMode.SINGLE) ? null : [];
        //
        let currentNode = this.#findNodeWithRank(minRank, fromTail);
        //
        if (mode == ParsedArgsMode.SINGLE) {
            if (currentNode) {
                if (fullResult)
                    return { value: currentNode.value, score: currentNode.score, rank: minRank };
                else
                    return currentNode.value;
            }
            else
                return null;
        }
        //
        if (!currentNode)
            return [];
        //
        const pointer = new Pointer_1.default(currentNode, minRank);
        const found = [];
        while (pointer.node && !pointer.node.isTail && pointer.rank <= maxRank) {
            if (fullResult)
                found.push({ value: pointer.node.value, score: pointer.node.score, rank: pointer.rank });
            else
                found.push(pointer.node.value);
            //
            pointer.fh_move(0);
        }
        return found;
    }
    //
    // Metoda do pobierania wszystkich kluczy (score) dla wartości (value)
    getScore(value) {
        return Array.from(this.#mapValueToNodeSet.getNodeSet(value) ?? []).map(node => node.score);
    }
    getRank(value, ...args) {
        let nodesSet = this.#mapValueToNodeSet.getNodeSet(value);
        //
        const [mode, options, minScore, maxScore] = this.#parseArgs(args);
        const [fullResult, fromTail] = options;
        //
        if (fullResult) {
            const result = [];
            nodesSet?.forEach(node => {
                if (mode != ParsedArgsMode.ZERO && !(node.score >= minScore && node.score <= maxScore))
                    return;
                result.push({ value: node.value, score: node.score, rank: this.#getRankByNode(node, fromTail) });
            });
            return result;
        }
        else {
            const result = [];
            nodesSet?.forEach(node => {
                if (mode != ParsedArgsMode.ZERO && !(node.score >= minScore && node.score <= maxScore))
                    return;
                result.push(this.#getRankByNode(node, fromTail));
            });
            return result;
        }
    }
    //
    countByValue(value) {
        return this.#mapValueToNodeSet.get(value)?.size ?? 0;
    }
    countByScore(...args) {
        const [mode, options, minScore, maxScore] = this.#parseArgs(args);
        const [fromTail] = options;
        //
        if (minScore > maxScore)
            return 0;
        //
        const [pointer] = this.#findFrontUpdateArrayAndPointerInFrontOfScore(minScore, fromTail);
        pointer.fh_move(0);
        if (pointer.node.isTail || !(pointer.node.score >= minScore && pointer.node.score <= maxScore))
            return 0;
        //
        const rank = pointer.rank;
        for (let i = pointer.node.level - 1; i >= 0; i -= 1) {
            while (pointer.fh_hasFollowing(i) && pointer.fh_peekFollowingScore(i) <= maxScore) {
                pointer.fh_move(i);
            }
        }
        return (pointer.rank - rank) + 1;
    }
    //
    has(value) {
        this.#mapValueToNodeSet.has(value);
    }
    forEach(callback) {
        for (const x of this)
            callback(...x);
    }
    forEachBackward(callback) {
        for (const x of this.backward())
            callback(...x);
    }
    //
    toString() {
        return JSON.stringify(Array.from(this));
    }
    *#nodeIterator() {
        const pointer = new Pointer_1.default(this.#head, -1);
        while (pointer.fh_hasFollowing(0)) {
            pointer.fh_move(0);
            yield pointer.node;
        }
    }
    *[Symbol.iterator]() {
        // Zaczynamy od pierwszego elementu na najniższym poziomie
        const pointer = new Pointer_1.default(this.#head, -1);
        // Przechodzimy przez wszystkie elementy na najniższym poziomie
        while (pointer.fh_hasFollowing(0)) {
            pointer.fh_move(0);
            yield [pointer.node.value, pointer.node.score, pointer.rank]; // Wykrzykujemy wartość, score i rank jako tuple
        }
    }
    *backward() {
        // Zaczynamy od ostatniego elementu na najniższym poziomie
        const pointer = new Pointer_1.default(this.#tail, -1);
        // Przechodzimy przez wszystkie elementy na najniższym poziomie
        while (pointer.ft_hasFollowing(0)) {
            pointer.ft_move(0);
            yield [pointer.node.value, pointer.node.score, this.#reverseRank(pointer.rank)]; // Wykrzykujemy wartość, score i rank jako tuple
        }
    }
    //
    debugVisualization() {
        if (this.size > 9)
            throw new Error("ASCII visualization in console works only for maximum 9 of nodes.");
        //
        const cellSize = 11;
        const mapNodeToId = new Map();
        let nodeIdCounter = 0;
        const nodes = [];
        //
        let current = this.#head;
        while (current) {
            if (current == this.#head)
                mapNodeToId.set(current, "H");
            else if (current == this.#tail)
                mapNodeToId.set(current, "T");
            else
                mapNodeToId.set(current, mapNodeToId.get(current) ?? (nodeIdCounter++));
            const isCurrentNodeBorder = (current == this.#head || current == this.#tail);
            nodes.push({
                isCurrentNodeBorder,
                id: mapNodeToId.get(current),
                value: current.value,
                score: current.score,
                fspan: current.forwardSpan,
                bspan: current.backwardSpan,
                next: current.next,
                prev: current.prev,
            });
            //
            current = current.next[0];
        }
        //
        console.log("Size is " + this.size + ", content: " + this);
        console.log(nodes.map(x => (x.isCurrentNodeBorder ? "$" : "*").repeat(cellSize)).join(" "));
        console.log(nodes.map(x => `|id: ${x.id}`.padEnd(cellSize - 1, " ") + "|").join(" "));
        console.log(nodes.map(x => "-".repeat(cellSize)).join(" "));
        for (let i = this.#config.maxLevel - 1; i >= 0; i--) {
            console.log(nodes
                .map(x => {
                let cellLine = "";
                cellLine += `|${i}| `;
                if (mapNodeToId.has(x.prev[i]) || mapNodeToId.has(x.next[i])) {
                    cellLine += `${mapNodeToId.has(x.prev[i]) ? mapNodeToId.get(x.prev[i]) + "<" : " <"}`;
                    cellLine += "-";
                    cellLine += `${mapNodeToId.has(x.next[i]) ? ">" + mapNodeToId.get(x.next[i]) : "> "}`;
                }
                return cellLine.padEnd(cellSize - 1, " ") + "|";
            })
                .join(" "));
        }
        console.log(nodes.map(x => "-".repeat(cellSize)).join(" "));
        for (let i = this.#config.maxLevel - 1; i >= 0; i--)
            console.log(nodes.map(x => (`|${i}| ` + (x.fspan[i] ? `~~> ${x.fspan[i]}` : "")).padEnd(cellSize - 1, " ") + "|").join(" "));
        console.log(nodes.map(x => "-".repeat(cellSize)).join(" "));
        for (let i = this.#config.maxLevel - 1; i >= 0; i--)
            console.log(nodes.map(x => (`|${i}| ` + (x.bspan[i] ? `${x.bspan[i]} <~~` : "")).padEnd(cellSize - 1, " ") + "|").join(" "));
        console.log(nodes.map(x => "-".repeat(cellSize)).join(" "));
        console.log(nodes.map(x => `|` + (x.isCurrentNodeBorder ? "" : `$: ${x.value}`).padEnd(cellSize - 2, " ") + "|").join(" "));
        console.log(nodes.map(x => `|` + (x.isCurrentNodeBorder ? "" : `#: ${x.score}`).padEnd(cellSize - 2, " ") + "|").join(" "));
        console.log(nodes.map(x => (x.isCurrentNodeBorder ? "$" : "*").repeat(cellSize)).join(" "));
    }
}
exports.default = FinalSkipList;
