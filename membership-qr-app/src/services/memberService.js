import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

const memberService = {
    getAllMembers: async () => {
        try {
            const response = await axios.get(`${API_URL}/members`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Error fetching members' };
        }
    },

    getMemberById: async (id) => {
        try {
            const response = await axios.get(`${API_URL}/members/${id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Error fetching member' };
        }
    },

    createMember: async (memberData) => {
        try {
            const response = await axios.post(`${API_URL}/members`, memberData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                }
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Error creating member' };
        }
    },

    updateMember: async (id, memberData) => {
        try {
            const response = await axios.put(`${API_URL}/members/${id}`, memberData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                }
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Error updating member' };
        }
    },

    deleteMember: async (id) => {
        try {
            const response = await axios.delete(`${API_URL}/members/${id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Error deleting member' };
        }
    },

    updateMemberStatus: async (id, status) => {
        try {
            const response = await axios.patch(
                `${API_URL}/members/${id}/status`,
                { status },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Error updating member status' };
        }
    }
};

export default memberService; 