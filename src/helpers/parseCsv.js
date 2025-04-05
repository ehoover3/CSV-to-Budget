export const parseCSV = (csvText, setCsvData, setCategories, setTotalSpent, setTotalIncome, setError) => {
  const lines = csvText.split("\n").filter((line) => line.trim() !== "");
  if (lines.length < 2) {
    setError("CSV file appears to be empty or invalid");
    return;
  }

  const headerLine = lines[0];
  const headers = headerLine.split(",").map((h) => h.trim());

  const amountIndex = headers.findIndex((h) => h.includes("Amount"));
  const categoryIndex = headers.findIndex((h) => h.includes("Transaction Category"));
  const typeIndex = headers.findIndex((h) => h.includes("Transaction Type"));
  const dateIndex = headers.findIndex((h) => h.includes("Posting Date") || h.includes("Date"));
  const descriptionIndex = headers.findIndex((h) => h.includes("Description"));

  if (amountIndex === -1 || categoryIndex === -1) {
    setError("CSV file missing required columns (Amount and Transaction Category)");
    return;
  }

  const transactions = [];
  const categoryTotals = {};
  let spent = 0;
  let income = 0;

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

        const absoluteAmount = Math.abs(amount);

        if (isDebit) {
          spent += absoluteAmount;
          categoryTotals[category] = (categoryTotals[category] || 0) + absoluteAmount;
        } else {
          income += absoluteAmount;
        }

        transactions.push({
          date,
          description,
          amount,
          category,
          type: isDebit ? "Expense" : "Income",
        });
      }
    }
  }

  const categoriesArray = Object.keys(categoryTotals)
    .map((category) => ({
      name: category,
      value: categoryTotals[category],
    }))
    .sort((a, b) => b.value - a.value);

  setCsvData(transactions);
  setCategories(categoriesArray);
  setTotalSpent(spent);
  setTotalIncome(income);
};
