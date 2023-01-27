import { createContext, useState } from 'react';
import {
  ISearchContext,
  ISearchProvider,
  PossibleOperators,
  Query,
} from './types';

export const SearchContext = createContext({} as ISearchContext);

export function SearchProvider({ children }: ISearchProvider) {
  const [query, setQuery] = useState<Query[]>([{ description: '' }]);

  return (
    <SearchContext.Provider value={{ query, setQuery }}>
      {children}
    </SearchContext.Provider>
  );
}
