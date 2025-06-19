 import React, { useState } from 'react'
 
 const SimpleCalculator = () => {
   const [input, setInput] = useState("");

  const handleClick = (value) => {
    if (value === "=") {
      try {
        setInput(eval(input).toString()); // Note: `eval` is unsafe for production
      } catch {
        setInput("Error");
      }
    } else if (value === "C") {
      setInput("");
    } else {
      setInput((prev) => prev + value);
    }
  };

  const buttons = ["7", "8", "9", "/", "4", "5", "6", "*", "1", "2", "3", "-", "0", ".", "=", "+", "C"];

  return (
    <div className="p-2">
      <input
        type="text"
        value={input}
        readOnly
        className="w-full mb-2 p-2 text-right border rounded"
      />
      <div className="grid grid-cols-4 gap-2">
        {buttons.map((btn) => (
          <button
            key={btn}
            onClick={() => handleClick(btn)}
            className="p-2 bg-gray-200 dark:bg-gray-700 rounded text-black dark:text-white"
          >
            {btn}
          </button>
        ))}
      </div>
    </div>
   )
 }
 
 export default SimpleCalculator
 