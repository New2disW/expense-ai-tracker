self.onmessage = async (e) => {
  const { file, token, aiServiceUrl } = e.data;
  
  try {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await fetch(`${aiServiceUrl}/api/receipts/parse`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });
    
    if (!response.ok) {
      throw new Error(`API returned status ${response.status}`);
    }
    
    const data = await response.json();
    self.postMessage({ success: true, data });
  } catch (error) {
    self.postMessage({ success: false, error: error.message });
  }
};
