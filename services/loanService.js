const Customer = require("../models/customer");
const Loan = require("../models/loan");

const checkEligibility = async ({
  customer_id,
  loan_amount,
  interest_rate,
  tenure,
}) => {
  try {
    // Step 1: Check if the customer exists in the loan data
    const customerLoans = await Loan.findAll({ where: { customer_id } });
    if (customerLoans.length === 0) {
      return {
        customer_id,
        approval: false,
        interest_rate,
        corrected_interest_rate: null,
        tenure,
        monthly_installment: null,
      };
    }

    // Step 2: Check if sum of current loans exceeds approved limit
    const customer = await Customer.findByPk(customer_id);
    const sumOfCurrentLoans = customerLoans.reduce((total, loan) => {
      if (!loan.end_date) {
        // Loan is ongoing
        return total + loan.monthly_repayment;
      }
      return total;
    }, 0);
    if (sumOfCurrentLoans > customer.approved_limit) {
      return {
        customer_id,
        approval: false,
        interest_rate,
        corrected_interest_rate: null,
        tenure,
        monthly_installment: null,
      };
    }

    // Step 3: Calculate credit score based on loan history
    let creditScore = 35; // Starting credit score
    const totalLoans = customerLoans.length;
    const emisPaidPercentage =
      (customerLoans.reduce(
        (total, loan) => total + loan.emis_paid_on_time,
        0
      ) /
        (totalLoans * tenure)) *
      100;
    const tenureCompletedPercentage =
      (customerLoans.reduce((total, loan) => {
        if (!loan.end_date) {
          // Loan is ongoing
          return total + (loan.emis_paid_on_time / tenure) * 100;
        }
        return total + 100;
      }, 0) /
        (totalLoans * 100)) *
      100;
    creditScore += emisPaidPercentage * 0.3 + tenureCompletedPercentage * 0.7;
    creditScore = Math.round(creditScore); // Round to nearest integer

    // Step 4: Calculate monthly installment
    const monthly_installment =
      loan_amount *
      (interest_rate /
        1200 /
        (1 - Math.pow(1 + interest_rate / 1200, -tenure)));

    // Step 5: Check eligibility and interest rate
    let approval = false;
    let corrected_interest_rate = null;
    if (creditScore > 50) {
      approval = true;
      if (creditScore <= 80) {
        interest_rate = 8;
      } else {
        interest_rate = 5;
      }
    }
    if (approval && sumOfCurrentLoans <= customer.monthly_salary * 0.5) {
      return {
        customer_id,
        approval,
        interest_rate,
        corrected_interest_rate,
        tenure,
        monthly_installment,
      };
    }

    return {
      customer_id,
      approval: false,
      interest_rate,
      corrected_interest_rate,
      tenure,
      monthly_installment: null,
    };
  } catch (error) {
    throw error;
  }
};

const processLoan = async ({
  customer_id,
  loan_amount,
  interest_rate,
  tenure,
}) => {
  try {
    // Check eligibility for the loan
    const eligibilityResult = await checkEligibility({
      customer_id,
      loan_amount,
      interest_rate,
      tenure,
    });
    if (!eligibilityResult.approval) {
      return {
        loan_id: null,
        customer_id,
        loan_approved: false,
        message: "Loan not approved due to eligibility criteria",
        monthly_installment: null,
      };
    }

    // Create the loan
    const loan = await Loan.create({
      customer_id,
      loan_amount,
      interest_rate: eligibilityResult.interest_rate,
      tenure,
    });

    return {
      loan_id: loan.id,
      customer_id,
      loan_approved: true,
      message: "Loan approved successfully",
      monthly_installment: eligibilityResult.monthly_installment,
    };
  } catch (error) {
    throw error;
  }
};

const getLoanDetails = async (loan_id) => {
  try {
    // Find the loan details by loan_id
    const loan = await Loan.findByPk(loan_id);
    if (!loan) {
      return { error: "Loan not found" };
    }

    // Find the customer details associated with the loan
    const customer = await Customer.findByPk(loan.customer_id);
    if (!customer) {
      return { error: "Customer not found" };
    }

    return {
      loan_id: loan.id,
      customer: {
        id: customer.id,
        first_name: customer.first_name,
        last_name: customer.last_name,
        phone_number: customer.phone_number,
        age: customer.age,
      },
      loan_amount: loan.loan_amount,
      interest_rate: loan.interest_rate,
      monthly_installment: loan.monthly_installment,
      tenure: loan.tenure,
    };
  } catch (error) {
    throw error;
  }
};

const makePayment = async (customer_id, loan_id, payment_amount) => {
  try {
    // Find the loan details
    const loan = await Loan.findByPk(loan_id);
    if (!loan) {
      return { error: "Loan not found" };
    }

    // Check if payment amount is less than due installment amount
    if (payment_amount !== loan.monthly_repayment) {
      return {
        error: "Payment amount should be equal to the due installment amount",
      };
    }

    // Update loan details (for demonstration purpose, assuming payment is made in full)
    await Loan.update(
      { emis_paid_on_time: loan.emis_paid_on_time + 1 },
      { where: { id: loan_id } }
    );

    return { success: true, message: "Payment successful" };
  } catch (error) {
    throw error;
  }
};

module.exports = {
  checkEligibility,
  processLoan,
  getLoanDetails,
  makePayment,
};
