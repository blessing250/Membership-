import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import QRCodeGenerator from '../../components/qr/QRCodeGenerator';

const Dashboard = () => {
  const { currentUser } = useAuth();

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold mb-6">Welcome, {currentUser?.name}</h1>

        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Membership Status</h2>
          <div className={`p-4 rounded-lg ${currentUser?.membershipStatus === 'active'
              ? 'bg-green-100 text-green-800'
              : 'bg-yellow-100 text-yellow-800'
            }`}>
            <p className="font-medium">
              Status: {currentUser?.membershipStatus === 'active' ? 'Active' : 'Inactive'}
            </p>
            {currentUser?.membershipStatus !== 'active' && (
              <p className="mt-2 text-sm">
                Please contact the administrator to activate your membership.
              </p>
            )}
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Your QR Code</h2>
          <p className="text-gray-600 mb-4">
            Show this QR code to the administrator to verify your membership.
          </p>
          <QRCodeGenerator />
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 