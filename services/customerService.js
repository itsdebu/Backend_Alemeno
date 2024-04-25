const Customer = require("../models/customer");

const createCustomer = async (customerData) => {
  const { first_name, last_name, age, monthly_income, phoneno } = customerData;
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
};

module.exports = { createCustomer };
