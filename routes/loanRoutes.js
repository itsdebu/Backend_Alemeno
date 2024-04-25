const express = require("express");
const router = express.Router();
const {
  checkLoanEligibility,
  createLoan,
  viewLoan,
  makePaymentHandler,
} = require("../controllers/loanController");

router.post("/check-eligibility", checkLoanEligibility);
router.post("/create-loan", createLoan);
router.get("/view-loan/:loan_id", viewLoan);
router.post("/make-payment/:customer_id/:loan_id", makePaymentHandler);

module.exports = router;
