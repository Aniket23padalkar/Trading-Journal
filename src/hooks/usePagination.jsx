export default function usePagination(
  filteredTrades,
  tradesPerPage,
  currentPage
) {
  const totalPages = Math.ceil(filteredTrades.length / tradesPerPage);

  const indexOfLastTrade = currentPage * tradesPerPage;
  const indexOfFirstTrade = indexOfLastTrade - tradesPerPage;

  const currentTrades = filteredTrades.slice(
    indexOfFirstTrade,
    indexOfLastTrade
  );

  return { totalPages, currentTrades };
}
