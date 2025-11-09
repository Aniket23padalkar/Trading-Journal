import { useMemo } from "react";

export default function usePagination(
  filteredTrades,
  tradesPerPage,
  currentPage
) {
  const totalPages = Math.ceil(filteredTrades.length / tradesPerPage);

  const indexOfLastTrade = currentPage * tradesPerPage;
  const indexOfFirstTrade = indexOfLastTrade - tradesPerPage;

  const currentTrades = useMemo(() => {
    return filteredTrades.slice(indexOfFirstTrade, indexOfLastTrade);
  }, [filteredTrades, indexOfFirstTrade, indexOfLastTrade]);

  return { totalPages, currentTrades, indexOfFirstTrade };
}
