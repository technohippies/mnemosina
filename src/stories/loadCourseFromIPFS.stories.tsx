import { createEffect } from 'solid-js';
// Correct the import to match the exported function name
import { loadJsonFromIPFSorIPNSPath } from '../utils/loadFromIPFSorIPNS'; // Corrected import path and function name

const LoadJSONFromIPFSStory = () => {
  createEffect(() => {
    const path = 'bafybeif6rjksdr56btcw4icgmvb3dglaajxcwu4ggq4kk7ude4lpynnxyy/QmUGGn5f4izxUw581ftDsMdY6iAPaRLmhYwjTzpZyLRohh';
    loadJsonFromIPFSorIPNSPath(path).then(data => {
      console.log('Fetched data:', data);
    }).catch(error => {
      console.error('Error fetching data:', error);
    });
  });

  return <div>Loading data from IPFS... Check the console for output.</div>;
};

export default {
    title: 'Utilities/LoadJSONFromIPFS',
    component: LoadJSONFromIPFSStory,
};

export const Default = () => <LoadJSONFromIPFSStory />;