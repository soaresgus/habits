import * as Popover from '@radix-ui/react-popover';
import { useState } from 'react';
import clsx from 'clsx';
import dayjs from 'dayjs';
import { ProgressBar } from './ProgressBar';
import { Checkbox } from './Checkbox';
interface IHabitDayProps {
  amount?: number;
  completed?: number;
  date: Date;
}

export function HabitDay({ amount = 0, completed = 0, date }: IHabitDayProps) {
  const [active, setActive] = useState(false);

  const weekDay = dayjs(date).format('dddd');
  const dayAndMonth = dayjs(date).format('DD/MM');

  const completedPercentage =
    amount > 0 ? Math.round((completed / amount) * 100) : 0;

  async function getHabitsByDate() {}

  return (
    <Popover.Root onOpenChange={(open) => setActive(open)}>
      <Popover.Trigger
        className={clsx(
          'w-10 h-10 bg-zinc-900 border-2 border-zinc-800 rounded-lg transition-all',
          {
            'bg-zinc-900 border-zinc-800': completedPercentage === 0,
            'bg-violet-900 border-violet-700':
              completedPercentage > 0 && completedPercentage < 20,
            'bg-violet-800 border-violet-600':
              completedPercentage >= 20 && completedPercentage < 40,
            'bg-violet-700 border-violet-500':
              completedPercentage >= 40 && completedPercentage < 60,
            'bg-violet-600 border-violet-400':
              completedPercentage >= 60 && completedPercentage < 80,
            'bg-violet-500 border-violet-400': completedPercentage >= 80,
            'border-4': active,
          }
        )}
        style={{ borderColor: active ? 'white' : '' }}
      />

      <Popover.Portal>
        <Popover.Content
          className="min-w-[320px] max-w-[374px] p-6 rounded-2xl bg-zinc-900 flex flex-col animate-showPopover data-[state=closed]:animate-closePopover"
          side="left"
        >
          <span className="font-semibold text-zinc-400">{weekDay}</span>
          <span className="mt-1 font-extrabold leading-tight text-3xl">
            {dayAndMonth}
          </span>

          <ProgressBar progress={completedPercentage} />

          <div className="mt-6 flex flex-col gap-3">
            {amount > 0 ? (
              <Checkbox
                title="Beber 2L de água"
                labelExtraClassName="peer-data-[state=checked]:line-through peer-data-[state=checked]:text-zinc-400 font-semibold text-xl "
              />
            ) : (
              <span className="text-zinc-400 cursor-pointer">
                Você ainda não está monitorando nenhum hábito, comece{' '}
                <span className="text-violet-400 underline">
                  cadastrando um
                </span>
                .
              </span>
            )}
          </div>

          <Popover.Arrow height={8} width={16} className="fill-zinc-900" />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
