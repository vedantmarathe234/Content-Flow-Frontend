import React, { useEffect, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Building2, Users, Clock, CheckSquare, UserCheck, FileText } from 'lucide-react';
import { getDashboardStats } from "../../services/contentService";
import { getRecentActivity } from "../../services/notificationService";


const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentActivities, setRecentActivities] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, activityRes] = await Promise.all([
          getDashboardStats(),
          getRecentActivity()
        ]);
        setStats(statsRes.data);
        setRecentActivities(activityRes.data || []);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };
    fetchData();
  }, []);

  if (!stats) {
    return (
      <div className="p-6 font-sans text-sm font-semibold text-[#063A3A] animate-pulse">
        Loading Dashboard...
      </div>
    );
  }

  const total = stats.approved + stats.rejected + stats.pendingLeader + stats.pendingAdmin;

  const statusData = [
    { name: "Approved", value: total > 0 ? Math.round((stats.approved * 100) / total) : 0, color: "#0D7A80" },
    { name: "Pending", value: total > 0 ? Math.round(((stats.pendingLeader + stats.pendingAdmin) * 100) / total) : 0, color: "#f59e0b" },
    { name: "Rejected", value: total > 0 ? Math.round((stats.rejected * 100) / total) : 0, color: "#ef4444" }
  ];

  return (
    <div className="space-y-6 p-2 bg-slate-50/50 min-h-screen font-sans">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#063A3A] tracking-tight">Admin Dashboard</h1>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {[
          { title: 'Total Departments', val: stats.totalDepartments, icon: <Building2 size={20} />, borderColor: 'border-l-[#063A3A]', iconColor: 'text-[#063A3A]', iconBg: 'bg-[#063A3A]/5' },
          { title: 'Total Teams', val: stats.totalTeams, icon: <Users size={20} />, borderColor: 'border-l-[#0D7A80]', iconColor: 'text-[#0D7A80]', iconBg: 'bg-[#0D7A80]/5' },
          { title: 'Pending Content', val: stats.pendingLeader + stats.pendingAdmin, icon: <Clock size={20} />, borderColor: 'border-l-amber-500', iconColor: 'text-amber-600', iconBg: 'bg-amber-50' },
          { title: 'Approved Content', val: stats.approved, icon: <CheckSquare size={20} />, borderColor: 'border-l-green-500', iconColor: 'text-green-600', iconBg: 'bg-green-50' },
          { title: 'Active Users', val: stats.totalUsers, icon: <UserCheck size={20} />, borderColor: 'border-l-slate-400', iconColor: 'text-slate-600', iconBg: 'bg-slate-100' }
        ].map((card, i) => (
          <div key={i} className={`bg-white p-5 rounded-xl border border-slate-200/80 border-l-4 ${card.borderColor} shadow-sm flex items-center justify-between transition-all hover:shadow-md`}>
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{card.title}</p>
              <h3 className="text-2xl font-extrabold text-[#063A3A] mt-1">{card.val}</h3>
            </div>
            <div className={`p-3 rounded-xl ${card.iconBg} ${card.iconColor}`}>{card.icon}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-l-4 border-l-[#0D7A80] border-slate-200/80 shadow-sm flex flex-col">
          <h3 className="text-sm font-bold text-[#063A3A] mb-6">Weekly Content Activity</h3>
          
          <div className="h-64 w-full relative min-h-[260px] flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart 
                data={stats.weeklyActivity || []} 
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0D7A80" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#0D7A80" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 500 }} 
                />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }} 
                  labelStyle={{ fontWeight: '700', color: '#063A3A' }}
                />
                <Area type="monotone" dataKey="count" stroke="#0D7A80" strokeWidth={3} fill="url(#colorCount)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-2xl border border-l-4 border-l-[#f59e0b] border-slate-200/80 shadow-sm flex flex-col">
          <h3 className="text-sm font-bold text-[#063A3A] mb-6">Content Status</h3>
          <div className="h-44 w-full relative min-h-[176px] flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={statusData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value" cx="50%" cy="50%">
                  {statusData.map((entry, index) => <Cell key={index} fill={entry.color} />)}
                </Pie>
                <Tooltip formatter={(value) => `${value}%`} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 space-y-3 flex-1">
            {statusData.map((item) => (
              <div key={item.name} className="flex justify-between text-xs px-1">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }}></div>
                  <span className="text-slate-600 font-medium">{item.name}</span>
                </div>
                <span className="font-bold text-[#063A3A]">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>


     <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
  <div className="bg-white p-6 rounded-2xl border border-l-4 border-l-[#0D7A80] border-slate-200/80 shadow-sm bg-[#0D7A80]/[0.01]">
    <h3 className="text-sm font-bold text-[#063A3A] mb-5">Top Departments</h3>
    <div className="space-y-3">
      {!stats.topDepartments || stats.topDepartments.length === 0 ? (
        <div className="text-slate-400 font-medium text-xs text-center py-6">
          No department statistics tracked yet.
        </div>
      ) : (
        stats.topDepartments.map((dept, i) => (
          <div key={i} className="flex justify-between items-center text-sm p-2.5 rounded-xl bg-white border border-slate-100 shadow-2xs">
            <span className="text-slate-700 font-semibold">{i + 1}. {dept.name}</span>
            <span className="font-bold text-[#0D7A80] bg-[#0D7A80]/5 px-2.5 py-1 rounded-lg text-xs">{dept.count}</span>
          </div>
        ))
      )}
    </div>
  </div>

        <div className="bg-white p-6 rounded-2xl border border-l-4 border-l-[#063A3A] border-slate-200/80 shadow-sm bg-[#063A3A]/[0.01]">
          <h3 className="text-sm font-bold text-[#063A3A] mb-5">Recent Activity</h3>
          <div className="space-y-3">
            {recentActivities.length === 0 ? (
              <p className="text-slate-400 font-medium text-xs text-center py-6">No recent pipeline activity tracked.</p>
            ) : (
              recentActivities.map((act, i) => (
                <div key={i} className="flex items-start gap-3 p-2.5 rounded-xl bg-white border border-slate-100 shadow-2xs">
                  <div className="mt-0.5 p-1.5 rounded-lg bg-slate-50 text-[#0D7A80]"><FileText size={16} /></div>
                  <div className="flex flex-col gap-0.5 min-w-0 flex-1">
                    <span className="text-sm text-slate-700 font-semibold truncate text-left">{act.message}</span>
                    <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider text-left">{new Date(act.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;