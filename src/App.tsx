import { useTranslation } from 'react-i18next';

import { useHistoryState } from '@uidotdev/usehooks';
import { Redo, RotateCw, Undo } from 'lucide-react';

import { Button } from '@/components/motion-ui/button';
import { ButtonGroup } from '@/components/ui/button-group';

import Cactpot from './components/Cactpot';
import LanguageSwitcher from './components/LanguageSwitcher';
import ThemeToggle from './components/ThemeToggle';
import { ThemeProvider } from './theme/ThemeProvider';

function App() {
  const {
    state: gridValue,
    set: setGridValue,
    undo,
    redo,
    clear,
    canUndo,
    canRedo,
  } = useHistoryState<(number | undefined)[][]>([
    [undefined, undefined, undefined],
    [undefined, undefined, undefined],
    [undefined, undefined, undefined],
  ]);
  const { t } = useTranslation();

  return (
    <ThemeProvider>
      <div className="flex h-dvh flex-col">
        <header className="bg-background/80 flex h-16 items-center justify-end gap-4 px-6">
          <ThemeToggle />
          <LanguageSwitcher />
        </header>
        <main className="flex flex-1 flex-col items-center justify-center">
          <ButtonGroup className="mb-4">
            <Button variant="outline" onClick={undo} disabled={!canUndo}>
              <Undo />
              {t('common.undo')}
            </Button>
            <Button variant="outline" onClick={redo} disabled={!canRedo}>
              <Redo />
              {t('common.redo')}
            </Button>
            <Button variant="outline" onClick={clear}>
              <RotateCw />
              {t('common.reset')}
            </Button>
          </ButtonGroup>
          <Cactpot cactpotBoard={gridValue} onChange={setGridValue} />
        </main>
      </div>
    </ThemeProvider>
  );
}

export default App;
