const { createCustomer } = require("../services/customerService");

const registerCustomer = async (req, res) => {
  try {
    const customer = await createCustomer(req.body);
    res.status(201).json(customer);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = { registerCustomer };
