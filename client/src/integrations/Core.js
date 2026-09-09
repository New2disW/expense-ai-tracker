import axios from 'axios';

/**
 * Re-implemented InvokeLLM to securely bridge the frontend component expectations
 * with the dedicated backend AI service, avoiding frontend API key exposure.
 */
export const InvokeLLM = async ({ prompt, response_json_schema }) => {
  try {
    const aiServiceUrl = import.meta.env.VITE_AI_SERVICE_URL || 'http://localhost:8000';
    
    // Extract the raw text from the hardcoded prompt ("Analyze this expense description...: '...'")
    // to pass to our existing backend /parse-nl endpoint.
    const textMatch = prompt.match(/categorize it:\s*"([^"]+)"/);
    const text = textMatch ? textMatch[1] : prompt;

    // We fetch the JWT token if the user is authenticated
    let token = '';
    const userInfoStr = localStorage.getItem('userInfo');
    if (userInfoStr) {
      try {
        const userInfo = JSON.parse(userInfoStr);
        token = userInfo.token || '';
      } catch (e) {
        // Handle parse error
      }
    }

    const res = await axios.post(`${aiServiceUrl}/parse-nl`, 
      { text }, 
      {
        headers: {
          Authorization: token ? `Bearer ${token}` : ''
        }
      }
    );

    // Map the backend's `ReceiptParseResponse` to the expected JSON schema format of the frontend
    return {
      category: res.data.category,
      explanation: res.data.description || "Categorized by Expense AI Service"
    };
  } catch (error) {
    console.error("InvokeLLM error:", error);
    throw error;
  }
};
