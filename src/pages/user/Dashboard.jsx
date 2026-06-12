import React, { useEffect, useState } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import {
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  Activity
} from 'lucide-react';
import API from "../../services/api";
import { getMyDashboardStats, getTeamDashboardStats } from "../../services/contentService";
import { getRecentActivity } from "../../services/notificationService";

const activityData = [
  { name: 'Mon', count: 2 },
  { name: 'Tue', count: 4 },
  { name: 'Wed', count: 3 },
  { name: 'Thu', count: 5 },
  { name: 'Fri', count: 4 },
  { name: 'Sat', count: 6 },
  { name: 'Sun', count: 5 }
];

const UserDashboard = () => {
  const [stats, setStats] = useState(null);
  const [activities, setActivities] = useState([]);
  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState(null);

  const currentUserId = Number(localStorage.getItem("userId"));
  const role = localStorage.getItem("role");

  const fetchRecentActivity = async () => {
    try {
      const response = await getRecentActivity();
      setActivities(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchDashboardStats = async (teamId = null) => {
    try {
      let response;
      if (teamId) {
        response = await getTeamDashboardStats(teamId);
      } else {
        response = await getMyDashboardStats();
      }
      setStats(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchTeams = async () => {
    try {
      const response = await API.get("/teams/my-team");
      setTeams(response.data);
      if (response.data.length > 0) {
        setSelectedTeam(response.data[0]);
        fetchDashboardStats(response.data[0].id);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchDashboardStats();
    fetchTeams();
    fetchRecentActivity();
  }, []);

  if (!stats) {
    return (
      <div className="flex h-64 items-center justify-center text-sm font-semibold text-slate-400">
        Loading dashboard metrics...
      </div>
    );
  }

  const total = stats.approved + stats.rejected + stats.pendingLeader + stats.pendingAdmin;

  const statusData = [
    {
      name: "Approved",
      value: total > 0 ? Math.round((stats.approved * 100) / total) : 0,
      color: "#0D7A80"
    },
    {
      name: "Pending",
      value: total > 0 ? Math.round(((stats.pendingLeader + stats.pendingAdmin) * 100) / total) : 0,
      color: "#f59e0b"
    },
    {
      name: "Rejected",
      value: total > 0 ? Math.round((stats.rejected * 100) / total) : 0,
      color: "#ef4444"
    }
  ];

  const isLeader = selectedTeam?.teamLeaderId === currentUserId;

  return (
    <div className="space-y-6 font-sans text-slate-800">
      
      <div>
        <h1 className="text-xl font-extrabold text-slate-950 tracking-tight">
          User Dashboard
        </h1>
        <p className="text-xs font-medium text-slate-400 mt-0.5">
          Manage your content workflow and team updates
        </p>
      </div>

      
      <div className="flex gap-2 flex-wrap items-center">
        {teams.map((team) => (
          <button
            key={team.id}
            onClick={() => {
              setSelectedTeam(team);
              fetchDashboardStats(team.id);
            }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold tracking-wider uppercase transition-all border cursor-pointer ${
              selectedTeam?.id === team.id
                ? "bg-[#063A3A] text-white border-[#063A3A] shadow-sm"
                : "bg-white border-slate-200 text-slate-500 hover:bg-slate-50"
            }`}
          >
            {team.name}
          </button>
        ))}

        {selectedTeam && (
          <div className="text-xs font-semibold text-slate-400 ml-2">
            Active: <span className="text-slate-600">{selectedTeam.name}</span>
            {isLeader && (
              <span className="ml-1.5 text-emerald-600 font-bold bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full uppercase text-[9px] tracking-wider inline-block">
                Team Leader
              </span>
            )}
          </div>
        )}
      </div>

     
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {[
          { title: 'Total Content', val: stats.totalContent, icon: <FileText size={16} />, bg: 'bg-slate-100 text-slate-700', border: 'border-l-slate-400' },
          { title: 'Pending', val: stats.pendingLeader + stats.pendingAdmin, icon: <Clock size={16} />, bg: 'bg-amber-50 text-amber-600 border border-amber-100', border: 'border-l-amber-500' },
          { title: 'Approved', val: stats.approved, icon: <CheckCircle size={16} />, bg: 'bg-teal-50 text-[#0D7A80] border border-teal-100', border: 'border-l-[#0D7A80]' },
          { title: 'Rejected', val: stats.rejected, icon: <XCircle size={16} />, bg: 'bg-rose-50 text-rose-600 border border-rose-100', border: 'border-l-rose-500' },
          { title: 'Approval Rate', val: total > 0 ? `${Math.round((stats.approved * 100) / total)}%` : "0%", icon: <Activity size={16} />, bg: 'bg-[#063A3A]/5 text-[#063A3A] border border-[#063A3A]/10', border: 'border-l-[#063A3A]' }
        ].map((card, i) => (
          <div
            key={i}
            className={`bg-white p-4 rounded-xl border border-slate-200/80 border-l-4 ${card.border} flex items-center justify-between shadow-sm`}
          >
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                {card.title}
              </p>
              <h3 className="text-2xl font-black text-slate-900 tracking-tight mt-1">
                {card.val}
              </h3>
            </div>
            <div className={`p-2 rounded-xl ${card.bg}`}>
              {card.icon}
            </div>
          </div>
        ))}
      </div>

  
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-5 rounded-xl border border-l-4 border-l-[#0D7A80] border-slate-200/80 shadow-sm">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-6">
            Weekly Content Activity
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={activityData}>
                <defs>
                  <linearGradient id="userColorCount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0D7A80" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#0D7A80" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 500 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 500 }}
                />
                <Tooltip 
                  contentStyle={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '12px' }}
                />
                <Area
                  type="monotone"
                  dataKey="count"
                  stroke="#0D7A80"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#userColorCount)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

      
        <div className="bg-white p-5 rounded-xl border border-l-4 border-l-[#f59e0b] border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              Content Status
            </h3>
            <div className="h-44 w-full relative flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    innerRadius={55}
                    outerRadius={75}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="space-y-2.5 pt-2">
            {statusData.map((item) => (
              <div key={item.name} className="flex justify-between text-xs font-semibold">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-slate-500">{item.name}</span>
                </div>
                <span className="font-bold text-slate-900">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

    
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-5 rounded-xl border border-l-4 border-l-slate-400 border-slate-200/80 shadow-sm">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
            Recent Activity
          </h3>
          <div className="space-y-3 max-h-[280px] overflow-y-auto custom-scrollbar">
            {activities.length === 0 ? (
              <p className="text-xs font-medium text-slate-400 py-2">No recent activity found.</p>
            ) : (
              activities.map((activity, index) => (
                <div key={index} className="flex flex-col gap-0.5 border-b border-slate-100 last:border-0 pb-2.5 last:pb-0">
                  <span className="text-xs font-bold text-slate-700 leading-relaxed">
                    {activity.message}
                  </span>
                  <span className="text-[10px] font-semibold text-slate-400">
                    {new Date(activity.createdAt).toLocaleString()}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        
        {role === "TEAM_LEADER" && (
          <div className="bg-white p-5 rounded-xl border border-l-4 border-l-amber-500 border-slate-200/80 shadow-sm flex flex-col justify-center">
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-100">
              <p className="text-xs font-bold text-amber-800 uppercase tracking-wider">
                Pending Actions Required
              </p>
              <p className="text-sm font-bold text-slate-800 mt-1">
                Team Content Pending Approval
              </p>
              <span className="inline-block mt-2 text-[10px] font-extrabold bg-amber-600 text-white px-2 py-0.5 rounded-md uppercase tracking-wider">
                3 Pending Requests
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;