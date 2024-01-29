import React, { useState } from 'react';
import LogsTab from './LogsTab';   // Component for Logs tab
import DashboardTab from './DashboardTab'; // Component for Dashboard tab

function MainPage({ streamData }) {
  const [activeTab, setActiveTab] = useState('logs');

  return (
    <div className="container mx-auto p-4">
      {/* Tab buttons */}
      {/* Tab content */}
      {activeTab === 'logs' && <LogsTab data={streamData} />}
      {activeTab === 'dashboard' && <DashboardTab data={streamData} />}
    </div>
  );
}

export default MainPage;