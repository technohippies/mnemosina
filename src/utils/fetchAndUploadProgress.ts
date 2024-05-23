// BROKEN DUE TO OUTSTANDING FILEBASE CORS PROBLEMS. 

interface PreSignedUrlResponse {
    url: string;
    contentType?: string; // Optional: Include contentType if the server provides it.
}

export async function fetchPresignedUrl(objectKey: string): Promise<PreSignedUrlResponse> {
    const response = await fetch(`https://vercel-presign.vercel.app/api/filebase-presigner?key=${encodeURIComponent(objectKey)}`);
    const responseBody = await response.text(); // Get the response body for logging
    console.log(`fetchPresignedUrl response status: ${response.status}, body: ${responseBody}`);
    if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.statusText}, body: ${responseBody}`);
    }
    try {
        const data: PreSignedUrlResponse = JSON.parse(responseBody);
        return data;
    } catch (error) {
        console.error(`Error parsing JSON from presigned URL response: ${error}`);
        throw error;
    }
}


export async function uploadDataToS3(preSignedUrl: string, file: File, contentType: string): Promise<void> {
    const headers = new Headers();
    headers.append('Content-Type', contentType);

    const cleanUrl = new URL(preSignedUrl);
    cleanUrl.searchParams.delete('Content-Type'); // Ensure no Content-Type parameter in the URL
    const cleanUrlString = cleanUrl.toString();
    
    console.log(`Attempting upload to: ${cleanUrlString} with Content-Type: ${contentType}`);

    try {
        const response = await fetch(cleanUrlString, {
            method: 'PUT',
            body: file,
            headers: headers,
        });

        const responseBody = await response.text(); // Get the response body for logging

        console.log(`uploadDataToS3 response status: ${response.status}, body: ${responseBody}`);

        if (!response.ok) {
            throw new Error(`Upload failed: ${response.status} ${response.statusText}, body: ${responseBody}`);
        }

        console.log('Upload successful');
    } catch (error) {
        console.error(`Error during file upload: ${error}`);
        throw error;
    }
}


