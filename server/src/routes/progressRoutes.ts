import express from "express";

import {
  getProgress,
} from "../controllers/progressController";

const router =
  express.Router();

router.get(
  "/",
  getProgress
);

export default router;