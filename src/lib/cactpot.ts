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

export function getExpectedBonus(
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
