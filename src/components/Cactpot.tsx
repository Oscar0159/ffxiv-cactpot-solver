import React, { useRef, useState } from 'react';

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
import { cn } from '@/lib/utils';

import NumberPad from './NumberPad';
import { Button } from './motion-ui/button';

type CactpotLineDirection =
  | 'TopRow'
  | 'MiddleRow'
  | 'BottomRow'
  | 'LeftColumn'
  | 'MiddleColumn'
  | 'RightColumn'
  | 'DiagonalTopLeftToBottomRight'
  | 'DiagonalTopRightToBottomLeft';

interface CactpotProps {
  cactpotBoard?: (number | undefined)[][];
  onChange?: (newValue: (number | undefined)[][]) => void;
}

export default function Cactpot({ cactpotBoard, onChange }: CactpotProps) {
  const selectedCellRef = useRef<{ row: number; col: number } | null>(null);
  const [numberPadOpen, setNumberPadOpen] = useState(false);
  const { t } = useTranslation();

  const isSelectFinished = cactpotBoard
    ? cactpotBoard.flat().filter((v) => v !== undefined).length >= 4
    : false;

  const cactpotLineSelectItems = [
    {
      row: 0,
      col: 0,
      dir: 'DiagonalTopLeftToBottomRight',
      prefix: <MoveDownRight />,
    },
    { row: 0, col: 1, dir: 'LeftColumn', prefix: <MoveDown /> },
    { row: 0, col: 2, dir: 'MiddleColumn', prefix: <MoveDown /> },
    { row: 0, col: 3, dir: 'RightColumn', prefix: <MoveDown /> },
    {
      row: 0,
      col: 4,
      dir: 'DiagonalTopRightToBottomLeft',
      prefix: <MoveDownLeft />,
    },
    { row: 1, col: 0, dir: 'TopRow', prefix: <MoveRight /> },
    { row: 2, col: 0, dir: 'MiddleRow', prefix: <MoveRight /> },
    { row: 3, col: 0, dir: 'BottomRow', prefix: <MoveRight /> },
  ];

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
      <div className="grid grid-cols-5 grid-rows-4 place-items-center gap-2">
        {cactpotLineSelectItems.map((item, index) => (
          <div
            key={index}
            style={{
              gridColumnStart: item.col + 1,
              gridRowStart: item.row + 1,
            }}
          >
            <Badge variant="outline">{item.prefix}</Badge>
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
                  'aspect-square h-18 border-2 text-2xl transition-all duration-300 ease-in-out',
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
