import axios from "axios";

export const fetchResumeData = async () => {
  try {
    const API_URL = "http://127.0.0.1:8000/extract";
    const response = await axios.get(API_URL, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      withCredentials: false  // Set this to false since we're not using credentials
    });
    
    console.log("Raw API Response:", response.data); // Check the response format

    // Check if response is already JSON (remove regex parsing)
    if (typeof response.data === "object") {
      return response.data;
    }

    // Attempt to extract JSON
    const jsonMatch = response.data.match(/```json\n([\s\S]*?)\n```/);
    
    if (!jsonMatch) {
      throw new Error("JSON data not found in response");
    }

    const jsonString = jsonMatch[1];
    const jsonData = JSON.parse(jsonString);

    console.log("Extracted Resume Data:", jsonData);
    return jsonData;
  } catch (error) {
    console.error("Error fetching or parsing resume data:", error);
    return null;
  }
};




  
