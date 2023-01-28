import * as Popover from '@radix-ui/react-popover';
import { useState } from 'react';
import clsx from 'clsx';
import dayjs from 'dayjs';
import { ProgressBar } from '../General/ProgressBar';
import { HabitsList } from './HabitsList';

interface IHabitDayProps {
  amount?: number;
  defaultCompleted?: number;
  date: Date;
  checked?: boolean;
}

export function HabitDay({
  amount = 0,
  defaultCompleted = 0,
  date,
  checked,
}: IHabitDayProps) {
  const [active, setActive] = useState(false);
  const [completed, setCompleted] = useState(defaultCompleted);

  const weekDay = dayjs(date).format('dddd');
  const dayAndMonth = dayjs(date).format('DD/MM');

  const completedPercentage =
    amount > 0 ? Math.round((completed / amount) * 100) : 0;

  function handleCompletedChanged(completed: number) {
    setCompleted(completed);
  }

  return (
    <Popover.Root onOpenChange={(open) => setActive(open)}>
      <Popover.Trigger
        className={clsx(
          'w-10 h-10 bg-zinc-900 border-2 border-zinc-800 rounded-lg transition-all  focus:outline-none focus:ring-2 focus:ring-blue-800 focus:ring-offset-2 focus:ring-offset-background',
          {
            'bg-zinc-900 border-zinc-800': completedPercentage === 0,
            'bg-blue-900 border-blue-700':
              completedPercentage > 0 && completedPercentage < 20,
            'bg-blue-800 border-blue-600':
              completedPercentage >= 20 && completedPercentage < 40,
            'bg-blue-700 border-blue-500':
              completedPercentage >= 40 && completedPercentage < 60,
            'bg-blue-600 border-blue-400':
              completedPercentage >= 60 && completedPercentage < 80,
            'bg-blue-500 border-blue-400': completedPercentage >= 80,
            'border-4': active,
            'border-green-400 border-4': checked,
          }
        )}
        style={{ borderColor: active ? 'white' : '' }}
      />

      <Popover.Portal>
        <Popover.Content
          className="min-w-[320px] max-w-[374px] p-6 rounded-2xl bg-zinc-900 flex flex-col animate-showPopover data-[state=closed]:animate-closePopover z-20"
          side="left"
        >
          <span className="font-semibold text-zinc-400">{weekDay}</span>
          <span className="mt-1 font-extrabold leading-tight text-3xl">
            {dayAndMonth}
          </span>

          <ProgressBar progress={completedPercentage} />

          <HabitsList date={date} onCompletedChanged={handleCompletedChanged} />

          <Popover.Arrow height={8} width={16} className="fill-zinc-900" />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
