import { createContext, useMemo, useState } from "react";

export const FilterContext = createContext(null);

export default function FilterContextProvider({ children }) {
  const [filterValue, setFilterValue] = useState({
    order: "",
    status: "",
    marketType: "",
    position: "",
    fromDate: "",
    toDate: "",
    year: "",
    month: "",
    pnlSort: "",
    dateTimeSort: "",
  });

  const memoizedFilter = useMemo(
    () => ({
      filterValue,
      setFilterValue,
    }),
    [filterValue]
  );

  return (
    <FilterContext.Provider value={memoizedFilter}>
      {children}
    </FilterContext.Provider>
  );
}
