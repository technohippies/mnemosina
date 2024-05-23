export async function uploadJsonDataToVercel(jsonData) {
  const response = await fetch('https://vercel-to-filebase.vercel.app/api/upload', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify(jsonData),
  });

  if (!response.ok) {
      throw new Error(`Failed to upload data: ${response.statusText}`);
  }

  const data = await response.json();
  console.log('Data uploaded successfully:', data);
}
