import React, { useState } from 'react';
import LogsTab from './LogsTab';
import DashboardTab from './DashboardTab';

function MainPage({ streamData }) {
  const [activeTab, setActiveTab] = useState('logs');

  return (
    <div className="container mx-auto p-4">
      <div className="tabs">
        <button 
          className={`tab-button ${activeTab === 'logs' ? 'active' : ''}`}
          onClick={() => setActiveTab('logs')}
        >
          Logs
        </button>
        <button 
          className={`tab-button ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('dashboard')}
        >
          Dashboard
        </button>
      </div>
      <div className="tab-content">
        {activeTab === 'logs' && <LogsTab data={streamData} />}
        {activeTab === 'dashboard' && <DashboardTab data={streamData} />}
      </div>
    </div>
  );
}

export default MainPage;
