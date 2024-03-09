import { useState, useEffect } from "react";

export const DarkMode = () => {
  const [darkMode, setDarkMode] = useState()

  useEffect(() => {
    const htmlElement = document.documentElement;
    htmlElement.classList.toggle("dark", darkMode);
    }, [darkMode]);

  const handleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const buttonStyle = {
    fontSize: "30px",
  };

  return (
    <div>
      <button onClick={handleDarkMode} style={buttonStyle}>
        {darkMode ? "🌞" : "🌒"}
      </button>
    </div>
  );
};
