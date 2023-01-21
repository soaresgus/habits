import { useQuery } from '@tanstack/react-query';
import { api } from '../libs/aixos';
import colors from 'tailwindcss/colors';
import Skeleton from 'react-loading-skeleton';
import dayjs from 'dayjs';
import { HabitDay } from './HabitDay';
import { generateDatesFromYearBeginning } from '../utils/generate-dates-from-year-beginning';

import 'react-loading-skeleton/dist/skeleton.css';

const weekDays = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];

const summaryDates = generateDatesFromYearBeginning();

const minimumSummaryDatesSize = 18 * 7; // 18 week = 126 days
const amountOfDaysToFill = minimumSummaryDatesSize - summaryDates.length;

interface ISummaryData {
  id: string;
  date: string;
  completed: number;
  amount: number;
}

export function SummaryTable() {
  const { data: summary, isSuccess } = useQuery<ISummaryData[]>(
    ['summary'],
    () => getSummary()
  );

  async function getSummary() {
    const response = await api.get('/summary');
    return (await response.data) as ISummaryData[];
  }

  return (
    <div className="w-full flex">
      <div className="grid grid-rows-7 grid-flow-row gap-3">
        {weekDays.map((weekDay, index) => (
          <div
            key={`${weekDay}-${index}`}
            className="text-zinc-400 text-xl h-10 w-10 flex items-center justify-center font-bold"
          >
            {weekDay}
          </div>
        ))}
      </div>

      <div className="grid grid-rows-7 grid-flow-col gap-3">
        {!isSuccess ? (
          <>
            {Array.from({ length: minimumSummaryDatesSize }).map((_, index) => (
              <Skeleton
                key={index}
                width={40}
                height={40}
                borderRadius={8}
                baseColor={colors.zinc[900]}
                highlightColor={colors.zinc[800]}
                duration={0.8}
              />
            ))}
          </>
        ) : (
          <>
            {summaryDates.map((date) => {
              const dayInSummary = summary?.find((day) =>
                dayjs(date).isSame(day.date, 'day')
              );

              return (
                <HabitDay
                  key={String(date)}
                  date={date}
                  amount={dayInSummary?.amount}
                  defaultCompleted={dayInSummary?.completed}
                />
              );
            })}
            {amountOfDaysToFill > 0 &&
              Array.from({ length: amountOfDaysToFill }).map((_, index) => (
                <div
                  key={index}
                  className="w-10 h-10 bg-zinc-900 border-2 border-zinc-800 rounded-lg opacity-40 cursor-not-allowed"
                />
              ))}
          </>
        )}
      </div>
    </div>
  );
}
