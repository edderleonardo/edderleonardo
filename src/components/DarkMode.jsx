import { useEffect, useState } from "react";

export const DarkMode = () => {
  
  const [darkMode, setDarkMode] = useState();


  useEffect(() => {
    localStorage.setItem('darkMode', true);
  });

  const handleDarkMode = () => {
    console.log("darkMode", darkMode);
    setDarkMode(!darkMode);
    if (!darkMode) {
      localStorage.setItem('darkMode', false);
    } else {
      localStorage.setItem('darkMode', true);
    }
  };

  const buttonStyle = {
    fontSize: "30px"
  };

  return (
    <div>
      <button onClick={handleDarkMode} style={buttonStyle}>
        {darkMode ? "🌞" : "🌒"}
      </button>
    </div>
  );
}

