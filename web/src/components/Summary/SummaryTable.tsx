import { useQuery } from '@tanstack/react-query';
import { api } from '../../libs/aixos';
import colors from 'tailwindcss/colors';
import Skeleton from 'react-loading-skeleton';
import dayjs from 'dayjs';
import { HabitDay } from './HabitDay';
import { generateDatesFromYearBeginning } from '../../utils/generate-dates-from-year-beginning';

import 'react-loading-skeleton/dist/skeleton.css';
import { useEffect, useRef } from 'react';
import { useSearch } from '../../context/SearchContext/useSearch';

const weekDays = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];

const summaryDates = generateDatesFromYearBeginning();

const minimumSummaryDatesSize = 19 * 7; // 18 week = 126 days
const amountOfDaysToFill = minimumSummaryDatesSize - summaryDates.length;

export interface ISummaryData {
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

  const { searchQuery, setSearchMessage, searchMessage, setSearchIsError } =
    useSearch();

  async function getSummary() {
    const response = await api.get('/summary');
    return (await response.data) as ISummaryData[];
  }

  const searchTimeoutRef = useRef<ReturnType<typeof setInterval>>();
  const componentInitialRender = useRef<boolean>(true);

  useEffect(() => {
    if (componentInitialRender.current) {
      componentInitialRender.current = false;
      return;
    }
    setSearchIsError(false);
    setSearchMessage('Filtrando...');
    const timeoutId = setTimeout(() => {
      if (searchQuery.every((value) => value.description && value.operator)) {
        //search
        setSearchIsError(true);
        setSearchMessage('Nenhum hábito encontrado para o filtro desejado.');
      } else {
        setSearchIsError(true);
        setSearchMessage('Complete o filtro para realizar a busca.');
      }
    }, 1 * 1000 /*2 seconds*/);
    searchTimeoutRef.current = timeoutId;

    return () => {
      clearTimeout(searchTimeoutRef.current as ReturnType<typeof setInterval>);
    };
  }, [searchQuery]);

  return (
    <div className="w-full max-w-[1024px] overflow-x-auto flex scrollbar-thin scrollbar-thumb-zinc-600 scrollbar-track-zinc-800 relative pt-4">
      <div className="grid grid-rows-7 grid-flow-row gap-2 sticky bg-background z-10 left-0 -translate-y-1">
        {weekDays.map((weekDay, index) => (
          <div
            key={`${weekDay}-${index}`}
            className="text-zinc-400 text-xl h-10 w-10 flex items-center justify-center font-bold"
          >
            {weekDay}
          </div>
        ))}
      </div>

      <div className="grid grid-rows-7 grid-flow-col gap-3 pl-2 pb-4">
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
