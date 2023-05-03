import Node from "./Node";

//

export default class Pointer<T> {
    public node: Node<T>;
    public rank: number;

    //

    constructor(node: Node<T>, rank: number) {
        this.node = node;
        this.rank = rank;
    }

    //

    fh_move(level: number) {
        this.rank += this.node.forwardSpan[level];
        this.node = this.node.next[level]!;
    }

    ft_move(level: number) {
        this.rank += this.node.backwardSpan[level];
        this.node = this.node.prev[level]!;
    }

    //

    fh_hasFollowing(level: number) {
        return (this.node.next[level] && !this.node.next[level]!.isTail);
    }

    ft_hasFollowing(level: number) {
        return (this.node.prev[level] && !this.node.prev[level]!.isHead);
    }

    //

    fh_peekFollowingNode(level: number) {
        return this.node.next[level];
    }

    ft_peekFollowingNode(level: number) {
        return this.node.prev[level];
    }

    //

    fh_peekFollowingRank(level: number) {
        return this.rank + this.node.forwardSpan[level];
    }

    ft_peekFollowingRank(level: number) {
        return this.rank + this.node.backwardSpan[level];
    }

    fh_peekFollowingScore(level: number) {
        return this.node.next[level]!.score;
    }

    ft_peekFollowingScore(level: number) {
        return this.node.prev[level]!.score;
    }
}