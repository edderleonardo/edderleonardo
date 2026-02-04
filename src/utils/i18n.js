// Función para obtener los datos del CV según el idioma
export async function getCVData(lang = "en") {
  try {
    if (lang === "es") {
      const cvData = await import("../../cv.json");
      return cvData.default;
    } else {
      const cvData = await import("../../cv_english.json");
      return cvData.default;
    }
  } catch (error) {
    console.error("Error loading CV data:", error);
    // Fallback to English
    const cvData = await import("../../cv_english.json");
    return cvData.default;
  }
}

// Función para obtener el idioma actual
export function getCurrentLanguage() {
  if (typeof window !== "undefined") {
    return new URLSearchParams(window.location.search).get("lang") || "en";
  }
  return "en";
}