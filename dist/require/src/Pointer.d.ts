import Node from "./Node";
export default class Pointer<T> {
    node: Node<T>;
    rank: number;
    constructor(node: Node<T>, rank: number);
    fh_move(level: number): void;
    ft_move(level: number): void;
    fh_hasFollowing(level: number): boolean | null;
    ft_hasFollowing(level: number): boolean | null;
    fh_peekFollowingNode(level: number): import("./Utilities").Nullable<Node<T>>;
    ft_peekFollowingNode(level: number): import("./Utilities").Nullable<Node<T>>;
    fh_peekFollowingRank(level: number): number;
    ft_peekFollowingRank(level: number): number;
    fh_peekFollowingScore(level: number): number;
    ft_peekFollowingScore(level: number): number;
}
