import type { User } from "./auth.types.js";
import type { GetFilteredStatsData, GetOverallStatsData } from "./stats.types.js";
import type {
  FilterValues,
  FilterValuesUI,
  Pagination,
  TradesData,
} from "./trades.types.js";

export interface ContextProviderProps {
  children: React.ReactNode;
}

export interface AuthContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  authLoading: boolean;
}

export type Theme = "light" | "dark";

export interface ThemeContextType {
  theme: Theme;
  setTheme: React.Dispatch<React.SetStateAction<Theme>>;
}

export interface TradesContextType {
  trades: TradesData[];
  setTrades: React.Dispatch<React.SetStateAction<[] | TradesData[]>>;
  pagination: Pagination;
  setPagination: React.Dispatch<React.SetStateAction<Pagination>>;
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  filterValues: FilterValuesUI;
  setFilterValues: React.Dispatch<React.SetStateAction<FilterValuesUI>>;
  fetchLoading: boolean;
  fetchTrades: () => void;
  filteredStats: GetFilteredStatsData | null;
}

export interface StatsContextType {
  overallStats: GetOverallStatsData;
  overallStatsLoading : boolean;
}
