import React from "react";
import { formatCurrency } from "../helpers/formatCurrency";

const CategoryTotals = ({ categoryData }) => {
  return (
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
  );
};

export default CategoryTotals;
