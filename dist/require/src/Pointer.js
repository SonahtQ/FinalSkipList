"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//
class Pointer {
    node;
    rank;
    //
    constructor(node, rank) {
        this.node = node;
        this.rank = rank;
    }
    //
    fh_move(level) {
        this.rank += this.node.forwardSpan[level];
        this.node = this.node.next[level];
    }
    ft_move(level) {
        this.rank += this.node.backwardSpan[level];
        this.node = this.node.prev[level];
    }
    //
    fh_hasFollowing(level) {
        return (this.node.next[level] && !this.node.next[level].isTail);
    }
    ft_hasFollowing(level) {
        return (this.node.prev[level] && !this.node.prev[level].isHead);
    }
    //
    fh_peekFollowingNode(level) {
        return this.node.next[level];
    }
    ft_peekFollowingNode(level) {
        return this.node.prev[level];
    }
    //
    fh_peekFollowingRank(level) {
        return this.rank + this.node.forwardSpan[level];
    }
    ft_peekFollowingRank(level) {
        return this.rank + this.node.backwardSpan[level];
    }
    fh_peekFollowingScore(level) {
        return this.node.next[level].score;
    }
    ft_peekFollowingScore(level) {
        return this.node.prev[level].score;
    }
}
exports.default = Pointer;
