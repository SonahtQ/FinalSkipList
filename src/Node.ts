import { Nullable } from "./Utilities";

//

// Klasa Node przechowuje parę key/value oraz następne i poprzednie węzły dla każdego poziomu.
export default class Node<T> {
    public score: number;
    public value: T;

    public next: Nullable<Node<T>>[];
    public prev: Nullable<Node<T>>[];

    public forwardSpan: number[];
    public backwardSpan: number[];

    //

    constructor(score: number, value: T, level: number) {
        this.score = score;
        this.value = value;

        this.next = new Array(level).fill(null);
        this.prev = new Array(level).fill(null);

        this.forwardSpan = new Array(level).fill(0);
        this.backwardSpan = new Array(level).fill(0);
    }

    //

    get level() {
        return this.next.length;
    }

    //

    get isBorder() {
        return this.isHead || this.isTail;
    }

    get isHead() {
        return this.prev[0] == null;
    }

    get isTail() {
        return this.next[0] == null;
    }
}