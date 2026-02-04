import { useState, useEffect } from "react";

export const LanguagePicker = () => {
  const [language, setLanguage] = useState("en");

  useEffect(() => {
    // Detect language from URL path
    const isSpanish = window.location.pathname.startsWith("/es");
    setLanguage(isSpanish ? "es" : "en");
  }, []);

  const handleLanguageChange = () => {
    const isSpanish = window.location.pathname.startsWith("/es");

    if (isSpanish) {
      // Go to English (root)
      window.location.href = "/";
    } else {
      // Go to Spanish
      window.location.href = "/es/";
    }
  };

  const buttonStyle = {
    fontSize: "24px",
  };

  return (
    <div>
      <button onClick={handleLanguageChange} style={buttonStyle} title={language === "en" ? "Cambiar a español" : "Switch to English"}>
        {language === "en" ? "🇲🇽" : "🇺🇸"}
      </button>
    </div>
  );
};