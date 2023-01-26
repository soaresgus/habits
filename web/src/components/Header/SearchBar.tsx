import { useRef, useState, ChangeEvent, Fragment } from 'react';
import { useTransition, animated } from '@react-spring/web';
import { useSearch } from '../../context/SearchContext/useSearch';
import { PossibleOperators, Query } from '../../context/SearchContext/types';
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

  const { query: queryList, setQuery } = useSearch();

  const transition = useTransition(filterMethodsPopoverActive, {
    from: { y: 4, opacity: 0 },
    enter: { y: 0, opacity: 1 },
    leave: { y: 4, opacity: 0 },
    config: { duration: 150 },
  });

  const inputRef = useRef<HTMLInputElement>(null);

  function handleChangeSearchInput(
    event: ChangeEvent<HTMLInputElement>,
    searchIndex: number
  ) {
    const searchBarValuesCopy = searchBarValues.slice();
    searchBarValuesCopy[searchIndex] = event.target.value;
    const currentInputValue = searchBarValuesCopy[searchIndex];

    const queryCopy = queryList.slice();
    queryCopy[searchIndex].description = currentInputValue;
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

    if (currentInputValue.length <= 0) {
      console.log('alo');
    }

    const newSearchBarValue = searchBarValuesCopy;
    const newQueryValue = queryCopy;

    console.log(newQueryValue);

    setQuery(newQueryValue);
    setSearchBarValues(newSearchBarValue);

    setFilterMethodsPopoverActive(false);
    currentInputValue.length == 0 && setFilterMethodsPopoverActive(true);
  }

  return (
    <>
      <div className="w-full overflow-hidden rounded-lg bg-zinc-800 text-white placeholder:text-zinc-400 transition-all [&:has(input:focus)]:outline-none [&:has(input:focus)]:ring-2 [&:has(input:focus)]:ring-blue-800 [&:has(input:focus)]:ring-offset-2 [&:has(input:focus)]:ring-offset-zinc-900 flex items-center">
        {queryList.map((query, index) => (
          <Fragment key={`${query.description}_${index}`}>
            {query.operator && (
              <span className="ml-4 bg-zinc-900 p-1 rounded-sm text-zinc-400 [&+input]:pl-1">
                {query.operator}:
              </span>
            )}
          </Fragment>
        ))}
        <input
          className={clsx(`w-full h-full outline-none bg-transparent p-4`, {
            'pr-0': queryList.length > 1,
          })}
          onFocus={() => setFilterMethodsPopoverActive(true)}
          onBlur={() => setFilterMethodsPopoverActive(false)}
          onChange={(event) => {
            handleChangeSearchInput(event, 0);
          }}
          value={searchBarValues[0]}
          ref={inputRef}
        />

        {/* <span className="bg-zinc-900 p-1 rounded-sm text-zinc-400 mx-1">;</span>
        <input
          className={clsx(`w-full h-full outline-none bg-transparent p-4`, {
            'pr-0': query.length > 1,
          })}
          onFocus={() => setFilterMethodsPopoverActive(true)}
          onBlur={() => setFilterMethodsPopoverActive(false)}
          onChange={(event) => {
            handleChangeSearchInput(event);
          }}
          ref={inputRef}
        /> */}
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
                      inputRef.current!.value = method.operator;
                      if (
                        method.operator.includes(':') ||
                        method.operator.length == 0
                      ) {
                        inputRef.current!.focus();
                        setFilterMethodsPopoverActive(false);
                      }
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
    </>
  );
}
