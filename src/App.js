import React, { useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import { FileUp, Check, X } from "lucide-react";

const SpendingTracker = () => {
  const [csvData, setCsvData] = useState([]);
  const [categories, setCategories] = useState({});
  const [chartData, setChartData] = useState([]);
  const [filteredChartData, setFilteredChartData] = useState([]);
  const [totalSpent, setTotalSpent] = useState(0);
  const [totalIncome, setTotalIncome] = useState(0);
  const [error, setError] = useState("");
  const [view, setView] = useState("pie");
  const [categoryFilters, setCategoryFilters] = useState({});
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [filteredTotal, setFilteredTotal] = useState(0);

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8", "#82ca9d", "#ffc658", "#8dd1e1", "#a4de6c", "#d0ed57"];

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setError("");

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target.result;
        parseCSV(text);
      } catch (err) {
        setError("Error parsing CSV file. Please check the format.");
        console.error(err);
      }
    };
    reader.readAsText(file);
  };

  const parseCSV = (csvText) => {
    // Split by lines
    const lines = csvText.split("\n").filter((line) => line.trim() !== "");

    if (lines.length < 2) {
      setError("CSV file appears to be empty or invalid");
      return;
    }

    // Find header row (look for both "Transaction Category" and other relevant columns)
    const headerLine = lines[0];
    const headers = headerLine.split(",").map((h) => h.trim());

    // Find column indices
    const amountIndex = headers.findIndex((h) => h.includes("Amount"));
    const categoryIndex = headers.findIndex((h) => h.includes("Transaction Category"));
    const typeIndex = headers.findIndex((h) => h.includes("Transaction Type"));
    const dateIndex = headers.findIndex((h) => h.includes("Posting Date") || h.includes("Date"));
    const descriptionIndex = headers.findIndex((h) => h.includes("Description"));

    if (amountIndex === -1 || categoryIndex === -1) {
      setError("CSV file missing required columns (Amount and Transaction Category)");
      return;
    }

    // Process data rows
    const transactions = [];
    const categoryTotals = {};
    let spent = 0;
    let income = 0;

    for (let i = 1; i < lines.length; i++) {
      // Handle potential commas within quotes
      let currentLine = lines[i];
      const values = [];
      let insideQuotes = false;
      let currentValue = "";

      for (let j = 0; j < currentLine.length; j++) {
        const char = currentLine[j];

        if (char === '"' && (j === 0 || currentLine[j - 1] !== "\\")) {
          insideQuotes = !insideQuotes;
        } else if (char === "," && !insideQuotes) {
          values.push(currentValue.trim());
          currentValue = "";
        } else {
          currentValue += char;
        }
      }

      values.push(currentValue.trim());

      // Only process rows with enough data
      if (values.length > Math.max(amountIndex, categoryIndex, typeIndex)) {
        // Parse amount - remove any non-numeric except . and -
        let rawAmount = values[amountIndex].replace(/[^\d.-]/g, "");
        const amount = parseFloat(rawAmount);

        if (!isNaN(amount)) {
          const category = values[categoryIndex] || "Uncategorized";
          const type = values[typeIndex] || "";
          const isDebit = type.toLowerCase().includes("debit") || amount < 0;
          const description = descriptionIndex !== -1 ? values[descriptionIndex] : "";
          const date = dateIndex !== -1 ? values[dateIndex] : "";

          const absoluteAmount = Math.abs(amount);

          if (isDebit) {
            spent += absoluteAmount;
            // Only track spending categories
            if (!categoryTotals[category]) {
              categoryTotals[category] = 0;
            }
            categoryTotals[category] += absoluteAmount;
          } else {
            income += absoluteAmount;
          }

          transactions.push({
            date,
            description,
            amount,
            category,
            type: isDebit ? "Expense" : "Income",
          });
        }
      }
    }

    // Prepare chart data
    const chartDataArray = Object.keys(categoryTotals).map((category) => ({
      name: category,
      value: categoryTotals[category],
    }));

    // Sort chart data by value descending
    chartDataArray.sort((a, b) => b.value - a.value);

    // Initialize all categories as selected (true)
    const filters = {};
    Object.keys(categoryTotals).forEach((category) => {
      filters[category] = true;
    });

    setCsvData(transactions);
    setCategories(categoryTotals);
    setChartData(chartDataArray);
    setFilteredChartData(chartDataArray);
    setTotalSpent(spent);
    setFilteredTotal(spent);
    setTotalIncome(income);
    setCategoryFilters(filters);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const toggleCategoryFilter = (category) => {
    const updatedFilters = {
      ...categoryFilters,
      [category]: !categoryFilters[category],
    };

    setCategoryFilters(updatedFilters);
    applyFilters(updatedFilters);
  };

  const toggleAllCategories = (selectAll) => {
    const updatedFilters = {};
    Object.keys(categoryFilters).forEach((category) => {
      updatedFilters[category] = selectAll;
    });

    setCategoryFilters(updatedFilters);
    applyFilters(updatedFilters);
  };

  const applyFilters = (filters) => {
    // Filter chart data based on selected categories
    const filtered = chartData.filter((item) => filters[item.name]);
    setFilteredChartData(filtered);

    // Calculate total of filtered categories
    const filteredSum = filtered.reduce((sum, item) => sum + item.value, 0);
    setFilteredTotal(filteredSum);
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className='bg-white p-4 rounded shadow border'>
          <p className='font-semibold'>{`${payload[0].name}`}</p>
          <p className='text-lg'>{formatCurrency(payload[0].value)}</p>
          <p>{`${((payload[0].value / filteredTotal) * 100).toFixed(1)}% of filtered total`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className='max-w-6xl mx-auto p-6'>
      <div className='text-center mb-8'>
        <h1 className='text-3xl font-bold mb-4'>Spending Tracker</h1>
        <div className='flex justify-center mb-6'>
          <label className='flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded cursor-pointer'>
            <FileUp size={20} />
            <span>Upload CSV File</span>
            <input type='file' accept='.csv' onChange={handleFileUpload} className='hidden' />
          </label>
        </div>

        {error && <div className='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4'>{error}</div>}

        {csvData.length > 0 && (
          <div className='mb-6'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-6'>
              <div className='bg-white p-6 rounded-lg shadow'>
                <h2 className='text-xl font-semibold mb-2'>Total Spending</h2>
                <p className='text-3xl text-red-600'>{formatCurrency(totalSpent)}</p>
                {filteredTotal !== totalSpent && <p className='text-lg text-gray-600 mt-2'>Filtered: {formatCurrency(filteredTotal)}</p>}
              </div>
              <div className='bg-white p-6 rounded-lg shadow'>
                <h2 className='text-xl font-semibold mb-2'>Total Income</h2>
                <p className='text-3xl text-green-600'>{formatCurrency(totalIncome)}</p>
              </div>
            </div>

            <div className='bg-white p-6 rounded-lg shadow mb-6'>
              <div className='flex justify-between items-center mb-4'>
                <h2 className='text-xl font-semibold'>Spending by Category</h2>
                <div className='flex gap-2'>
                  <button onClick={() => setShowFilterPanel(!showFilterPanel)} className={`px-3 py-1 rounded ${showFilterPanel ? "bg-blue-600 text-white" : "bg-gray-200"}`}>
                    Filters
                  </button>
                  <button onClick={() => setView("pie")} className={`px-3 py-1 rounded ${view === "pie" ? "bg-blue-600 text-white" : "bg-gray-200"}`}>
                    Pie
                  </button>
                  <button onClick={() => setView("bar")} className={`px-3 py-1 rounded ${view === "bar" ? "bg-blue-600 text-white" : "bg-gray-200"}`}>
                    Bar
                  </button>
                </div>
              </div>

              {showFilterPanel && (
                <div className='bg-gray-50 p-4 rounded-lg mb-4 text-left'>
                  <div className='flex justify-between items-center mb-2'>
                    <h3 className='font-medium'>Filter Categories</h3>
                    <div className='flex gap-2'>
                      <button onClick={() => toggleAllCategories(true)} className='flex items-center gap-1 px-2 py-1 text-sm bg-green-100 text-green-800 rounded hover:bg-green-200'>
                        <Check size={16} /> Select All
                      </button>
                      <button onClick={() => toggleAllCategories(false)} className='flex items-center gap-1 px-2 py-1 text-sm bg-red-100 text-red-800 rounded hover:bg-red-200'>
                        <X size={16} /> Clear All
                      </button>
                    </div>
                  </div>
                  <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 mt-2'>
                    {Object.keys(categoryFilters).map((category) => (
                      <div key={category} className='flex items-center'>
                        <input type='checkbox' id={`filter-${category}`} checked={categoryFilters[category]} onChange={() => toggleCategoryFilter(category)} className='mr-2' />
                        <label htmlFor={`filter-${category}`} className='text-sm truncate'>
                          {category}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {filteredChartData.length > 0 ? (
                <div className='h-80'>
                  <ResponsiveContainer width='100%' height='100%'>
                    {view === "pie" ? (
                      <PieChart>
                        <Pie data={filteredChartData} cx='50%' cy='50%' labelLine={false} outerRadius={100} fill='#8884d8' dataKey='value' label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}>
                          {filteredChartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                      </PieChart>
                    ) : (
                      <BarChart data={filteredChartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray='3 3' />
                        <XAxis dataKey='name' />
                        <YAxis />
                        <Tooltip formatter={(value) => formatCurrency(value)} />
                        <Bar dataKey='value' fill='#8884d8'>
                          {filteredChartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Bar>
                      </BarChart>
                    )}
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className='h-80 flex items-center justify-center bg-gray-50 rounded'>
                  <p className='text-gray-500'>No categories selected to display</p>
                </div>
              )}
            </div>

            <div className='bg-white p-6 rounded-lg shadow'>
              <h2 className='text-xl font-semibold mb-4'>Recent Transactions</h2>
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
                    {csvData.slice(0, 10).map((transaction, index) => (
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
