import React, { useEffect, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import memberService from '../../services/memberService';
import { toast } from 'react-toastify';

const QRCodeScanner = () => {
  const [scanResult, setScanResult] = useState(null);
  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const scanner = new Html5QrcodeScanner('reader', {
      qrbox: {
        width: 250,
        height: 250,
      },
      fps: 5,
    });

    const success = async (result) => {
      scanner.clear();
      setScanResult(result);
      await validateQRCode(result);
    };

    const error = (err) => {
      console.warn(err);
    };

    scanner.render(success, error);

    return () => {
      scanner.clear();
    };
  }, []);

  const validateQRCode = async (qrData) => {
    try {
      setLoading(true);
      const data = JSON.parse(qrData);
      const memberData = await memberService.getMemberById(data.userId);
      setMember(memberData);

      if (memberData.membershipStatus === 'active') {
        toast.success('Valid membership!');
      } else {
        toast.warning('Membership is not active');
      }
    } catch (error) {
      toast.error('Invalid QR code or member not found');
      console.error('Error validating QR code:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">QR Code Scanner</h1>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div id="reader" className="w-full max-w-md mx-auto"></div>

          {loading && (
            <div className="flex justify-center mt-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          )}

          {member && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h2 className="text-xl font-semibold text-gray-900">Member Information</h2>
              <div className="mt-2 space-y-2">
                <p><span className="font-medium">Name:</span> {member.name}</p>
                <p><span className="font-medium">Email:</span> {member.email}</p>
                <p><span className="font-medium">Membership Number:</span> {member.membershipNumber}</p>
                <p><span className="font-medium">Status:</span>
                  <span className={`ml-2 px-2 py-1 rounded-full text-sm ${member.membershipStatus === 'active'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                    }`}>
                    {member.membershipStatus}
                  </span>
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QRCodeScanner; 