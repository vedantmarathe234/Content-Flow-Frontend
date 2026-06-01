import React, { useState, useEffect } from 'react';
import API from '../../services/api';
import TeamModal from './TeamModal';
import { Trash2, Edit3, Plus, ArrowLeft } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const TeamsPage = () => {
  const navigate = useNavigate();
  const [teams, setTeams] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentTeam, setCurrentTeam] = useState(null);

  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    try {
      const { data } = await API.get('/teams/all');
      setTeams(data);
    } catch (error) {
      toast.error("Failed to fetch teams");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this team?")) {
      try {
        await API.delete(`/teams/${id}`);
        toast.success("Team deleted successfully");
        fetchTeams();
      } catch (error) {
        toast.error("Failed to delete team");
      }
    }
  };

  return (
    <div className="w-full font-sans text-slate-800 ">
      
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)} 
            className="p-2 hover:bg-slate-100 rounded-full transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Teams</h1>
        </div>
        <button 
          onClick={() => { setCurrentTeam(null); setIsModalOpen(true); }}
          className="bg-[#4f46e5] hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg text-sm transition-all flex items-center gap-1.5 shadow-sm cursor-pointer"
        >
          <span className="text-lg font-light">+</span> Create Team
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {teams.map((team) => {
          const sortedMembers = team.memberNames ? [...team.memberNames].sort((a, b) => {
            if (a === team.teamLeaderName) return -1;
            return 1;
          }) : [];

          return (
            <div key={team.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">{team.name}</h3>
                  <p className="text-[11px] text-blue-600 font-medium uppercase mt-0.5">{team.departmentName}</p>
                </div>
                <div className="flex items-center gap-3">
                  <button onClick={() => { setCurrentTeam(team); setIsModalOpen(true); }} className="text-indigo-600 hover:text-indigo-800 transition-colors">
                    <Edit3 size={18} />
                  </button>
                  <button onClick={() => handleDelete(team.id)} className="text-red-500 hover:text-red-700 transition-colors">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>

              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Members</p>
                <div className="flex flex-col gap-2">
                  {sortedMembers.map((name, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-600 uppercase border border-slate-200">
                        {name.charAt(0)}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs font-medium text-slate-700">{name}</span>
                        {name === team.teamLeaderName && (
                          <span className="text-[9px] text-blue-600 font-bold uppercase">Team Leader</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {isModalOpen && (
        <TeamModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          team={currentTeam} 
          onRefresh={fetchTeams} 
        />
      )}
    </div>
  );
};

export default TeamsPage;