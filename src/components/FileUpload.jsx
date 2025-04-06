import React, { useEffect } from "react";
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

    // Clean Up the Transactions Data
    transactions.forEach((transaction) => {
      // Set Transfers isIncluded to false
      if (transaction.description.includes("# Xfer From")) transaction.isIncluded = false;
      if (transaction.description.includes("# Xfer To")) transaction.isIncluded = false;

      // Fix Broken Description
      if (transaction.date === "3/9/2025" && transaction.description == "United Airlines") {
        transaction.description = "UNITED ART AND EDUCATI 4111 N CLINTON ST";
        transaction.category = "Shopping";
      }

      if (transaction.description === "Payment to Amazon Prime")
        // Amazon Prime
        transaction.category = "Amazon Prime";

      // Car
      if (transaction.description === "A1 Automotive") transaction.category = "Car";
      if (transaction.description === "E-ZPass") transaction.category = "Car";
      if (transaction.description === "The Tube Car Wash") transaction.category = "Car";

      // Career Expenses
      if (transaction.description === "Amazon Web Services") transaction.category = "Career Expenses";
      if (transaction.description === "Kryterion Inc") transaction.category = "Career Expenses";
      if (transaction.description === "Office Depot") transaction.category = "Career Expenses";
      if (transaction.description === "The Guys' Place") transaction.category = "Career Expenses";

      // Daycare
      if (transaction.description === "Kiddie Academy") transaction.category = "Daycare";

      // Entertainment
      if (transaction.description === "Steam") transaction.category = "Entertainment";
      if (transaction.description === "MEMORIAL COLISEUM PARK 4000 PARNELL AVENUE FORT WAYNE I") transaction.category = "Entertainment";

      // Gas
      if (transaction.description === "Lassus") transaction.category = "Gas";
      if (transaction.description === "Murphy USA") transaction.category = "Gas";
      if (transaction.description === "Shell") transaction.category = "Gas";
      if (transaction.description === "Sunoco") transaction.category = "Gas";

      // Health
      if (transaction.description === "ROOTED IN HEALING 6131 STONEY CREEK DRIVEFORT WAYNE INUS") transaction.category = "Healthcare";
      if (transaction.description === "Walgreens") transaction.category = "Healthcare";
      if (transaction.description === "YMCA") transaction.category = "Healthcare";

      // Home Improvement
      if (transaction.description === "Lowe's") transaction.category = "Home Improvement";
      if (transaction.description === "Harbor Freight Tools") transaction.category = "Home Improvement";

      // Income
      if (transaction.description === "Mobile Deposit") transaction.category = "Income";
      if (transaction.description === "DIGITAL MOBILE I - PAYROLL") transaction.category = "Income";

      // Rent / Utilities / Phone
      if (transaction.description === "BILT bx2919bXX00 - BILTRENT") transaction.category = "Rent / Utilities / Phone";
      if (transaction.description === "RPS*Reserve at Daws CD 8902 N Meridian St #XX0154 I") transaction.category = "Rent / Utilities / Phone";
      if (transaction.description === "Payment to Nipsco") transaction.category = "Rent / Utilities / Phone";
      if (transaction.description === "Payment to Nipsco	Utilities") transaction.category = "Rent / Utilities / Phone";
      if (transaction.description === "Payment to Remc") transaction.category = "Rent / Utilities / Phone";
      if (transaction.description === "Payment to T-Mobile") transaction.category = "Rent / Utilities / Phone";
      if (transaction.description === "Payment to Verizon Wireless") transaction.category = "Rent / Utilities / Phone";

      // Restaurants
      if (transaction.description === "Chipotle Mexican Grill") transaction.category = "Restaurants";
      if (transaction.description === "THE FAIRFIELD 1510 FAIRFIELD AVE FORT WAYNE INUS") transaction.category = "Restaurants";
      if (transaction.description === "Portillo's") transaction.category = "Restaurants";
      if (transaction.description === "Smoothie King") transaction.category = "Restaurants";
      if (transaction.description === "SWEETWATER DOWNBEAT DI 5501 US Hwy 30 W FORT WAYNE I") transaction.category = "Restaurants";
      if (transaction.description === "The Lucky Moose") transaction.category = "Restaurants";
      if (transaction.description === "The Famous Taco") transaction.category = "Restaurants";
      if (transaction.description === "TST*TEQUILA MEXICAN RE 6328 W Jefferson Blvd Fort Wayne I") transaction.category = "Restaurants";

      // Shopping
      if (transaction.description === "DSW") transaction.category = "Shopping";
      if (transaction.description === "Express") transaction.category = "Shopping";
      if (transaction.description === "Forever 21") transaction.category = "Shopping";
      if (transaction.description === "Kid to Kid") transaction.category = "Shopping";
      if (transaction.description === "Ross Stores") transaction.category = "Shopping";
      if (transaction.description === "USPS") transaction.category = "Shopping";

      if (transaction.description === "SP AMERICAN TALL 850 New Burton Road DOVER DEUS") transaction.category = "Shopping";
      if (transaction.description === "Sweetwater Sound") transaction.category = "Shopping";

      // Thrift Shopping
      if (transaction.description === "Dollar Tree") transaction.category = "Thrift Shopping";
      if (transaction.description === "FRANCISCAN CENTE FORT WAYNE INUS") transaction.category = "Thrift Shopping";
      if (transaction.description === "Franciscan Center") transaction.category = "Thrift Shopping";
      if (transaction.description === "Goodwill") transaction.category = "Thrift Shopping";
      if (transaction.description === "The Lighthouse") transaction.category = "Thrift Shopping";
      if (transaction.description === "Treasure House") transaction.category = "Thrift Shopping";
      if (transaction.description === "TSA FT WAYNE STR XX 6031 LIMA RD FORT WAYNE IN") transaction.category = "Thrift Shopping";
      if (transaction.description === "TSA FT WAYNE STR XX 710 E DUPONT RD FORT WAYNE IN") transaction.category = "Thrift Shopping";
    });

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
