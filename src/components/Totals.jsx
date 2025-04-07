import React from "react";
import { formatCurrency } from "../helpers/formatCurrency";

function Totals({ totalIncome, totalSpent, totalSavings }) {
  return (
    <div>
      <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-6'>
        <div className='bg-white p-6 rounded-lg shadow'>
          <h2 className='text-xl font-semibold mb-2'>Total Income</h2>
          <p className='text-3xl text-green-600'>{formatCurrency(totalIncome)}</p>
        </div>
        <div className='bg-white p-6 rounded-lg shadow'>
          <h2 className='text-xl font-semibold mb-2'>Total Spending</h2>
          <p className='text-3xl text-red-600'>{formatCurrency(totalSpent)}</p>
        </div>
        <div className='bg-white p-6 rounded-lg shadow'>
          <h2 className='text-xl font-semibold mb-2'>Potential Savings</h2>
          <p className='text-3xl text-green-600'>{formatCurrency(totalSavings)}</p>
        </div>
      </div>
    </div>
  );
}

export default Totals;
