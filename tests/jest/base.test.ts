import FinalSkipList, {ValueScoreRank} from "../../src/FinalSkipList";

//

function getRandomInt(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomValue() {
    return `#${getRandomInt(1, 5)}`;
}

function getRandomScore() {
    return getRandomInt(1, 200) * 1000;
}

function getRandomScoreRange() {
    let minScore = getRandomInt(1 * 1000, 100 * 1000);
    let maxScore = getRandomInt(100 * 1000, 200 * 1000);

    if (minScore > maxScore)
        [minScore, maxScore] = [maxScore, minScore];

    return [minScore, maxScore];
}

//

describe('TEST_NO_1', () => {
    let valueScoreTuples: (readonly [string, number])[];
    let valueScoreRankSorted: ValueScoreRank<string>[];

    beforeAll(() => {

    });

    beforeEach(() => {
        valueScoreTuples = new Array(getRandomInt(1000, 2000))
            .fill(null)
            .map((x, i) => [getRandomValue(), getRandomScore()] as const);

        valueScoreRankSorted = Array.from(valueScoreTuples)
            .sort((a, b) => a[1] < b[1] ? -1 : 1) //posortuj wg score rosnąco
            .map((x, i) => ({value: x[0], score: x[1], rank: i})) //dodaj rank czyli index
    });

    test('should be the same as in sorted array', () => {
        const fsl = new FinalSkipList(valueScoreTuples);
        const arr = Array.from(valueScoreRankSorted);

        //

        expect(fsl.size).toBe(arr.length);

        //

        fsl.forEach((value, score, rank) => {
            expect(rank).toBeGreaterThanOrEqual(0);

            expect(value).toBe(arr[rank]?.value);
            expect(score).toBe(arr[rank]?.score);
        })

        //

        const [minRank, maxRank] = [5, 15];

        const fslRankRangeArr = fsl.getByRank(minRank, maxRank, true);
        const fslRankRangeArr_fromTail = fsl.getByRank(minRank, maxRank, true, true);
        const arrIndexRangeArr = arr.filter(x => x.rank >= minRank && x.rank <= maxRank);

        expect(fslRankRangeArr).toEqual(fslRankRangeArr_fromTail);
        expect(fslRankRangeArr).toEqual(arrIndexRangeArr);

        //

        const [minScore, maxScore] = getRandomScoreRange();

        const fslScoreRangeArr = fsl.getByScore(minScore, maxScore, true);
        const fslScoreRangeArr_fromTail = fsl.getByScore(minScore, maxScore, true, true);
        const arrScoreRangeArr = arr.filter(x => x.score >= minScore && x.score <= maxScore);

        expect(fslScoreRangeArr).toEqual(fslScoreRangeArr_fromTail);
        expect(fslScoreRangeArr).toEqual(arrScoreRangeArr);

        //

        const valueToGet = getRandomValue();

        const fslValueScoreRankArr = fsl.getRank(valueToGet, true)
            .sort((a,b) => a.rank > b.rank ? -1 : 1)
        const fslValueScoreRankArr_fromTail = fsl.getRank(valueToGet, true, true)
            .sort((a,b) => a.rank > b.rank ? -1 : 1)
        const arrValueScoreRankArr = arr.filter(x => x.value == valueToGet)
            .sort((a,b) => a.rank > b.rank ? -1 : 1)

        expect(fslValueScoreRankArr).toEqual(fslValueScoreRankArr_fromTail);
        expect(fslValueScoreRankArr).toEqual(arrValueScoreRankArr);
    });

    test('should be the same as in sorted array, after random deleting by rank', () => {
        const fsl = new FinalSkipList(valueScoreTuples);
        const fsl2 = new FinalSkipList(valueScoreTuples);
        const arr = Array.from(valueScoreRankSorted);

        //

        let deleting = getRandomInt(10, 20);
        while (deleting > 0) {
            const index = getRandomInt(0, arr.length - 1);

            arr.splice(index, 1);
            fsl.deleteByRank(index);
            fsl2.deleteByRank(index, false, true);

            deleting--;
        }

        //

        expect(fsl.size).toBe(fsl2.size);
        expect(fsl.size).toBe(arr.length);

        //

        fsl.forEach((value, score, rank) => {
            expect(rank).toBeGreaterThanOrEqual(0);

            expect(arr.at(rank)?.value).toBe(value);
            expect(arr.at(rank)?.score).toBe(score);
        })

        fsl.forEachBackward((value, score, rank) => {
            expect(rank).toBeGreaterThanOrEqual(0);

            expect(arr.at(rank)?.value).toBe(value);
            expect(arr.at(rank)?.score).toBe(score);
        })

        fsl2.forEach((value, score, rank) => {
            expect(rank).toBeGreaterThanOrEqual(0);

            expect(arr.at(rank)?.value).toBe(value);
            expect(arr.at(rank)?.score).toBe(score);
        })

        fsl2.forEachBackward((value, score, rank) => {
            expect(rank).toBeGreaterThanOrEqual(0);

            expect(arr.at(rank)?.value).toBe(value);
            expect(arr.at(rank)?.score).toBe(score);
        })
    });

    test('should be the same as in sorted array, after random deleting by score', () => {
        const fsl = new FinalSkipList(valueScoreTuples);
        const fsl2 = new FinalSkipList(valueScoreTuples);
        let arr = Array.from(valueScoreRankSorted);

        const [minScore, maxScore] = getRandomScoreRange();

        //

        arr = arr.filter(x => !(x.score >= minScore && x.score <= maxScore));

        const arrDeletedCount = valueScoreRankSorted.length - arr.length;

        const fslDeletedCount = fsl.deleteByScore(minScore, maxScore).length;
        const fslDeletedCount_fromTail = fsl2.deleteByScore(minScore, maxScore, false, true).length;

        //

        expect(fsl.size).toBe(arr.length);

        expect(fslDeletedCount).toBe(fslDeletedCount_fromTail);
        expect(arrDeletedCount).toBe(fslDeletedCount);

        fsl.forEach((value, score, rank) => {
            expect(rank).toBeGreaterThanOrEqual(0);

            expect(arr.at(rank)?.value).toBe(value);
            expect(arr.at(rank)?.score).toBe(score);
        })

        fsl.forEachBackward((value, score, rank) => {
            expect(rank).toBeGreaterThanOrEqual(0);

            expect(arr.at(rank)?.value).toBe(value);
            expect(arr.at(rank)?.score).toBe(score);
        })

        fsl2.forEach((value, score, rank) => {
            expect(rank).toBeGreaterThanOrEqual(0);

            expect(arr.at(rank)?.value).toBe(value);
            expect(arr.at(rank)?.score).toBe(score);
        })

        fsl2.forEachBackward((value, score, rank) => {
            expect(rank).toBeGreaterThanOrEqual(0);

            expect(arr.at(rank)?.value).toBe(value);
            expect(arr.at(rank)?.score).toBe(score);
        })
    });

    test('should be the same as in sorted array, after random deleting by value', () => {
        const fsl = new FinalSkipList(valueScoreTuples);
        const fsl2 = new FinalSkipList(valueScoreTuples);
        let arr = Array.from(valueScoreRankSorted);

        const valueToDelete = getRandomValue();

        //

        arr = arr.filter(x => x.value != valueToDelete);

        const arrDeletedCount = valueScoreRankSorted.length - arr.length;

        const fslDeletedCount = fsl.deleteByValue(valueToDelete).length;
        const fslDeletedCount_fromTail = fsl2.deleteByValue(valueToDelete, false, true).length;

        //

        expect(fsl.size).toBe(arr.length);

        expect(fslDeletedCount).toBe(fslDeletedCount_fromTail);
        expect(arrDeletedCount).toBe(fslDeletedCount);

        fsl.forEach((value, score, rank) => {
            expect(rank).toBeGreaterThanOrEqual(0);

            expect(arr.at(rank)?.value).toBe(value);
            expect(arr.at(rank)?.score).toBe(score);
        })

        fsl.forEachBackward((value, score, rank) => {
            expect(rank).toBeGreaterThanOrEqual(0);
            
            expect(arr.at(rank)?.value).toBe(value);
            expect(arr.at(rank)?.score).toBe(score);
        })

        fsl2.forEach((value, score, rank) => {
            expect(rank).toBeGreaterThanOrEqual(0);

            expect(arr.at(rank)?.value).toBe(value);
            expect(arr.at(rank)?.score).toBe(score);
        })

        fsl2.forEachBackward((value, score, rank) => {
            expect(rank).toBeGreaterThanOrEqual(0);
            
            expect(arr.at(rank)?.value).toBe(value);
            expect(arr.at(rank)?.score).toBe(score);
        })
    });

    test('Counts should be the same in both', () => {
        const fsl = new FinalSkipList(valueScoreTuples);
        let arr = Array.from(valueScoreRankSorted);

        const valueToCount = getRandomValue();
        const scoreRangeToCount = getRandomScoreRange();

        //

        const arr_countOfValue = Array.from(arr).filter(x => x.value == valueToCount).length;
        const fsl_countOfValue = fsl.countByValue(valueToCount);

        expect(arr_countOfValue).toBe(fsl_countOfValue);

        //

        const arr_countOfScoreRange = Array.from(arr).filter(x => x.score >= scoreRangeToCount[0] && x.score <= scoreRangeToCount[1]).length;
        const fsl_countOfScoreRange = fsl.countByScore(scoreRangeToCount[0], scoreRangeToCount[1]);
        const fsl_countOfScoreRange_fromTail = fsl.countByScore(scoreRangeToCount[0], scoreRangeToCount[1], true);

        //

        expect(fsl_countOfScoreRange).toBe(fsl_countOfScoreRange_fromTail);
        expect(arr_countOfScoreRange).toBe(fsl_countOfScoreRange);
    });

    test('Should pop the same elements in both', () => {
        const fsl = new FinalSkipList(valueScoreTuples);
        let arr = Array.from(valueScoreRankSorted);

        //

        let count = 10;
        while(count > 0) {
            const fsl_poped = fsl.popFirst(true);
            const arr_poped = arr.shift();

            expect(fsl_poped ?? null).toEqual(arr_poped ?? null);

            count--;
            
            arr.forEach((x, i) => {x.rank = i});
        }

        count = 10;
        while(count > 0) {
            const fsl_poped = fsl.popLast(true);
            const arr_poped = arr.pop();

            expect(fsl_poped ?? null).toEqual(arr_poped ?? null);

            count--;

            arr.forEach((x, i) => {x.rank = i});
        }
    });
});
