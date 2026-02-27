const extractJson = async (text) => {
  if (!text) return null;

  try {
    const cleaned = text
      .replace(/```json/gi, "")
      .replace(/```/g, "")
      .trim();

    const firstBrace = cleaned.indexOf("{");
    const lastBrace = cleaned.lastIndexOf("}");

    if (firstBrace === -1 || lastBrace === -1) return null;

    const jsonString = cleaned.slice(firstBrace, lastBrace + 1);

    return JSON.parse(jsonString);

  } catch (err) {
    console.error("JSON extraction failed:", err);
    return null;
  }
};

export default extractJson;