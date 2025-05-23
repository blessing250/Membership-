import React, { useEffect, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import memberService from '../../services/memberService';
import { toast } from 'react-toastify';
import axios from 'axios';

const QRCodeScanner = () => {
  const [scanResult, setScanResult] = useState(null);
  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(false);
  const [scanHistory, setScanHistory] = useState([]);
  const [error, setError] = useState(null);

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
      setError(null);

      // Parse the QR data
      let data;
      try {
        data = JSON.parse(qrData);
      } catch (parseError) {
        setError('Invalid QR code format');
        toast.error('Invalid QR code format');
        setLoading(false);
        return;
      }

      if (!data.userId) {
        setError('Invalid QR code: Missing user ID');
        toast.error('Invalid QR code: Missing user ID');
        setLoading(false);
        return;
      }

      // Try to get user from API
      try {
        const response = await axios.get(`http://localhost:8000/api/admin/users/${data.userId}`, {
          withCredentials: true
        });

        if (response.data) {
          setMember(response.data);

          // Add to scan history
          const scanRecord = {
            id: Date.now(),
            timestamp: new Date(),
            user: response.data,
            status: response.data.membership === 'paid' ? 'Valid' : 'Invalid'
          };

          setScanHistory(prev => [scanRecord, ...prev].slice(0, 10)); // Keep last 10 scans

          if (response.data.membership === 'paid') {
            toast.success('Valid membership!');
          } else {
            toast.warning('Membership is not active');
          }
        }
      } catch (apiError) {
        console.error('API error, falling back to service:', apiError);
        // Fallback to member service
        try {
          const memberData = await memberService.getMemberById(data.userId);
          setMember(memberData);

          // Add to scan history
          const scanRecord = {
            id: Date.now(),
            timestamp: new Date(),
            user: memberData,
            status: memberData.membership === 'paid' ? 'Valid' : 'Invalid'
          };

          setScanHistory(prev => [scanRecord, ...prev].slice(0, 10)); // Keep last 10 scans

          if (memberData.membership === 'paid') {
            toast.success('Valid membership!');
          } else {
            toast.warning('Membership is not active');
          }
        } catch (serviceError) {
          setError('Member not found');
          toast.error('Member not found');
        }
      }
    } catch (error) {
      setError('Error validating QR code');
      toast.error('Error validating QR code');
      console.error('Error validating QR code:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetScanner = () => {
    setMember(null);
    setScanResult(null);
    setError(null);

    // Reinitialize scanner
    const scanner = new Html5QrcodeScanner('reader', {
      qrbox: {
        width: 250,
        height: 250,
      },
      fps: 5,
    });

    scanner.render(
      async (result) => {
        scanner.clear();
        setScanResult(result);
        await validateQRCode(result);
      },
      (err) => {
        console.warn(err);
      }
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">QR Code Scanner</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Scan Member QR Code</h2>
            <div id="reader" className="w-full max-w-md mx-auto"></div>

            {loading && (
              <div className="flex justify-center mt-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
              </div>
            )}

            {error && (
              <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-md">
                {error}
              </div>
            )}

            {member && (
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-gray-900">Member Information</h2>
                  <button
                    onClick={resetScanner}
                    className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700"
                  >
                    Scan Again
                  </button>
                </div>
                <div className="mt-2 space-y-3">
                  <p><span className="font-medium">Name:</span> {member.name}</p>
                  <p><span className="font-medium">Email:</span> {member.email}</p>
                  <p><span className="font-medium">ID:</span> {member._id}</p>
                  <p><span className="font-medium">Role:</span> {member.role}</p>
                  <p>
                    <span className="font-medium">Membership Status:</span>
                    <span className={`ml-2 px-2 py-1 rounded-full text-sm ${member.membership === 'paid'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                      }`}>
                      {member.membership || 'Not Paid'}
                    </span>
                  </p>
                  {member.membershipExpiry && (
                    <p><span className="font-medium">Expires:</span> {new Date(member.membershipExpiry).toLocaleDateString()}</p>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Scans</h2>
            {scanHistory.length === 0 ? (
              <div className="text-center py-8 text-gray-500">No scan history available</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Time
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {scanHistory.map((scan) => (
                      <tr key={scan.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">
                            {scan.timestamp.toLocaleTimeString()}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {scan.user.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {scan.user.email}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${scan.status === 'Valid' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {scan.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRCodeScanner;