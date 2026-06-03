import z from "zod";

const executionsSchema = z.object({
  order_type: z.enum(["buy", "sell"]),
  price: z.coerce.number().positive(),
  quantity: z.coerce.number().int().min(1),
  executed_at: z.coerce.date(),
});

export const createTradeSchema = z
  .object({
    symbol: z.string().toLowerCase().trim().min(1),
    market_type: z.enum(["equity", "options", "futures"]),
    order_status: z.enum(["open", "closed"]),
    position: z.enum([
      "intraday",
      "btst",
      "stbt",
      "swing",
      "positional",
      "longterm",
    ]),
    trade_rating: z
      .enum(["worst", "poor", "average", "good", "best"])
      .optional(),
    entry_time: z.coerce.date(),
    exit_time: z.coerce.date().optional(),
    executions: z.array(executionsSchema).min(1),
    description: z.string().trim(),
  })
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
      const types = new Set(data.executions.map((e) => e.order_type));

      if (data.order_status === "open") {
        return types.size === 1;
      }

      if (data.order_status === "closed") {
        return types.has("buy") && types.has("sell");
      }

      return true;
    },
    {
      message: "Invalid executions types for trade status",
      path: ["executions"],
    },
  );

export type CreateTradeData = z.infer<typeof createTradeSchema>;

const updateTradeSchema = createTradeSchema
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
