import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Layout from './components/layout/Layout';
import Login from './pages/Login';
import AdminDashboard from './pages/admin/AdminDashboard';
import Members from './pages/admin/Members';
import QRCodeScanner from './components/qr/QRCodeScanner';
import NotFound from './pages/NotFound';
import AdminNavbar from './components/layout/AdminNavbar';
import Home from './pages/Home';
import Signup from './pages/Signup';
import UserDashboard from './pages/user/UserDashboard';

const AdminLayout = ({ children }) => (
  <div className="min-h-screen bg-gray-50">
    <AdminNavbar />
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <main className="py-8">
        {children}
      </main>
    </div>
  </div>
);


function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route element={<Layout />}>
            {/* Public routes */}
            <Route index element={<Home />} />
            <Route path="login" element={<Login />} />
            <Route path="signup" element={<Signup />} />

            {/* Protected routes */}
            <Route
              path="user/dashboard"
              element={
                <ProtectedRoute allowedRoles={['user', 'admin']}>
                  <UserDashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminLayout>
                    <AdminDashboard />
                  </AdminLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="admin/members"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminLayout>
                    <Members />
                  </AdminLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="admin/scanner"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminLayout>
                    <QRCodeScanner />
                  </AdminLayout>
                </ProtectedRoute>
              }
            />

            {/* Catch all route */}
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </AuthProvider>
    </Router>
  );
}

export default App; 