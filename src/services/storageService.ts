
// Uploads a base64 image to FastAPI backend and returns the file URL
export async function uploadProfileImageBase64(base64Image: string): Promise<string> {
  const response = await fetch('http://localhost:8001/upload-face-image', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ image_base64: base64Image }),
  });
  if (!response.ok) {
    throw new Error('Failed to upload face image');
  }
  const data = await response.json();
  return data.url;
}

// (Optional) Remove or update this function if you want to handle report uploads via backend as well.
