import {
  createTradeService,
  getMonthlyPnlService,
  getStatsService,
  getTradesService,
  getYearMonthService,
  tradeDeleteService,
  updateTradeService,
} from "../services/tradesService.js";

export const getTrades = async (req, res) => {
  try {
    const data = await getTradesService(req.query, req.user.user_id);
    res.status(200).json(data);
  } catch (err) {
    console.error(err);
    if (err.statusCode) {
      return res.status(err.statusCode).json({ message: err.message });
    }
    res.status(500).json({ message: "Server Error" });
  }
};

export const getYearMonth = async (req, res) => {
  try {
    const data = await getYearMonthService(req.user.user_id);

    res.status(200).json(data.rows[0]);
  } catch (err) {
    console.error(err);
    if (err.statusCode) {
      return res.status(err.statusCode).json({ message: err.message });
    }
    res.status(500).json({ message: "Server Error" });
  }
};

export const getStats = async (req, res) => {
  try {
    const data = await getStatsService(req.query, req.user.user_id);

    res.status(200).json(data);
  } catch (err) {
    console.error(err);
    if (err.statusCode) {
      return res.status(err.statusCode).json({ message: err.message });
    }
    res.status(500).json({ message: "Server Error" });
  }
};

export const getMonthlyPnl = async (req, res) => {
  try {
    const data = await getMonthlyPnlService(req.query, req.user.user_id);

    res.status(200).json(data);
  } catch (err) {
    console.error(err);
    if (err.statusCode) {
      return res.status(err.statusCode).json({ message: err.message });
    }
    res.status(500).json({ message: "Server Error" });
  }
};

export const createTrade = async (req, res) => {
  try {
    const data = await createTradeService(req.body, req.user.user_id);

    res.status(201).json(data);
  } catch (err) {
    console.error(err);
    if (err.statusCode) {
      return res.status(err.statusCode).json({ message: err.message });
    }
    res.status(500).json({ message: "Server Error" });
  }
};

export const updateTrade = async (req, res) => {
  try {
    const data = await updateTradeService({
      tradeId: req.params.id,
      body: req.body,
      userId: req.user.user_id,
    });

    res.status(200).json(data);
  } catch (err) {
    console.error(err);
    if (err.statusCode) {
      return res.status(err.statusCode).json({ message: err.message });
    }
    res.status(500).json({ message: "Server Error" });
  }
};

export const deleteTrade = async (req, res) => {
  try {
    const data = await tradeDeleteService({
      tradeId: req.params.id,
      userId: req.user.user_id,
    });

    res.status(200).json(data);
  } catch (err) {
    console.error(err);
    if (err.statusCode) {
      return res.status(err.statusCode).json({ message: err.message });
    }
    res.status(500).json({ message: "Server Error" });
  }
};
