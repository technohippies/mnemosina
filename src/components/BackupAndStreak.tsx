import { Component, createSignal } from 'solid-js';
import TablelandConnection from './TablelandConnection';
import Completed from './SaveProgress';

const BackupAndStreak: Component = () => {
  const [activeTab, setActiveTab] = createSignal('backup');

  return (
    <div>
      <div class="inline-flex rounded-md shadow-sm" role="group">
        <button
          type="button"
          class={`px-4 py-2 text-sm font-medium ${activeTab() === 'backup' ? 'bg-blue-500 text-white' : 'text-gray-900 bg-white'} border border-gray-200 rounded-l-lg hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:text-white dark:hover:bg-gray-700 dark:focus:ring-blue-500 dark:focus:text-white`}
          onClick={() => setActiveTab('backup')}
        >
          Backup Data
        </button>
        <button
          type="button"
          class={`px-4 py-2 text-sm font-medium ${activeTab() === 'broadcast' ? 'bg-blue-500 text-white' : 'text-gray-900 bg-white'} border border-gray-200 rounded-r-lg hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:text-white dark:hover:bg-gray-700 dark:focus:ring-blue-500 dark:focus:text-white`}
          onClick={() => setActiveTab('broadcast')}
        >
          Broadcast Streak
        </button>
      </div>
      <div>
        {activeTab() === 'backup' ? <TablelandConnection /> : <Completed />}
      </div>
    </div>
  );
};

export default BackupAndStreak;