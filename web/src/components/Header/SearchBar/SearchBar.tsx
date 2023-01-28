import {
  useRef,
  useState,
  ChangeEvent,
  Fragment,
  KeyboardEvent,
  useEffect,
  useReducer,
} from 'react';
import { useTransition, animated } from '@react-spring/web';
import clsx from 'clsx';
import { SearchBarFiltersMethodsPopover } from './SearchBarFiltersMethodsPopover';
import { useSearch } from '../../../context/SearchContext/useSearch';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../../../libs/aixos';
import dayjs from 'dayjs';
import { formatDateInPatternDdMm } from '../../../utils/format-date-in-pattern-dd-mm';
import { ISummaryData } from '../../Summary/SummaryTable';

type PossibleOperators =
  | 'name'
  | 'date'
  | 'progress'
  | 'incomplete'
  | 'complete';

type Query = {
  operator?: PossibleOperators;
  description: string;
};

type PossibleSearchProgressOperators = '>' | '=' | '<';

interface IHabitSearchData {
  id: string;
  title: string;
  createdAt: Date;
  weekDays: number[];
}

interface IReducerState {
  filterMethodsPopoverActive: boolean;
  searchBarValues: string[];
  selectedSearchBarInputIndex: number;
  searchQuery: Query[];
  searchIsError: boolean;
  searchIsSuccess: boolean;
  searchMessage: string;
}

type ReducerActions =
  | {
      type: 'setFilterMethodsPopoverActive';
      active: boolean;
    }
  | {
      type: 'setSearchBarValues';
      searchBarValues: string[];
    }
  | {
      type: 'setSelectedSearchBarInputIndex';
      searchBarInputIndex: number;
    }
  | {
      type: 'setSearchQuery';
      searchQuery: Query[];
    }
  | {
      type: 'setSearchIsError';
      searchIsError: boolean;
    }
  | {
      type: 'setSearchMessage';
      searchMessage: string;
    }
  | { type: 'setSearchIsSuccess'; searchIsSuccess: boolean };

function reducer(state: IReducerState, action: ReducerActions) {
  switch (action.type) {
    case 'setFilterMethodsPopoverActive':
      return {
        ...state,
        filterMethodsPopoverActive: action.active,
      };

    case 'setSearchBarValues':
      return {
        ...state,
        searchBarValues: action.searchBarValues,
      };

    case 'setSelectedSearchBarInputIndex':
      return {
        ...state,
        selectedSearchBarInputIndex: action.searchBarInputIndex,
      };

    case 'setSearchQuery':
      return {
        ...state,
        searchQuery: action.searchQuery,
      };

    case 'setSearchIsError':
      return { ...state, searchIsError: action.searchIsError };

    case 'setSearchMessage':
      return { ...state, searchMessage: action.searchMessage };

    case 'setSearchIsSuccess':
      return { ...state, searchIsSuccess: action.searchIsSuccess };
    default:
      return state;
  }
}

const possibleOperators: PossibleOperators[] = [
  'complete',
  'date',
  'name',
  'incomplete',
  'progress',
];

export function SearchBar() {
  const [
    {
      filterMethodsPopoverActive,
      searchBarValues,
      searchIsError,
      searchIsSuccess,
      searchMessage,
      searchQuery,
      selectedSearchBarInputIndex,
    },
    dispatch,
  ] = useReducer(reducer, {
    filterMethodsPopoverActive: false,
    searchBarValues: [],
    selectedSearchBarInputIndex: 0,
    searchQuery: [{ description: '' }],
    searchIsError: false,
    searchIsSuccess: false,
    searchMessage: '',
  });

  const queryClient = useQueryClient();
  const summaryCache = queryClient.getQueryData(['summary']) as ISummaryData[];

  const searchBarInputsRefs = useRef<HTMLInputElement[]>([]);
  const componentInitialRender = useRef<boolean>(true);
  const searchInitialRender = useRef<boolean>(true);
  const searchTimeoutRef = useRef<ReturnType<typeof setInterval>>();

  const searchMessageSpanTransition = useTransition(Boolean(searchMessage), {
    from: { y: 4, opacity: 0 },
    enter: { y: 0, opacity: 1 },
    leave: { y: 4, opacity: 0 },
    config: { duration: 150 },
  });

  const searchQueryIsValid = searchQuery.every(
    (value) => value.description && value.operator
  );

  const {
    data: habitsDateByName,
    refetch,
    isSuccess: habitDateByNameIsSuccess,
  } = useQuery<IHabitSearchData[]>(
    [
      `habit-${
        searchQueryIsValid &&
        searchQuery.filter((value) => value.operator === 'name').length > 0
          ? searchQuery.filter((value) => value.operator === 'name')[0]
              .description
          : ''
      }`,
    ],
    () =>
      getHabitsByName(
        searchQueryIsValid &&
          searchQuery.filter((value) => value.operator === 'name').length > 0
          ? searchQuery.filter((value) => value.operator === 'name')[0]
              .description
          : ''
      )
  );

  const { filteredHabits, setFilteredHabits } = useSearch();

  async function getHabitsByName(name: string) {
    const response = await api.get(`/search/${name}`);
    return (await response.data) as IHabitSearchData[];
  }

  function handleChangeSearchInput(
    event: ChangeEvent<HTMLInputElement>,
    searchIndex: number
  ) {
    dispatch({ type: 'setSearchMessage', searchMessage: '' });

    dispatch({ type: 'setSearchIsError', searchIsError: false });

    const searchBarValuesCopy = searchBarValues.slice();
    searchBarValuesCopy[searchIndex] = event.target.value;
    const currentInputValue = searchBarValuesCopy[searchIndex];

    const queryCopy = searchQuery.slice();

    queryCopy[searchIndex] = {
      ...queryCopy[searchIndex],
      description: currentInputValue,
    };

    const currentQueryValue = queryCopy[searchIndex];

    const currentInputValueContainsSomePossibleOperator =
      possibleOperators.some((value) => currentInputValue.includes(value));

    if (currentInputValueContainsSomePossibleOperator) {
      /**
       * get possible operators string from description and set to operator
       */

      const RegExToGetOperator = `\\b(?!${possibleOperators
        .map((value, index) =>
          index != possibleOperators.length - 1
            ? `(${value})\\b|`
            : `(${value})\\b`
        )
        .join('')})\\w+`;

      const getOperatorInDescription = currentQueryValue.description
        .replaceAll(new RegExp(RegExToGetOperator, 'gi'), '')
        .trim()
        .toLowerCase();

      const operatorInDescriptionWithoutSpecialChars =
        getOperatorInDescription.replaceAll(/[^\w\s]/gi, '');

      /**
       * Remove all possible operators strings from description and clear current input
       */

      currentQueryValue.operator =
        operatorInDescriptionWithoutSpecialChars as PossibleOperators;

      const allOperatorsORRegEx = possibleOperators.join('|');

      currentQueryValue.description = currentQueryValue.description.replaceAll(
        new RegExp(allOperatorsORRegEx, 'gi'),
        ''
      );

      searchBarValuesCopy[searchIndex] = '';

      /**
       * remove repeated operators
       */

      if (
        queryCopy.filter(
          (value) => value.operator === operatorInDescriptionWithoutSpecialChars
        ).length > 1
      ) {
        queryCopy[searchIndex].operator = undefined;

        dispatch({
          type: 'setSearchMessage',
          searchMessage: 'Não é permitido o uso de operadores repetidos.',
        });

        dispatch({
          type: 'setSearchIsError',
          searchIsError: true,
        });
      }
    }

    const newSearchBarValue = searchBarValuesCopy;
    const newQueryValue = queryCopy;

    console.log(newQueryValue);

    dispatch({
      type: 'setSearchQuery',
      searchQuery: newQueryValue,
    });

    dispatch({
      type: 'setSearchBarValues',
      searchBarValues: newSearchBarValue,
    });

    dispatch({
      type: 'setSearchBarValues',
      searchBarValues: newSearchBarValue,
    });
  }

  function handleSearchInputKeyDown(
    event: KeyboardEvent<HTMLInputElement>,
    searchIndex: number
  ) {
    const keyCode = event.code.toLowerCase();
    const inputValue = searchBarValues[searchIndex];

    let queryCopy = searchQuery.slice();

    if (keyCode === 'delete' || keyCode === 'backspace') {
      if (!inputValue || inputValue.length <= 0) {
        if (queryCopy[searchIndex].operator) {
          queryCopy[searchIndex] = {
            ...queryCopy[searchIndex],
            operator: undefined,
          };
        }

        if (!queryCopy[searchIndex].operator) {
          let searchBarValuesCopy = searchBarValues;

          queryCopy = [
            ...queryCopy.slice(0, searchIndex),
            ...queryCopy.slice(searchIndex + 1),
          ];

          searchBarValuesCopy = [
            ...searchBarValuesCopy.slice(0, searchIndex),
            ...searchBarValuesCopy.slice(searchIndex + 1),
          ];

          if (searchBarValues.length <= 1) {
            queryCopy = [{ description: '' }];
          }

          searchBarInputsRefs.current[selectedSearchBarInputIndex].focus();

          if (searchIndex > 0 && searchIndex == searchBarValues.length - 1) {
            searchBarInputsRefs.current[
              selectedSearchBarInputIndex - 1
            ].focus();
          }

          event.preventDefault();
          dispatch({
            type: 'setSearchBarValues',
            searchBarValues: searchBarValuesCopy,
          });
        }
        dispatch({
          type: 'setSearchQuery',
          searchQuery: queryCopy,
        });
      }
    }

    if (keyCode === 'slash') {
      event.preventDefault();
      if (
        queryCopy[searchIndex].description.length > 0 &&
        queryCopy[searchIndex].operator
      ) {
        queryCopy[searchIndex + 1] = { description: '' };
        dispatch({
          type: 'setSearchQuery',
          searchQuery: queryCopy,
        });
        return;
      }
      dispatch({
        type: 'setSearchMessage',
        searchMessage: 'Complete a busca anterior para iniciar uma nova',
      });

      dispatch({
        type: 'setSearchIsError',
        searchIsError: true,
      });
    }
  }

  function handleClickOnSearchMethod(operator: PossibleOperators) {
    dispatch({
      type: 'setSearchQuery',
      searchQuery: [
        ...searchQuery.slice(0, selectedSearchBarInputIndex),
        {
          ...searchQuery[selectedSearchBarInputIndex],
          operator: operator,
        },
        ...searchQuery.slice(selectedSearchBarInputIndex + 1),
      ],
    });

    searchBarInputsRefs.current[selectedSearchBarInputIndex].focus();

    dispatch({ type: 'setFilterMethodsPopoverActive', active: false });
  }

  function filterHabits(): Date[] {
    let filteredHabits: Date[] = [];
    if (searchQueryIsValid) {
      //Date
      const searchQueryDatesFormatted = searchQuery
        .filter((value) => value.operator === 'date')
        .map((value) =>
          dayjs(formatDateInPatternDdMm(value.description)).toDate()
        );

      filteredHabits = searchQueryDatesFormatted;

      //Progress
      const searchQueryProgress = searchQuery.filter(
        (value) => value.operator === 'progress'
      );

      const searchQueryProgressNumber = Number(
        searchQueryProgress
          .map((value) => value.description.split(/>|<|=/))
          .map((value) => value[1])
      );

      const searchQueryProgressLogicOperator = searchQuery.map((value) =>
        value.description
          .replaceAll(new RegExp('\\b(?!(>)\\b|(<)\\b|(=)\\b)\\w+', 'gi'), '')
          .trim()
      )[0] as PossibleSearchProgressOperators;

      const habitsProgress = summaryCache.map((value) => {
        return {
          date: value.date,
          progress: Math.round((value.completed / value.amount) * 100),
        };
      });

      let filteredHabitsByProgress: Date[] = [];

      switch (searchQueryProgressLogicOperator) {
        case '>':
          filteredHabitsByProgress = habitsProgress
            .filter((value) => value.progress > searchQueryProgressNumber)
            .map((value) => dayjs(value.date).toDate());
          break;
        case '<':
          filteredHabitsByProgress = habitsProgress
            .filter(
              (value) =>
                value.progress < searchQueryProgressNumber && value.progress > 0
            )
            .map((value) => dayjs(value.date).toDate());
          break;
        case '=':
          filteredHabitsByProgress = habitsProgress
            .filter((value) => value.progress == searchQueryProgressNumber)
            .map((value) => dayjs(value.date).toDate());
          break;
      }

      if (filteredHabitsByProgress.length > 0) {
        filteredHabits = filteredHabitsByProgress;

        if (searchQueryDatesFormatted.length > 0) {
          filteredHabits = filteredHabitsByProgress.filter(
            (value) =>
              value.toString() === searchQueryDatesFormatted[0].toString()
          );
        }
      }
    }

    return filteredHabits;
  }

  useEffect(() => {
    if (componentInitialRender.current) {
      componentInitialRender.current = false;
      return;
    }

    if (searchBarInputsRefs.current[selectedSearchBarInputIndex]) {
      searchBarInputsRefs.current[selectedSearchBarInputIndex].focus();
    }
  }, [searchBarValues]);

  useEffect(() => {
    if (searchQuery[selectedSearchBarInputIndex + 1]) {
      if (
        searchQuery.some((value) => !value.operator && value.description == '')
      ) {
        searchBarInputsRefs.current[selectedSearchBarInputIndex + 1].focus();
      }
    }

    //Search

    if (searchInitialRender.current) {
      searchInitialRender.current = false;
      return;
    }

    if (searchQueryIsValid) {
      setFilteredHabits([]);
      dispatch({ type: 'setSearchMessage', searchMessage: 'Filtrando...' });
      dispatch({ type: 'setSearchIsError', searchIsError: false });
      dispatch({ type: 'setSearchIsSuccess', searchIsSuccess: false });
    }

    const timeoutId = setTimeout(() => {
      if (searchQueryIsValid) {
        console.log(searchQuery);
        console.log(filterHabits());
        dispatch({ type: 'setSearchIsError', searchIsError: false });
        dispatch({ type: 'setSearchIsSuccess', searchIsSuccess: true });
        dispatch({
          type: 'setSearchMessage',
          searchMessage: 'Hábitos filtrados foram marcados em verde.',
        });
        dispatch({ type: 'setFilterMethodsPopoverActive', active: false });

        setFilteredHabits(filterHabits());
        if (filterHabits().length <= 0) {
          dispatch({
            type: 'setSearchMessage',
            searchMessage: 'Nenhum hábito encontrado para o filtro desejado.',
          });
          dispatch({ type: 'setSearchIsError', searchIsError: true });
        }
        return;
      }

      dispatch({
        type: 'setSearchMessage',
        searchMessage: 'Complete o filtro para realizar a busca.',
      });

      dispatch({ type: 'setSearchIsError', searchIsError: false });
    }, 2 * 1000 /*2 seconds*/);
    searchTimeoutRef.current = timeoutId;

    return () => {
      clearTimeout(searchTimeoutRef.current);
    };
  }, [searchQuery]);

  useEffect(() => {
    if (searchMessage && searchIsError) {
      dispatch({ type: 'setSearchIsSuccess', searchIsSuccess: false });
      if (searchBarInputsRefs.current[selectedSearchBarInputIndex]) {
        searchBarInputsRefs.current[selectedSearchBarInputIndex].blur();
      }
    }
  }, [searchIsError]);

  return (
    <>
      <div className="w-full overflow-x-auto scrollbar-thin scrollbar-thumb-zinc-600 scrollbar-track-zinc-900  rounded-lg bg-zinc-800 text-white placeholder:text-zinc-400 transition-all [&:has(input:focus)]:outline-none [&:has(input:focus)]:ring-2 [&:has(input:focus)]:ring-blue-800 [&:has(input:focus)]:ring-offset-2 [&:has(input:focus)]:ring-offset-zinc-900 flex items-center">
        {searchQuery.map((query, index) => (
          <Fragment key={`${query.description}_${index}`}>
            {query.operator && (
              <span
                className={clsx(
                  ' bg-zinc-900 p-1 rounded-sm text-zinc-400 [&+input]:pl-1',
                  { 'ml-4': index == 0 }
                )}
              >
                {query.operator}:
              </span>
            )}
            <input
              className={clsx(
                `w-full h-full outline-none bg-transparent p-4 min-w-[120px]`,
                {
                  'pr-0': searchQuery.length > 1,
                  'pl-0': searchQuery.length > 1 && index != 0,
                }
              )}
              placeholder="Filtrar hábitos"
              value={searchBarValues[index]}
              ref={(ref) => (searchBarInputsRefs!.current[index] = ref!)}
              onFocus={() => {
                dispatch({
                  type: 'setFilterMethodsPopoverActive',
                  active: true,
                });

                dispatch({
                  type: 'setSelectedSearchBarInputIndex',
                  searchBarInputIndex: index,
                });
              }}
              onBlur={() => {
                dispatch({
                  type: 'setFilterMethodsPopoverActive',
                  active: false,
                });
              }}
              onChange={(event) => {
                handleChangeSearchInput(event, index);
              }}
              onKeyDown={(event) => {
                handleSearchInputKeyDown(event, index);
              }}
            />
            {searchQuery.length > 1 && index != searchQuery.length - 1 && (
              <span className="mx-1 bg-zinc-900 p-1 rounded-sm text-zinc-400">
                ;
              </span>
            )}
          </Fragment>
        ))}
      </div>

      <SearchBarFiltersMethodsPopover
        active={filterMethodsPopoverActive}
        onClickInMethod={handleClickOnSearchMethod}
      />

      {searchMessageSpanTransition(
        (style, visible) =>
          visible && (
            <animated.span
              style={style}
              className={clsx(
                `flex justify-center text-sm text-zinc-400 h-0 w-full`,
                {
                  'text-red-500': searchIsError,
                  'text-green-500': searchIsSuccess,
                }
              )}
            >
              {searchMessage}
            </animated.span>
          )
      )}
    </>
  );
}
