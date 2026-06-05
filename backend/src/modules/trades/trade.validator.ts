import type { ExecutionsData } from "../../schemas/trade.schema.js";
import type {
  ValidateDirectionParams,
  ValidateExecutionTimeParams,
  ValidateOrderTypeParams,
  ValidateQuantitiesParams,
} from "../../types/trade.types.js";
import { AppError } from "../../utils/AppError.js";

export const validateDirection = ({
  executions,
  direction,
}: ValidateDirectionParams): void => {
  const firstExecution: ExecutionsData | undefined = executions
    .slice()
    .sort((a, b) => a.executed_at.getTime() - b.executed_at.getTime())[0];

  if (direction === "long" && firstExecution?.order_type === "sell") {
    throw new AppError("First execution must be buy for long trade", 400);
  }

  if (direction === "short" && firstExecution?.order_type === "buy") {
    throw new AppError("First execution must be sell for short trade", 400);
  }
};

export const validateExecutionTime = ({
  executions,
  entry_time,
}: ValidateExecutionTimeParams): void => {
  const invalidExecution: boolean = executions.some(
    (exe) => exe.executed_at < entry_time,
  );

  if (invalidExecution) {
    throw new AppError("Execution time cannot be before entry time", 400);
  }
};

export const validateOrderTypes = ({
  executions,
  order_status,
}: ValidateOrderTypeParams) => {
  const types: Set<"buy" | "sell"> = new Set(
    executions.map((e) => e.order_type),
  );

  if (order_status === "open" && types.size > 1) {
    throw new AppError("Open trade cannot have both buy and sell", 400);
  }

  if (order_status === "closed" && (!types.has("buy") || !types.has("sell"))) {
    throw new AppError("Closed trade must have both buy and sell", 400);
  }
};

export const validateQuantities = ({
  executions,
  direction,
}: ValidateQuantitiesParams) => {
  const totalBuy: number = executions
    .filter((exe) => exe.order_type === "buy")
    .reduce((sum, exe) => sum + exe.quantity, 0);

  const totalSell: number = executions
    .filter((exe) => exe.order_type === "sell")
    .reduce((sum, exe) => sum + exe.quantity, 0);

  if (direction === "long" && totalBuy < totalSell) {
    throw new AppError(
      "Direction is long so total sell quantity can not be more than total buy quantity",
      400,
    );
  }

  if (direction === "short" && totalBuy > totalSell) {
    throw new AppError(
      "Direction is short so total buy quantity can not be more than total sell quantity",
      400,
    );
  }
};
