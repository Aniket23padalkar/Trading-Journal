import z from "zod";

export const executionsSchema = z.object({
  execution_id: z.uuid().optional(),
  order_type: z.enum(["buy", "sell"]),
  price: z.coerce.number().positive(),
  quantity: z.coerce.number().int().min(1),
  executed_at: z.coerce.date(),
});

export type ExecutionsData = z.infer<typeof executionsSchema>;

const baseTradeSchema = z.object({
  symbol: z.string().toLowerCase().trim().min(1),
  market_type: z.enum(["equity", "options", "futures"]),
  order_status: z.enum(["open", "closed"]),
  direction: z.enum(["long", "short"]),
  position: z.enum([
    "intraday",
    "btst",
    "stbt",
    "swing",
    "positional",
    "longterm",
  ]),
  risk: z.coerce.number().positive(),
  trade_rating: z.enum(["worst", "poor", "average", "good", "best"]).optional(),
  entry_time: z.coerce.date(),
  exit_time: z.coerce.date().optional().nullable(),
  executions: z.array(executionsSchema).min(1),
  description: z.string().trim().optional(),
});

export const createTradeSchema = baseTradeSchema
  .refine(
    (data) => {
      if (data.exit_time && data.exit_time < data.entry_time) {
        return false;
      }
      return true;
    },
    {
      message: "Exit time must be after entry time",
      path: ["exit_time"],
    },
  )
  .refine(
    (data) => {
      if (data.order_status === "open") {
        return !data.exit_time;
      }
      return true;
    },
    {
      message: "Open trade should not have exit time",
      path: ["exit_time"],
    },
  )
  .refine(
    (data) => {
      if (data.order_status === "closed" && data.exit_time) {
        return data.exit_time ? true : false;
      }
      return true;
    },
    {
      message: "Closed trades must have exit time!",
      path: ["exit_time"],
    },
  );

export type CreateTradeData = z.infer<typeof createTradeSchema>;

export const updateTradeSchema = baseTradeSchema
  .partial()
  .superRefine((data, ctx) => {
    if (data.exit_time && data.entry_time) {
      if (data.exit_time < data.entry_time) {
        ctx.addIssue({
          path: ["exit_time"],
          message: "Exit time must be after entry_time",
          code: "custom",
        });
      }
    }

    if (data.order_status === "open" && data.exit_time) {
      ctx.addIssue({
        path: ["exit_time"],
        message: "Open trade should not have exit time",
        code: "custom",
      });
    }

    if (data.executions) {
      const types = new Set(data.executions.map((e) => e.order_type));

      if (data.order_status === "open" && types.size !== 1) {
        ctx.addIssue({
          path: ["executions"],
          message: "Open trade should have single execution type",
          code: "custom",
        });
      }
    }
  });

export type UpdateTradeData = z.infer<typeof updateTradeSchema>;

export const tradeParamsSchema = z.object({
  trade_id: z.uuid(),
});

export type TradeParamsTradeId = z.infer<typeof tradeParamsSchema>;

const yearSchema = z.coerce
  .number()
  .positive()
  .refine((year) => Number.isInteger(year), {
    message: "Year must be a valid number",
  })
  .refine((year) => year >= 1900 && year <= new Date().getFullYear(), {
    message: "Year must be between 1900 and current year",
  });

const monthMap: Record<string, number> = {
  jan: 1,
  feb: 2,
  mar: 3,
  apr: 4,
  may: 5,
  jun: 6,
  jul: 7,
  aug: 8,
  sep: 9,
  oct: 10,
  nov: 11,
  dec: 12,
};

const monthSchema = z
  .string()
  .transform((val) => val.trim().toLowerCase())
  .refine((val) => val in monthMap, {
    message: "Invalid month",
  })
  .transform((val) => monthMap[val]);

export const getTradeQuerySchema = z.object({
  limit: z
    .string()
    .transform(Number)
    .refine((val) => val > 0 && val <= 100, {
      message: "Limit must be between 1 and 100",
    })
    .optional(),
  page: z
    .string()
    .transform(Number)
    .refine((val) => val > 0, { message: "Page must be >= 1" })
    .optional(),
  direction: z.enum(["long", "short"]).optional(),
  order_status: z.enum(["open", "closed"]).optional(),
  market_type: z.enum(["equity", "options", "futures"]).optional(),
  position: z
    .enum(["intraday", "btst", "stbt", "swing", "positional", "longterm"])
    .optional(),
  fromDate: z
    .string()
    .transform((val) => new Date(val))
    .optional(),
  toDate: z
    .string()
    .transform((val) => new Date(val))
    .optional(),
  year: yearSchema.optional(),
  month: monthSchema.optional(),
  pnlSort: z.enum(["asc", "desc"]).optional(),
  dateTimeSort: z.enum(["asc", "desc"]).optional(),
});

export type GetTradeQueryData = z.infer<typeof getTradeQuerySchema>;
