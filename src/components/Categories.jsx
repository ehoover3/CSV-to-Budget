import React from "react";
import { formatCurrency } from "../helpers/formatCurrency";

const CategoryTotals = ({ categories = [], transactions, setTransactions }) => {
  const toggleSubcategory = (categoryName, subcategoryName, checked) => {
    const updated = transactions.map((txn) => {
      if (txn.category === categoryName && txn.subcategory === subcategoryName) {
        const original = txn.originalAmount ?? txn.amount;
        return {
          ...txn,
          originalAmount: original,
          amount: checked ? 0 : original,
          savings: checked ? original * -1 : undefined,
        };
      }
      return txn;
    });
    setTransactions(updated);
  };

  return (
    <div className='bg-white p-6 rounded-lg shadow mb-6'>
      <div className='flex justify-between font-bold border-b pb-2 mb-2'>
        <span>Category</span>
        <div className='flex gap-4 w-2/3 justify-end'>
          <span>Spending</span>
          <span>Savings</span>
        </div>
      </div>

      <div className='space-y-4'>
        {categories.map((category, index) => (
          <div key={index} className='border-b pb-2 last:border-b-0'>
            <div className='flex justify-between font-semibold items-center'>
              <span>{category.name}</span>
              <div className='flex gap-4'>
                <span className={category.value >= 0 ? "text-green-600" : "text-red-600"}>{formatCurrency(category.value)}</span>
                <span className='text-blue-600'>{formatCurrency(category.savings ?? 0)}</span>
              </div>
            </div>

            <div className='pl-6 space-y-1 mt-1'>
              {category.subcategoriesArray.map((subcategory, subIndex) => (
                <div key={`${index}-${subIndex}`} className='flex justify-between text-sm text-gray-600 items-center'>
                  <div className='flex items-center'>
                    <input type='checkbox' className='mr-2' onChange={(e) => toggleSubcategory(category.name, subcategory.name, e.target.checked)} />
                    <span>- {subcategory.name}</span>
                  </div>
                  <div className='flex gap-4 '>
                    <span>{formatCurrency(subcategory.value)}</span>
                    <span className='text-blue-500'>{formatCurrency(subcategory.savings ?? 0)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryTotals;
