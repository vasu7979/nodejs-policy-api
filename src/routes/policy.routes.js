import express from "express";

import {
  searchPolicies,
  aggregatePolicies,
} from "../controllers/policy.controller.js";

const router = express.Router();

router.get("/search", searchPolicies);
router.get("/aggregate", aggregatePolicies);

export default router;