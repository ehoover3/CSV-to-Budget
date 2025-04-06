import React, { useState, useEffect } from "react";
import { ResponsiveContainer } from "recharts";
import { formatCurrency } from "./helpers/formatCurrency";
import FileUpload from "./components/FileUpload.jsx";

const SpendingTracker = () => {
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [totalSpent, setTotalSpent] = useState(0);
  const [totalIncome, setTotalIncome] = useState(0);

  useEffect(() => {
    // Initialize variables for total spent and total income
    let totalSpentAmount = 0;
    let totalIncomeAmount = 0;
    let categoriesData = [];

    // Loop through transactions to calculate totals and categorize them
    transactions
      .filter((transaction) => transaction.isIncluded)
      .forEach((transaction) => {
        if (transaction.type === "Expense") {
          totalSpentAmount += transaction.amount;
        } else if (transaction.type === "Income") {
          totalIncomeAmount += transaction.amount;
        }

        // Update categories data
        const existingCategory = categoriesData.find((category) => category.name === transaction.category);
        if (existingCategory) {
          existingCategory.value += transaction.amount;
        } else {
          categoriesData.push({
            name: transaction.category,
            value: transaction.amount,
          });
        }
      });
    categoriesData.sort((a, b) => a.value - b.value);

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
            total: transaction.amount,
          });
        }
      });
    vendorsData.sort((a, b) => a.description.localeCompare(b.description));

    console.log("vendorsData START");
    console.log(vendorsData);
    console.log("vendorData end");

    // Update the state with the calculated values
    setTotalIncome(totalIncomeAmount);
    setTotalSpent(totalSpentAmount);
    setCategories(categoriesData);
    setVendors(vendorsData);
  }, [transactions]);

  return (
    <div className='max-w-6xl mx-auto p-6'>
      <div className='text-center mb-8'>
        <h1 className='text-3xl font-bold mb-4'>Spending Tracker</h1>
        <FileUpload setTransactions={setTransactions} />
        {transactions.length > 0 && (
          <div className='mb-6'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-6'>
              <div className='bg-white p-6 rounded-lg shadow'>
                <h2 className='text-xl font-semibold mb-2'>Total Income</h2>
                <p className='text-3xl text-green-600'>{formatCurrency(totalIncome)}</p>
              </div>
              <div className='bg-white p-6 rounded-lg shadow'>
                <h2 className='text-xl font-semibold mb-2'>Total Spending</h2>
                <p className='text-3xl text-red-600'>{formatCurrency(totalSpent)}</p>
              </div>
            </div>

            <div className='bg-white p-6 rounded-lg shadow mb-6'>
              <ResponsiveContainer width='100%' height='auto'>
                <div className='bg-white p-6 rounded-lg shadow'>
                  <h2 className='text-xl font-semibold mb-4'>Category Summaries</h2>
                  <div className='space-y-4'>
                    {categories.map((category, index) => (
                      <div key={index} className='flex justify-between'>
                        <span>{category.name}</span>
                        <span>{formatCurrency(category.value)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </ResponsiveContainer>
            </div>

            {/* Vendor Summaries */}
            <div className='bg-white p-6 rounded-lg shadow mb-6'>
              <h2 className='text-xl font-semibold mb-4'>Description Totals</h2>
              <div className='overflow-x-auto'>
                <table className='min-w-full bg-white'>
                  <thead>
                    <tr>
                      <th className='py-2 px-4 bg-gray-100 text-left'>Description</th>
                      <th className='py-2 px-4 bg-gray-100 text-left'>Category</th>
                      <th className='py-2 px-4 bg-gray-100 text-right'>Total Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {vendors.map((vendor, index) => (
                      <tr key={index} className='border-b hover:bg-gray-50'>
                        <td className='py-2 px-4 text-left'>{vendor.description}</td>
                        <td className='py-2 px-4 text-left'>{vendor.category}</td>
                        <td className='py-2 px-4 text-right'>{formatCurrency(vendor.total)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className='bg-white p-6 rounded-lg shadow'>
              <h2 className='text-xl font-semibold mb-4'>Transactions</h2>
              <div className='overflow-x-auto'>
                <table className='min-w-full bg-white'>
                  <thead>
                    <tr>
                      <th className='py-2 px-4 bg-gray-100 text-center'>isIncluded</th> {/* New column for the checkbox */}
                      <th className='py-2 px-4 bg-gray-100 text-left'>Date</th>
                      <th className='py-2 px-4 bg-gray-100 text-left'>Description</th>
                      <th className='py-2 px-4 bg-gray-100 text-left'>Category</th>
                      <th className='py-2 px-4 bg-gray-100 text-right'>Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map((transaction, index) => (
                      <tr key={index} className='border-b hover:bg-gray-50'>
                        <td className='py-2 px-4 text-center'>
                          <input
                            type='checkbox'
                            checked={transaction.isIncluded}
                            onChange={() => {
                              const updatedTransactions = [...transactions];
                              updatedTransactions[index].isIncluded = !updatedTransactions[index].isIncluded;
                              setTransactions(updatedTransactions);
                            }}
                          />
                        </td>
                        <td className='py-2 px-4 text-left'>{transaction.date}</td>
                        <td className='py-2 px-4 text-left'>{transaction.description}</td>
                        <td className='py-2 px-4 text-left'>{transaction.category}</td>
                        <td className={`py-2 px-4 text-right ${transaction.type === "Expense" ? "text-red-600" : "text-green-600"}`}>{formatCurrency(transaction.amount)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SpendingTracker;
