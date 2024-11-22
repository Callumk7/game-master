import type { BasicEntity } from "@repo/api";
import { type ReactNode, createContext, useContext } from "react";
import { useEntitySearch } from "~/hooks/search";
import { JollySearchField } from "../ui/searchfield";
import { Toolbar } from "../ui/toolbar";

interface TableAndControlsProps<T extends BasicEntity> {
  data: T[];
  addEntityComponent?: ReactNode;
  children: ReactNode;
}

/**
 * TableAndControls is a component that uses context for sub
 * components to access the data after it has been searched,
 * and so the whole set in this module is required.
 */
export function TableAndControls<T extends BasicEntity>({
  data,
  addEntityComponent,
  children,
}: TableAndControlsProps<T>) {
  const search = useEntitySearch(data, {
    threshold: 0.3,
    keys: ["name", "type"],
  });
  const contextValue = {
    searchResults: search.result,
    searchTerm: search.searchTerm,
    setSearchTerm: search.setSearchTerm,
  };
  return (
    <SearchContext.Provider value={contextValue}>
      <TableControlBar
        searchTerm={search.searchTerm}
        setSearchTerm={search.setSearchTerm}
      >
        {addEntityComponent}
      </TableControlBar>
      {children}
    </SearchContext.Provider>
  );
}

interface SearchContextValue<T extends BasicEntity> {
  searchResults: T[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}
const SearchContext = createContext<SearchContextValue<BasicEntity> | undefined>(
  undefined,
);

export const useSearch = <T extends BasicEntity>() => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error("useSearch must be used within a SearchProvider");
  }

  return context as SearchContextValue<T>;
};

// ----------------------------------------------

interface TableControlBarProps {
  children?: ReactNode;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}
/**
 * Controls that provide a unified feel for the layout of table Controls
 */
export function TableControlBar({
  children,
  searchTerm,
  setSearchTerm,
}: TableControlBarProps) {
  return (
    <Toolbar>
      <div className="flex items-center gap-1">
        {children}
        <JollySearchField
          value={searchTerm}
          onInput={(e) => setSearchTerm(e.currentTarget.value)}
        />
      </div>
    </Toolbar>
  );
}
