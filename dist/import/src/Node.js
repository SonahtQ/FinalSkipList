//
// Klasa Node przechowuje parę key/value oraz następne i poprzednie węzły dla każdego poziomu.
export default class Node {
    score;
    value;
    next;
    prev;
    forwardSpan;
    backwardSpan;
    //
    constructor(score, value, level) {
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
