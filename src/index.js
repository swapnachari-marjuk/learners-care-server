const express = require('express'); // Import express
const PORT = 3000; 
const app = require("./app");
const { connectDB } = require("./config/db");

// Vercel serverless এ export করাই যথেষ্ট
// কিন্তু প্রথম request এর আগে connect নিশ্চিত করতে হবে

connectDB(); // await ছাড়াই call করুন, cached connection কাজ করবে

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});

module.exports = app;
