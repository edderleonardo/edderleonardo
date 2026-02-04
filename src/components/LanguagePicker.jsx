import { useState, useEffect } from "react";

export const LanguagePicker = () => {
  const [language, setLanguage] = useState("en");

  useEffect(() => {
    // Obtener idioma actual de la URL
    const currentLang = new URLSearchParams(window.location.search).get("lang") || "en";
    setLanguage(currentLang);
  }, []);

  const handleLanguageChange = () => {
    const newLanguage = language === "en" ? "es" : "en";

    // Actualizar URL y recargar
    const url = new URL(window.location);
    if (newLanguage === "en") {
      url.searchParams.delete("lang");
    } else {
      url.searchParams.set("lang", newLanguage);
    }

    // Navegar a la nueva URL
    window.location.href = url.toString();
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