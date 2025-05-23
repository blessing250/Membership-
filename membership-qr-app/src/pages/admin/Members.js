import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import authService from '../../services/authService';
import memberService from '../../services/memberService';
import axios from 'axios';

const Members = () => {
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState('all'); // 'all', 'paid', 'not paid'
    const navigate = useNavigate();

    useEffect(() => {
        const fetchMembers = async () => {
            try {
                if (!authService.isAuthenticated() || !authService.isAdmin()) {
                    navigate('/login');
                    return;
                }

                // Try to get users from API
                try {
                    const response = await axios.get('http://localhost:8000/api/auth/all-users', {
                        withCredentials: true
                    });
                    
                    if (response.data) {
                        setMembers(response.data);
                    }
                } catch (apiError) {
                    console.error('API error, falling back to service:', apiError);
                    // Fallback to member service if API fails
                    const data = await memberService.getAllMembers();
                    setMembers(data);
                }
            } catch (error) {
                console.error('Error fetching members:', error);
                setError('Failed to fetch members');
                toast.error('Failed to fetch members');
            } finally {
                setLoading(false);
            }
        };

        fetchMembers();
    }, [navigate]);

    const handleDeleteMember = async (memberId) => {
        if (!window.confirm('Are you sure you want to delete this member?')) {
            return;
        }

        try {
            // Try API first
            try {
                await axios.delete(`http://localhost:8000/api/admin/users/${memberId}`, {
                    withCredentials: true
                });
            } catch (apiError) {
                console.error('API error, falling back to service:', apiError);
                // Fallback to service
                await memberService.deleteMember(memberId);
            }
            
            setMembers(members.filter(member => member._id !== memberId));
            toast.success('Member deleted successfully');
        } catch (error) {
            console.error('Error deleting member:', error);
            toast.error('Failed to delete member');
        }
    };
    
    const handleUpdateMemberRole = async (memberId, newRole) => {
        try {
            await axios.patch(`http://localhost:8000/api/auth/${memberId}/role`, 
                { role: newRole },
                { withCredentials: true }
            );
            
            // Update local state
            setMembers(members.map(member => 
                member._id === memberId ? { ...member, role: newRole } : member
            ));
            
            toast.success(`User role updated to ${newRole}`);
        } catch (error) {
            console.error('Error updating member role:', error);
            toast.error('Failed to update member role');
        }
    };
    
    // Filter members based on search term and membership filter
    const filteredMembers = members.filter(member => {
        const matchesSearch = 
            member.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
            member.email?.toLowerCase().includes(searchTerm.toLowerCase());
            
        if (filter === 'all') return matchesSearch;
        if (filter === 'paid') return matchesSearch && member.membership === 'paid';
        if (filter === 'not paid') return matchesSearch && member.membership !== 'paid';
        
        return matchesSearch;
    });

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="text-red-500">{error}</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="bg-white shadow rounded-lg p-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">Members Management</h2>
                            <p className="text-gray-600">Manage all member accounts</p>
                        </div>
                        <div className="mt-4 md:mt-0 flex flex-col sm:flex-row gap-4">
                            <div>
                                <input
                                    type="text"
                                    placeholder="Search by name or email"
                                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md p-2"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <div>
                                <select
                                    className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                                    value={filter}
                                    onChange={(e) => setFilter(e.target.value)}
                                >
                                    <option value="all">All Members</option>
                                    <option value="paid">Paid Members</option>
                                    <option value="not paid">Unpaid Members</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {loading ? (
                        <div className="flex justify-center items-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
                        </div>
                    ) : error ? (
                        <div className="text-center py-6 text-red-500">{error}</div>
                    ) : filteredMembers.length === 0 ? (
                        <div className="text-center py-6 text-gray-500">
                            {searchTerm ? 'No members found matching your search.' : 'No members found.'}
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Name
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Email
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Role
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Membership
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Expiry
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {filteredMembers.map((member) => (
                                        <tr key={member._id}>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">
                                                    {member.name}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-500">
                                                    {member.email}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${member.role === 'admin'
                                                        ? 'bg-purple-100 text-purple-800'
                                                        : 'bg-green-100 text-green-800'
                                                        }`}>
                                                        {member.role}
                                                    </span>
                                                    {member.role !== 'admin' && (
                                                        <button
                                                            onClick={() => handleUpdateMemberRole(member._id, 'admin')}
                                                            className="ml-2 text-xs text-indigo-600 hover:text-indigo-900"
                                                        >
                                                            Make Admin
                                                        </button>
                                                    )}
                                                    {member.role === 'admin' && (() => {
                                                        const currentUser = authService.getCurrentUser();
                                                        return currentUser && member._id !== currentUser.id;
                                                    })() && (
                                                        <button
                                                            onClick={() => handleUpdateMemberRole(member._id, 'user')}
                                                            className="ml-2 text-xs text-indigo-600 hover:text-indigo-900"
                                                        >
                                                            Make User
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${member.membership === 'paid'
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-red-100 text-red-800'
                                                    }`}>
                                                    {member.membership || 'not paid'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-500">
                                                    {member.membershipExpiry ? new Date(member.membershipExpiry).toLocaleDateString() : 'N/A'}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <button
                                                    onClick={() => handleDeleteMember(member._id)}
                                                    className="text-red-600 hover:text-red-900 mr-4"
                                                >
                                                    Delete
                                                </button>
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
    );
};

export default Members;