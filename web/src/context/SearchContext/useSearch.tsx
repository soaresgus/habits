import { useContext } from 'react';
import { SearchContext } from '.';

export function useSearch() {
  const context = useContext(SearchContext);

  return context;
}
