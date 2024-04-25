const express = require("express");
const router = express.Router();
const {
  registerCustomer,
  viewStatementHandler,
} = require("../controllers/customerController");

router.post("/register", registerCustomer);
router.get("/view-statement/:customer_id/:loan_id", viewStatementHandler);

module.exports = router;
