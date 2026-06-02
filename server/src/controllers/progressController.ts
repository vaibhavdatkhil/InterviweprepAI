import Progress
from "../models/Progress";

import {
  Request,
  Response,
} from "express";

export const getProgress =
async (
  req: Request,
  res: Response
) => {

  try {

    const progress =
      await Progress.findOne({
        userId: "demo-user",
      });

    res.json(progress);

  } catch (error: any) {

    res.status(500).json({
      message:
        error.message,
    });

  }

};