import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../../services/api';
import { FiArrowLeft, FiSearch, FiEdit2 } from 'react-icons/fi';
import { Trash2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import TeamModal from './TeamModal';

const DepartmentDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const userRole = localStorage.getItem("role");

    const [details, setDetails] = useState({ departmentName: 'Loading...', interns: [] });
    const [allTeams, setAllTeams] = useState([]);
    const [loading, setLoading] = useState(true);
    const [internSearch, setInternSearch] = useState('');
    const [teamSearch, setTeamSearch] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentTeam, setCurrentTeam] = useState(null);

    const fetchData = async () => {
        try {
            const deptRes = await API.get(`/departments/${id}/details`);
            setDetails(deptRes.data);
            const teamsRes = await API.get('/teams/all');
            setAllTeams(teamsRes.data);
        } catch (err) {
            console.error('Error fetching details:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchData(); }, [id]);

    const handleDelete = async (teamId) => {
        if (window.confirm("Are you sure you want to delete this team?")) {
            try {
                await API.delete(`/teams/${teamId}`);
                toast.success("Team deleted successfully");
                fetchData();
            } catch (error) {
                toast.error("Failed to delete team");
            }
        }
    };

    const filteredInterns = details.interns.filter((i) => i.name.toLowerCase().includes(internSearch.toLowerCase()));
    const filteredTeams = allTeams.filter((t) => t.departmentId == id && t.name.toLowerCase().includes(teamSearch.toLowerCase()));

    if (loading) return <div className="p-8">Loading...</div>;

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-800 ">
            <div className="flex items-center mb-6">
                <button onClick={() => navigate(-1)} className="p-2 hover:bg-slate-100 rounded-full transition-colors mr-4">
                    <FiArrowLeft size={20} />
                </button>
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{details.departmentName}</h1>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 h-[calc(100vh-140px)]">
                
                <div className="xl:col-span-6 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">
                    <div className="flex justify-between items-center mb-6 flex-shrink-0">
                        <h2 className="font-bold text-lg">Interns ({filteredInterns.length})</h2>
                        <div className="flex items-center bg-slate-100 px-4 py-2 rounded-lg border border-slate-200">
                            <FiSearch className="text-slate-400 mr-2" />
                            <input placeholder="Search interns..." className="bg-transparent outline-none text-sm w-48" onChange={(e) => setInternSearch(e.target.value)} />
                        </div>
                    </div>
            
                    <div className="grid grid-cols-2 gap-4 overflow-y-auto pr-2 custom-scrollbar">
                        {filteredInterns.map((i) => (
                            <div key={i.id} className="w-full p-2 rounded-xl border border-slate-200 bg-white shadow-sm flex items-center gap-3">
                               {i.profilePhotoUrl ? (
    <img
        src={`http://localhost:8080/uploads/${i.profilePhotoUrl}`}
        alt={i.name}
        className="w-10 h-10 rounded-full border border-slate-200 object-cover flex-shrink-0"
         />
        ) : (
        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-600 border border-slate-200 flex-shrink-0">
        {i.name?.charAt(0)}
               </div>
        )}
                                <div className="min-w-0">
                                    <p className="font-semibold text-sm truncate">{i.name}</p>
                                    <p className="text-xs text-slate-500 truncate">{i.email}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            
                <div className="xl:col-span-6 flex flex-col overflow-hidden">
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm h-full flex flex-col">
                        <div className="flex justify-between items-center mb-6 flex-shrink-0">
                            <h2 className="font-bold text-lg">Teams ({filteredTeams.length})</h2>
                            <div className="flex items-center bg-slate-100 px-4 py-2 rounded-lg border border-slate-200">
                                <FiSearch className="text-slate-400 mr-2" />
                                <input placeholder="Search teams..." className="bg-transparent outline-none text-sm w-32" onChange={(e) => setTeamSearch(e.target.value)} />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 overflow-y-auto pr-2 custom-scrollbar">
                            {filteredTeams.map((team) => {
                                const sortedMembers = team.memberNames
  ? team.memberNames.map((name, index) => ({
      name,
      photo: team.memberPhotoUrls?.[index] || null,
    }))
  : [];

sortedMembers.sort((a, b) => {
  if (a.name === team.teamLeaderName) return -1;
  if (b.name === team.teamLeaderName) return 1;
  return 0;
});
                                return (
                                    <div key={team.id} className="w-full p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col">
                                        <div className="flex justify-between items-start mb-3">
                                            <div className="min-w-0">
                                                <h3 className="text-sm font-bold text-slate-900 truncate">{team.name}</h3>
                                                <p className="text-[10px] text-blue-600 font-medium uppercase mt-0.5 truncate">{team.departmentName}</p>
                                            </div>
                                            {userRole === "ADMIN" && (
                                                <div className="flex items-center gap-2 flex-shrink-0">
                                                    <button onClick={() => { setCurrentTeam(team); setIsModalOpen(true); }} className="text-indigo-600 hover:text-indigo-800"><FiEdit2 size={16} /></button>
                                                    <button onClick={() => handleDelete(team.id)} className="text-red-500 hover:text-red-700"><Trash2 size={16} /></button>
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex flex-col gap-1.5">
                                                {sortedMembers.map((member, i) => (
                                                <div key={i} className="flex items-center gap-2">
                                                   {member.photo ? (
                                                   
                                 <img
                                            src={`http://localhost:8080/uploads/${member.photo}`}
                                            alt={member.name}
                                               className="w-6 h-6 rounded-full object-cover border border-slate-200 flex-shrink-0"
                                                    />
                                                  ) : (
                                                 <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-[9px] font-bold text-slate-600 uppercase border border-slate-200 flex-shrink-0">
                                                   {member.name?.charAt(0)}
                                                   </div>
                                                           )}
                                                    <div className="min-w-0">
                                                        <span className="text-xs font-medium text-slate-700 truncate block">{member.name}</span>
                                                        {member.name === team?.teamLeaderName && <span className="text-[8px] text-green-600 font-bold uppercase">Leader</span>}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>

            {userRole === "ADMIN" && isModalOpen && <TeamModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} team={currentTeam} onRefresh={fetchData} />}
        </div>
    );
};

export default DepartmentDetails;