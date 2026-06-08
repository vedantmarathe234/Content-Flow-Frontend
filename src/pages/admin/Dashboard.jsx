import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Building2, Users, Clock, CheckSquare, UserCheck, FileText, CheckCircle, PlusCircle } from 'lucide-react';

import { useEffect, useState } from "react";
import { getDashboardStats }
from "../../services/contentService";

const activityData = [
  { name: 'Mon', count: 10 }, { name: 'Tue', count: 18 }, { name: 'Wed', count: 12 },
  { name: 'Thu', count: 25 }, { name: 'Fri', count: 15 }, { name: 'Sat', count: 32 }, { name: 'Sun', count: 28 }
];


const topDepartments = [
  { name: 'Graphic Design', count: 45 }, { name: 'Digital Marketing', count: 38 },
  { name: 'Video Editing', count: 32 }, { name: 'UI/UX Design', count: 28 },
];

const recentActivity = [
  { title: 'New content submitted by John Doe', time: '2 mins ago', icon: <FileText size={16} />, color: 'text-blue-500' },
  { title: 'Content "Instagram Post" approved', time: '10 mins ago', icon: <CheckCircle size={16} />, color: 'text-green-500' },
  { title: 'New team "Social Media Team" created', time: '1 hour ago', icon: <PlusCircle size={16} />, color: 'text-purple-500' },
];

const AdminDashboard = () => {

  const [stats, setStats] = useState(null);

useEffect(() => {
  fetchDashboardStats();
}, []);

const fetchDashboardStats = async () => {
  try {

    const response =
      await getDashboardStats();

    setStats(response.data);

  } catch (error) {
    console.error(error);
  }
};

if (!stats) {
  return <div>Loading...</div>;
}

const total =
  stats.approved +
  stats.rejected +
  stats.pendingLeader +
  stats.pendingAdmin;

const statusData = [
  {
    name: "Approved",
    value:
      total > 0
        ? Math.round((stats.approved * 100) / total)
        : 0,
    color: "#3b82f6"
  },
  {
    name: "Pending",
    value:
      total > 0
        ? Math.round(
            ((stats.pendingLeader + stats.pendingAdmin) * 100) / total
          )
        : 0,
    color: "#f59e0b"
  },
  {
    name: "Rejected",
    value:
      total > 0
        ? Math.round((stats.rejected * 100) / total)
        : 0,
    color: "#ef4444"
  }
];

  return (
    <div className="space-y-6 p-2 bg-slate-50/50">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Dashboard</h1>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {[
          { title: 'Total Departments', val: stats.totalDepartments, icon: <Building2 size={20} />, bg: 'bg-blue-50 text-blue-600' },
          { title: 'Total Teams', val: stats.totalTeams, icon: <Users size={20} />, bg: 'bg-teal-50 text-teal-600' },
          { title: 'Pending Content', val:
stats.pendingLeader +
stats.pendingAdmin, icon: <Clock size={20} />, bg: 'bg-orange-50 text-orange-600' },
          { title: 'Approved Content', val: stats.approved, icon: <CheckSquare size={20} />, bg: 'bg-green-50 text-green-600' },
          { title: 'Active Users', val: stats.totalUsers, icon: <UserCheck size={20} />, bg: 'bg-rose-50 text-rose-600' }
        ].map((card, i) => (
          <div key={i} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">{card.title}</p>
              <h3 className="text-2xl font-extrabold text-slate-900 mt-1">{card.val}</h3>
            </div>
            <div className={`p-3 rounded-xl ${card.bg}`}>{card.icon}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-sm font-bold text-slate-900 mb-6">Weekly Content Activity</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={activityData}>
                <defs>
                  <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f8fafc" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 500 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <Tooltip />
                <Area type="monotone" dataKey="count" stroke="#3b82f6" strokeWidth={3} fill="url(#colorCount)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-sm font-bold text-slate-900 mb-6">Content Status</h3>
          <div className="h-44 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={statusData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                  {statusData.map((entry, index) => <Cell key={index} fill={entry.color} />)}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 space-y-3">
            {statusData.map((item) => (
              <div key={item.name} className="flex justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }}></div>
                  <span className="text-slate-600 font-medium">{item.name}</span>
                </div>
                <span className="font-bold text-slate-900">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-sm font-bold text-slate-900 mb-5">Top Departments</h3>
          <div className="space-y-4">
            {topDepartments.map((dept, i) => (
              <div key={i} className="flex justify-between items-center text-sm">
                <span className="text-slate-600 font-medium">{i + 1}. {dept.name}</span>
                <span className="font-bold text-slate-900">{dept.count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-sm font-bold text-slate-900 mb-5">Recent Activity</h3>
          <div className="space-y-4">
            {recentActivity.map((act, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className={`mt-0.5 ${act.color}`}>{act.icon}</div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-sm text-slate-700 font-medium">{act.title}</span>
                  <span className="text-[11px] text-slate-400 font-semibold">{act.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;