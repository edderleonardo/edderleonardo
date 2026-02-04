import { useState, useEffect } from "react";

export const DarkMode = () => {
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("darkMode");
      return saved !== null ? saved === "true" : true;
    }
    return true;
  });

  useEffect(() => {
    const htmlElement = document.documentElement;
    htmlElement.classList.toggle("dark", darkMode);
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  const handleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const buttonStyle = {
    fontSize: "24px",
  };

  return (
    <div>
      <button onClick={handleDarkMode} style={buttonStyle} title={darkMode ? "Light mode" : "Dark mode"}>
        {darkMode ? "🌞" : "🌒"}
      </button>
    </div>
  );
};
