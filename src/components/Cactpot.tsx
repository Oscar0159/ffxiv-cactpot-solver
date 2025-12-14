import React, { useMemo, useRef, useState } from 'react';

import { useTranslation } from 'react-i18next';

import { MoveDown, MoveDownLeft, MoveDownRight, MoveRight } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { calcExpectedBonus, calcRevealPositions } from '@/lib/cactpot';
import { cn } from '@/lib/utils';
import type { CactpotLineDirection } from '@/types/cactpot';

import NumberPad from './NumberPad';
import { Button } from './motion-ui/button';

interface CactpotProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  'onChange'
> {
  cactpotBoard: (number | undefined)[][];
  onChange?: (newValue: (number | undefined)[][]) => void;
}

export default function Cactpot({
  cactpotBoard,
  onChange,
  className,
}: CactpotProps) {
  const selectedCellRef = useRef<{ row: number; col: number } | null>(null);
  const [numberPadOpen, setNumberPadOpen] = useState(false);
  const { t } = useTranslation();

  const isSelectFinished = cactpotBoard
    ? cactpotBoard.flat().filter((v) => v !== undefined).length >= 4
    : false;

  const revealPositions = useMemo(() => {
    if (!cactpotBoard) return [];
    return calcRevealPositions(cactpotBoard);
  }, [cactpotBoard]);

  const cactpotLineSelectItems: Array<{
    row: number;
    col: number;
    dir: CactpotLineDirection;
    prefix: React.ReactNode;
    expectedBonus: number;
  }> = useMemo(
    () => [
      {
        row: 0,
        col: 0,
        dir: 'DiagonalTopLeftToBottomRight',
        prefix: <MoveDownRight />,
        expectedBonus: calcExpectedBonus(
          cactpotBoard,
          'DiagonalTopLeftToBottomRight',
        ),
      },
      {
        row: 0,
        col: 1,
        dir: 'LeftColumn',
        prefix: <MoveDown />,
        expectedBonus: calcExpectedBonus(cactpotBoard, 'LeftColumn'),
      },
      {
        row: 0,
        col: 2,
        dir: 'MiddleColumn',
        prefix: <MoveDown />,
        expectedBonus: calcExpectedBonus(cactpotBoard, 'MiddleColumn'),
      },
      {
        row: 0,
        col: 3,
        dir: 'RightColumn',
        prefix: <MoveDown />,
        expectedBonus: calcExpectedBonus(cactpotBoard, 'RightColumn'),
      },
      {
        row: 0,
        col: 4,
        dir: 'DiagonalTopRightToBottomLeft',
        prefix: <MoveDownLeft />,
        expectedBonus: calcExpectedBonus(
          cactpotBoard,
          'DiagonalTopRightToBottomLeft',
        ),
      },
      {
        row: 1,
        col: 0,
        dir: 'TopRow',
        prefix: <MoveRight />,
        expectedBonus: calcExpectedBonus(cactpotBoard, 'TopRow'),
      },
      {
        row: 2,
        col: 0,
        dir: 'MiddleRow',
        prefix: <MoveRight />,
        expectedBonus: calcExpectedBonus(cactpotBoard, 'MiddleRow'),
      },
      {
        row: 3,
        col: 0,
        dir: 'BottomRow',
        prefix: <MoveRight />,
        expectedBonus: calcExpectedBonus(cactpotBoard, 'BottomRow'),
      },
    ],
    [cactpotBoard],
  );

  const bestLineDirections = useMemo(() => {
    const maxExpectedBonus = Math.max(
      ...cactpotLineSelectItems.map((item) => item.expectedBonus),
    );
    return cactpotLineSelectItems
      .filter((item) => item.expectedBonus === maxExpectedBonus)
      .map((item) => item.dir);
  }, [cactpotLineSelectItems]);

  const hasNumber = (num: number) => {
    if (!cactpotBoard) return false;
    return cactpotBoard.flat().includes(num);
  };

  const handleNumberSelect = (num: number) => {
    if (selectedCellRef.current && onChange && cactpotBoard) {
      const newGrid = cactpotBoard.map((row) => row.slice());
      newGrid[selectedCellRef.current.row][selectedCellRef.current.col] = num;
      onChange(newGrid);
    }
  };

  return (
    <>
      <div
        className={cn(
          'grid grid-cols-5 grid-rows-4 place-items-center gap-2',
          className,
        )}
      >
        {cactpotLineSelectItems.map((item, index) => (
          <div
            key={index}
            style={{
              gridColumnStart: item.col + 1,
              gridRowStart: item.row + 1,
            }}
          >
            <Badge
              variant="outline"
              className={cn(
                isSelectFinished &&
                  bestLineDirections.includes(item.dir) &&
                  'animate-pulse border-amber-500 bg-amber-100 dark:border-amber-400 dark:bg-amber-900',
              )}
            >
              {item.prefix}
              {item.expectedBonus.toFixed(0)}
            </Badge>
          </div>
        ))}
        {Array.from({ length: 3 }).map((_, rowIndex) =>
          Array.from({ length: 3 }).map((_, colIndex) => {
            const cellValue =
              cactpotBoard && cactpotBoard[rowIndex]
                ? cactpotBoard[rowIndex][colIndex]
                : null;

            return (
              <Button
                key={`${rowIndex}-${colIndex}`}
                variant="outline"
                className={cn(
                  'aspect-square h-18 rounded-full border-2 text-2xl transition-all duration-150 ease-in-out',
                  isSelectFinished && 'hover:bg-muted/0',
                  !isSelectFinished &&
                    revealPositions.some(
                      (pos) => pos[0] === rowIndex && pos[1] === colIndex,
                    )
                    ? 'animate-pulse border-green-500 bg-green-100/50 dark:border-green-400 dark:bg-green-900/50'
                    : '',
                )}
                style={{
                  gridColumnStart: colIndex + 2,
                  gridRowStart: rowIndex + 2,
                }}
                onClick={() => {
                  if (isSelectFinished) return;
                  selectedCellRef.current = { row: rowIndex, col: colIndex };
                  setNumberPadOpen(true);
                }}
                disabled={cellValue !== undefined}
                whileTap={{ scale: 0.95 }}
              >
                {cellValue ?? null}
              </Button>
            );
          }),
        )}
      </div>
      <Dialog open={numberPadOpen} onOpenChange={setNumberPadOpen}>
        <DialogContent className="w-auto">
          <DialogHeader>
            <DialogTitle>{t('cactpot.selectNumber')}</DialogTitle>
            <DialogDescription>
              {t('cactpot.selectNumberDescription')}
            </DialogDescription>
          </DialogHeader>
          <div className="flex w-auto flex-col items-center">
            <NumberPad
              numberButtonRenderer={(num) => (
                <DialogClose
                  className={
                    hasNumber(num) ? 'pointer-events-none opacity-50' : ''
                  }
                >
                  {num}
                </DialogClose>
              )}
              onClick={handleNumberSelect}
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
