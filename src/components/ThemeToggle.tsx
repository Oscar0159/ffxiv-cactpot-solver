import { useRef } from 'react';

import { flushSync } from 'react-dom';

import { Moon, Sun } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';

import { Button } from '@/components/motion-ui/button';
import { useTheme } from '@/theme/ThemeContext';
import { cn } from '@/lib/utils';

interface ThemeToggleProps {
  className?: string;
}

export default function ThemeToggle({ className }: ThemeToggleProps) {
  const { theme, setTheme } = useTheme();

  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleThemeChange = async () => {
    const btnRect = buttonRef.current?.getBoundingClientRect();

    if (!document.startViewTransition || !btnRect) {
      setTheme(theme === 'dark' ? 'light' : 'dark');
      return;
    }

    const radius = Math.sqrt(
      Math.max(
        btnRect.x + btnRect.width / 2,
        window.innerWidth - (btnRect.x + btnRect.width / 2),
      ) **
        2 +
        Math.max(
          btnRect.y + btnRect.height / 2,
          window.innerHeight - (btnRect.y + btnRect.height / 2),
        ) **
          2,
    );

    await flushSync(() => {
      document
        .startViewTransition(() => {
          setTheme(theme === 'dark' ? 'light' : 'dark');
        })
        .ready.then(() => {
          document.documentElement.animate(
            {
              clipPath: [
                `circle(0px at ${btnRect.x + btnRect.width / 2}px ${btnRect.y + btnRect.height / 2}px)`,
                `circle(${radius}px at ${btnRect.x + btnRect.width / 2}px ${btnRect.y + btnRect.height / 2}px)`,
              ],
            },
            {
              duration: 300,
              easing: 'ease-in',
              pseudoElement: '::view-transition-new(root)',
            },
          );
        });
    });
  };

  return (
    <Button
      ref={buttonRef}
      variant="ghost"
      size="icon"
      onClick={handleThemeChange}
      className={cn("rounded-full", className)}
    >
      <AnimatePresence initial={false}>
        {theme === 'dark' ? (
          <motion.div
            className="absolute"
            initial={{ scale: 0, rotate: 360, opacity: 0 }}
            animate={{ scale: 1, rotate: 0, opacity: 1 }}
            exit={{ scale: 0, rotate: -360, opacity: 0 }}
            transition={{ type: 'spring', duration: 0.5 }}
            key={theme}
          >
            <Moon strokeWidth={3} />
          </motion.div>
        ) : (
          <motion.div
            className="absolute"
            initial={{ scale: 0, rotate: -360, opacity: 0 }}
            animate={{ scale: 1, rotate: 0, opacity: 1 }}
            exit={{ scale: 0, rotate: 360, opacity: 0 }}
            transition={{ type: 'spring', duration: 0.5 }}
            key={theme}
          >
            <Sun strokeWidth={3} />
          </motion.div>
        )}
      </AnimatePresence>
    </Button>
  );
}
