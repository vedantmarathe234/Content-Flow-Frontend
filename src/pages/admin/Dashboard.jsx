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
  Building2,
  Users,
  Clock,
  CheckSquare,
  UserCheck
} from 'lucide-react';

const activityData = [
  { name: 'Mon', count: 4 },
  { name: 'Tue', count: 7 },
  { name: 'Wed', count: 5 },
  { name: 'Thu', count: 8 },
  { name: 'Fri', count: 6 },
  { name: 'Sat', count: 9 },
  { name: 'Sun', count: 7 }
];

const statusData = [
  { name: 'Approved', value: 65, color: '#3b82f6' },
  { name: 'Pending', value: 15, color: '#2dd4bf' },
  { name: 'Rejected', value: 10, color: '#f87171' },
  { name: 'Draft', value: 10, color: '#fbbf24' },
];

const AdminDashboard = () => {

  return (

    <div className="space-y-6">

      <div>

        <h1 className="text-xl font-bold text-slate-900">
          Admin Dashboard
        </h1>

        <p className="text-sm text-slate-500 mt-1">
          Manage departments, teams and content workflow
        </p>

      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">

        {[
          {
            title: 'Total Departments',
            val: '8',
            icon: <Building2 size={18} />,
            bg: 'bg-blue-50 text-blue-600'
          },

          {
            title: 'Total Teams',
            val: '24',
            icon: <Users size={18} />,
            bg: 'bg-teal-50 text-teal-600'
          },

          {
            title: 'Pending Content',
            val: '18',
            icon: <Clock size={18} />,
            bg: 'bg-orange-50 text-orange-600'
          },

          {
            title: 'Approved Content',
            val: '156',
            icon: <CheckSquare size={18} />,
            bg: 'bg-green-50 text-green-600'
          },

          {
            title: 'Active Users',
            val: '62',
            icon: <UserCheck size={18} />,
            bg: 'bg-rose-50 text-rose-600'
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
                    id="colorCount"
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
                  fill="url(#colorCount)"
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

          <div className="grid grid-cols-2 gap-2 text-xs pt-2">

            {
              statusData.map((item) => (

                <div
                  key={item.name}
                  className="flex justify-between items-center p-1.5 bg-slate-50 rounded-lg"
                >

                  <div className="flex items-center gap-1.5">

                    <div
                      className="w-2 h-2 rounded-full"
                      style={{
                        backgroundColor: item.color
                      }}
                    ></div>

                    <span className="text-slate-500">
                      {item.name}
                    </span>

                  </div>

                  <span className="font-semibold text-slate-700">
                    {item.value}%
                  </span>

                </div>

              ))
            }

          </div>

        </div>

      </div>

    </div>

  );
};

export default AdminDashboard;