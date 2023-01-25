import { createContext, useState } from 'react';
import { ISearchContext, ISearchProvider, Query } from './types';

export const SearchContext = createContext({} as ISearchContext);

export function SearchProvider({ children }: ISearchProvider) {
  const [query, setQuery] = useState<Query[]>([]);

  return (
    <SearchContext.Provider value={{ query, setQuery }}>
      {children}
    </SearchContext.Provider>
  );
}
