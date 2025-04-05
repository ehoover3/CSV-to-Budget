import React from "react";
import { formatCurrency } from "../helpers/formatCurrency";

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className='bg-white p-4 rounded shadow border'>
        <p className='font-semibold'>{payload[0].name}</p>
        <p className='text-lg'>{formatCurrency(payload[0].value)}</p>
      </div>
    );
  }
  return null;
};

export default CustomTooltip;
