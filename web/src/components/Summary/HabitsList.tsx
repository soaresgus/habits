import { useQuery, useQueryClient } from '@tanstack/react-query';
import dayjs from 'dayjs';
import Skeleton from 'react-loading-skeleton';
import colors from 'tailwindcss/colors';
import { api } from '../../libs/aixos';
import { Checkbox } from '../General/Checkbox';

interface IHabitsListProps {
  date: Date;
  onCompletedChanged(completed: number): void;
}

interface IHabitsByDateData {
  possibleHabits: [{ id: string; title: string; created_at: 'string' }];
  completedHabits: string[];
}

export function HabitsList({ date, onCompletedChanged }: IHabitsListProps) {
  const { isLoading, data: habitsList } = useQuery<IHabitsByDateData>(
    [`${date}-habitsList`],
    () => getHabitsByDate(date)
  );
  const queryClient = useQueryClient();

  const isDateInPast = dayjs(date).endOf('day').isBefore(new Date());

  const habitsByDateCache = queryClient.getQueryData<IHabitsByDateData>([
    `${date}-habitsList`,
  ]);

  async function handleToggleHabit(habitId: string) {
    const isHabitAlreadyCompleted =
      habitsList!.completedHabits.includes(habitId);

    let completedHabits: string[] = [];

    if (isHabitAlreadyCompleted) {
      completedHabits = habitsList!.completedHabits.filter(
        (id) => id != habitId
      );
    } else {
      completedHabits = [...habitsList!.completedHabits, habitId];
    }

    queryClient.setQueryData([`${date}-habitsList`], {
      possibleHabits: habitsList!.possibleHabits,
      completedHabits: completedHabits,
    });

    onCompletedChanged(completedHabits.length);

    await api.patch(`/habits/${habitId}/toggle`);
  }

  async function getHabitsByDate(date: Date) {
    const response = await api.get('/day', {
      params: { date: dayjs(date).startOf('day').toISOString() },
    });
    return response.data as IHabitsByDateData;
  }

  return (
    <div className="mt-6 flex flex-col gap-3">
      {isLoading ? (
        Array.from({ length: 3 }).map((_, index) => (
          <div className="flex gap-3 items-center" key={index}>
            <Skeleton
              width={32}
              height={32}
              borderRadius={8}
              baseColor={colors.zinc[700]}
              highlightColor={colors.zinc[600]}
              duration={0.8}
            />
            <Skeleton
              width={200}
              height={18}
              borderRadius={8}
              baseColor={colors.zinc[700]}
              highlightColor={colors.zinc[600]}
              duration={0.8}
            />
          </div>
        ))
      ) : (
        <>
          {habitsList?.possibleHabits && habitsList?.possibleHabits.length > 0
            ? habitsList.possibleHabits.map((habit) => (
                <Checkbox
                  key={habit.id}
                  title={habit.title}
                  checked={habitsByDateCache!.completedHabits.includes(
                    habit.id
                  )}
                  onCheckedChange={() => handleToggleHabit(habit.id)}
                  disabled={isDateInPast}
                  labelExtraClassName="peer-data-[state=checked]:line-through peer-data-[state=checked]:text-zinc-400 font-semibold text-xl peer-disabled:cursor-not-allowed"
                />
              ))
            : !isDateInPast && (
                <span className="text-zinc-400 cursor-pointer">
                  Você ainda não está monitorando nenhum hábito, comece{' '}
                  <span className="text-blue-400 underline">
                    cadastrando um
                  </span>
                  .
                </span>
              )}
          {isDateInPast && (
            <span className="text-zinc-400 font-semibold">
              Modificações encerradas
            </span>
          )}
        </>
      )}
    </div>
  );
}
