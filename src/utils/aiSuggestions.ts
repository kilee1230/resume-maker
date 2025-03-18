export async function getSuggestions(section: string, data: any) {
  try {
    const response = await fetch("/api/suggestions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        section,
        data,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to get suggestions");
    }

    return await response.json();
  } catch (error) {
    console.error("Error getting suggestions:", error);
    return null;
  }
}
