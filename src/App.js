import React, { useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import { formatCurrency } from "./helpers/formatCurrency";
import { parseCSV } from "./helpers/parseCsv.js";
import FileUpload from "./components/FileUpload.jsx";
import CustomTooltip from "./components/CustomTooltip.jsx";

const SpendingTracker = () => {
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [totalSpent, setTotalSpent] = useState(0);
  const [totalIncome, setTotalIncome] = useState(0);
  const [error, setError] = useState("");
  const [view, setView] = useState("pie");

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8", "#82ca9d", "#ffc658", "#8dd1e1", "#a4de6c", "#d0ed57"];

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setError("");

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target.result;
        parseCSV(text, setTransactions, setCategories, setTotalSpent, setTotalIncome, setError);
      } catch (err) {
        setError("Error parsing CSV file. Please check the format.");
        console.error(err);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className='max-w-6xl mx-auto p-6'>
      <div className='text-center mb-8'>
        <h1 className='text-3xl font-bold mb-4'>Spending Tracker</h1>
        <div className='flex justify-center mb-6'>
          <FileUpload handleFileUpload={handleFileUpload} />
        </div>

        {error && <div className='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4'>{error}</div>}

        {transactions.length > 0 && (
          <div className='mb-6'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-6'>
              <div className='bg-white p-6 rounded-lg shadow'>
                <h2 className='text-xl font-semibold mb-2'>Total Spending</h2>
                <p className='text-3xl text-red-600'>{formatCurrency(totalSpent)}</p>
              </div>
              <div className='bg-white p-6 rounded-lg shadow'>
                <h2 className='text-xl font-semibold mb-2'>Total Income</h2>
                <p className='text-3xl text-green-600'>{formatCurrency(totalIncome)}</p>
              </div>
            </div>

            <div className='bg-white p-6 rounded-lg shadow mb-6'>
              <div className='flex justify-end mb-4'>
                <button onClick={() => setView("pie")} className={`px-3 py-1 rounded ${view === "pie" ? "bg-blue-600 text-white" : "bg-gray-200"}`}>
                  Pie
                </button>
                <button onClick={() => setView("bar")} className={`ml-2 px-3 py-1 rounded ${view === "bar" ? "bg-blue-600 text-white" : "bg-gray-200"}`}>
                  Bar
                </button>
              </div>

              <div className='h-80'>
                <ResponsiveContainer width='100%' height='100%'>
                  {view === "pie" ? (
                    <PieChart>
                      <Pie data={categories} cx='50%' cy='50%' labelLine={false} outerRadius={100} fill='#8884d8' dataKey='value' label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}>
                        {categories.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                    </PieChart>
                  ) : (
                    <BarChart data={categories} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray='3 3' />
                      <XAxis dataKey='name' />
                      <YAxis />
                      <Tooltip formatter={(value) => formatCurrency(value)} />
                      <Bar dataKey='value' fill='#8884d8'>
                        {categories.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  )}
                </ResponsiveContainer>
              </div>
            </div>

            <div className='bg-white p-6 rounded-lg shadow'>
              <h2 className='text-xl font-semibold mb-4'>Transactions</h2>
              <div className='overflow-x-auto'>
                <table className='min-w-full bg-white'>
                  <thead>
                    <tr>
                      <th className='py-2 px-4 bg-gray-100 text-left'>Date</th>
                      <th className='py-2 px-4 bg-gray-100 text-left'>Description</th>
                      <th className='py-2 px-4 bg-gray-100 text-left'>Category</th>
                      <th className='py-2 px-4 bg-gray-100 text-right'>Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map((transaction, index) => (
                      <tr key={index} className='border-b hover:bg-gray-50'>
                        <td className='py-2 px-4'>{transaction.date}</td>
                        <td className='py-2 px-4'>{transaction.description}</td>
                        <td className='py-2 px-4'>{transaction.category}</td>
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
