import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

const authService = {
    login: async (email, password) => {
        try {
            const response = await axios.post(`${API_URL}/auth/login`,
                { email, password },
                { withCredentials: true }
            );
            if (response.data.user) {
                localStorage.setItem('user', JSON.stringify(response.data.user));
            }
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Error logging in' };
        }
    },

    register: async (name, email, password) => {
        try {
            const response = await axios.post(`${API_URL}/auth/register`,
                { name, email, password },
                { withCredentials: true }
            );
            if (response.data.user) {
                localStorage.setItem('user', JSON.stringify(response.data.user));
            }
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Registration failed' };
        }
    },

    logout: async () => {
        try {
            await axios.post(`${API_URL}/auth/logout`, {}, { withCredentials: true });
            localStorage.removeItem('user');
        } catch (error) {
            console.error('Logout error:', error);
        }
    },

    getCurrentUser: () => {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    },

    isAuthenticated: () => {
        return localStorage.getItem('user') !== null;
    },

    getProfile: async () => {
        try {
            const response = await axios.get(`${API_URL}/auth/profile`, {
                withCredentials: true
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Error fetching profile' };
        }
    },

    hasRole: (requiredRole) => {
        const user = authService.getCurrentUser();
        return user?.role === requiredRole;
    },

    isAdmin: () => {
        return authService.hasRole('admin');
    },
    
    getCurrentUserId: () => {
        const user = authService.getCurrentUser();
        return user?.id || null;
    }
};

export default authService;