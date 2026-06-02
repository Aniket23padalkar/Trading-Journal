import z from "zod";

export const createTradeSchema = z
  .object({
    symbol: z.string().toLowerCase().trim(),
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
  );

export type createTradeData = z.infer<typeof createTradeSchema>;
