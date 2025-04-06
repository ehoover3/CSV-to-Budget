import React from "react";
import { FileUp } from "lucide-react";

const FileUpload = ({ setTransactions }) => {
  const parseCSV = (csvText) => {
    const lines = csvText.split("\n").filter((line) => line.trim() !== "");
    if (lines.length < 2) {
      console.log("lines.length < 2");
      return;
    }

    const headerLine = lines[0];
    const headers = headerLine.split(",").map((header) => header.trim());
    const amountIndex = headers.findIndex((header) => header.includes("Amount"));
    const categoryIndex = headers.findIndex((header) => header.includes("Transaction Category"));
    const typeIndex = headers.findIndex((header) => header.includes("Transaction Type"));
    const dateIndex = headers.findIndex((header) => header.includes("Posting Date") || header.includes("Date"));
    const descriptionIndex = headers.findIndex((header) => header.includes("Description"));

    if (amountIndex === -1 || categoryIndex === -1) {
      console.log("amountIndex === -1 || categoryIndex === -1");
      return;
    }

    const transactions = [];

    for (let i = 1; i < lines.length; i++) {
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

      if (values.length > Math.max(amountIndex, categoryIndex, typeIndex)) {
        let rawAmount = values[amountIndex].replace(/[^\d.-]/g, "");
        const amount = parseFloat(rawAmount);

        if (!isNaN(amount)) {
          const category = values[categoryIndex] || "Uncategorized";
          const type = values[typeIndex] || "";
          const isDebit = type.toLowerCase().includes("debit") || amount < 0;
          const description = descriptionIndex !== -1 ? values[descriptionIndex] : "";
          const date = dateIndex !== -1 ? values[dateIndex] : "";

          transactions.push({
            date,
            description,
            amount,
            category,
            type: isDebit ? "Expense" : "Income",
            isIncluded: true, // Add isIncluded property
          });
        }
      }
    }

    console.log("TRANSACTIONS - START");
    console.log(transactions);
    console.log("TRANSACTIONS - END");
    setTransactions(transactions);
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target.result;
        parseCSV(text);
      } catch (err) {
        console.error(err);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className='flex justify-center mb-6'>
      <label className='flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded cursor-pointer'>
        <FileUp size={20} />
        <span>Upload CSV File</span>
        <input type='file' accept='.csv' onChange={handleFileUpload} className='hidden' />
      </label>
    </div>
  );
};

export default FileUpload;
