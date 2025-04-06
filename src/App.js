import React, { useState, useEffect } from "react";
import FileUpload from "./components/FileUpload.jsx";
import Totals from "./components/Totals.jsx";
import CategoryTotals from "./components/CategoryTotals.jsx";
import VendorTotals from "./components/VendorTotals.jsx";
import TransactionsTable from "./components/Transactions.jsx";

const SpendingTracker = () => {
  const [transactions, setTransactions] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [totalSpent, setTotalSpent] = useState(0);
  const [totalIncome, setTotalIncome] = useState(0);

  useEffect(() => {
    // Initialize variables for total spent and total income
    let totalSpentAmount = 0;
    let totalIncomeAmount = 0;
    let categoriesMap = {};

    // Loop through transactions to calculate totals and categorize them
    transactions
      .filter((transaction) => transaction.isIncluded)
      .forEach((transaction) => {
        if (transaction.type === "Expense") {
          totalSpentAmount += transaction.amount;
        } else if (transaction.type === "Income") {
          totalIncomeAmount += transaction.amount;
        }

        // Get category and subcategory
        const category = transaction.category;
        const subcategory = transaction.subcategory || "General";

        // Initialize category in the map if it doesn't exist
        if (!categoriesMap[category]) {
          categoriesMap[category] = {
            name: category,
            value: 0,
            subcategories: {},
          };
        }

        // Add to category total
        categoriesMap[category].value += transaction.amount;

        // Initialize subcategory if it doesn't exist
        if (!categoriesMap[category].subcategories[subcategory]) {
          categoriesMap[category].subcategories[subcategory] = {
            name: subcategory,
            value: 0,
          };
        }

        // Add to subcategory total
        categoriesMap[category].subcategories[subcategory].value += transaction.amount;
      });

    // Convert categoriesMap to array and sort
    const categoriesData = Object.values(categoriesMap);

    // Convert subcategories from objects to arrays and sort them
    categoriesData.forEach((category) => {
      category.subcategoriesArray = Object.values(category.subcategories);
      category.subcategoriesArray.sort((a, b) => a.value - b.value); // Sort by value in descending order
    });

    categoriesData.sort((a, b) => a.value - b.value); // Sort categories by value
    // Find and move "Income" category to index 0
    const incomeIndex = categoriesData.findIndex((item) => item.name === "Income");
    if (incomeIndex > 0) {
      const [incomeItem] = categoriesData.splice(incomeIndex, 1);
      categoriesData.unshift(incomeItem);
    }

    // Update vendors data
    let vendorsData = [];
    transactions
      .filter((transaction) => transaction.isIncluded)
      .forEach((transaction) => {
        // Check if the vendor (description) already exists in vendorsData
        const existingVendor = vendorsData.find((vendor) => vendor.description === transaction.description);

        if (existingVendor) {
          existingVendor.total += transaction.amount;
        } else {
          vendorsData.push({
            description: transaction.description,
            category: transaction.category,
            subcategory: transaction.subcategory || "General",
            total: transaction.amount,
          });
        }
      });
    vendorsData.sort((a, b) => a.total - b.total);

    // Update the state with the calculated values
    setTotalIncome(totalIncomeAmount);
    setTotalSpent(totalSpentAmount);
    setCategoryData(categoriesData);
    setVendors(vendorsData);
  }, [transactions]);

  return (
    <div className='max-w-6xl mx-auto p-6'>
      <div className='text-center mb-8'>
        <h1 className='text-3xl font-bold mb-4'>Spending Tracker</h1>
        <FileUpload setTransactions={setTransactions} />
        {transactions.length > 0 && (
          <div className='mb-6'>
            <Totals totalIncome={totalIncome} totalSpent={totalSpent} />
            <CategoryTotals categoryData={categoryData} />
            <VendorTotals vendors={vendors} />
            <TransactionsTable transactions={transactions} setTransactions={setTransactions} />
          </div>
        )}
      </div>
    </div>
  );
};

export default SpendingTracker;
