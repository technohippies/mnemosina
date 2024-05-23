export async function loadJsonFromIPFSorIPNSPath(cid: string, directoryPath?: string) {
    // console.log("Attempting to load JSON from IPFS or IPNS with CID:", cid, "and directoryPath:", directoryPath); // Log the inputs

    // Determine if the CID is for IPFS or IPNS
    const isIPNS = cid.startsWith('k2') || cid.startsWith('k51');
    const protocol = isIPNS ? 'ipns' : 'ipfs';

    
    // Construct the base URL
    const workerUrl = 'https://worker-raspy-hat-a845.tht3ch.workers.dev/';
    let fetchUrl = `${workerUrl}?${protocol}Path=${encodeURIComponent(cid)}`;
    console.log(fetchUrl);
    // If a directory path is provided, append it to the fetch URL
    if (directoryPath) {
        fetchUrl += `/${encodeURIComponent(directoryPath)}`;
    }
  
    try {
        const response = await fetch(fetchUrl);
        const text = await response.text();
        const data = JSON.parse(text);
        return data;
    } catch (error) {
        console.error('Network or server error:', error);
        throw error; 
    }
}