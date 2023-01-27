export type PossibleOperators =
  | 'name'
  | 'date'
  | 'progress'
  | 'incomplete'
  | 'complete';

export type Query = {
  operator?: PossibleOperators;
  description: string;
};

interface ISearch {
  searchQuery: Query[];
  searchIsError: boolean;
  searchMessage: string;
}

export interface ISearchContext extends ISearch {
  setSearchQuery(query: Query[]): void;
  setSearchMessage(value: string): void;
  setSearchIsError(value: boolean): void;
}

export interface ISearchProvider {
  children: React.ReactNode;
}
