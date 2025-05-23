import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import {
  ChartBarIcon,
  UserGroupIcon,
  QrCodeIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  CogIcon,
  BellIcon
} from '@heroicons/react/24/outline';

const AdminDashboard = () => {
  const { currentUser } = useAuth();
  const [stats, setStats] = useState({
    totalMembers: 0,
    activeMembers: 0,
    pendingApprovals: 0,
    monthlyRevenue: 0
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        // Fetch stats data
        const statsResponse = await axios.get('http://localhost:8000/api/auth/stats', {
          withCredentials: true
        });
        
        if (statsResponse.data) {
          setStats({
            totalMembers: statsResponse.data.totalMembers || 0,
            activeMembers: statsResponse.data.paidMembers || 0,
            pendingApprovals: statsResponse.data.unpaidMembers || 0,
            monthlyRevenue: statsResponse.data.totalRevenue || 0
          });
        }
        
        // Fetch recent activity
        try {
          const activityResponse = await axios.get('http://localhost:8000/api/auth/stats', {
            withCredentials: true
          });
          
          // If we have recent users from the stats endpoint, format them for display
          if (activityResponse.data && activityResponse.data.recentUsers) {
            const formattedActivity = activityResponse.data.recentUsers.map((user, index) => ({
              id: index,
              action: 'User registered',
              time: new Date(user.createdAt).toLocaleString(),
              user: user.name
            }));
            setRecentActivity(formattedActivity);
          }
        } catch (activityError) {
          console.error('Error fetching activity data:', activityError);
          // Activity error is non-critical, so we continue
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        toast.error('Failed to fetch dashboard data');
        // Set fallback data for development
        setStats({
          totalMembers: 150,
          activeMembers: 120,
          pendingApprovals: 5,
          monthlyRevenue: 2500
        });
        setRecentActivity([
          { id: 1, action: 'New member registration', time: '2 minutes ago', user: 'John Doe' },
          { id: 2, action: 'Membership approved', time: '15 minutes ago', user: 'Jane Smith' },
          { id: 3, action: 'Payment received', time: '1 hour ago', user: 'Mike Johnson' },
          { id: 4, action: 'Class booking', time: '2 hours ago', user: 'Sarah Wilson' }
        ]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);

  const StatCard = ({ title, value, icon: Icon, color }) => (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex items-center">
        <div className={`p-3 rounded-full ${color} bg-opacity-10`}>
          <Icon className={`h-6 w-6 ${color}`} />
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-semibold text-gray-900">{value}</p>
        </div>
      </div>
    </div>
  );

  const QuickAction = ({ title, description, icon: Icon, to, color }) => (
    <Link
      to={to}
      className={`p-6 rounded-lg shadow-md transition-all hover:shadow-lg ${color} text-white`}
    >
      <div className="flex items-center">
        <Icon className="h-8 w-8" />
        <div className="ml-4">
          <h3 className="text-lg font-semibold">{title}</h3>
          <p className="text-sm opacity-80">{description}</p>
        </div>
      </div>
    </Link>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="mt-2 text-sm text-gray-600">
          Welcome back, {currentUser?.name}
        </p>
      </div>

      {/* Stats Overview */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Members"
            value={stats.totalMembers}
            icon={UserGroupIcon}
            color="text-blue-500"
          />
          <StatCard
            title="Paid Members"
            value={stats.activeMembers}
            icon={ChartBarIcon}
            color="text-green-500"
          />
          <StatCard
            title="Unpaid Members"
            value={stats.pendingApprovals}
            icon={BellIcon}
            color="text-yellow-500"
          />
          <StatCard
            title="Total Revenue"
            value={`RWF ${stats.monthlyRevenue}`}
            icon={CurrencyDollarIcon}
            color="text-purple-500"
          />
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <QuickAction
          title="Scan QR Code"
          description="Verify member access and approve memberships"
          icon={QrCodeIcon}
          to="/admin/scanner"
          color="bg-primary"
        />
        <QuickAction
          title="Manage Members"
          description="View and manage all member accounts"
          icon={UserGroupIcon}
          to="/admin/members"
          color="bg-secondary"
        />
        <QuickAction
          title="Schedule"
          description="View and manage class schedules"
          icon={CalendarIcon}
          to="/admin/schedule"
          color="bg-green-500"
        />
        <QuickAction
          title="Settings"
          description="Configure system settings"
          icon={CogIcon}
          to="/admin/settings"
          color="bg-gray-600"
        />
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
        <div className="space-y-4">
          {recentActivity.length > 0 ? (
            recentActivity.map(activity => (
              <div key={activity.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">{activity.action}</p>
                  <p className="text-sm text-gray-500">by {activity.user}</p>
                </div>
                <span className="text-sm text-gray-400">{activity.time}</span>
              </div>
            ))
          ) : (
            <div className="text-center py-4 text-gray-500">No recent activity found</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;