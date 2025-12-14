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
import { getExpectedBonus } from '@/lib/cactpot';
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
        expectedBonus: getExpectedBonus(
          cactpotBoard,
          'DiagonalTopLeftToBottomRight',
        ),
      },
      {
        row: 0,
        col: 1,
        dir: 'LeftColumn',
        prefix: <MoveDown />,
        expectedBonus: getExpectedBonus(cactpotBoard, 'LeftColumn'),
      },
      {
        row: 0,
        col: 2,
        dir: 'MiddleColumn',
        prefix: <MoveDown />,
        expectedBonus: getExpectedBonus(cactpotBoard, 'MiddleColumn'),
      },
      {
        row: 0,
        col: 3,
        dir: 'RightColumn',
        prefix: <MoveDown />,
        expectedBonus: getExpectedBonus(cactpotBoard, 'RightColumn'),
      },
      {
        row: 0,
        col: 4,
        dir: 'DiagonalTopRightToBottomLeft',
        prefix: <MoveDownLeft />,
        expectedBonus: getExpectedBonus(
          cactpotBoard,
          'DiagonalTopRightToBottomLeft',
        ),
      },
      {
        row: 1,
        col: 0,
        dir: 'TopRow',
        prefix: <MoveRight />,
        expectedBonus: getExpectedBonus(cactpotBoard, 'TopRow'),
      },
      {
        row: 2,
        col: 0,
        dir: 'MiddleRow',
        prefix: <MoveRight />,
        expectedBonus: getExpectedBonus(cactpotBoard, 'MiddleRow'),
      },
      {
        row: 3,
        col: 0,
        dir: 'BottomRow',
        prefix: <MoveRight />,
        expectedBonus: getExpectedBonus(cactpotBoard, 'BottomRow'),
      },
    ],
    [cactpotBoard],
  );

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
            <Badge variant="outline">
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
