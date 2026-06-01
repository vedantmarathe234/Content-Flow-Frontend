import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import API from '../../services/api';
import { toast } from 'react-hot-toast';

const TeamModal = ({ isOpen, onClose, team, onRefresh }) => {
  const [formData, setFormData] = useState({
    name: '',
    departmentId: null,
    memberIds: [],
    teamLeaderId: null
  });
  const [depts, setDepts] = useState([]);
  const [interns, setInterns] = useState([]);

  useEffect(() => {
    API.get('/departments/all').then(res => setDepts(res.data.map(d => ({ value: d.id, label: d.name }))));
    
    if (team) {
      setFormData({
        name: team.name,
        departmentId: team.departmentId,
        memberIds: team.memberIds || [],
        teamLeaderId: team.teamLeaderId
      });
      
      API.get(`/teams/department/${team.departmentId}/interns`)
         .then(res => setInterns(res.data.map(u => ({ value: u.id, label: u.name }))));
    }
  }, [team]);

  const handleDeptChange = async (opt) => {
    setFormData(prev => ({ ...prev, departmentId: opt.value, memberIds: [], teamLeaderId: null }));
    const { data } = await API.get(`/teams/department/${opt.value}/interns`);
    setInterns(data.map(u => ({ value: u.id, label: u.name })));
  };

  const availableLeaders = interns.filter(i => formData.memberIds.includes(i.value));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.departmentId || formData.memberIds.length === 0 || !formData.teamLeaderId) {
      toast.error("Please complete all required fields");
      return;
    }
    try {
      team ? await API.put(`/teams/${team.id}/edit`, formData) : await API.post('/teams/create', formData);
      toast.success(team ? "Team updated" : "Team created");
      onRefresh();
      onClose();
    } catch (err) {
      toast.error("Failed to save team");
    }
  };

  const customStyles = {
    control: (provided) => ({ ...provided, padding: '1px', borderRadius: '10px', borderColor: '#e2e8f0', minHeight: '40px', fontSize: '14px' }),
    placeholder: (provided) => ({ ...provided, color: '#94a3b8', fontSize: '13px' }),
    multiValue: (provided) => ({ ...provided, backgroundColor: '#dbeafe', borderRadius: '6px', padding: '1px 2px' }),
    multiValueLabel: (provided) => ({ ...provided, color: '#1e40af', fontWeight: '500', fontSize: '12px' }),
    menuPortal: (base) => ({ ...base, zIndex: 9999 })
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl animate-in fade-in zoom-in duration-300">
        <div className="p-5 border-b border-slate-100">
          <h2 className="text-xl font-bold text-slate-800">{team ? 'Edit Team' : 'Create Team'}</h2>
        </div>
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Team Name</label>
            <input className="w-full p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm" placeholder="Name" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Department</label>
            <Select options={depts} onChange={handleDeptChange} styles={customStyles} menuPortalTarget={document.body} placeholder="Select..." value={depts.find(d => d.value === formData.departmentId)} />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Assign Interns</label>
            <Select isMulti options={interns} value={interns.filter(i => formData.memberIds.includes(i.value))} onChange={vals => setFormData({ ...formData, memberIds: vals.map(v => v.value), teamLeaderId: null })} styles={customStyles} menuPortalTarget={document.body} placeholder="Select members..." closeMenuOnSelect={false} />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Team Leader</label>
            <Select options={availableLeaders} value={availableLeaders.find(i => i.value === formData.teamLeaderId) || null} onChange={val => setFormData({ ...formData, teamLeaderId: val.value })} styles={customStyles} menuPortalTarget={document.body} placeholder="Select leader..." />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 border border-slate-200 rounded-lg font-semibold text-slate-600 hover:bg-slate-50 transition-all">Cancel</button>
            <button type="submit" className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold shadow-md transition-all">{team ? 'Update Team' : 'Create Team'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TeamModal;