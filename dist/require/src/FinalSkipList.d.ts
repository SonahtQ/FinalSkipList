export type ValueScoreTuple<T> = (readonly [T, number]);
export interface ValueScoreRank<T> {
    value: T;
    score: number;
    rank: number;
}
export interface Options {
    maxLevel?: number;
    getLevel?: null | ((config: Required<Options>) => number);
}
export default class FinalSkipList<T> {
    #private;
    static from<T>(valueScoreTuples: Iterable<ValueScoreTuple<T>>, options?: Options): FinalSkipList<T>;
    constructor(valueScoreTuples: Iterable<ValueScoreTuple<T>>, options?: Options);
    constructor(options?: Options);
    get size(): number;
    insert(value: T, score: number, fromTail?: boolean): void;
    deleteByScore(score: number, fullResult?: false, fromTail?: boolean): T[];
    deleteByScore(score: number, fullResult: true, fromTail?: boolean): ValueScoreRank<T>[];
    deleteByScore(minScore: number, maxScore: number, fullResult?: false, fromTail?: boolean): T[];
    deleteByScore(minScore: number, maxScore: number, fullResult?: true, fromTail?: boolean): ValueScoreRank<T>[];
    deleteByRank(rank: number, fullResult?: false, fromTail?: boolean): T | null;
    deleteByRank(rank: number, fullResult: true, fromTail?: boolean): ValueScoreRank<T> | null;
    deleteByRank(minRank: number, maxRank: number, fullResult?: false, fromTail?: boolean): T[];
    deleteByRank(minRank: number, maxRank: number, fullResult: true, fromTail?: boolean): ValueScoreRank<T>[];
    deleteByValue(value: T, fullResult?: false, fromTail?: boolean): number[];
    deleteByValue(value: T, fullResult?: true, fromTail?: boolean): ValueScoreRank<T>[];
    popFirst(fullResult?: false): null | T;
    popFirst(fullResult: true): null | ValueScoreRank<T>;
    popLast(fullResult?: false): null | T;
    popLast(fullResult: true): null | ValueScoreRank<T>;
    getByScore(score: number, fullResult?: false, fromTail?: boolean): T[];
    getByScore(score: number, fullResult: true, fromTail?: boolean): ValueScoreRank<T>[];
    getByScore(minScore: number, maxScore: number, fullResult?: false, fromTail?: boolean): T[];
    getByScore(minScore: number, maxScore: number, fullResult: true, fromTail?: boolean): ValueScoreRank<T>[];
    getByRank(rank: number, fullResult?: false, fromTail?: boolean): T | null;
    getByRank(rank: number, fullResult: true, fromTail?: boolean): ValueScoreRank<T> | null;
    getByRank(minRank: number, maxRank: number, fullResult?: false, fromTail?: boolean): T[];
    getByRank(minRank: number, maxRank: number, fullResult: true, fromTail?: boolean): ValueScoreRank<T>[];
    getScore(value: T): number[];
    getRank(value: T, fullResult?: false, fromTail?: boolean): number[];
    getRank(value: T, fullResult: true, fromTail?: boolean): ValueScoreRank<T>[];
    getRank(value: T, score: number, fullResult?: false, fromTail?: boolean): number[];
    getRank(value: T, score: number, fullResult: true, fromTail?: boolean): ValueScoreRank<T>[];
    getRank(value: T, minScore: number, maxScore: number, fullResult?: false, fromTail?: boolean): number[];
    getRank(value: T, minScore: number, maxScore: number, fullResult: true, fromTail?: boolean): ValueScoreRank<T>[];
    countByValue(value: T): number;
    countByScore(score: number, fromTail?: boolean): number;
    countByScore(minScore: number, maxScore: number, fromTail?: boolean): number;
    has(value: T): void;
    forEach(callback: (value: T, score: number, rank: number) => void): void;
    forEachBackward(callback: (value: T, score: number, rank: number) => void): void;
    toString(): string;
    [Symbol.iterator](): Generator<readonly [T, number, number], void, unknown>;
    backward(): Generator<readonly [T, number, number], void, unknown>;
    private debugVisualization;
}
