const {
  createCustomer,
  viewStatement,
} = require("../services/customerService");

const registerCustomer = async (req, res) => {
  try {
    const customer = await createCustomer(req.body);
    console.log(customer);
    res.status(201).json(customer);
  } catch (err) {
    console.error("Error creating customer:", err); // Log the error
    res.status(500).json({ error: "Failed to create customer" }); // Return error response
  }
};

const viewStatementHandler = async (req, res) => {
  try {
    const { customer_id, loan_id } = req.params;
    const statement = await viewStatement(customer_id, loan_id);
    res.status(200).json(statement);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = { registerCustomer, viewStatementHandler };
