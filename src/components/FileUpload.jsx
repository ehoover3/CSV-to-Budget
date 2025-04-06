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

    const transactionMapping = [
      {
        category: "Career Expenses",
        subcategories: [
          { subcategory: "AWS", vendors: ["Amazon Web Services"] },
          { subcategory: "Certification", vendors: ["Kryterion Inc", "WL *VUE*TESTING 5601 Green Valley DBLOOMINGTON MNUS"] },
          { subcategory: "Entrepreneuer", vendors: ["Fiverr"] },
          { subcategory: "Haircut", vendors: ["The Guys' Place"] },
          { subcategory: "Office Supplies", vendors: ["Office Depot"] },
          { subcategory: "Training", vendors: ["XX4882 PAYPAL *SKILLSHA San Jose CAUS", "TRYHACKME.COM 160 Kemp House LONDON GBGB"] },
        ],
      },
      {
        category: "Daycare",
        subcategories: [{ subcategory: "Kiddie Academy", vendors: ["Kiddie Academy"] }],
      },
      {
        category: "Financial Services",
        subcategories: [
          { subcategory: "ATM/Cash Withdrawals", vendors: ["PAI ISO 1265 N STATE ROAD 5 SHIPSHEWANA INUS", "Withdrawal"] },
          { subcategory: "Checks", vendors: ["Check # 1086: Completed", "Check # 1090: Completed"] },
          { subcategory: "Credit Card Payments", vendors: ["Payment to Capital One"] },
          { subcategory: "Fees", vendors: ["3rivers Federal Credit Union Service Charges/Fees"] },
        ],
      },
      {
        category: "Food",
        subcategories: [
          { subcategory: "Grocery", vendors: ["Albion Village Foods", "ALDI", "Giant Food", "Kroger", "Meijer", "Target", "Trader Joe's", "Walmart"] },
          {
            subcategory: "Restaurant",
            vendors: [
              "AMAY KITCHEN 3620 NORTH CLINTON FORT WAYNE INUS",
              "Arby's",
              "Auntie Anne's",
              "Buffalo Wild Wings",
              "Burger King",
              "BurgerFi",
              "Casa Grille",
              "Chipotle Mexican Grill",
              "Dairy Queen",
              "Dashpass",
              "DD *DOORDASHDAS 303 2nd StreetSuiteSAN FRANCISCO CAUS",
              "Fazoli's",
              "FSP*THREE 4039 N CLINT FORT WAYNE INUS",
              "HALLS DRIVE IN 4416 LIMA ROAD FORT WAYNE INUS",
              "Hershey's Chocolate World",
              "IHOP",
              "JIB BOB LLC 214 N FRANKLIN ST MOUNT PLEASAN MIUS",
              "Jimmy John's",
              "KFC",
              "Loving Cafe",
              "McDonald's",
              "MOZZARELLIS PIZ 1820 WEST DUPONT ROFORT WAYNE INUS",
              "Naf Naf Grill",
              "Olive Garden",
              "ORIGINAL BUTTER 6750 MCGULPIN ST MACKINAC IS MIUS",
              "ORIGINAL MURDIC 7363 MAIN ST MACKINAC IS MIUS",
              "Out Of The Fire Cafe",
              "Panda Express",
              "Panera Bread",
              "Papa John's Pizza",
              "Park View Plaza",
              "PAYPAL *PAPA JO 7700 EASTPORT PARKWXX7733 NEUS",
              "PEKING RESTAURA 312 S BUFFALO ST WARSAW INUS",
              "Pizza Hut",
              "Popeyes Louisiana Kitchen",
              "Portillo's",
              "SQ *SHAWNANIGANS WINONA LAKE INUS",
              "Smoothie King",
              "SQ *BANH MI PHO x2844 Coldwater RoaFort Wayne INUS",
              "Starbucks",
              "Store 5788 Coldwater Road Fort Wayne INUS",
              "Sun Rise Cafe",
              "SWEETWATER DOWNBEAT DI 5501 US Hwy 30 W FORT WAYNE I",
              "Taco Bell",
              "Taj Mahal",
              "THAI GARDEN RES x0376 LEO RD STE B FORT WAYNE INUS",
              "THE FAIRFIELD 1510 FAIRFIELD AVE FORT WAYNE INUS",
              "The Famous Taco",
              "The Lucky Moose",
              "TOKYO GRILL & B 285 E COLISEUM BLVDFORT WAYNE INUS",
              "Transfer to Panera Bread",
              "TRES PORTRILLOS 435 COLEMANS XING MARYSVILLE OHUS",
              "TST* DIRTY DOUG 1525 W DUPONT RD FORT WAYNE INUS",
              "TST* GRAIN & BE 9821 LIMA RD SUITE FT. WAYNE INUS",
              "TST* GRANITE CI 3809 COLDWATER RD FORT WAYNE INUS",
              "TST* LAYALI EL SHAM MI 214 N FRANKLIN ST RED LION P",
              "TST* LUCILLES B 9011 Lima Rd FORT WAYNE INUS",
              "TST*TEQUILA MEXICAN RE 6328 W Jefferson Blvd Fort Wayne I",
              "Wendy's",
              "Wings Etc.",
              "ZIANO'S ITALIAN 702 E DUPONT RD. FORT WAYNE INUS",
            ],
          },
        ],
      },
      {
        category: "Entertainment",
        subcategories: [
          { subcategory: "Running Events", vendors: ["SignUp *PathfinderTurk 300 Mill Street, Suite XX1360 N", "SignUp *FROZENTRAILFES 300 Mill Street, Suite XX1360 N"] },
          { subcategory: "Streaming Service", vendors: ["Payment to Amazon Prime", "Peacock"] },
          { subcategory: "Theater / Tradeshows", vendors: ["Box office", "COLISEUM TKTS 4000 Parnell Ave FORT WAYNE INUS"] },
          { subcategory: "Video Games", vendors: ["Steam", "WL *STEAM PURCH x0400 NE 4th Ste StSEATTLE WAUS"] },
          { subcategory: "Zoos", vendors: ["COLUMBUS ZOO GU 9990 RIVERSIDE DRIVPOWELL OHUS", "FORT WAYNE ZOOL 3411 Sherman Blvd FORT WAYNE INUS", "Potter Park Zoo"] },
        ],
      },
      {
        category: "Health",
        subcategories: [
          { subcategory: "Gym", vendors: ["YMCA"] },
          { subcategory: "Massage", vendors: ["ELEMENTS MASSAGE FORT 2894-A DUPONT RD XX0494 IN"] },
          { subcategory: "Pharmacy", vendors: ["Walgreens"] },
          { subcategory: "Therapy", vendors: ["Canopy", "ROOTED IN HEALING 6131 STONEY CREEK DRIVEFORT WAYNE INUS", "SQ *SOZO WELLNE x0901 Southwest Foxgosq.com FLUS", "SQ *SOZO WELLNE 100 Village Square gosq.com FLUS"] },
        ],
      },
      {
        category: "Home",
        subcategories: [
          { subcategory: "Home Improvement", vendors: ["Harbor Freight Tools", "Lowe's", "Payment to U-Haul", "UNITED ART AND EDUCATI 4111 N CLINTON ST"] },
          { subcategory: "Misc", vendors: ["Amazon Kindle", "Finders Keepers", "ITCH.IO - GAME STORE 153 Vicksburg SAN FRANCISCOCAU"] },
          { subcategory: "Phone", vendors: ["Payment to T-Mobile", "Payment to Verizon Wireless"] },
          {
            subcategory: "Rent",
            vendors: [
              "BILT bx2919bXX00 - BILTRENT",
              "BILT 6dx2951f6cfXX00 - BILTRENT",
              "BILT-RENT PAYMT XX58 - RENT PMT",
              "BILT f39b08b2a40d-XX00 - BILTRENT",
              "BILT 8de3c0fXX00 - BILTRENT",
              "BILT 30e8bXX01 - BILTRENT",
              "Reserve at Dawso (CHECK PMTS) Accounts Receivable Entry SERIAL #: 01082",
              "Reserve at Dawso (CHECK PMTS) Accounts Receivable Entry SERIAL #: 01083",
              "Reserve at Dawso (CHECK PMTS) Accounts Receivable Entry SERIAL #: 01088",
              "Reserve at Dawso (CHECK PMTS) Accounts Receivable Entry SERIAL #: 01084",
              "Reserve at Dawso (CHECK PMTS) Accounts Receivable Entry SERIAL #: 01087",
              "BILT-RP-ACH XX58 - RENT PMT",
              "BILT e9ccee27baXX00 - BILTRENT",
              "RPS*Reserve at Daws CD 8902 N Meridian St #XX0154 I",
            ],
          },
          { subcategory: "Taxes", vendors: ["#38032775# Transfer To *****1093 2023 Taxes", "Tax Payment to H&R Block", "US TREASURY IRS (PAYMENT) Accounts Receivable Entry SERIAL #: 1085"] },
          { subcategory: "Utilities", vendors: ["Payment to Nipsco", "Payment to Nipsco	Utilities", "Payment to Remc"] },
        ],
      },
      {
        category: "Income",
        subcategories: [
          { subcategory: "Mobile Deposits", vendors: ["DIGITAL MOBILE XX 55 - DIRECT DEP", "Mobile Deposit"] },
          { subcategory: "Job", vendors: ["DIGITAL MOBILE I - PAYROLL"] },
        ],
      },
      {
        category: "Pets",
        subcategories: [
          { subcategory: "Dog Park", vendors: ["Ruff House"] },
          { subcategory: "Dog Sitter", vendors: ["Rover.com"] },
          { subcategory: "Dog Store", vendors: ["PetSmart", "Pet Supplies Plus"] },

          { subcategory: "Veterinarian", vendors: ["Cedar Creek Veterinary x2625 LEO RD Fort Wayne I", "Cedar Creek Vet x2625 LEO RD Fort Wayne INUS"] },
        ],
      },
      {
        category: "Shopping",
        subcategories: [
          { subcategory: "Clothes", vendors: ["DSW", "Carter's", "Express", "Forever 21", "Kid to Kid", "Kohl's", "Macy's", "Ross Stores", "Sheplers Inc", "SP AMERICAN TALL 850 New Burton Road DOVER DEUS"] },
          { subcategory: "Entertainment", vendors: ["MEMORIAL COLISEUM PARK 4000 PARNELL AVENUE FORT WAYNE I"] },
          { subcategory: "Misc", vendors: ["Amazon", "Barnes & Noble", "Best Buy", "eBay", "Jo-Ann Stores", "Little Green Apple", "QLT*Greater Fort Wayne 2020 E. Washington BlvdFort Wayne I", "Ulta Beauty", "ZOLA.COM*REGIST 250 Greenwich StFL NEW YORK NYUS"] },
          { subcategory: "Music", vendors: ["Sweetwater Sound"] },
          { subcategory: "Postage", vendors: ["USPS"] },
          {
            subcategory: "Thrift Shopping",
            vendors: ["Dollar Tree", "FRANCISCAN CENTE FORT WAYNE INUS", "Franciscan Center", "FRANCISCAN CENT 925 E. COLISEUM BLVFORT WAYNE INUS", "Goodwill", "Ollie's Bargain Outlet", "Plato's Closet", "The Lighthouse", "Treasure House", "TSA FT WAYNE STR XX 6031 LIMA RD FORT WAYNE IN", "TSA FT WAYNE ST 710 E DUPONT RD FORT WAYNE INUS", "TSA FT WAYNE STR XX 710 E DUPONT RD FORT WAYNE IN"],
          },
        ],
      },
      {
        category: "Travel",
        subcategories: [
          { subcategory: "Car Insurance", vendors: ["Payment to Erie Insurance Group", "Payment to State Farm"] },
          { subcategory: "Car Repair/Maintenance", vendors: ["A1 Automotive", "BOB THOMAS FOR 310 COLISEUM BOULEVFORT WAYNE INUS", "Jiffy Lube", "O'Reilly Auto Parts", "Tire Barn"] },
          { subcategory: "Car Wash", vendors: ["The Tube Car Wash"] },
          { subcategory: "Gas", vendors: ["Al's Corner", "Amoco", "BP Global", "Giant Gas Station", "gogo stores", "HUNTSVILLE MARA 6990 LIMA ST HUNTSVILLE OHUS", "Kroger Fuel Center", "Lassus", "Meijer Gas", "Murphy USA", "Shell", "Sunoco"] },
          { subcategory: "Hotel", vendors: ["Holiday Inn"] },
          { subcategory: "Parking", vendors: ["ALLEN CTY LIB P 900 LIBRARY PLAZA FORT WAYNE INUS", "PLAZA PARKING G 1 E MAIN FORT WAYNE INUS"] },
          { subcategory: "Tolls", vendors: ["E-ZPass", "MACKINAC BRIDGE 415 INTERSTATE 75 BST. IGNACE MIUS"] },
          { subcategory: "Uber", vendors: ["Uber"] },
        ],
      },
    ];
    console.log(transactions);

    transactions.forEach((transaction) => {
      if (transaction.description.includes("# Xfer From")) transaction.isIncluded = false;
      if (transaction.description.includes("# Xfer To")) transaction.isIncluded = false;
      if (transaction.date === "3/9/2025" && transaction.description === "United Airlines") transaction.description = "UNITED ART AND EDUCATI 4111 N CLINTON ST";

      for (const category of transactionMapping) {
        for (const subcategory of category.subcategories) {
          if (subcategory.vendors.includes(transaction.description)) {
            transaction.category = category.category;
            transaction.subcategory = subcategory.subcategory;
            return; // Stop once we find the first match
          }
        }
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
