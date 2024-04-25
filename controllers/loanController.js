const {
  checkEligibility,
  processLoan,
  getLoanDetails,
} = require("../services/loanService");

const checkLoanEligibility = async (req, res) => {
  try {
    const loanDetails = await checkEligibility(req.body);
    res.status(200).json(loanDetails);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const createLoan = async (req, res) => {
  try {
    const loanDetails = await processLoan(req.body);
    res.status(200).json(loanDetails);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const viewLoan = async (req, res) => {
  try {
    const loanDetails = await getLoanDetails(req.params.loan_id);
    res.status(200).json(loanDetails);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const makePaymentHandler = async (req, res) => {
  try {
    const { customer_id, loan_id } = req.params;
    const { payment_amount } = req.body;
    const paymentDetails = await makePayment(
      customer_id,
      loan_id,
      payment_amount
    );
    res.status(200).json(paymentDetails);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  checkLoanEligibility,
  createLoan,
  viewLoan,
  makePaymentHandler,
};
