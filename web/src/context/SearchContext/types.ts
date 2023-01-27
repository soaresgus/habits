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
  query: Query[];
}

export interface ISearchContext extends ISearch {
  setQuery(query: Query[]): void;
}

export interface ISearchProvider {
  children: React.ReactNode;
}
