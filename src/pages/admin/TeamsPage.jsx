import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import API from '../../services/api';
import TeamModal from './TeamModal';
import { Trash2, ArrowLeft, X, AlertTriangle } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { FiEdit2 } from 'react-icons/fi';

const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, itemName }) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[200] bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 font-sans animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-sm bg-white rounded-2xl shadow-2xl overflow-hidden border border-l-[4px] border-l-[#0D7A80] border-slate-100 flex flex-col p-6 animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-end mb-2">
          <button 
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-50 transition-colors cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        <div className="mx-auto flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-rose-50 border border-rose-100 text-rose-500 mb-4">
          <AlertTriangle size={22} />
        </div>

        <div className="text-center mb-6">
          <h3 className="text-base font-bold text-slate-900 leading-snug">
            Delete Team Confirmation
          </h3>
          <p className="text-xs text-slate-500 font-medium mt-2 leading-relaxed">
            Are you absolutely sure you want to delete <span className="font-bold text-slate-800">"{itemName || "this team"}"</span>? This action is permanent and cannot be undone.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2 px-4 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 active:scale-[0.98] transition-all cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="flex-1 py-2 px-4 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-sm shadow-rose-600/10 active:scale-[0.98] transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Trash2 size={13} />
            Delete Team
          </button>
        </div>
      </div>
    </div>
  );
};

const TeamsPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const userRole = localStorage.getItem("role");

  const [teams, setTeams] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentTeam, setCurrentTeam] = useState(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [teamToDelete, setTeamToDelete] = useState(null);

  const searchTeamId = location.state?.selectedTeamId;
  const searchTeamName = location.state?.selectedTeamName;

  const pageTitle = searchTeamId 
    ? searchTeamName 
    : (userRole === "ADMIN" ? "All Teams" : "My Teams");

  const displayedTeams = searchTeamId 
    ? teams.filter(t => t.id === searchTeamId)
    : teams;

  const fetchTeams = async () => {
    try {
      const { data } = await API.get('/teams/all');
      setTeams(data || []);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch teams");
    }
  };

  const fetchMyTeam = async () => {
    try {
      const { data } = await API.get('/teams/my-team');
      if (data) {
        setTeams(data || []);
      } else {
        setTeams([]);
      }
    } catch (error) {
      console.error(error);
      setTeams([]);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      if (userRole === "ADMIN") {
        await fetchTeams();
      } else {
        await fetchMyTeam();
      }
    };
    void loadData();
  }, [userRole]);

  const handleDeleteClick = (team) => {
    setTeamToDelete(team);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!teamToDelete) return;
    try {
      await API.delete(`/teams/${teamToDelete.id}`);
      toast.success("Team deleted successfully");
      if (userRole === "ADMIN") {
        await fetchTeams();
      } else {
        await fetchMyTeam();
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete team");
    } finally {
      setIsDeleteModalOpen(false);
      setTeamToDelete(null);
    }
  };

  return (
    <div className="w-full font-sans text-slate-800 p-2 min-h-screen bg-slate-50/50">
      
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => {
              if (searchTeamId) {
                navigate(location.pathname, { replace: true, state: {} });
              } else {
                navigate(-1);
              }
            }}
            className="p-2 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
          >
            <ArrowLeft size={20} className="text-[#063A3A]" />
          </button>
          
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-[#063A3A] tracking-tight">
              {pageTitle}
            </h1>
            
            {searchTeamId && (
              <button 
                onClick={() => navigate(location.pathname, { replace: true, state: {} })}
                className="text-[10px] font-bold bg-[#0D7A80]/10 hover:bg-[#0D7A80]/20 text-[#0D7A80] px-2 py-1 rounded-md transition-colors cursor-pointer"
              >
                Clear Filter ✕
              </button>
            )}
          </div>
        </div>

        {userRole === "ADMIN" && (
          <button
            onClick={() => {
              setCurrentTeam(null);
              setIsModalOpen(true);
            }}
            className="bg-[#063A3A] hover:bg-[#0D7A80] text-white font-semibold py-2 px-4 rounded-xl text-sm transition-all flex items-center gap-1.5 shadow-sm cursor-pointer"
          >
            <span className="text-lg font-light">+</span> Create Team
          </button>
        )}
      </div>

      {displayedTeams.length === 0 && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-slate-500 font-medium">
            {searchTeamId 
              ? "No team matching filter parameter found."
              : (userRole === "ADMIN" ? "No teams found." : "You are not assigned to any team yet.")}
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {displayedTeams.map((team) => {
          const sortedMembers = Array.isArray(team?.memberNames)
            ? team.memberNames.map((name, index) => ({
                name,
                photo: team.memberPhotoUrls?.[index] || null,
              }))
            : [];

          sortedMembers.sort((a, b) => {
            if (a.name === team?.teamLeaderName) return -1;
            if (b.name === team?.teamLeaderName) return 1;
            return 0;
          });

          return (
            <div
              key={team.id}
              onClick={() =>
                navigate(`/team/${team.id}/calendar`, {
                  state: { teamName: team.name },
                })
              }
              className="bg-white p-4 rounded-2xl border border-l-4 border-l-[#0D7A80] border-slate-200 shadow-sm hover:shadow-md transition-all w-full cursor-pointer bg-[#063A3A]/[0.01] hover:bg-[#063A3A]/[0.05]"
            >
              <div className="flex justify-between items-start mb-3">
                <div className="min-w-0">
                  <h3 className="text-sm font-bold text-[#063A3A] truncate">
                    {team.name}
                  </h3>
                  <p className="text-[10px] text-[#0D7A80] font-bold uppercase mt-0.5 truncate tracking-wider">
                    {team.departmentName}
                  </p>
                </div>

                {userRole === "ADMIN" && (
                  <div className="flex items-center gap-1.5 flex-shrink-0 bg-white p-1 rounded-lg border border-slate-100 shadow-3xs" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => {
                        setCurrentTeam(team);
                        setIsModalOpen(true);
                      }}
                      className="text-[#0D7A80] hover:text-[#063A3A] p-1 transition-colors cursor-pointer"
                    >
                      <FiEdit2 size={15} />
                    </button>
                    <button
                      onClick={() => handleDeleteClick(team)}
                      className="text-red-500 hover:text-red-700 p-1 transition-colors cursor-pointer"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                )}
              </div>

              <div className="border-t border-slate-100 pt-3 mt-1">
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Members ({sortedMembers.length})
                </p>

                <div className="flex flex-col gap-1.5">
                  {sortedMembers.map((member, i) => (
                    <div key={i} className="flex items-center gap-2 p-1 rounded-lg bg-white border border-slate-100/70 shadow-3xs">
                      {member.photo ? (
                        <img
                          src={`http://localhost:8080/uploads/${member.photo}`}
                          alt={member.name}
                          className="w-6 h-6 rounded-full object-cover border border-slate-200 flex-shrink-0"
                        />
                      ) : (
                        <div className="w-6 h-6 rounded-full bg-[#063A3A]/5 flex items-center justify-center text-[9px] font-bold text-slate-600 uppercase border border-slate-200 flex-shrink-0">
                          {member.name?.charAt(0)}
                        </div>
                      )}
                      
                      <div className="min-w-0 flex-1 flex items-center justify-between gap-2">
                        <span className="text-[11px] font-medium text-slate-700 truncate block">
                          {member.name}
                        </span>
                        {member.name === team?.teamLeaderName && (
                          <span className="text-[8px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-1.5 py-0.5 rounded-md font-bold uppercase tracking-wider flex-shrink-0">
                            Leader
                          </span>
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

      {userRole === "ADMIN" && isModalOpen && (
        <TeamModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          team={currentTeam}
          onRefresh={fetchTeams}
        />
      )}

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        itemName={teamToDelete?.name}
      />
    </div>
  );
};

export default TeamsPage;