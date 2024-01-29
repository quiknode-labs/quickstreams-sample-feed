import React from 'react';

function DashboardTab({ data }) {
  return (
    <div className="dashboard-tab">
      <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
      <p>This is a placeholder for the Dashboard tab.</p>
      {/* Future Visualization Components Go Here */}
      <div>
        {/* Example: Display the number of data points received */}
        <p>Total Data Points: {data.length}</p>
      </div>
    </div>
  );
}

export default DashboardTab;