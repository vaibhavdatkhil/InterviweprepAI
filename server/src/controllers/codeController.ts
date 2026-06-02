import axios from "axios";

import {
  Request,
  Response,
} from "express";

export const runCode =
async (
  req: Request,
  res: Response
) => {

  try {

    const {
      language,
      code,
    } = req.body;

    console.log(
      "LANGUAGE:",
      language
    );

    console.log(
      "CODE:",
      code
    );

    const response =
      await axios.post(
        "https://emkc.org/api/v2/piston/execute",
        {

          language,

          version: "*",

          files: [
            {
              content: code,
            },
          ],

        }
      );

    console.log(
      response.data
    );

    res.json(
      response.data
    );

  } catch (error: any) {

    console.log(
      "RUN CODE ERROR:"
    );

    console.log(error);

    res.status(500).json({

      success: false,

      error:
        error.message,

    });

  }

};