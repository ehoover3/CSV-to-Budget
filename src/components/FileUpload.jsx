import React from "react";
import { FileUp } from "lucide-react";

const FileUpload = ({ handleFileUpload }) => (
  <label className='flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded cursor-pointer'>
    <FileUp size={20} />
    <span>Upload CSV File</span>
    <input type='file' accept='.csv' onChange={handleFileUpload} className='hidden' />
  </label>
);

export default FileUpload;
