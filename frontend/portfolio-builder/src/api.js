import axios from "axios";

export const fetchResumeData = async () => {
  try {
    const API_URL = "http://127.0.0.1:8000/extract";
    const response = await axios.get(API_URL, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      withCredentials: false
    });
    
    console.log("API Response:", response.data);

    // Since FastAPI automatically serializes to JSON, we can return the data directly
    return response.data;

  } catch (error) {
    console.error("Error fetching resume data:", error);
    if (error.response) {
      // Log more detailed error information
      console.error("Error details:", error.response.data);
    }
    return null;
  }
};




  
