import type { CactpotLineDirection } from '@/types/cactpot';

import { combinations } from './combinations';

const bonus = [
  0, 0, 0, 0, 0, 0, 10000, 36, 720, 360, 80, 252, 108, 72, 54, 180, 72, 180,
  119, 36, 306, 1080, 144, 1800, 3600,
];

const boardLineIndices: Record<
  CactpotLineDirection,
  Array<[number, number]>
> = {
  TopRow: [
    [0, 0],
    [0, 1],
    [0, 2],
  ],
  MiddleRow: [
    [1, 0],
    [1, 1],
    [1, 2],
  ],
  BottomRow: [
    [2, 0],
    [2, 1],
    [2, 2],
  ],
  LeftColumn: [
    [0, 0],
    [1, 0],
    [2, 0],
  ],
  MiddleColumn: [
    [0, 1],
    [1, 1],
    [2, 1],
  ],
  RightColumn: [
    [0, 2],
    [1, 2],
    [2, 2],
  ],
  DiagonalTopLeftToBottomRight: [
    [0, 0],
    [1, 1],
    [2, 2],
  ],
  DiagonalTopRightToBottomLeft: [
    [0, 2],
    [1, 1],
    [2, 0],
  ],
};

export function calcExpectedBonus(
  board: (number | undefined)[][],
  lineDirection: CactpotLineDirection,
): number {
  const indices = boardLineIndices[lineDirection];
  const lineValues = indices
    .map(([row, col]) => board[row][col])
    .filter((val): val is number => val !== undefined);
  const knownNumbers = board
    .flat()
    .filter((num): num is number => num !== undefined);

  const allCombinations = [
    ...combinations(
      [1, 2, 3, 4, 5, 6, 7, 8, 9].filter((n) => !knownNumbers.includes(n)),
      3 - lineValues.length,
    ),
  ].map((combo) => [...lineValues, ...combo]);

  const scoreProbabilities: Map<number, number> = new Map();
  for (const combo of allCombinations) {
    const lineSum = combo.reduce((sum, num) => sum + num, 0);
    scoreProbabilities.set(
      lineSum,
      (scoreProbabilities.get(lineSum) || 0) + 1 / allCombinations.length,
    );
  }

  let expectedBonus = 0;
  for (const [score, probability] of scoreProbabilities) {
    expectedBonus += bonus[score] * probability;
  }

  return expectedBonus;
}

export function calcRevealPositions(
  board: (number | undefined)[][],
): Array<[number, number]> {
  const positions: Array<[number, number]> = [];

  const emptyPositions: Array<[number, number]> = [];
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 3; col++) {
      if (board[row][col] === undefined) {
        emptyPositions.push([row, col]);
      }
    }
  }
  if (emptyPositions.length === 0) {
    return positions;
  }

  const availableNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9].filter((num) =>
    !board.flat().includes(num),
  );
  const posAverageScores: Map<string, number> = new Map();
  for (const pos of emptyPositions) {
    for (const num of availableNumbers) {
      const testBoard = JSON.parse(JSON.stringify(board)) as (
        | number
        | undefined
      )[][];
      testBoard[pos[0]][pos[1]] = num;
      let totalExpectedBonus = 0;
      for (const lineDirection of Object.keys(boardLineIndices) as CactpotLineDirection[]) {
        totalExpectedBonus += calcExpectedBonus(testBoard, lineDirection);
      }
      const key = `${pos[0]},${pos[1]}`;
      posAverageScores.set(
        key,
        (posAverageScores.get(key) || 0) + totalExpectedBonus / availableNumbers.length,
      );
    }
  }
  
  const sortedPositions = Array.from(posAverageScores.entries()).sort(
    (a, b) => b[1] - a[1],
  );
  const maxScore = sortedPositions[0][1];
  for (const [key, score] of sortedPositions) {
    if (score === maxScore) {
      const [rowStr, colStr] = key.split(',');
      positions.push([parseInt(rowStr, 10), parseInt(colStr, 10)]);
    } else {
      break;
    }
  }

  return positions;
}
