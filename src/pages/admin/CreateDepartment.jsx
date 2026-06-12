import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../services/api';
import { FiEdit2, FiTrash2, FiArrowLeft } from 'react-icons/fi';
import toast from 'react-hot-toast';

const CreateDepartment = () => {
    const navigate = useNavigate();
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isProcessing, setIsProcessing] = useState(false);

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

        setIsProcessing(true);
        try {
            await API.post('/departments/create', formData);
            toast.success("Department added successfully!");
            setIsCreateOpen(false);
            setFormData({ name: '', secretKey: '' });
            loadDepartments();
        } catch (err) {
            console.error(err);
            toast.error("Failed to add department!");
        } finally {
            setIsProcessing(false);
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

        setIsProcessing(true);
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
        } finally {
            setIsProcessing(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this department?")) return;
        
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
        <div className="w-full font-sans text-slate-800 p-2 min-h-screen bg-slate-50/50">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                    <button 
                        onClick={() => navigate(-1)} 
                        className="p-2 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
                    >
                        <FiArrowLeft size={20} className="text-[#063A3A]" />
                    </button>
                    <h1 className="text-2xl font-bold text-[#063A3A] tracking-tight">Departments</h1>
                </div>
                <button 
                    onClick={() => setIsCreateOpen(true)} 
                    className="bg-[#063A3A] hover:bg-[#0D7A80] text-white font-semibold py-2 px-4 rounded-xl text-sm transition-all flex items-center gap-1.5 shadow-sm cursor-pointer"
                >
                    <span className="text-lg font-light">+</span> Add Department
                </button>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-[#063A3A]/40 text-[#063A3A] text-[11px] uppercase tracking-wider font-bold border-b border-slate-200/60">
                                <th className="py-4 px-6 text-center">Department Name</th>
                                <th className="py-4 px-6 text-center">Secret Key</th>
                                <th className="py-4 px-6 text-center">Teams</th>
                                <th className="py-4 px-6 text-center">Members</th>
                                <th className="py-4 px-6 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm divide-y divide-slate-100 text-slate-600 font-medium text-center">
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="p-8 text-center text-[#063A3A] font-semibold">Loading...</td>
                                </tr>
                            ) : departments.map((dept) => (
                                <tr 
                                    key={dept.id} 
                                    className="hover:bg-[#0D7A80]/10 transition-colors cursor-pointer border-l-4 border-l-transparent hover:border-l-[#0D7A80]"
                                    onClick={() => navigate(`/admin/department/${dept.id}`)}
                                >
                                    <td className="py-4 px-6 text-[#063A3A] font-bold">{dept.name}</td>
                                    <td className="py-4 px-6 font-mono text-xs text-slate-500 tracking-wide">{dept.secretKey || "N/A"}</td>
                                    <td className="py-4 px-6 text-slate-500">{dept.teamsCount}</td>
                                    <td className="py-4 px-6 text-slate-500">{dept.internCount}</td>
                                    <td className="py-4 px-6 text-center" onClick={(e) => e.stopPropagation()}>
                                        <div className="flex items-center justify-center gap-2">
                                            <div className="flex items-center bg-white shadow-sm border border-slate-100 rounded-lg p-0.5">
                                                <button onClick={() => openEditModal(dept.id, dept.name, dept.secretKey)} className="text-[#0D7A80] hover:text-[#063A3A] p-1.5 hover:bg-slate-50 rounded-md transition-colors cursor-pointer">
                                                    <FiEdit2 size={15} />
                                                </button>
                                                <button onClick={() => handleDelete(dept.id)} className="text-red-500 hover:text-red-700 p-1.5 hover:bg-red-50 rounded-md transition-colors cursor-pointer">
                                                    <FiTrash2 size={15} />
                                                </button>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Create Modal */}
            {isCreateOpen && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <form onSubmit={handleCreateSubmit} className="bg-white p-6 rounded-2xl w-full max-w-md shadow-xl border border-slate-100 space-y-4">
                        <h3 className="text-lg font-bold text-[#063A3A]">Add New Department</h3>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Name</label>
                            <input type="text" placeholder="Department Name" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full p-2.5 border border-slate-200 rounded-xl outline-none focus:border-[#0D7A80] text-sm text-slate-700" />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Secret Key</label>
                            <input type="text" placeholder="Secret Key" required value={formData.secretKey} onChange={(e) => setFormData({...formData, secretKey: e.target.value})} className="w-full p-2.5 border border-slate-200 rounded-xl outline-none focus:border-[#0D7A80] text-sm text-slate-700" />
                        </div>
                        <div className="flex justify-end gap-2 pt-2">
                            <button type="button" onClick={() => setIsCreateOpen(false)} disabled={isProcessing} className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-sm font-semibold transition-colors cursor-pointer">Cancel</button>
                            <button type="submit" disabled={isProcessing} className="px-4 py-2 bg-[#063A3A] hover:bg-[#0D7A80] text-white rounded-xl text-sm font-semibold transition-colors cursor-pointer flex items-center gap-2">
                                {isProcessing ? "Adding..." : "Add"}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Edit Modal */}
            {isEditOpen && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <form onSubmit={handleEditSubmit} className="bg-white p-6 rounded-2xl w-full max-w-md shadow-xl border border-slate-100 space-y-4">
                        <h3 className="text-lg font-bold text-[#063A3A]">Edit Department</h3>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Name</label>
                            <input type="text" value={editData.name} onChange={(e) => setEditData({...editData, name: e.target.value})} className="w-full p-2.5 border border-slate-200 rounded-xl outline-none focus:border-[#0D7A80] text-sm text-slate-700" />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Secret Key</label>
                            <input type="text" value={editData.secretKey} onChange={(e) => setEditData({...editData, secretKey: e.target.value})} className="w-full p-2.5 border border-slate-200 rounded-xl outline-none focus:border-[#0D7A80] font-mono text-sm text-slate-700" />
                        </div>
                        <div className="flex justify-end gap-2 pt-2">
                            <button type="button" onClick={() => setIsEditOpen(false)} disabled={isProcessing} className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-sm font-semibold transition-colors cursor-pointer">Cancel</button>
                            <button type="submit" disabled={isProcessing} className="px-4 py-2 bg-[#063A3A] hover:bg-[#0D7A80] text-white rounded-xl text-sm font-semibold transition-colors cursor-pointer flex items-center gap-2">
                                {isProcessing ? "Saving..." : "Save"}
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

export default CreateDepartment;