import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../../services/api';
import { FiArrowLeft } from 'react-icons/fi';

const DepartmentDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [details, setDetails] = useState({ 
        departmentName: "Loading...", 
        interns: [], 
        teams: [] 
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const response = await API.get(`/departments/${id}/details`);
                setDetails(response.data);
            } catch (err) {
                console.error("Error fetching department details:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchDetails();
    }, [id]);

    if (loading) return <div className="p-8">Loading...</div>;

    return (
        <div className="p-8">
            <div className="flex items-center gap-4 mb-8">
                <button 
                    onClick={() => navigate(-1)} 
                    className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                >
                    <FiArrowLeft size={24} />
                </button>
                <h1 className="text-3xl font-bold text-slate-900">{details.departmentName}</h1>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                    <h2 className="font-bold text-lg mb-6 text-slate-800">Interns ({details.interns ? details.interns.length : 0})</h2>
                    {details.interns && details.interns.length > 0 ? (
                        <div className="space-y-4">
                            {details.interns.map((i) => (
                                <div key={i.id} className="flex items-center gap-4 py-2 border-b border-slate-50 last:border-0">
                                    <img 
                                        src={i.profilePhotoUrl || '/default-avatar.png'} 
                                        alt={i.name} 
                                        className="w-10 h-10 rounded-full object-cover border border-slate-200"
                                        onError={(e) => { e.target.src = '/default-avatar.png'; }}
                                    />
                                    <div>
                                        <p className="font-semibold text-slate-900">{i.name}</p>
                                        <p className="text-sm text-slate-500">{i.email}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-slate-500 italic">No interns registered.</p>
                    )}
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                    <h2 className="font-bold text-lg mb-6 text-slate-800">Teams ({details.teams ? details.teams.length : 0})</h2>
                    {details.teams && details.teams.length > 0 ? (
                        <ul className="space-y-2">
                            {details.teams.map((t) => (
                                <li key={t.id} className="p-3 bg-slate-50 rounded-lg text-slate-700 font-medium">
                                    {t.name}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-slate-500 italic">No teams available.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DepartmentDetails;