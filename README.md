# FinalSkipList

Fast & fully-featured skip list data structure for JavaScript and TypeScript, designed for efficient and easy-to-use operations on sorted sets of data.

## Features

- Insert, delete, and search by rank or score.
- Supports duplicate scores with unique values.
- Count and query ranges of scores or ranks.
- Iterable with `for...of` loops.
- Customizable configuration for optimization.
- Written in TypeScript with type definitions included.

## Installation

```bash
npm install finalskiplist
```

## Usage

### TypeScript

```typescript
import FinalSkipList from 'finalskiplist';

const mySkipList = new FinalSkipList<string>();

// Insert elements with scores
mySkipList.insert('A', 10);
mySkipList.insert('B', 20);
mySkipList.insert('C', 30);
mySkipList.insert('D', 40);
mySkipList.insert('E', 50);
mySkipList.insert('F', 60);

// Get elements by rank
console.log(mySkipList.getByRank(0)); // 'A'
console.log(mySkipList.getByRank(1)); // 'B'

// Get elements by score
console.log(mySkipList.getByScore(20)); // ['B']

// Delete elements by rank or score
mySkipList.deleteByRank(0); // 'A'
mySkipList.deleteByScore(30); // ['C']
```

## API

For a detailed API documentation and examples, check out the [API.md](./API.md) file.

## License

FinalSkipList is licensed under the [MIT License](./LICENSE).