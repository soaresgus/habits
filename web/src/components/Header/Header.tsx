import { Plus, X } from 'phosphor-react';
import * as Dialog from '@radix-ui/react-dialog';
import logoSrc from '../../assets/logo.svg';
import { NewHabitForm } from './NewHabitForm';
import { SearchBar } from './SearchBar';

export function Header() {
  return (
    <header className="w-full max-w-3xl mx-auto flex items-center justify-between flex-wrap gap-4 max-md:justify-center">
      <img src={logoSrc} alt="Habits Logo" />

      <div className="max-[709px]:order-3 flex-1 w-screen min-w-[300px] max-w-[340px]">
        <SearchBar />
      </div>

      <Dialog.Root>
        <Dialog.Trigger
          type="button"
          className="border-2 border-blue-500 font-semibold rounded-lg px-6 py-4 flex items-center gap-3 hover:border-blue-300 transition-all focus:outline-none focus:ring-2 focus:ring-blue-800 focus:ring-offset-2 focus:ring-offset-background"
        >
          <Plus size={20} className="text-blue-500" />
          Novo hábito
        </Dialog.Trigger>

        <Dialog.Portal>
          <Dialog.Overlay className="w-screen h-screen bg-black/80 fixed inset-0" />
          <Dialog.Content className="absolute p-10 bg-zinc-900 rounded-2xl w-full max-w-md top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-showModal data-[state=closed]:animate-closeModal z-50">
            <Dialog.Close className="absolute right-6 top-6 text-zinc-400 hover:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-blue-800 focus:ring-offset-2 focus:ring-offset-zinc-900 rounded-full transition-all">
              <X size={24} aria-label="Fechar" />
            </Dialog.Close>

            <Dialog.Title className="text-3xl leading-tight font-extrabold">
              Criar hábito
            </Dialog.Title>

            <NewHabitForm />
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </header>
  );
}
