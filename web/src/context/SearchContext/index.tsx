import { createContext, useState } from 'react';
import { ISearchContext, ISearchProvider } from './types';

export const SearchContext = createContext({} as ISearchContext);

export function SearchProvider({ children }: ISearchProvider) {
  const [filteredHabits, setFilteredHabits] = useState<Date[]>([]);

  return (
    <SearchContext.Provider value={{ filteredHabits, setFilteredHabits }}>
      {children}
    </SearchContext.Provider>
  );
}
