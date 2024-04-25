const Customer = require("../models/customer");
const Loan = require("../models/loan");

const createCustomer = async (customerData) => {
  try {
    const { first_name, last_name, age, monthly_income, phoneno } =
      customerData;
    const approved_limit = Math.round((36 * monthly_income) / 100000) * 100000; // Rounded to nearest lakh

    const customer = await Customer.create({
      first_name,
      last_name,
      age,
      monthly_income,
      approved_limit,
      phoneno,
    });

    return customer;
  } catch (error) {
    throw new Error("Failed to create customer");
  }
};

const viewStatement = async (customer_id, loan_id) => {
  try {
    // Find the loan details
    const loan = await Loan.findByPk(loan_id);
    if (!loan || loan.customer_id !== Number(customer_id)) {
      return { error: "Loan not found or not associated with the customer" };
    }

    // Calculate the amount repaid by the applicant towards the loan
    const amountPaid = loan.loan_amount - loan.principal;

    // Calculate the number of EMIs left
    const emisLeft = loan.tenure - loan.emis_paid_on_time;

    return {
      customer_id: loan.customer_id,
      loan_id: loan.id,
      principal: loan.loan_amount,
      interest_rate: loan.interest_rate,
      amount_paid: amountPaid,
      monthly_installment: loan.monthly_installment,
      repayments_left: emisLeft,
    };
  } catch (error) {
    throw error;
  }
};
module.exports = { createCustomer, viewStatement };
