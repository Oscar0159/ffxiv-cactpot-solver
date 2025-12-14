import { Button } from './motion-ui/button';

interface NumberPadProps {
  onClick?: (num: number) => void;
  numbers?: number[];
  disabledNumbers?: number[];
  numberButtonRenderer?: (num: number) => React.ReactNode;
}

export default function NumberPad({
  onClick,
  numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9],
  numberButtonRenderer,
}: NumberPadProps) {
  const renderButton = (num: number) => {
    return numberButtonRenderer ? numberButtonRenderer(num) : num;
  };

  return (
    <div className="grid w-max grid-cols-3 gap-2">
      {numbers.map((num) => (
        <Button
          key={num}
          variant="outline"
          className="aspect-square h-14 text-xl"
          onClick={() => onClick?.(num)}
          whileTap={{ scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          asChild={renderButton !== undefined}
        >
          {renderButton(num)}
        </Button>
      ))}
    </div>
  );
}
