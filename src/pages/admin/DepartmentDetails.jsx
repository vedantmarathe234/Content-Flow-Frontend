import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation} from 'react-router-dom';
import API from '../../services/api';
import { FiArrowLeft, FiSearch, FiEdit2 } from 'react-icons/fi';
import { Trash2, AlertTriangle, X } from 'lucide-react';
import { toast } from 'react-hot-toast';
import TeamModal from './TeamModal';

const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, itemName }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[200] bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 font-sans animate-in fade-in duration-200" onClick={onClose}>
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl overflow-hidden border border-l-[4px] border-l-[#0D7A80] border-slate-100 flex flex-col p-6 animate-in zoom-in-95 duration-150" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-end mb-2">
          <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-50 transition-colors cursor-pointer">
            <X size={16} />
          </button>
        </div>
        <div className="mx-auto flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-rose-50 border border-rose-100 text-rose-500 mb-4">
          <AlertTriangle size={22} />
        </div>
        <div className="text-center mb-6">
          <h3 className="text-base font-bold text-slate-900 leading-snug">Delete Team Confirmation</h3>
          <p className="text-xs text-slate-500 font-medium mt-2 leading-relaxed">
            Are you absolutely sure you want to delete <span className="font-bold text-slate-800">"{itemName || "this team"}"</span>? This action is permanent and cannot be undone.
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <button type="button" onClick={onClose} className="flex-1 py-2 px-4 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all cursor-pointer">Cancel</button>
          <button type="button" onClick={onConfirm} className="flex-1 py-2 px-4 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer">
            <Trash2 size={13} /> Delete Team
          </button>
        </div>
      </div>
    </div>
  );
};

const DepartmentDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const userRole = localStorage.getItem("role");

    const [details, setDetails] = useState({ departmentName: 'Loading...', interns: [] });
    const [allTeams, setAllTeams] = useState([]);
    const [loading, setLoading] = useState(true);
    const [internSearch, setInternSearch] = useState('');
    const [teamSearch, setTeamSearch] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentTeam, setCurrentTeam] = useState(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [teamToDelete, setTeamToDelete] = useState(null);


    useEffect(() => {
        if (location.state?.searchInternName) {
            setInternSearch(location.state.searchInternName);
        }
    }, [location.state]);

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

    const handleConfirmDelete = async () => {
        if (!teamToDelete) return;
        try {
            await API.delete(`/teams/${teamToDelete.id}`);
            toast.success("Team deleted successfully");
            fetchData();
        } catch (error) {
            toast.error("Failed to delete team");
        } finally {
            setIsDeleteModalOpen(false);
            setTeamToDelete(null);
        }
    };

   const filteredInterns = details.interns.filter((i) => i.name.toLowerCase().includes(internSearch.toLowerCase()));

const filteredTeams = allTeams.filter((t) => {
    const matchesDept = t.departmentId == id;
    const matchesTeamSearch = t.name.toLowerCase().includes(teamSearch.toLowerCase());
    
    if (internSearch.trim() !== '') {
        const searchTarget = internSearch.toLowerCase().trim();

        const isMember = t.memberNames?.some(name => 
            name && name.toLowerCase().includes(searchTarget)
        );

        const isLeader = t.teamLeaderName && t.teamLeaderName.toLowerCase().includes(searchTarget);
        
        return matchesDept && matchesTeamSearch && (isMember || isLeader);
    }
    
    return matchesDept && matchesTeamSearch;
});
    if (loading) return <div className="p-8">Loading...</div>;

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-800 ">
          <div className="flex items-center mb-6">
    <button 
        onClick={() => {
            if (location.state?.searchInternName) {
                navigate(location.pathname, { replace: true, state: {} });
                setInternSearch('');
            } else {
                navigate(-1);
            }
        }} 
        className="p-2 hover:bg-slate-100 rounded-full transition-colors mr-4"
    >
        <FiArrowLeft size={20} className="text-[#063A3A]" />
    </button>
    <div className="flex items-center gap-3">
        <h1 className="text-2xl font-bold text-[#063A3A] tracking-tight transition-all">
            {internSearch ? internSearch : details.departmentName}
        </h1>
        
        {internSearch && (
            <button 
                onClick={() => {
                    navigate(location.pathname, { replace: true, state: {} });
                    setInternSearch('');
                }}
                className="text-[10px] font-bold bg-[#0D7A80]/10 hover:bg-[#0D7A80]/20 text-[#0D7A80] px-2 py-1 rounded-md transition-colors flex items-center gap-1 cursor-pointer"
                title="Clear filter and view all department data"
            >
                Clear Filter ✕
            </button>
        )}
    </div>
</div>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 h-[calc(100vh-140px)]">
                <div className="xl:col-span-6 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">
                    <div className="flex justify-between items-center mb-6 flex-shrink-0">
                        <h2 className="font-bold text-lg text-[#063A3A]">Interns ({filteredInterns.length})</h2>
                        <div className="flex items-center bg-slate-100 px-4 py-2 rounded-lg border border-slate-200 focus-within:border-[#0D7A80] transition-colors">
                            <FiSearch className="text-slate-400 mr-2" />
                            <input placeholder="Search interns..." className="bg-transparent outline-none text-sm w-48" onChange={(e) => setInternSearch(e.target.value)} />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 overflow-y-auto pr-2 scrollbar scrollbar-thumb-[#0D7A80]/40 custom-scrollbar">
                        {filteredInterns.length > 0 ? (
                            filteredInterns.map((i) => (
                                <div key={i.id} onClick={() => navigate(`/intern-content/${i.id}`)} className="w-full p-2 rounded-xl border border-l-4 border-l-[#0D7A80] border-slate-200 bg-[#0D7A80]/[0.02] shadow-sm flex items-center gap-3 transition-all hover:bg-[#063A3A]/[0.05] hover:shadow-md cursor-pointer">
                                    {i.profilePhotoUrl ? <img src={`http://localhost:8080/uploads/${i.profilePhotoUrl}`} alt={i.name} className="w-10 h-10 rounded-full border border-slate-200 object-cover flex-shrink-0" /> : <div className="w-10 h-10 rounded-full bg-[#063A3A]/5 flex items-center justify-center font-bold text-[#063A3A] border border-[#063A3A]/10 flex-shrink-0">{i.name?.charAt(0)}</div>}
                                    <div className="min-w-0"><p className="font-bold text-sm text-[#063A3A] truncate">{i.name}</p><p className="text-xs text-slate-500 truncate">{i.email}</p></div>
                                </div>
                            ))
                        ) : <p className="text-slate-500 italic p-4">No interns found.</p>}
                    </div>
                </div>

                <div className="xl:col-span-6 flex flex-col overflow-hidden">
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm h-full flex flex-col">
                        <div className="flex justify-between items-center mb-6 flex-shrink-0">
                            <h2 className="font-bold text-lg text-[#063A3A]">Teams ({filteredTeams.length})</h2>
                            <div className="flex items-center bg-slate-100 px-4 py-2 rounded-lg border border-slate-200 focus-within:border-[#0D7A80] transition-colors">
                                <FiSearch className="text-slate-400 mr-2" />
                                <input placeholder="Search teams..." className="bg-transparent outline-none text-sm w-32" onChange={(e) => setTeamSearch(e.target.value)} />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 overflow-y-auto pr-2 scrollbar scrollbar-thumb-[#0D7A80]/40 custom-scrollbar">
                            {filteredTeams.length > 0 ? (
                                filteredTeams.map((team) => {
                                    const sortedMembers = team.memberNames ? team.memberNames.map((name, index) => ({ name, photo: team.memberPhotoUrls?.[index] || null })) : [];
                                    sortedMembers.sort((a, b) => a.name === team.teamLeaderName ? -1 : b.name === team.teamLeaderName ? 1 : 0);
                                    return (
                                        <div key={team.id} onClick={() => navigate(`/team-content/${team.id}`, { state: { teamName: team.name } })} className="w-full p-4 rounded-xl border border-l-4 border-l-[#0D7A80] border-slate-200 bg-[#063A3A]/[0.01] shadow-sm flex flex-col transition-all hover:bg-[#063A3A]/[0.05] hover:shadow-md cursor-pointer">
                                            <div className="flex justify-between items-start mb-3">
                                                <div className="min-w-0"><h3 className="text-sm font-bold text-[#063A3A] truncate">{team.name}</h3><p className="text-[10px] text-[#0D7A80] font-bold uppercase mt-0.5 truncate tracking-wider">{team.departmentName}</p></div>
                                                {userRole === "ADMIN" && (
                                                    <div className="flex items-center gap-3 flex-shrink-0 bg-white p-2 rounded-lg border border-slate-100 shadow-2xs" onClick={(e) => e.stopPropagation()}>
                                                        <button onClick={() => { setCurrentTeam(team); setIsModalOpen(true); }} className="text-[#0D7A80] hover:text-[#063A3A]"><FiEdit2 size={16} /></button>
                                                        <button onClick={() => { setTeamToDelete(team); setIsDeleteModalOpen(true); }} className="text-red-500 hover:text-red-700"><Trash2 size={16} /></button>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex flex-col gap-1.5 border-t border-slate-200 pt-2.5 mt-1">
                                                {sortedMembers.map((member, i) => (
                                                    <div key={i} className="flex items-center gap-2 p-1 rounded-lg bg-white border border-slate-100 shadow-2xs">
                                                        {member.photo ? <img src={`http://localhost:8080/uploads/${member.photo}`} alt={member.name} className="w-6 h-6 rounded-full object-cover border border-slate-200 flex-shrink-0" /> : <div className="w-6 h-6 rounded-full bg-[#063A3A]/5 flex items-center justify-center text-[9px] font-bold text-slate-600 uppercase border border-slate-200 flex-shrink-0">{member.name?.charAt(0)}</div>}
                                                        <div className="min-w-0 flex-1 flex items-center justify-between gap-2"><span className="text-xs font-medium text-slate-700 truncate block">{member.name}</span>{member.name === team?.teamLeaderName && <span className="text-[8px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-1.5 py-0.5 rounded-md font-bold uppercase tracking-wider flex-shrink-0">Leader</span>}</div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    );
                                })
                            ) : <p className="text-slate-500 italic p-4">No teams found.</p>}
                        </div>
                    </div>
                </div>
            </div>
            {userRole === "ADMIN" && isModalOpen && <TeamModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} team={currentTeam} onRefresh={fetchData} />}
            <DeleteConfirmationModal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} onConfirm={handleConfirmDelete} itemName={teamToDelete?.name} />
        </div>
    );
};

export default DepartmentDetails;