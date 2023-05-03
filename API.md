# FinalSkipList API Documentation

This document covers the public API for the `SkipList` class from the `finalskiplist` package. All methods and properties are documented with examples.

## Table of Contents

1. [Constructor](#constructor)
2. [Inserting](#inserting)
3. [Deleting](#deleting)
4. [Get & Search](#get--search)
5. [Count](#count)
6. [Iterating](#iterating)
7. [Others](#other)

## Constructor

### `new FinalSkipList([valueScoreTuples, [options]])`

Creates a new instance of the `FinalSkipList` class. An optional `options` object can be passed to customize the behavior of the skip list.

```typescript
import FinalSkipList from "finalskiplist";

const mySkipList = new FinalSkipList({
  maxLevel: 16, // maximum levels of skip list, default: 32
  //getLevel: () => {} // custom function for level generating for new nodes, default: null
});
```

### `FinalSkipList.from([valueScoreTuples, [options]])`

Alias for `new FinalSkipList(...);`

```typescript
import FinalSkipList from "finalskiplist";

const someSkipList = FinalSkipList.from({
  maxLevel: 16
});
```

## Inserting

### `insert(value, score, [fromTail])`
`average O(log(N))`

Inserts a new `value` with a given `score`. Duplicated scores and values are allowed.

When `fromTail` (default: false) is set to `true`, then inserting process proceeds from tail instead from head of skiplist. It'll be slightly faster when You are sure that with provided `score` it should land somewhere in second half of skiplist.

```typescript
mySkipList.insert('A', 10);
mySkipList.insert('B', 20);
mySkipList.insert('C', 30);
mySkipList.insert('D', 40);
mySkipList.insert('E', 50);
mySkipList.insert('F', 60);
```

## Deleting

### `deleteByScore(score, [fullResult, [fromTail]])`
`average O(log(N)+M) - where M is number of values with same score`

Deletes values with a given score and returns array of deleted values - or if `fullResult` is `true` then returns array of `{value, score, rank}` objects.

When `fromTail` (default: false) is set to `true`, then deleting process proceeds from tail instead from head of skiplist. It'll be slightly faster when You are sure that with provided `score` it should deletes nodes somewhere in second half of skiplist.

```typescript
mySkipList.deleteByScore(1000); // Removes all values with score 1000
```

### `deleteByScore(minScore, maxScore, [fullResult, [fromTail]])`
`average O(log(N)+M) - where M is number of values between inclusively minScore & maxScore`

Deletes values within given score range (inclusively) and returns array of deleted values - or if `fullResult` is `true` then returns array of `{value, score, rank}` objects.

When `fromTail` (default: false) is set to `true`, then deleting process proceeds from tail instead from head of skiplist. It'll be slightly faster when You are sure that with provided `score` it should deletes nodes somewhere in second half of skiplist.

```typescript
mySkipList.deleteByScore(1000,4000); // Removes values within 1000-4000 score range inclusively.
```

### `deleteByRank(rank, [fullResult, [fromTail]])`
`average O(log(N))`

Deletes element with a given rank and returns its value - or if `fullResult` is `true` then returns `{value, score, rank}` object.

When `fromTail` (default: false) is set to `true`, then deleting process proceeds from tail instead from head of skiplist. It'll be slightly faster when You are sure that with provided `rank` it should deletes nodes somewhere in second half of skiplist.

```typescript
mySkipList.deleteByRank(0); // Removes the element with rank 0
```

### `deleteByRank(minRank, maxRank, [fullResult, [fromTail]])`
`average O(log(N)+M) - where M is number of values between inclusively minRank & maxRank`

Deletes values within given rank range (inclusively) and returns array of deleted values - or if `fullResult` is `true` then returns array of `{value, score, rank}` objects.

When `fromTail` (default: false) is set to `true`, then deleting process proceeds from tail instead from head of skiplist. It'll be slightly faster when You are sure that with provided `rank` it should deletes nodes somewhere in second half of skiplist.

```typescript
mySkipList.deleteByRank(1,4); // Removes values within 1-4 rank range inclusively.
```

### `deleteByValue(value, [fullResult, [fromTail]])`
`average O(M * log(N)) - where M is number of same values in skiplist`

Deletes all occurences of value and returns theirs scores as array - or if `fullResult` is `true` then returns array of `{value, score, rank}` objects.

When `fromTail` (default: false) is set to `true`, then `rank` calculate process proceeds from tail instead from head of skiplist. It'll be slightly faster when You are sure that most of occurences of `value` are somewhere in second half of skiplist.

```typescript
const scores = mySkipList.deleteByValue("C"); // Removes all occurences of "C" value
console.log(scores); // [30]
```

### `popFirst([fullResult])`
`average O(1)`

Deletes first value with lowest score and returns it. If `fullResult` is specified as `true` then returns `{value, score, rank}` object.

In case skip list is empty, null is returned.

```typescript
console.log(mySkipList.popFirst()); // "A";
console.log(mySkipList.popFirst(true)); // ["B", 20, 0];
```

### `popLast([fullResult])`
`average O(1)`

Deletes last value with highest score and returns it. If `fullResult` is specified as `true` then returns `{value, score, rank}` object.

In case skip list is empty, null is returned.

```typescript
console.log(mySkipList.popLast()); // "F";
console.log(mySkipList.popLast(true)); // ["E", 50, 4];
```

## Get & Search

### `has(value)`
`average O(1)`

Returns true if skiplist has at least one provided value and returns false otherwise.

```typescript
console.log(mySkipList.has("Z")); // false
```

### `getScore(value)`
`average O(1)`

Returns array of scores of all value occurences.

```typescript
console.log(mySkipList.getScore("B")); // [20]
```

### `getRank(value, [fullResult, [fromTail]])`
`average O(log(N))`

Returns array of `rank` of all `value` occurences. When `fullResult` is `true`, then returns array of `{value, score, rank}` objects.

When `fromTail` (default: false) is set to `true`, then `rank` calculate process proceeds from tail instead from head of skiplist. It'll be slightly faster when You are sure that most of occurences of `value` are somewhere in second half of skiplist.

```typescript
console.log(mySkipList.getRank("B")); // [1]
console.log(mySkipList.getRank("B", true)); // [["B", 1, 20]]
```

### `getRank(value, score, [fullResult, [fromTail]])`
`average O(log(N))`

Returns array of `rank` of all `value` occurences that meets score requirement. When `fullResult` is `true`, then returns array of `{value, score, rank}` objects.

When `fromTail` (default: false) is set to `true`, then `rank` calculate process proceeds from tail instead from head of skiplist. It'll be slightly faster when You are sure that most of occurences of `value` are somewhere in second half of skiplist.

```typescript
console.log(mySkipList.getRank("B", 20)); // [1]
console.log(mySkipList.getRank("B", 20, true)); // [["B", 1, 20]]
```

### `getRank(value, minScore, maxScore, [fullResult, [fromTail]])`
`average O(log(N))`

Returns array of `rank` of all `value` occurences that meets score range requirement. When `fullResult` is `true`, then returns array of `{value, score, rank}` objects.

When `fromTail` (default: false) is set to `true`, then `rank` calculate process proceeds from tail instead from head of skiplist. It'll be slightly faster when You are sure that most of occurences of `value` are somewhere in second half of skiplist.

```typescript
console.log(mySkipList.getRank("B", 20, 30)); // [1]
console.log(mySkipList.getRank("B", 20, 30, true)); // [[1, 20]]
```

### `getByRank(rank, [fullResult, [fromTail]])`
`average O(log(N))`

Returns value of given rank. Negative rank leads to indexing from the end. When `fullResult` specified as `true`, then returns `{value, score, rank}` object.

When `fromTail` (default: false) is set to `true`, then `rank` calculate process proceeds from tail instead from head of skiplist. It'll be slightly faster when You are sure that `rank` is somewhere in second half of skiplist.

```typescript
console.log(mySkipList.getByRank(0)); // 'A'
console.log(mySkipList.getByRank(-1)); // 'F'
```

### `getByRank(minRank, maxRank, [fullResult, [fromTail]])`
`average O(log(N)+M) - where M is the number of values between inclusively minRank & maxRank`

Returns array of values within given rank range (inclusively). Negative minRank/maxRank leads to indexing from the end. When `fullResult` specified as `true`, then returns array of `{value, score, rank}` objects.

When `fromTail` (default: false) is set to `true`, then `rank` calculate process proceeds from tail instead from head of skiplist. It'll be slightly faster when You are sure that `minRank` is somewhere in second half of skiplist.

```typescript
console.log(mySkipList.getByRank(0,1)); // ['A', 'B']
console.log(mySkipList.getByRank(-2,-1)); // ['E', 'F']
```

### `getByScore(score, [fullResult, [fromTail]])`
`average O(log(N)+M) - where M is the number of values with same score`

Returns an array of values with a given score. When `fullResult` specified as `true`, then returns array of `{value, score, rank}` objects.

When `fromTail` (default: false) is set to `true`, then searching proceeds from tail instead from head of skiplist. It'll be slightly faster when You are sure that `score` is somewhere in second half of skiplist.

```typescript
console.log(mySkipList.getByScore(20)); // ['B']
```

### `getByScore(minScore, maxScore, [fullResult, [fromTail]])`
`average O(log(N)+M) - where M is the number of values between inclusively minScore & maxScore`

Returns an array of values within given score range.  When `fullResult` specified as `true`, then returns array of `{value, score, rank}` objects.

When `fromTail` (default: false) is set to `true`, then searching proceeds from tail instead from head of skiplist. It'll be slightly faster when You are sure that `minScore` is somewhere in second half of skiplist.

```typescript
console.log(mySkipList.getByScore(10, 20)); // ['A', 'B']
```

## Count

### `size`

Returns the total number of values in the Skip List.

```typescript
console.log(mySkipList.size); // 6
```

### `countByValue(value)`
`average O(1)`

Returns count of all value occurences.

```typescript
console.log(mySkipList.countByValue('C')); // 1
```

### `countByScore(score, [fromTail])`
`average O(log(N)+log(M)) - where M is the number of values with same score`

Returns count of all values with score.

When `fromTail` (default: false) is set to `true`, then counting proceeds from tail instead from head of skiplist. It'll be slightly faster when You are sure that `score` is somewhere in second half of skiplist.

```typescript
console.log(mySkipList.countByScore(30)); // 1
```

### `countByScore(minScore, maxScore, [fromTail])`
`average O(log(N)+log(M)) - where M is the number of values between inclusively minScore & maxScore`

Returns count of all values within score range.

When `fromTail` (default: false) is set to `true`, then counting proceeds from tail instead from head of skiplist. It'll be slightly faster when You are sure that `minScore` is somewhere in second half of skiplist.

```typescript
console.log(mySkipList.countByScore(30, 1000)); // 4
```

## Iterating

### `forEach(callback)`

Calls callback for each value in skip list in ascending order of their scores.

```typescript
mySkipList.forEach((value, score, rank) => {
    console.log(value, score);
});
```

### `forEachBackward(callback)`

Calls callback for each value in skip list in descending order of their scores.

```typescript
mySkipList.forEachBackward((value, score, rank) => {
    console.log(value, score);
});
```

### `for...of`

`FinalSkipList` is iterable with a `for...of` loop, which returns [value,score,rank] tuples in ascending order of their scores.

```typescript
for (const [value, score] of mySkipList) {
  console.log(value, score);
}
```

## Other

### `toString()`

Returns a string representation of the Skip List structure.

```typescript
console.log(mySkipList.toString());
```