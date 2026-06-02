import { Request, Response }
from "express";

import Analytics
from "../models/Analytics";

export const getAnalytics =
async (
  req: Request,
  res: Response
) => {

  try {

    const totalSolved =
      await Analytics.countDocuments({
        type: "code-review",
      });

    const mockInterviews =
      await Analytics.countDocuments({
        type: "interview",
      });

    const avgScoreData =
      await Analytics.aggregate([
        {
          $group: {
            _id: null,
            avgScore: {
              $avg: "$score",
            },
          },
        },
      ]);

    const averageScore =
      avgScoreData[0]?.avgScore || 0;

    res.json({

      totalSolved,

      mockInterviews,

      averageScore:
        Math.round(
          averageScore
        ),

    });

  } catch (error: any) {

    res.status(500).json({
      message:
        error.message,
    });

  }

};