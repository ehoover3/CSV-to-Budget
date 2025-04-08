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

  function getTotalIncomeAmount(categories) {
    console.log(categories);
    return categories.filter((categories) => categories.category === "Income").reduce((sum, category) => sum + category.amount, 0);
  }

  function getTotalSpentAmount(categories) {
    return categories.filter((categories) => categories.category !== "Income").reduce((sum, category) => sum + category.amount, 0);
  }

  function getTotalSavings(categories) {
    return categories.reduce((sum, category) => {
      const savings = category.savings ?? 0;
      if (category.category === "Income") return sum;
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
    const categoriesList = Object.values(categoriesMap);
    categoriesList.forEach((category) => {
      category.subcategoriesArray = Object.values(category.subcategories);
    });
    return categoriesList;
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
    let newCategories = getCategories(transactions);
    if (firstRun.current === true) {
      newCategories = sortCategories(newCategories);
      firstRun.current = false;
    }
    setCategories(newCategories || []);
    setVendors(getVendors(transactions));
    console.log("CATEGORIES");
    console.log(categories);
  }, [transactions]);

  useEffect(() => {
    setTotalIncome(getTotalIncomeAmount(transactions));
    setTotalSpent(getTotalSpentAmount(transactions));
    setTotalSavings(getTotalSavings(transactions));
  }, [categories]);

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
