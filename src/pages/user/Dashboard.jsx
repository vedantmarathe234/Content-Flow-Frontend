import React from 'react';

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

const activityData = [
  { name: 'Mon', count: 2 },
  { name: 'Tue', count: 4 },
  { name: 'Wed', count: 3 },
  { name: 'Thu', count: 5 },
  { name: 'Fri', count: 4 },
  { name: 'Sat', count: 6 },
  { name: 'Sun', count: 5 }
];

const statusData = [
  { name: 'Approved', value: 60, color: '#3b82f6' },
  { name: 'Pending', value: 25, color: '#f59e0b' },
  { name: 'Rejected', value: 15, color: '#ef4444' },
];

const UserDashboard = () => {

  const role = localStorage.getItem("role");

  return (

    <div className="space-y-6">

      <div>

        <h1 className="text-xl font-bold text-slate-900">
          User Dashboard
        </h1>

        <p className="text-sm text-slate-500 mt-1">
          Manage your content workflow
        </p>

      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">

        {[
          {
            title: 'Total Content',
            val: '12',
            icon: <FileText size={18} />,
            bg: 'bg-blue-50 text-blue-600'
          },

          {
            title: 'Pending',
            val: '4',
            icon: <Clock size={18} />,
            bg: 'bg-orange-50 text-orange-600'
          },

          {
            title: 'Approved',
            val: '8',
            icon: <CheckCircle size={18} />,
            bg: 'bg-green-50 text-green-600'
          },

          {
            title: 'Rejected',
            val: '1',
            icon: <XCircle size={18} />,
            bg: 'bg-red-50 text-red-600'
          },

          {
            title: 'Activity',
            val: '92%',
            icon: <Activity size={18} />,
            bg: 'bg-purple-50 text-purple-600'
          }

        ].map((card, i) => (

          <div
            key={i}
            className="bg-white p-5 rounded-xl border border-slate-100 flex items-center justify-between shadow-sm"
          >

            <div>

              <p className="text-xs font-medium text-slate-400 tracking-wide">
                {card.title}
              </p>

              <h3 className="text-2xl font-bold text-slate-800 mt-1">
                {card.val}
              </h3>

            </div>

            <div className={`p-2.5 rounded-xl ${card.bg}`}>
              {card.icon}
            </div>

          </div>

        ))}

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-100 shadow-sm">

          <h3 className="text-sm font-bold text-slate-800 mb-6">
            Weekly Content Activity
          </h3>

          <div className="h-64 w-full">

            <ResponsiveContainer width="100%" height="100%">

              <AreaChart data={activityData}>

                <defs>

                  <linearGradient
                    id="userColorCount"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >

                    <stop
                      offset="5%"
                      stopColor="#3b82f6"
                      stopOpacity={0.2}
                    />

                    <stop
                      offset="95%"
                      stopColor="#3b82f6"
                      stopOpacity={0}
                    />

                  </linearGradient>

                </defs>

                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#f1f5f9"
                />

                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fill: '#94a3b8',
                    fontSize: 11
                  }}
                />

                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fill: '#94a3b8',
                    fontSize: 11
                  }}
                />

                <Tooltip />

                <Area
                  type="monotone"
                  dataKey="count"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#userColorCount)"
                />

              </AreaChart>

            </ResponsiveContainer>

          </div>

        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm flex flex-col justify-between">

          <h3 className="text-sm font-bold text-slate-800 mb-2">
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

                  {
                    statusData.map((entry, index) => (

                      <Cell
                        key={index}
                        fill={entry.color}
                      />

                    ))
                  }

                </Pie>

                <Tooltip />

              </PieChart>

            </ResponsiveContainer>

          </div>

          <div className="space-y-3 pt-2">

            <div className="p-3 rounded-xl bg-slate-50">

              <p className="text-sm font-medium text-slate-700">
                Instagram Post Submitted
              </p>

              <span className="text-xs text-slate-400">
                2 mins ago
              </span>

            </div>

            <div className="p-3 rounded-xl bg-slate-50">

              <p className="text-sm font-medium text-slate-700">
                Reel Approved
              </p>

              <span className="text-xs text-slate-400">
                1 hour ago
              </span>

            </div>

            {
              role === "TEAM_LEADER" && (

                <div className="p-3 rounded-xl bg-slate-50">

                  <p className="text-sm font-medium text-slate-700">
                    Team Content Pending Approval
                  </p>

                  <span className="text-xs text-slate-400">
                    3 pending requests
                  </span>

                </div>

              )
            }

          </div>

        </div>

      </div>

    </div>

  );
};

export default UserDashboard;