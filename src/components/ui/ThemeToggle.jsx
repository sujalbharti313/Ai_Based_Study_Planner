import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

/**
 * Animated sun/moon theme toggle.
 * Uses the custom .theme-toggle CSS class for the pill track
 * and animates the thumb with a spring-like cubic-bezier.
 */
export default function ThemeToggle() {
  const { isDark, toggle } = useTheme();

  return (
    <button
      onClick={toggle}
      className="theme-toggle"
      data-active={isDark ? 'true' : 'false'}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      aria-pressed={isDark}
      title={isDark ? 'Light mode' : 'Dark mode'}
    >
      <span className="theme-toggle-thumb">
        {isDark ? (
          <Moon size={11} strokeWidth={2.5} style={{ color: '#2563eb' }} />
        ) : (
          <Sun size={11} strokeWidth={2.5} style={{ color: '#ea580c' }} />
        )}
      </span>
    </button>
  );
}
