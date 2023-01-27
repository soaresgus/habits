import { createContext, useState } from 'react';
import {
  ISearchContext,
  ISearchProvider,
  PossibleOperators,
  Query,
} from './types';

export const SearchContext = createContext({} as ISearchContext);

export function SearchProvider({ children }: ISearchProvider) {
  const [searchQuery, setSearchQuery] = useState<Query[]>([
    { description: '' },
  ]);

  const [searchIsError, setSearchIsError] = useState<boolean>(false);

  const [searchMessage, setSearchMessage] = useState<string>('');

  return (
    <SearchContext.Provider
      value={{
        searchQuery,
        setSearchQuery,
        searchIsError,
        setSearchIsError,
        searchMessage,
        setSearchMessage,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
}
