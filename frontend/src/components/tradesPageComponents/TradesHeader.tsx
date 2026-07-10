import React, { Suspense, useCallback, useMemo, useState } from "react";
const Filters = React.lazy(() => import("./Filters.js"));
import { ScaleLoader } from "react-spinners";
import { useEffect } from "react";
import { getYearAndMonth } from "../../api/tradesService.js";
import type {
  FilterValues,
  FormattedMonthsData,
  GetYearAndMonthResponse,
} from "../../types/trades.types.js";
import { useTradesContext } from "../../hooks/useTradesContext.js";
import { getErrorMessage } from "../../utils/error.handler.js";
import { getFormattedMonths } from "../../utils/formattedMonths.js";
import Icon from "../../ui/Icon.js";

interface TradesHeaderParams {
  setAddModal: React.Dispatch<React.SetStateAction<boolean>>;
}

function TradesHeader({ setAddModal }: TradesHeaderParams) {
  const { filterValues, setFilterValues } = useTradesContext();
  const [viewFilters, setViewFilters] = useState<boolean>(false);
  const [yearsMonths, setYearsMonths] =
    useState<GetYearAndMonthResponse | null>(null);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const { name, value } = e.target as {
        name: keyof FilterValues;
        value: string;
      };
      setFilterValues((prev) => {
        if (prev?.[name] === value) return prev;
        return { ...prev, [name]: value };
      });
    },
    [setFilterValues],
  );

  const handleClearFilters = useCallback(() => {
    setFilterValues({
      direction: "",
      order_status: "",
      market_type: "",
      position: "",
      fromDate: "",
      toDate: "",
      year: "",
      month: "",
      pnlSort: "",
      dateTimeSort: "",
    });
  }, [setFilterValues]);

  async function fetchYearMonth() {
    try {
      const res = await getYearAndMonth();

      setYearsMonths({ years: res.years, raw: res.raw });
    } catch (err: unknown) {
      const message = getErrorMessage(err);
      console.log(message);
    }
  }

  useEffect(() => {
    fetchYearMonth();
  }, []);

  const formattedMonths: FormattedMonthsData[] = useMemo(() => {
    if (!yearsMonths) return [];

    return getFormattedMonths({
      data: yearsMonths.raw,
      selectedYear: Number(filterValues.year),
    });
  }, [yearsMonths, filterValues.year]);

  const handleOpen = useCallback(() => {
    setAddModal(true);
  }, [setAddModal]);

  const handleViewFilter = useCallback(() => {
    setViewFilters((prev) => !prev);
  }, [setViewFilters]);

  return (
    <header className="flex w-full justify-between items-center p-2 lg:py-2 lg:px-6 relative rounded-xl shadow shadow-gray-400 bg-white dark:bg-gray-950 dark:shadow-none dark:text-white">
      <div className="flex items-center gap-2">
        <p className="drop-shadow-lg font-medium mr-2 text-l">
          Yearly/Monthly Trades :
        </p>
        <select
          name="year"
          className="filter-select"
          value={filterValues.year}
          onChange={handleChange}
        >
          <option value="">All Years</option>
          {yearsMonths?.years?.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
        {/* <p>Monthly Trades :</p> */}
        <select
          name="month"
          value={filterValues.month}
          className="filter-select"
          onChange={handleChange}
        >
          <option value="">All month</option>
          {formattedMonths.map((month) => (
            <option key={month.value} value={month.label}>
              {month.label}
            </option>
          ))}
        </select>
        <select
          name="order_status"
          value={filterValues.order_status}
          className="filter-select"
          onChange={handleChange}
        >
          <option value="">Status</option>
          <option value="open">Open</option>
          <option value="closed">Closed</option>
        </select>
      </div>
      {viewFilters && (
        <Suspense
          fallback={
            <div className="flex absolute h-full w-full justify-between items-center">
              <ScaleLoader color="##20dfbc" />
            </div>
          }
        >
          <Filters />
        </Suspense>
      )}
      <div className="flex items-center gap-2">
        <button
          onClick={handleClearFilters}
          className="py-0.5 px-1.5 lg:py-1 lg:px-3 rounded-md cursor-pointer hover:bg-red-300 text-sm bg-red-200 text-red-500 dark:bg-red-900 dark:text-red-200 dark:hover:bg-red-700"
        >
          Clear
        </button>
        <button
          className={
            viewFilters
              ? "flex items-center lg:px-4 py-0 gap-1 cursor-pointer rounded-md lg:bg-blue-100 lg:dark:bg-blue-500  text-blue-400 dark:text-blue-100 lg:border lg:border-blue-300 dark:border-none dark:py-0.5"
              : "flex items-center lg:px-4 py-0 gap-1 cursor-pointer rounded-md lg:bg-blue-100 lg:dark:bg-blue-900 text-blue-500 dark:text-blue-200 lg:border lg:border-blue-500 dark:border-none dark:py-0.5"
          }
          onClick={handleViewFilter}
        >
          <Icon size={19} name="FilterIcon" className="text-lg lg:text-sm" />{" "}
          <span className="hidden lg:block">Filters</span>
        </button>

        <button
          onClick={handleOpen}
          className="h-full py-0.5 px-2 lg:py-1 lg:px-5 font-bold cursor-pointer hover:scale-105 text-green-700 text-sm rounded-lg bg-green-200 border border-green-700 dark:bg-teal-500 dark:text-green-800 dark:border-none"
        >
          + Add
        </button>
      </div>
    </header>
  );
}

export default React.memo(TradesHeader);
