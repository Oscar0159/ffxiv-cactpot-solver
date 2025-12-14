import { useTranslation } from 'react-i18next';

import { useHistoryState } from '@uidotdev/usehooks';
import { Redo, RotateCw, Undo } from 'lucide-react';

import { Button } from '@/components/motion-ui/button';
import { ButtonGroup } from '@/components/ui/button-group';

import Github from './assets/github.svg?react';
import Cactpot from './components/Cactpot';
import CactuarCanvas from './components/CactuarCanvas';
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
        <header className="bg-background/80 flex h-16 items-center px-6">
          <div className="flex-1"></div>
          <h4 className="flex-1 scroll-m-20 text-center text-xl font-semibold tracking-tight">
            {t('common.appName')}
          </h4>
          <div className="flex flex-1 justify-end gap-4">
            <ThemeToggle />
            <LanguageSwitcher />
          </div>
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
          <div className="flex w-full">
            <CactuarCanvas />
            <Cactpot
              cactpotBoard={gridValue}
              onChange={setGridValue}
              className="shrink-0"
            />
            <CactuarCanvas />
          </div>
        </main>
        <footer className="bg-background/80 flex h-12 flex-col items-center justify-center gap-1 px-6 pb-2">
          <div className="flex items-center">
            <p className="text-muted-foreground text-sm">
              © 2025 Archer Wn. {t('common.rightsReserved')}
            </p>
            <a
              href="https://github.com/Oscar0159/ffxiv-cactpot-solver"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Github className="fill-muted-foreground ml-4 h-5 w-5 hover:opacity-70" />
            </a>
          </div>
          <p className="text-muted-foreground text-sm">
            {t('common.cactuarCredit')}
          </p>
        </footer>
      </div>
    </ThemeProvider>
  );
}

export default App;
