import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { QRCodeSVG } from 'qrcode.react';
import authService from '../../services/authService';

const UserDashboard = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                if (!authService.isAuthenticated()) {
                    navigate('/login');
                    return;
                }

                const userData = await authService.getProfile();
                setUser(userData);
            } catch (error) {
                console.error('Error fetching user data:', error);
                toast.error('Failed to fetch user data');
                navigate('/login');
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [navigate]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
        );
    }

    if (!user) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="bg-white shadow rounded-lg p-6">
                    <div className="flex flex-col md:flex-row items-center justify-between">
                        <div className="mb-6 md:mb-0">
                            <h2 className="text-2xl font-bold text-gray-900">Welcome, {user.name}</h2>
                            <p className="text-gray-600">Email: {user.email}</p>
                            <p className="text-gray-600">Role: {user.role}</p>
                        </div>
                        <div className="bg-white p-4 rounded-lg shadow">
                            <QRCodeSVG
                                value={JSON.stringify({
                                    userId: user._id,
                                    name: user.name,
                                    email: user.email
                                })}
                                size={200}
                                level="H"
                                includeMargin={true}
                            />
                            <p className="mt-2 text-center text-sm text-gray-600">
                                Your Membership QR Code
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserDashboard; 