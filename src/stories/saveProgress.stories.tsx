import { Component } from 'solid-js';
import { uploadJsonDataToVercel } from '../utils/uploadProgress';
import { retrieveFlashcardsAsJson } from '../utils/retrieveFlashcardsAsJson';

const SaveProgress: Component = () => {
  const handleUpload = async () => {
    try {
      const jsonData = await retrieveFlashcardsAsJson();
      const dataObject = JSON.parse(jsonData as string); // Explicitly casting as string


      await uploadJsonDataToVercel(dataObject);
      console.log('Data saved successfully');
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };

  return (
    <div>
            <button 
                onClick={handleUpload} 
                class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
                Upload Data
            </button>
    </div>
  );
};

export default {
  title: 'Utilities/SaveProgress',
  component: SaveProgress,
};

export const SaveProgressStory = () => <SaveProgress />;