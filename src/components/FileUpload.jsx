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

    transactions.forEach((transaction) => {
      // Set Transfers isIncluded to false
      if (transaction.description.includes("# Xfer From")) transaction.isIncluded = false;
      if (transaction.description.includes("# Xfer To")) transaction.isIncluded = false;

      // Car
      if (transaction.description === "A1 Automotive") {
        transaction.category = "Car";
        transaction.subcategory = "Repair";
      }
      if (transaction.description === "E-ZPass") {
        transaction.category = "Car";
        transaction.subcategory = "Tolls";
      }
      if (transaction.description === "The Tube Car Wash") {
        transaction.category = "Car";
        transaction.subcategory = "Wash";
      }
      if (transaction.description === "Lassus") {
        transaction.category = "Car";
        transaction.subcategory = "Gas";
      }
      if (transaction.description === "Murphy USA") {
        transaction.category = "Car";
        transaction.subcategory = "Gas";
      }
      if (transaction.description === "Payment to Erie Insurance Group") {
        transaction.category = "Car";
        transaction.subcategory = "Insurance";
      }
      if (transaction.description === "Shell") {
        transaction.category = "Car";
        transaction.subcategory = "Gas";
      }
      if (transaction.description === "Sunoco") {
        transaction.category = "Car";
        transaction.subcategory = "Gas";
      }

      // Career Expenses
      if (transaction.description === "Amazon Web Services") {
        transaction.category = "Career Expenses";
        transaction.subcategory = "AWS";
      }
      if (transaction.description === "Kryterion Inc") {
        transaction.category = "Career Expenses";
        transaction.subcategory = "Certification";
      }
      if (transaction.description === "Office Depot") {
        transaction.category = "Career Expenses";
        transaction.subcategory = "Office Supplies";
      }
      if (transaction.description === "The Guys' Place") {
        transaction.category = "Career Expenses";
        transaction.subcategory = "Haircut";
      }

      // Daycare
      if (transaction.description === "Kiddie Academy") {
        transaction.category = "Daycare";
        transaction.subcategory = "Kiddie Academy";
      }

      // Food - Grocery / Restaurant
      if (transaction.description === "ALDI") {
        transaction.category = "Food";
        transaction.subcategory = "Grocery";
      }
      if (transaction.description === "Kroger") {
        transaction.category = "Food";
        transaction.subcategory = "Grocery";
      }
      if (transaction.description === "Meijer") {
        transaction.category = "Food";
        transaction.subcategory = "Grocery";
      }
      if (transaction.description === "Target") {
        transaction.category = "Food";
        transaction.subcategory = "Grocery";
      }
      if (transaction.description === "Trader Joe's") {
        transaction.category = "Food";
        transaction.subcategory = "Grocery";
      }
      if (transaction.description === "Walmart") {
        transaction.category = "Food";
        transaction.subcategory = "Grocery";
      }
      if (transaction.description === "Chipotle Mexican Grill") {
        transaction.category = "Food";
        transaction.subcategory = "Restaurant";
      }
      if (transaction.description === "THE FAIRFIELD 1510 FAIRFIELD AVE FORT WAYNE INUS") {
        transaction.category = "Food";
        transaction.subcategory = "Restaurant";
      }
      if (transaction.description === "Portillo's") {
        transaction.category = "Food";
        transaction.subcategory = "Restaurant";
      }
      if (transaction.description === "Smoothie King") {
        transaction.category = "Food";
        transaction.subcategory = "Restaurant";
      }
      if (transaction.description === "SWEETWATER DOWNBEAT DI 5501 US Hwy 30 W FORT WAYNE I") {
        transaction.category = "Food";
        transaction.subcategory = "Restaurant";
      }
      if (transaction.description === "The Lucky Moose") {
        transaction.category = "Food";
        transaction.subcategory = "Restaurant";
      }
      if (transaction.description === "The Famous Taco") {
        transaction.category = "Food";
        transaction.subcategory = "Restaurant";
      }
      if (transaction.description === "TST*TEQUILA MEXICAN RE 6328 W Jefferson Blvd Fort Wayne I") {
        transaction.category = "Food";
        transaction.subcategory = "Restaurant";
      }

      // Health
      if (transaction.description === "ROOTED IN HEALING 6131 STONEY CREEK DRIVEFORT WAYNE INUS") {
        transaction.category = "Health";
        transaction.subcategory = "Therapy";
      }
      if (transaction.description === "Walgreens") {
        transaction.category = "Health";
        transaction.subcategory = "Pharmacy";
      }
      if (transaction.description === "YMCA") {
        transaction.category = "Health";
        transaction.subcategory = "Gym";
      }

      // Income
      if (transaction.description === "Mobile Deposit") transaction.category = "Income";
      if (transaction.description === "DIGITAL MOBILE I - PAYROLL") transaction.category = "Income";

      // Home - Rent / Utilities / Phone / Taxes / Home Improvement
      if (transaction.description === "BILT bx2919bXX00 - BILTRENT") {
        transaction.category = "Home";
        transaction.subcategory = "Rent";
      }
      if (transaction.description === "RPS*Reserve at Daws CD 8902 N Meridian St #XX0154 I") {
        transaction.category = "Home";
        transaction.subcategory = "Rent";
      }
      if (transaction.description === "Payment to Nipsco") {
        transaction.category = "Home";
        transaction.subcategory = "Utilities";
      }
      if (transaction.description === "Payment to Nipsco	Utilities") {
        transaction.category = "Home";
        transaction.subcategory = "Utilities";
      }
      if (transaction.description === "Payment to Remc") {
        transaction.category = "Home";
        transaction.subcategory = "Utilities";
      }
      if (transaction.description === "Payment to T-Mobile") {
        transaction.category = "Home";
        transaction.subcategory = "Phone";
      }
      if (transaction.description === "Payment to Verizon Wireless") {
        transaction.category = "Home";
        transaction.subcategory = "Phone";
      }
      if (transaction.description === "Tax Payment to H&R Block") {
        transaction.category = "Home";
        transaction.subcategory = "Taxes";
      }
      if (transaction.description === "Harbor Freight Tools") {
        transaction.category = "Home";
        transaction.subcategory = "Home Improvement";
      }
      if (transaction.description === "Lowe's") {
        transaction.category = "Home";
        transaction.subcategory = "Home Improvement";
      }
      if (transaction.description === "Payment to U-Haul") {
        transaction.category = "Home";
        transaction.subcategory = "Home Improvement";
      }
      if (transaction.date === "3/9/2025" && transaction.description == "United Airlines") {
        transaction.description = "UNITED ART AND EDUCATI 4111 N CLINTON ST";
        transaction.category = "Home";
        transaction.category = "Home Improvement";
      }
      if (transaction.description === "Amazon") {
        transaction.category = "Home";
        transaction.subcategory = "Misc";
      }
      if (transaction.description === "eBay") {
        transaction.category = "Home";
        transaction.subcategory = "Misc";
      }
      if (transaction.description === "Finders Keepers") {
        transaction.category = "Home";
        transaction.subcategory = "Misc";
      }
      if (transaction.description === "ITCH.IO - GAME STORE 153 Vicksburg SAN FRANCISCOCAU") {
        transaction.category = "Home";
        transaction.subcategory = "Misc";
      }

      // Pets - Dog Park / Veterinarian
      if (transaction.description === "Ruff House") {
        transaction.category = "Pets";
        transaction.subcategory = "Dog Park";
      }
      if (transaction.description === "Cedar Creek Veterinary x2625 LEO RD Fort Wayne I") {
        transaction.category = "Pets";
        transaction.subcategory = "Veterinarian";
      }

      // Shopping - Clothes / Entertainment / Music / Postage / Thrift Shopping
      if (transaction.description === "DSW") {
        transaction.category = "Shopping";
        transaction.subcategory = "Clothes";
      }
      if (transaction.description === "Express") {
        transaction.category = "Shopping";
        transaction.subcategory = "Clothes";
      }
      if (transaction.description === "Forever 21") {
        transaction.category = "Shopping";
        transaction.subcategory = "Clothes";
      }
      if (transaction.description === "Kid to Kid") {
        transaction.category = "Shopping";
        transaction.subcategory = "Clothes";
      }
      if (transaction.description === "Kohl's") {
        transaction.category = "Shopping";
        transaction.subcategory = "Clothes";
      }
      if (transaction.description === "Macy's") {
        transaction.category = "Shopping";
        transaction.subcategory = "Clothes";
      }
      if (transaction.description === "Ross Stores") {
        transaction.category = "Shopping";
        transaction.subcategory = "Clothes";
      }
      if (transaction.description === "SP AMERICAN TALL 850 New Burton Road DOVER DEUS") {
        transaction.category = "Shopping";
        transaction.subcategory = "Clothes";
      }

      if (transaction.description === "Payment to Amazon Prime") {
        transaction.category = "Shopping";
        transaction.subcategory = "Streaming Service";
      }
      if (transaction.description === "Steam") {
        transaction.category = "Shopping";
        transaction.subcategory = "Video Games";
      }
      if (transaction.description === "MEMORIAL COLISEUM PARK 4000 PARNELL AVENUE FORT WAYNE I") {
        transaction.category = "Shopping";
        transaction.subcategory = "Entertainment";
      }

      if (transaction.description === "Sweetwater Sound") {
        transaction.category = "Shopping";
        transaction.subcategory = "Music";
      }

      if (transaction.description === "USPS") {
        transaction.category = "Shopping";
        transaction.subcategory = "Postage";
      }

      if (transaction.description === "Dollar Tree") {
        transaction.category = "Shopping";
        transaction.subcategory = "Thrift Shopping";
      }
      if (transaction.description === "FRANCISCAN CENTE FORT WAYNE INUS") {
        transaction.category = "Shopping";
        transaction.subcategory = "Thrift Shopping";
      }
      if (transaction.description === "Franciscan Center") {
        transaction.category = "Shopping";
        transaction.subcategory = "Thrift Shopping";
      }
      if (transaction.description === "Goodwill") {
        transaction.category = "Shopping";
        transaction.subcategory = "Thrift Shopping";
      }
      if (transaction.description === "Ollie's Bargain Outlet") {
        transaction.category = "Shopping";
        transaction.subcategory = "Thrift Shopping";
      }
      if (transaction.description === "The Lighthouse") {
        transaction.category = "Shopping";
        transaction.subcategory = "Thrift Shopping";
      }
      if (transaction.description === "Treasure House") {
        transaction.category = "Shopping";
        transaction.subcategory = "Thrift Shopping";
      }
      if (transaction.description === "TSA FT WAYNE STR XX 6031 LIMA RD FORT WAYNE IN") {
        transaction.category = "Shopping";
        transaction.subcategory = "Thrift Shopping";
      }
      if (transaction.description === "TSA FT WAYNE STR XX 710 E DUPONT RD FORT WAYNE IN") {
        transaction.category = "Shopping";
        transaction.subcategory = "Thrift Shopping";
      }
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
