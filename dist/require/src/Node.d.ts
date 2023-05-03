import { Nullable } from "./Utilities";
export default class Node<T> {
    score: number;
    value: T;
    next: Nullable<Node<T>>[];
    prev: Nullable<Node<T>>[];
    forwardSpan: number[];
    backwardSpan: number[];
    constructor(score: number, value: T, level: number);
    get level(): number;
    get isBorder(): boolean;
    get isHead(): boolean;
    get isTail(): boolean;
}
