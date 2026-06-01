import express from "express";

import {
  reviewCode,
} from "../controllers/aiController";

const router =
  express.Router();

router.post(
  "/review",
  reviewCode
);

export default router;