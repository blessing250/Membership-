import React, { useEffect, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-toastify';

const QRCodeGenerator = () => {
  const { currentUser } = useAuth();
  const qrCodeRef = useRef(null);

  useEffect(() => {
    if (currentUser && qrCodeRef.current) {
      const qrData = JSON.stringify({
        userId: currentUser._id,
        email: currentUser.email,
        name: currentUser.name,
        membershipStatus: currentUser.membershipStatus
      });

      // Generate QR code using qrcode.js
      const QRCode = require('qrcode');
      QRCode.toCanvas(qrCodeRef.current, qrData, {
        width: 200,
        margin: 1,
        color: {
          dark: '#000000',
          light: '#ffffff'
        }
      }, (error) => {
        if (error) {
          toast.error('Error generating QR code');
          console.error(error);
        }
      });
    }
  }, [currentUser]);

  const handleDownload = () => {
    if (qrCodeRef.current) {
      const link = document.createElement('a');
      link.download = 'membership-qr.png';
      link.href = qrCodeRef.current.toDataURL('image/png');
      link.click();
    }
  };

  if (!currentUser) return null;

  return (
    <div className="flex flex-col items-center space-y-4">
      <canvas ref={qrCodeRef} className="bg-white p-4 rounded-lg shadow-md" />
      <div className="flex space-x-4">
        <button
          onClick={handleDownload}
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Download QR Code
        </button>
        <button
          onClick={() => window.print()}
          className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
        >
          Print QR Code
        </button>
      </div>
      <p className="text-sm text-gray-600">Scan this QR code to verify membership</p>
    </div>
  );
};

export default QRCodeGenerator; 