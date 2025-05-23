import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { QRCodeSVG } from "qrcode.react";
import authService from "../../services/authService";
import { FlutterWaveButton, closePaymentModal } from "flutterwave-react-v3";
import { public_key } from "./key";
import axios from "axios";
import Cookies from "js-cookie";

const UserDashboard = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (!authService.isAuthenticated()) {
          navigate("/login");
          return;
        }

        const userData = await authService.getProfile();
        setUser(userData);
      } catch (error) {
        console.error("Error fetching user data:", error);
        toast.error("Failed to fetch user data");
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  const handlePaymentSuccess = async (response) => {
    if (response.status === "successful") {
      try {
        const res = await axios.patch(
          `http://localhost:8000/api/auth/${user._id}/membership`,
          {}, // No body needed
          {
            withCredentials: true,
            headers: {
              Authorization: `Bearer ${Cookies.get("token")}`,
            },
          }
        );

        toast.success("Membership upgraded successfully!");
        setUser(res.data.user || { ...user, membership: "paid" });
      } catch (error) {
        console.error("Error updating membership:", error);
        toast.error("Failed to update membership.");
      }
    } else {
      toast.error("Payment was not successful.");
    }

    closePaymentModal();
  };

  const config = {
    public_key,
    tx_ref: `tx_${Date.now()}_membership`,
    amount: 100,
    currency: "RWF",
    payment_options: "card,mobilemoney,ussd",
    customer: {
      email: user?.email,
      name: user?.name,
    },
    customizations: {
      title: "Membership Plan",
      description: "Upgrade to a paid membership",
      logo: "https://st2.depositphotos.com/4403291/7418/v/450/depositphotos_74189661-stock-illustration-online-shop-log.jpg",
    },
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-6 md:mb-0">
              <h2 className="text-2xl font-bold text-gray-900 md:flex hidden">
                Welcome, {user.name}
              </h2>
              <p className="text-gray-600">Email: {user.email}</p>
              <p className="text-gray-600">Role: {user.role}</p>
              
              {user.role === 'admin' && (
                <div className="mt-2">
                  <Link 
                    to="/admin"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Go to Admin Panel
                  </Link>
                </div>
              )}

              {user.membership !== "paid" ? (
                <div className="mt-4">
                  <FlutterWaveButton
                    {...config}
                    text="Upgrade Membership"
                    callback={handlePaymentSuccess}
                    onClose={() => toast.info("Payment popup closed")}
                    className="w-full text-white py-2 px-4 rounded-lg bg-[#7A26C1] hover:bg-black transition duration-300"
                  />
                </div>
              ) : (
                <div className="mt-4">
                  <p className="text-green-600 font-semibold">
                    Your membership is paid!
                  </p>
                </div>
              )}
            </div>

            <div className="bg-white p-4 rounded-lg shadow">
              <QRCodeSVG
                value={JSON.stringify({
                  userId: user._id,
                  name: user.name,
                  email: user.email,
                  membership: user.membership,
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
