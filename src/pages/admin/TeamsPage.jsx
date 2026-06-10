import { useState, useEffect } from 'react';
import API from '../../services/api';
import TeamModal from './TeamModal';
import { Trash2, ArrowLeft } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { FiEdit2 } from 'react-icons/fi';

const TeamsPage = () => {
  const navigate = useNavigate();
  const userRole = localStorage.getItem("role");

  const [teams, setTeams] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentTeam, setCurrentTeam] = useState(null);

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

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this team?")) {
      try {
        await API.delete(`/teams/${id}`);
        toast.success("Team deleted successfully");
        await fetchTeams();
      } catch (error) {
        console.error(error);
        toast.error("Failed to delete team");
      }
    }
  };

  return (
    <div className="w-full font-sans text-slate-800">
      
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-slate-100 rounded-full transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            {userRole === "ADMIN" ? "Teams / Teams Content" : "My Teams"}
          </h1>
        </div>

        {userRole === "ADMIN" && (
          <button
            onClick={() => {
              setCurrentTeam(null);
              setIsModalOpen(true);
            }}
            className="bg-[#4f46e5] hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg text-sm transition-all flex items-center gap-1.5 shadow-sm"
          >
            <span className="text-lg font-light">+</span>
            Create Team
          </button>
        )}
      </div>

  
      {teams.length === 0 && (
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-slate-500">
            {userRole === "ADMIN"
              ? "No teams found."
              : "You are not assigned to any team yet."}
          </p>
        </div>
      )}

     
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {teams.map((team) => {
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
              state: {
              teamName: team.name,
              },
              })
             }
              className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow w-full cursor-pointer"
            >
              <div className="flex justify-between items-start mb-3">
                <div className="min-w-0">
                  <h3 className="text-sm font-bold text-slate-900 truncate">
                    {team.name}
                  </h3>
                  <p className="text-[10px] text-blue-600 font-medium uppercase mt-0.5 truncate">
                    {team.departmentName}
                  </p>
                </div>

                {userRole === "ADMIN" && (
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setCurrentTeam(team);
                        setIsModalOpen(true);
                      }}
                      className="text-indigo-600 hover:text-indigo-800"
                    >
                      <FiEdit2 size={16} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(team.id);
                      }}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                )}
              </div>

              <div>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Members
                </p>

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
                      <div className="flex flex-col min-w-0">
                        <span className="text-[11px] font-medium text-slate-700 truncate">
                          {member.name}
                        </span>
                        {member.name === team?.teamLeaderName && (
                          <span className="text-[8px] text-green-600 font-bold uppercase">
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
    </div>
  );
};

export default TeamsPage;