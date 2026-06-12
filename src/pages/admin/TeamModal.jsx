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
  const [isProcessing, setIsProcessing] = useState(false);

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
    try {
      const { data } = await API.get(`/teams/department/${opt.value}/interns`);
      setInterns(data.map(u => ({ value: u.id, label: u.name })));
    } catch (err) {
      toast.error("Failed to load interns for this department");
    }
  };

  const availableLeaders = interns.filter(i => formData.memberIds.includes(i.value));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.departmentId || formData.memberIds.length === 0 || !formData.teamLeaderId) {
      toast.error("Please complete all required fields");
      return;
    }
    
    setIsProcessing(true);
    try {
      team ? await API.put(`/teams/${team.id}/edit`, formData) : await API.post('/teams/create', formData);
      toast.success(team ? "Team updated" : "Team created");
      onRefresh();
      onClose();
    } catch (err) {
      toast.error("Failed to save team");
    } finally {
      setIsProcessing(false);
    }
  };

  const customStyles = {
    control: (provided, state) => ({ 
      ...provided, 
      padding: '1px', 
      borderRadius: '12px', 
      borderColor: state.isFocused ? '#0D7A80' : '#e2e8f0', 
      boxShadow: state.isFocused ? '0 0 0 1px #0D7A80' : 'none',
      minHeight: '40px', 
      fontSize: '14px',
      '&:hover': { borderColor: '#0D7A80' }
    }),
    placeholder: (provided) => ({ ...provided, color: '#94a3b8', fontSize: '13px' }),
    multiValue: (provided) => ({ ...provided, backgroundColor: 'rgba(13, 122, 128, 0.08)', borderRadius: '6px', padding: '1px 2px', border: '1px solid rgba(13, 122, 128, 0.15)' }),
    multiValueLabel: (provided) => ({ ...provided, color: '#063A3A', fontWeight: '600', fontSize: '12px' }),
    multiValueRemove: (provided) => ({
      ...provided,
      color: '#0D7A80',
      '&:hover': { backgroundColor: '#0D7A80', color: 'white' },
    }),
    option: (provided, state) => ({
      ...provided,
      fontSize: '14px',
      backgroundColor: state.isSelected ? '#063A3A' : state.isFocused ? 'rgba(13, 122, 128, 0.05)' : 'white',
      color: state.isSelected ? 'white' : '#334155',
      '&:active': { backgroundColor: '#0D7A80' }
    }),
    menuPortal: (base) => ({ ...base, zIndex: 9999 })
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl border border-slate-100 animate-in fade-in zoom-in duration-300">
        <div className="p-5 border-b border-slate-100">
          <h2 className="text-xl font-bold text-[#063A3A]">{team ? 'Edit Team' : 'Create Team'}</h2>
        </div>
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Team Name</label>
            <input className="w-full p-2.5 border border-slate-200 rounded-xl outline-none focus:border-[#0D7A80] text-sm text-slate-700 transition-all" placeholder="e.g. Social Media Team" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Department</label>
            <Select options={depts} onChange={handleDeptChange} styles={customStyles} menuPortalTarget={document.body} placeholder="Select department..." value={depts.find(d => d.value === formData.departmentId)} />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Assign Interns</label>
            <Select isMulti options={interns} value={interns.filter(i => formData.memberIds.includes(i.value))} onChange={vals => setFormData({ ...formData, memberIds: vals.map(v => v.value), teamLeaderId: null })} styles={customStyles} menuPortalTarget={document.body} placeholder="Select members..." closeMenuOnSelect={false} />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Team Leader</label>
            <Select options={availableLeaders} value={availableLeaders.find(i => i.value === formData.teamLeaderId) || null} onChange={val => setFormData({ ...formData, teamLeaderId: val ? val.value : null })} styles={customStyles} menuPortalTarget={document.body} placeholder="Select leader..." />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} disabled={isProcessing} className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 rounded-xl font-semibold text-slate-600 transition-all text-sm">Cancel</button>
            <button type="submit" disabled={isProcessing} className="flex-1 py-2.5 bg-[#063A3A] hover:bg-[#0D7A80] text-white rounded-xl font-semibold shadow-sm transition-all text-sm flex items-center justify-center gap-2">
              {isProcessing ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : (team ? 'Save Changes' : 'Create Team')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TeamModal;