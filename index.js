const express = require("express");
const app = express();
require("dotenv").config();

const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api/customers", CustomerRoutes);
app.use("/api/loans", LoanRoutes);

app.listen(PORT, () => {
  console.log(`Server Running on Port:${PORT}`);
});
