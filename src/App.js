import React, { useState, useEffect } from "react";
import FileUpload from "./components/FileUpload.jsx";
import Totals from "./components/Totals.jsx";
import CategoryTotals from "./components/CategoryTotals.jsx";
import VendorTotals from "./components/VendorTotals.jsx";

const SpendingTracker = () => {
  const [transactions, setTransactions] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [totalSpent, setTotalSpent] = useState(0);
  const [totalIncome, setTotalIncome] = useState(0);

  function getTotalIncomeAmount(transactions) {
    return transactions.filter((transaction) => transaction.isIncluded && transaction.type === "Income").reduce((sum, transaction) => sum + transaction.amount, 0);
  }

  function getTotalSpentAmount(transactions) {
    return transactions.filter((transaction) => transaction.isIncluded && transaction.type === "Expense").reduce((sum, transaction) => sum + transaction.amount, 0);
  }

  function getCategories(transactions) {
    const categoriesMap = {};
    transactions
      .filter((transaction) => transaction.isIncluded)
      .forEach((transaction) => {
        const category = transaction.category;
        const subcategory = transaction.subcategory || "General";
        if (!categoriesMap[category]) {
          categoriesMap[category] = {
            name: category,
            value: 0,
            subcategories: {},
          };
        }
        categoriesMap[category].value += transaction.amount;
        if (!categoriesMap[category].subcategories[subcategory]) {
          categoriesMap[category].subcategories[subcategory] = {
            name: subcategory,
            value: 0,
          };
        }
        categoriesMap[category].subcategories[subcategory].value += transaction.amount;
      });
    const categoriesData = Object.values(categoriesMap);
    categoriesData.forEach((category) => {
      category.subcategoriesArray = Object.values(category.subcategories).sort((a, b) => a.value - b.value);
    });
    categoriesData.sort((a, b) => a.value - b.value);
    const incomeIndex = categoriesData.findIndex((item) => item.name === "Income");
    if (incomeIndex > 0) {
      const [incomeItem] = categoriesData.splice(incomeIndex, 1);
      categoriesData.unshift(incomeItem);
    }
    return categoriesData;
  }

  function getVendors(transactions) {
    const vendorsData = [];
    transactions
      .filter((transaction) => transaction.isIncluded)
      .forEach((transaction) => {
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
    return vendorsData.sort((a, b) => a.total - b.total);
  }

  useEffect(() => {
    setTotalIncome(getTotalIncomeAmount(transactions));
    setTotalSpent(getTotalSpentAmount(transactions));
    setCategoryData(getCategories(transactions));
    setVendors(getVendors(transactions));
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
            {/* <TransactionsTable transactions={transactions} setTransactions={setTransactions} /> */}
          </div>
        )}
      </div>
    </div>
  );
};

export default SpendingTracker;
