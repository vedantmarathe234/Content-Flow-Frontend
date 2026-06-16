import React, { useState, useEffect, useRef } from 'react';
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
  const [showDeptMenu, setShowDeptMenu] = useState(false);
  const [showMemberMenu, setShowDeptMemberMenu] = useState(false);
  const [showLeaderMenu, setShowLeaderMenu] = useState(false);
  const deptMenuRef = useRef(null);
  const memberMenuRef = useRef(null);
  const leaderMenuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (deptMenuRef.current && !deptMenuRef.current.contains(event.target)) {
        setShowDeptMenu(false);
      }
      if (memberMenuRef.current && !memberMenuRef.current.contains(event.target)) {
        setShowDeptMemberMenu(false);
      }
      if (leaderMenuRef.current && !leaderMenuRef.current.contains(event.target)) {
        setShowLeaderMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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

  if (!isOpen) return null;

  const selectedDept = depts.find(d => d.value === formData.departmentId);
  const selectedLeader = availableLeaders.find(i => i.value === formData.teamLeaderId);
  const selectedMembers = interns.filter(i => formData.memberIds.includes(i.value));

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl border border-l-[4px] border-l-[#0D7A80] border-slate-100 animate-in fade-in zoom-in duration-300">
        <div className="p-5 border-b border-slate-100">
          <h2 className="text-xl font-bold text-[#063A3A]">{team ? 'Edit Team' : 'Create Team'}</h2>
        </div>
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Team Name</label>
            <input 
              className="w-full border border-slate-200 bg-slate-50 rounded-xl px-4 py-2.5 text-sm outline-none transition-all focus:border-[#0A5B63] focus:bg-white focus:ring-4 focus:ring-[#0A5B63]/8 placeholder:text-slate-300 font-medium text-slate-700" 
              placeholder="e.g. Social Media Team" 
              value={formData.name} 
              onChange={e => setFormData({ ...formData, name: e.target.value })} 
              required 
            />
          </div>
          
          <div className="relative" ref={deptMenuRef}>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Department</label>
            <div 
              onClick={() => setShowDeptMenu(!showDeptMenu)}
              className={`flex items-center border rounded-xl transition-all duration-200 overflow-hidden cursor-pointer ${
                showDeptMenu 
                  ? "border-[#0A5B63] bg-white ring-4 ring-[#0A5B63]/8" 
                  : "border-slate-200 bg-slate-50 hover:border-slate-300"
              }`}
            >
              <div className="w-full px-4 py-2.5 text-sm text-slate-700 font-medium select-none bg-transparent">
                {selectedDept ? selectedDept.label : "Select department..."}
              </div>
              <div className="px-3.5 py-2.5 text-slate-400 border-l border-slate-200 text-[10px] bg-slate-50 shrink-0 self-stretch flex items-center justify-center">
                ▼
              </div>
            </div>

            {showDeptMenu && (
              <div className="absolute left-0 right-0 mt-1 bg-white border border-slate-100 rounded-xl shadow-xl z-50 py-1.5 animate-in slide-in-from-top-2 max-h-48 overflow-y-auto">
                {depts.map((dept) => (
                  <button 
                    key={dept.value}
                    type="button" 
                    className="w-full text-left px-4 py-2 hover:bg-[#0D7A80]/5 hover:text-[#063A3A] font-bold transition-colors text-xs uppercase tracking-wider text-slate-600" 
                    onClick={() => { handleDeptChange(dept); setShowDeptMenu(false); }}
                  >
                    {dept.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="relative" ref={memberMenuRef}>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Assign Interns</label>
            <div 
              onClick={() => setShowDeptMemberMenu(!showMemberMenu)}
              className={`flex items-center border rounded-xl transition-all duration-200 overflow-hidden cursor-pointer ${
                showMemberMenu 
                  ? "border-[#0A5B63] bg-white ring-4 ring-[#0A5B63]/8" 
                  : "border-slate-200 bg-slate-50 hover:border-slate-300"
              }`}
            >
              <div className="w-full px-4 py-2.5 text-sm text-slate-700 font-medium select-none bg-transparent flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
                {selectedMembers.length > 0 ? (
                  selectedMembers.map(m => (
                    <span 
                      key={m.value} 
                      className="bg-[#0D7A80]/5 text-[#063A3A] font-bold text-xs px-2.5 py-1 border border-[#0D7A80]/15 rounded-lg flex items-center gap-1.5 transition-colors hover:bg-[#0D7A80]/10"
                    >
                      {m.label}
                      <span 
                        className="cursor-pointer text-[#0D7A80] hover:text-red-500 font-bold text-[11px] px-0.5" 
                        onClick={(e) => {
                          e.stopPropagation();
                          setFormData({ ...formData, memberIds: formData.memberIds.filter(id => id !== m.value), teamLeaderId: null });
                        }}
                      >
                        ✕
                      </span>
                    </span>
                  ))
                ) : (
                  <span className="text-slate-400 text-sm font-normal">Select members...</span>
                )}
              </div>
              <div className="px-3.5 py-2.5 text-slate-400 border-l border-slate-200 text-[10px] bg-slate-50 shrink-0 self-stretch flex items-center justify-center">
                ▼
              </div>
            </div>

            {showMemberMenu && (
              <div className="absolute left-0 right-0 mt-1 bg-white border border-slate-100 rounded-xl shadow-xl z-50 py-1.5 animate-in slide-in-from-top-2 max-h-48 overflow-y-auto">
                {interns.map((intern) => {
                  const isChecked = formData.memberIds.includes(intern.value);
                  return (
                    <button 
                      key={intern.value}
                      type="button" 
                      className={`w-full text-left px-4 py-2 hover:bg-[#0D7A80]/5 hover:text-[#063A3A] font-bold transition-colors text-xs uppercase tracking-wider flex justify-between items-center ${isChecked ? 'text-[#0D7A80] bg-[#0D7A80]/5' : 'text-slate-600'}`}
                      onClick={() => {
                        const updatedIds = isChecked 
                          ? formData.memberIds.filter(id => id !== intern.value)
                          : [...formData.memberIds, intern.value];
                        setFormData({ ...formData, memberIds: updatedIds, teamLeaderId: null });
                      }}
                    >
                      <span>{intern.label}</span>
                      {isChecked && <span className="text-xs font-bold">✓</span>}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <div className="relative" ref={leaderMenuRef}>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Team Leader</label>
            <div 
              onClick={() => setShowLeaderMenu(!showLeaderMenu)}
              className={`flex items-center border rounded-xl transition-all duration-200 overflow-hidden cursor-pointer ${
                showLeaderMenu 
                  ? "border-[#0A5B63] bg-white ring-4 ring-[#0A5B63]/8" 
                  : "border-slate-200 bg-slate-50 hover:border-slate-300"
              }`}
            >
              <div className="w-full px-4 py-2.5 text-sm text-slate-700 font-medium select-none bg-transparent">
                {selectedLeader ? selectedLeader.label : "Select leader..."}
              </div>
              <div className="px-3.5 py-2.5 text-slate-400 border-l border-slate-200 text-[10px] bg-slate-50 shrink-0 self-stretch flex items-center justify-center">
                ▼
              </div>
            </div>

            {showLeaderMenu && (
              <div className="absolute left-0 right-0 mt-1 bg-white border border-slate-100 rounded-xl shadow-xl z-50 py-1.5 animate-in slide-in-from-top-2 max-h-48 overflow-y-auto">
                {availableLeaders.map((leader) => (
                  <button 
                    key={leader.value}
                    type="button" 
                    className="w-full text-left px-4 py-2 hover:bg-[#0D7A80]/5 hover:text-[#063A3A] font-bold transition-colors text-xs uppercase tracking-wider text-slate-600" 
                    onClick={() => { setFormData({ ...formData, teamLeaderId: leader.value }); setShowLeaderMenu(false); }}
                  >
                    {leader.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} disabled={isProcessing} className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 rounded-xl font-semibold text-slate-600 transition-all text-sm cursor-pointer">Cancel</button>
            <button type="submit" disabled={isProcessing} className="flex-1 py-2.5 bg-[#063A3A] hover:bg-[#0D7A80] text-white rounded-xl font-semibold shadow-sm transition-all text-sm flex items-center justify-center gap-2 cursor-pointer">
              {isProcessing ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : (team ? 'Save Changes' : 'Create Team')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TeamModal;