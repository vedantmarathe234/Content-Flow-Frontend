import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../services/api';
import { FiEdit2, FiTrash2, FiArrowLeft } from 'react-icons/fi';
import toast from 'react-hot-toast';

const CreateDepartment = () => {
    const navigate = useNavigate();
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(true);

    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);

    const [formData, setFormData] = useState({ name: '', secretKey: '' });
    const [editData, setEditData] = useState({ id: '', name: '', secretKey: '' });

    const loadDepartments = async () => {
        try {
            setLoading(true);
            const response = await API.get('/departments/all');
            const depts = response.data;

            const detailedDepartments = await Promise.all(
                depts.map(async (dept) => {
                    try {
                        const detailRes = await API.get(`/departments/${dept.id}/details`);
                        return {
                            ...dept,
                            internCount: detailRes.data.interns?.length || 0,
                            teamsCount: detailRes.data.teams?.length || 0
                        };
                    } catch (err) {
                        return { ...dept, internCount: 0, teamsCount: 0 };
                    }
                })
            );

            setDepartments(detailedDepartments);
        } catch (err) {
            console.error("Error loading departments:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadDepartments();
    }, []);

    const handleCreateSubmit = async (e) => {
        e.preventDefault();
        const isDuplicate = departments.some(
            (dept) => dept.name.toLowerCase() === formData.name.toLowerCase()
        );

        if (isDuplicate) {
            toast.error("Department already exists!");
            return;
        }

        try {
            await API.post('/departments/create', formData);
            toast.success("Department added successfully!");
            setIsCreateOpen(false);
            setFormData({ name: '', secretKey: '' });
            loadDepartments();
        } catch (err) {
            console.error(err);
            toast.error("Failed to add department!");
        }
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        const isDuplicate = departments.some(
            (dept) => dept.name.toLowerCase() === editData.name.toLowerCase() && dept.id !== editData.id
        );

        if (isDuplicate) {
            toast.error("Department already exists!");
            return;
        }

        try {
            await API.put(`/departments/update/${editData.id}`, { 
                name: editData.name, 
                secretKey: editData.secretKey 
            });
            toast.success("Department updated successfully!");
            setIsEditOpen(false);
            loadDepartments();
        } catch (err) {
            console.error(err);
            toast.error("Failed to update department!");
        }
    };

    const handleDelete = async (id) => {
        try {
            await API.delete(`/departments/delete/${id}`);
            toast.success("Department deleted successfully!");
            loadDepartments();
        } catch (err) {
            console.error(err);
            toast.error("Failed to delete department!");
        }
    };

    const openEditModal = (id, name, secretKey) => {
        setEditData({ id, name, secretKey });
        setIsEditOpen(true);
    };

    return (
        <div className="w-full font-sans text-slate-800">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                    <button 
                        onClick={() => navigate(-1)} 
                        className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                    >
                        <FiArrowLeft size={20} />
                    </button>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Departments</h1>
                </div>
                <button 
                    onClick={() => setIsCreateOpen(true)} 
                    className="bg-[#4f46e5] hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg text-sm transition-all flex items-center gap-1.5 shadow-sm cursor-pointer"
                >
                    <span className="text-lg font-light">+</span> Add Department
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 text-slate-400 text-[11px] uppercase tracking-wider font-semibold border-b border-slate-200">
                                <th className="py-3.5 px-6">Department Name</th>
                                <th className="py-3.5 px-6">Secret Key</th>
                                <th className="py-3.5 px-6">Teams</th>
                                <th className="py-3.5 px-6">Members</th>
                                <th className="py-3.5 px-6 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm divide-y divide-slate-100 text-slate-600 font-medium">
                            {loading ? (
                                <tr><td colSpan="5" className="p-8 text-center text-slate-400">Loading...</td></tr>
                            ) : departments.map((dept) => (
                                <tr 
                                    key={dept.id} 
                                    className="hover:bg-slate-50/80 transition-colors cursor-pointer"
                                    onClick={() => navigate(`/admin/department/${dept.id}`)}
                                >
                                    <td className="py-4 px-6 text-slate-900 font-semibold">{dept.name}</td>
                                    <td className="py-4 px-6 font-mono text-xs text-slate-500 uppercase tracking-wide">{dept.secretKey || "N/A"}</td>
                                    <td className="py-4 px-6 text-slate-500">{dept.teamsCount}</td>
                                    <td className="py-4 px-6 text-slate-500">{dept.internCount}</td>
                                    <td className="py-4 px-6 text-center" onClick={(e) => e.stopPropagation()}>
                                        <div className="flex items-center justify-center gap-3">
                                            <button onClick={() => openEditModal(dept.id, dept.name, dept.secretKey)} className="text-indigo-600 hover:text-indigo-800 transition-colors">
                                                <FiEdit2 size={18} />
                                            </button>
                                            <button onClick={() => handleDelete(dept.id)} className="text-red-500 hover:text-red-700 transition-colors">
                                                <FiTrash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {isCreateOpen && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <form onSubmit={handleCreateSubmit} className="bg-white p-6 rounded-xl w-full max-w-md shadow-xl border border-slate-100 space-y-4">
                        <h3 className="text-lg font-bold">Add New Department</h3>
                        <input type="text" placeholder="Name" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full p-2 border rounded-lg" />
                        <input type="text" placeholder="Secret Key" required value={formData.secretKey} onChange={(e) => setFormData({...formData, secretKey: e.target.value})} className="w-full p-2 border rounded-lg" />
                        <div className="flex justify-end gap-2">
                            <button type="button" onClick={() => setIsCreateOpen(false)} className="px-4 py-2 bg-slate-100 rounded-lg">Cancel</button>
                            <button type="submit" className="px-4 py-2 bg-[#4f46e5] text-white rounded-lg">Add</button>
                        </div>
                    </form>
                </div>
            )}

            {isEditOpen && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <form onSubmit={handleEditSubmit} className="bg-white p-6 rounded-xl w-full max-w-md shadow-xl border border-slate-100 space-y-4">
                        <h3 className="text-lg font-bold">Edit Department</h3>
                        <input type="text" value={editData.name} onChange={(e) => setEditData({...editData, name: e.target.value})} className="w-full p-2 border rounded-lg" />
                        <input type="text" value={editData.secretKey} onChange={(e) => setEditData({...editData, secretKey: e.target.value})} className="w-full p-2 border rounded-lg" />
                        <div className="flex justify-end gap-2">
                            <button type="button" onClick={() => setIsEditOpen(false)} className="px-4 py-2 bg-slate-100 rounded-lg">Cancel</button>
                            <button type="submit" className="px-4 py-2 bg-[#4f46e5] text-white rounded-lg">Save</button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

export default CreateDepartment;