const express = require("express");
const app = express();
const customerRoutes = require("./routes/customerRoutes");
const loanRoutes = require("./routes/loanRoutes");
require("dotenv").config();

const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api/customers", customerRoutes);
app.use("/api/loans", loanRoutes);

app.listen(PORT, () => {
  console.log(`Server Running on Port:${PORT}`);
});
