import React from "react";

function Error({ error }) {
  return <div>{error && <div className='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4'>{error}</div>}</div>;
}

export default Error;
