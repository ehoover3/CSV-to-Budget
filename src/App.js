// import React, { useState, useEffect } from "react";
// import { ResponsiveContainer } from "recharts";
// import { formatCurrency } from "./helpers/formatCurrency";
// import FileUpload from "./components/FileUpload.jsx";

// const SpendingTracker = () => {
//   const [transactions, setTransactions] = useState([]);
//   const [categories, setCategories] = useState([]);
//   const [vendors, setVendors] = useState([]);
//   const [totalSpent, setTotalSpent] = useState(0);
//   const [totalIncome, setTotalIncome] = useState(0);

//   useEffect(() => {
//     // Initialize variables for total spent and total income
//     let totalSpentAmount = 0;
//     let totalIncomeAmount = 0;
//     let categoriesData = [];

//     // Loop through transactions to calculate totals and categorize them
//     transactions
//       .filter((transaction) => transaction.isIncluded)
//       .forEach((transaction) => {
//         if (transaction.type === "Expense") {
//           totalSpentAmount += transaction.amount;
//         } else if (transaction.type === "Income") {
//           totalIncomeAmount += transaction.amount;
//         }

//         // Update categories data
//         const existingCategory = categoriesData.find((category) => category.name === transaction.category);
//         if (existingCategory) {
//           existingCategory.value += transaction.amount;
//         } else {
//           categoriesData.push({
//             name: transaction.category,
//             value: transaction.amount,
//           });
//         }
//       });
//     categoriesData.sort((a, b) => a.value - b.value);

//     // Update vendors data
//     let vendorsData = [];
//     transactions
//       .filter((transaction) => transaction.isIncluded)
//       .forEach((transaction) => {
//         // Check if the vendor (description) already exists in vendorsData
//         const existingVendor = vendorsData.find((vendor) => vendor.description === transaction.description);

//         if (existingVendor) {
//           existingVendor.total += transaction.amount;
//         } else {
//           vendorsData.push({
//             description: transaction.description,
//             category: transaction.category,
//             total: transaction.amount,
//           });
//         }
//       });
//     vendorsData.sort((a, b) => a.description.localeCompare(b.description));

//     console.log("vendorsData START");
//     console.log(vendorsData);
//     console.log("vendorData end");

//     // Update the state with the calculated values
//     setTotalIncome(totalIncomeAmount);
//     setTotalSpent(totalSpentAmount);
//     setCategories(categoriesData);
//     setVendors(vendorsData);
//   }, [transactions]);

//   return (
//     <div className='max-w-6xl mx-auto p-6'>
//       <div className='text-center mb-8'>
//         <h1 className='text-3xl font-bold mb-4'>Spending Tracker</h1>
//         <FileUpload setTransactions={setTransactions} />
//         {transactions.length > 0 && (
//           <div className='mb-6'>
//             <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-6'>
//               <div className='bg-white p-6 rounded-lg shadow'>
//                 <h2 className='text-xl font-semibold mb-2'>Total Income</h2>
//                 <p className='text-3xl text-green-600'>{formatCurrency(totalIncome)}</p>
//               </div>
//               <div className='bg-white p-6 rounded-lg shadow'>
//                 <h2 className='text-xl font-semibold mb-2'>Total Spending</h2>
//                 <p className='text-3xl text-red-600'>{formatCurrency(totalSpent)}</p>
//               </div>
//             </div>

//             <div className='bg-white p-6 rounded-lg shadow mb-6'>
//               <ResponsiveContainer width='100%' height='auto'>
//                 <div className='bg-white p-6 rounded-lg shadow'>
//                   <h2 className='text-xl font-semibold mb-4'>Category Summaries</h2>
//                   <div className='space-y-4'>
//                     {categories.map((category, index) => (
//                       <div key={index} className='flex justify-between'>
//                         <span>{category.name}</span>
//                         <span>{subcategory.name}</span>

//                         <span>{formatCurrency(category.value)}</span>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               </ResponsiveContainer>
//             </div>

//             {/* Vendor Summaries */}
//             <div className='bg-white p-6 rounded-lg shadow mb-6'>
//               <h2 className='text-xl font-semibold mb-4'>Description Totals</h2>
//               <div className='overflow-x-auto'>
//                 <table className='min-w-full bg-white'>
//                   <thead>
//                     <tr>
//                       <th className='py-2 px-4 bg-gray-100 text-left'>Description</th>
//                       <th className='py-2 px-4 bg-gray-100 text-left'>Category</th>
//                       <th className='py-2 px-4 bg-gray-100 text-right'>Total Amount</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {vendors.map((vendor, index) => (
//                       <tr key={index} className='border-b hover:bg-gray-50'>
//                         <td className='py-2 px-4 text-left'>{vendor.description}</td>
//                         <td className='py-2 px-4 text-left'>{vendor.category}</td>
//                         <td className='py-2 px-4 text-right'>{formatCurrency(vendor.total)}</td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             </div>

//             <div className='bg-white p-6 rounded-lg shadow'>
//               <h2 className='text-xl font-semibold mb-4'>Transactions</h2>
//               <div className='overflow-x-auto'>
//                 <table className='min-w-full bg-white'>
//                   <thead>
//                     <tr>
//                       <th className='py-2 px-4 bg-gray-100 text-center'>isIncluded</th> {/* New column for the checkbox */}
//                       <th className='py-2 px-4 bg-gray-100 text-left'>Date</th>
//                       <th className='py-2 px-4 bg-gray-100 text-left'>Description</th>
//                       <th className='py-2 px-4 bg-gray-100 text-left'>Category</th>
//                       <th className='py-2 px-4 bg-gray-100 text-right'>Amount</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {transactions.map((transaction, index) => (
//                       <tr key={index} className='border-b hover:bg-gray-50'>
//                         <td className='py-2 px-4 text-center'>
//                           <input
//                             type='checkbox'
//                             checked={transaction.isIncluded}
//                             onChange={() => {
//                               const updatedTransactions = [...transactions];
//                               updatedTransactions[index].isIncluded = !updatedTransactions[index].isIncluded;
//                               setTransactions(updatedTransactions);
//                             }}
//                           />
//                         </td>
//                         <td className='py-2 px-4 text-left'>{transaction.date}</td>
//                         <td className='py-2 px-4 text-left'>{transaction.description}</td>
//                         <td className='py-2 px-4 text-left'>{transaction.category}</td>
//                         <td className={`py-2 px-4 text-right ${transaction.type === "Expense" ? "text-red-600" : "text-green-600"}`}>{formatCurrency(transaction.amount)}</td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default SpendingTracker;

import React, { useState, useEffect } from "react";
import { ResponsiveContainer } from "recharts";
import { formatCurrency } from "./helpers/formatCurrency";
import FileUpload from "./components/FileUpload.jsx";

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
              <h2 className='text-xl font-semibold mb-4'>Category Totals</h2>
              <div className='space-y-4'>
                {categoryData.map((category, index) => (
                  <div key={index} className='border-b pb-2 last:border-b-0'>
                    <div className='flex justify-between font-semibold'>
                      <span>{category.name}</span>
                      <span className={category.value >= 0 ? "text-green-600" : "text-red-600"}>{formatCurrency(category.value)}</span>
                    </div>
                    <div className='pl-4 space-y-1 mt-1'>
                      {category.subcategoriesArray.map((subcategory, subIndex) => (
                        <div key={`${index}-${subIndex}`} className='flex justify-between text-sm text-gray-600'>
                          <span>- {subcategory.name}</span>
                          <span>{formatCurrency(subcategory.value)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Vendor Summaries */}
            <div className='bg-white p-6 rounded-lg shadow mb-6'>
              <h2 className='text-xl font-semibold mb-4'>Vendor Totals</h2>
              <div className='overflow-x-auto'>
                <table className='min-w-full bg-white'>
                  <thead>
                    <tr>
                      <th className='py-2 px-4 bg-gray-100 text-left'>Description</th>
                      <th className='py-2 px-4 bg-gray-100 text-left'>Category</th>
                      <th className='py-2 px-4 bg-gray-100 text-left'>Subcategory</th>
                      <th className='py-2 px-4 bg-gray-100 text-right'>Total Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {vendors.map((vendor, index) => (
                      <tr key={index} className='border-b hover:bg-gray-50'>
                        <td className='py-2 px-4 text-left'>{vendor.description}</td>
                        <td className='py-2 px-4 text-left'>{vendor.category}</td>
                        <td className='py-2 px-4 text-left'>{vendor.subcategory}</td>
                        <td className={`py-2 px-4 text-right ${vendor.total >= 0 ? "text-green-600" : "text-red-600"}`}>{formatCurrency(vendor.total)}</td>
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
                      <th className='py-2 px-4 bg-gray-100 text-center'>isIncluded</th>
                      <th className='py-2 px-4 bg-gray-100 text-left'>Date</th>
                      <th className='py-2 px-4 bg-gray-100 text-left'>Description</th>
                      <th className='py-2 px-4 bg-gray-100 text-left'>Category</th>
                      <th className='py-2 px-4 bg-gray-100 text-left'>Subcategory</th>
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
                        <td className='py-2 px-4 text-left'>{transaction.subcategory || "General"}</td>
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
