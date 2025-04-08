import React, { useState, useEffect, useRef } from "react";
import FileUpload from "./components/FileUpload.jsx";
import Totals from "./components/Totals.jsx";
import TransactionsTable from "./components/Transactions.jsx";
import CategoryTotals from "./components/Categories.jsx";
import VendorTotals from "./components/Vendors.jsx";

const SpendingTracker = () => {
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalSpent, setTotalSpent] = useState(0);
  const [totalSavings, setTotalSavings] = useState(0);
  const firstRun = useRef(true);

  function getTotalIncomeAmount(transactions) {
    return transactions.filter((transaction) => transaction.type === "Income").reduce((sum, transaction) => sum + transaction.amount, 0);
  }

  function getTotalSpentAmount(transactions) {
    return transactions.filter((transaction) => transaction.type === "Expense").reduce((sum, transaction) => sum + transaction.amount, 0);
  }

  function getTotalSavings(transactions) {
    return transactions.reduce((sum, transaction) => {
      const savings = transaction.savings ?? 0;
      return sum + savings;
    }, 0);
  }

  function sortCategories(categoriesData) {
    categoriesData.forEach((category) => {
      category.subcategoriesArray = Object.values(category.subcategories).sort((a, b) => b.value - a.value);
    });
    categoriesData.sort((a, b) => b.value - a.value);
    const incomeIndex = categoriesData.findIndex((item) => item.name === "Income");
    if (incomeIndex > 0) {
      const [incomeItem] = categoriesData.splice(incomeIndex, 1);
      categoriesData.unshift(incomeItem);
    }
    return categoriesData;
  }

  function getCategories(transactions) {
    const categoriesMap = {};
    transactions.forEach((transaction) => {
      const category = transaction.category;
      const subcategory = transaction.subcategory || "General";
      const savings = transaction.savings ?? 0;
      if (!categoriesMap[category]) {
        categoriesMap[category] = {
          name: category,
          value: 0,
          savings: 0,
          subcategories: {},
        };
      }
      categoriesMap[category].value += transaction.amount;
      categoriesMap[category].savings += savings;
      if (!categoriesMap[category].subcategories[subcategory]) {
        categoriesMap[category].subcategories[subcategory] = {
          name: subcategory,
          value: 0,
          savings: 0,
        };
      }
      categoriesMap[category].subcategories[subcategory].value += transaction.amount;
      categoriesMap[category].subcategories[subcategory].savings += savings;
    });
    return Object.values(categoriesMap);
  }

  function getVendors(transactions) {
    const vendorsData = [];
    transactions.forEach((transaction) => {
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
    setTotalSavings(getTotalSavings(transactions));

    let newCategories = getCategories(transactions);
    newCategories = sortCategories(newCategories);
    setCategories(newCategories || []);

    setVendors(getVendors(transactions));
  }, [transactions]);

  return (
    <div className='max-w-6xl mx-auto p-6'>
      <div className='text-center mb-8'>
        <h1 className='text-3xl font-bold mb-4'>Spending Tracker</h1>
        <FileUpload setTransactions={setTransactions} />
        {transactions.length > 0 && (
          <div className='mb-6'>
            <Totals totalIncome={totalIncome} totalSpent={totalSpent} totalSavings={totalSavings} />
            <CategoryTotals categories={categories} transactions={transactions} setTransactions={setTransactions} />
            <VendorTotals vendors={vendors} setTransactions={setTransactions} />
            <TransactionsTable transactions={transactions} setTransactions={setTransactions} />
          </div>
        )}
      </div>
    </div>
  );
};

export default SpendingTracker;
