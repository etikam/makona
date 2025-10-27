import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import AdminDashboard from './AdminDashboard';

const TestResponsiveAdmin = () => {
  const [user] = useState({
    first_name: 'Admin',
    last_name: 'Test',
    user_type: 'admin',
    email: 'admin@test.com'
  });

  const handleLogout = () => {
    console.log('Logout clicked');
  };

  const handleNavigate = (path) => {
    console.log('Navigate to:', path);
  };

  return (
    <>
      <Helmet>
        <title>Test Responsive Admin - Makona Awards 2025</title>
        <meta name="description" content="Test du dashboard admin responsive." />
      </Helmet>
      
      <AdminDashboard 
        user={user}
        onLogout={handleLogout}
        onNavigate={handleNavigate}
      />
    </>
  );
};

export default TestResponsiveAdmin;
