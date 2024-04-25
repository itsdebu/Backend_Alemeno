const express = require("express");
const app = express();
require("dotenv").config({ path: "../.env" });

const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api/customers", customerRoutes);
app.use("/api/loans", loanRoutes);

app.listen(PORT, () => {
  console.log(`Server Running on Port:${PORT}`);
});
