import React from "react";
import { formatCurrency } from "../helpers/formatCurrency";

const VendorTotals = ({ vendors }) => {
  return (
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
  );
};

export default VendorTotals;
