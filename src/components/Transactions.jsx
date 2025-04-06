import React from "react";
import { formatCurrency } from "../helpers/formatCurrency";

const TransactionsTable = ({ transactions, setTransactions }) => {
  const handleCheckboxChange = (index) => {
    const updated = [...transactions];
    updated[index].isIncluded = !updated[index].isIncluded;
    setTransactions(updated);
  };

  return (
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
                  <input type='checkbox' checked={transaction.isIncluded} onChange={() => handleCheckboxChange(index)} />
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
  );
};

export default TransactionsTable;
