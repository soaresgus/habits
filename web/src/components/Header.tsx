import { Plus } from 'phosphor-react';
import logoSrc from '../assets/logo.svg';

export function Header() {
  return (
    <header className="w-full max-w-3xl mx-auto flex items-center justify-between">
      <img src={logoSrc} alt="Habits Logo" />

      <button
        type="button"
        className="border-2 border-violet-500 font-semibold rounded-lg px-6 py-4 flex items-center gap-3 hover:border-violet-300 transition-all"
      >
        <Plus size={20} className="text-violet-500" />
        Novo hábito
      </button>
    </header>
  );
}
