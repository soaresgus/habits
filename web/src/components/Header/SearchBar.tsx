import {
  useRef,
  useState,
  ChangeEvent,
  Fragment,
  KeyboardEvent,
  useEffect,
} from 'react';
import { useTransition, animated } from '@react-spring/web';
import { useSearch } from '../../context/SearchContext/useSearch';
import { PossibleOperators } from '../../context/SearchContext/types';
import clsx from 'clsx';

interface ISearchBarProps {}

type FilterMethod = {
  title: string;
  operator: PossibleOperators;
  example: string;
};

const filterMethods: FilterMethod[] = [
  {
    title: 'nome do hábito',
    operator: 'name',
    example: 'name beber 2L de água',
  },
  { title: 'data', operator: 'date', example: 'date 20/01' },
  { title: 'progresso', operator: 'progress', example: 'progress >= 50' },
  { title: 'dias incompletos', operator: 'incomplete', example: 'incomplete' },
  { title: 'dias completos', operator: 'complete', example: 'complete' },
];

const possibleOperators: PossibleOperators[] = [
  'complete',
  'date',
  'name',
  'incomplete',
  'progress',
];

export function SearchBar() {
  const [filterMethodsPopoverActive, setFilterMethodsPopoverActive] =
    useState(false);
  const [searchBarValues, setSearchBarValues] = useState<string[]>([]);
  const [searchBarError, setSearchBarError] = useState<string>();
  const [selectedSearchBarInputIndex, setSelectedSearchBarInputIndex] =
    useState<number>(0);

  const { query: queryList, setQuery } = useSearch();

  const searchBarInputsRefs = useRef<HTMLInputElement[]>([]);
  const searchBarInitialRenders = useRef<number>(2);

  const transition = useTransition(filterMethodsPopoverActive, {
    from: { y: 4, opacity: 0 },
    enter: { y: 0, opacity: 1 },
    leave: { y: 4, opacity: 0 },
    config: { duration: 150 },
  });

  useEffect(() => {
    if (searchBarInitialRenders.current > 0) {
      searchBarInitialRenders.current -= 1;
      return;
    }

    if (searchBarInputsRefs.current[selectedSearchBarInputIndex]) {
      searchBarInputsRefs.current[selectedSearchBarInputIndex].focus();
    }
  }, [searchBarValues]);

  useEffect(() => {
    if (queryList[selectedSearchBarInputIndex + 1]) {
      if (
        queryList.some((value) => !value.operator && value.description == '')
      ) {
        searchBarInputsRefs.current[selectedSearchBarInputIndex + 1].focus();
      }
    }
  }, [queryList]);

  function handleChangeSearchInput(
    event: ChangeEvent<HTMLInputElement>,
    searchIndex: number
  ) {
    setSearchBarError('');
    const searchBarValuesCopy = searchBarValues.slice();
    searchBarValuesCopy[searchIndex] = event.target.value;
    const currentInputValue = searchBarValuesCopy[searchIndex];

    const queryCopy = queryList.slice();

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
    }

    const newSearchBarValue = searchBarValuesCopy;
    const newQueryValue = queryCopy;

    setQuery(newQueryValue);
    setSearchBarValues(newSearchBarValue);

    setFilterMethodsPopoverActive(false);
    currentInputValue.length == 0 && setFilterMethodsPopoverActive(true);
  }

  function handleSearchInputKeyDown(
    event: KeyboardEvent<HTMLInputElement>,
    searchIndex: number
  ) {
    const keyCode = event.code.toLowerCase();
    const inputValue = searchBarValues[searchIndex];

    let queryCopy = queryList.slice();

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

          if (searchIndex > 0 && searchIndex == searchBarValues.length - 1) {
            searchBarInputsRefs.current[
              selectedSearchBarInputIndex - 1
            ].focus();
          } else {
            searchBarInputsRefs.current[selectedSearchBarInputIndex].focus();
          }

          event.preventDefault();
          setSearchBarValues(searchBarValuesCopy);
        }
        setQuery(queryCopy);
      }
    }

    if (keyCode === 'slash') {
      event.preventDefault();
      if (
        queryCopy[searchIndex].description.length > 0 &&
        queryCopy[searchIndex].operator
      ) {
        queryCopy[searchIndex + 1] = { description: '' };
        setQuery(queryCopy);
        return;
      }
      setSearchBarError('Complete a busca anterior para iniciar uma nova.');
    }
  }

  return (
    <>
      <div className="w-full overflow-x-auto scrollbar-thin scrollbar-thumb-zinc-600 scrollbar-track-zinc-900  rounded-lg bg-zinc-800 text-white placeholder:text-zinc-400 transition-all [&:has(input:focus)]:outline-none [&:has(input:focus)]:ring-2 [&:has(input:focus)]:ring-blue-800 [&:has(input:focus)]:ring-offset-2 [&:has(input:focus)]:ring-offset-zinc-900 flex items-center">
        {queryList.map((query, index) => (
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
                  'pr-0': queryList.length > 1,
                  'pl-0': queryList.length > 1 && index != 0,
                }
              )}
              placeholder="Filtrar hábitos"
              value={searchBarValues[index]}
              ref={(ref) => (searchBarInputsRefs!.current[index] = ref!)}
              onFocus={() => {
                setFilterMethodsPopoverActive(true);
                setSelectedSearchBarInputIndex(index);
              }}
              onBlur={() => setFilterMethodsPopoverActive(false)}
              onChange={(event) => {
                handleChangeSearchInput(event, index);
              }}
              onKeyDown={(event) => {
                handleSearchInputKeyDown(event, index);
              }}
            />
            {queryList.length > 1 && index != queryList.length - 1 && (
              <span className="mx-1 bg-zinc-900 p-1 rounded-sm text-zinc-400">
                ;
              </span>
            )}
          </Fragment>
        ))}
      </div>

      {transition(
        (style, visible) =>
          visible && (
            <animated.div
              className="flex flex-col items-center bg-zinc-800 p-2 w-screen min-w-[300px] max-w-[340px] mt-3 rounded-lg z-50 absolute"
              style={style}
            >
              <span className="text-zinc-400 text-base">Formas de filtrar</span>
              <div className="flex flex-col gap-2 w-full text-sm">
                {filterMethods.map((method) => (
                  <div
                    key={method.title}
                    className="flex justify-between bg-zinc-900 p-2 w-full rounded-lg transition-colors cursor-pointer hover:bg-background"
                    onClick={() => {
                      setQuery([
                        ...queryList.slice(0, selectedSearchBarInputIndex),
                        {
                          ...queryList[selectedSearchBarInputIndex],
                          operator: method.operator,
                        },
                        ...queryList.slice(selectedSearchBarInputIndex + 1),
                      ]);
                      searchBarInputsRefs.current[0].focus();
                      setFilterMethodsPopoverActive(false);
                    }}
                  >
                    <span className="first-letter:capitalize ">
                      {method.title}
                    </span>
                    <span className="text-zinc-400">Ex.: {method.example}</span>
                  </div>
                ))}
                <span className="text-zinc-400 text-xs text-center">
                  <span className="bg-zinc-900 p-1 rounded-sm">Dica</span>: Faça
                  pesquisas múltiplas usando ponto e vírgula (
                  <span className="bg-zinc-900 p-1 rounded-sm">;</span>)
                </span>
              </div>
            </animated.div>
          )
      )}
      <span className="flex justify-center text-sm text-red-500 h-0">
        {searchBarError}
      </span>
    </>
  );
}
