interface ISearch {
  filteredHabits: Date[];
}

export interface ISearchContext extends ISearch {
  setFilteredHabits(filteredHabits: Date[]): void;
}

export interface ISearchProvider {
  children: React.ReactNode;
}
