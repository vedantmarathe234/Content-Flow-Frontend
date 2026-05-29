import { useEffect, useState } from "react";

const departments = [
  "Graphic Design",
  "Digital Marketing",
  "Video Editing",
  "UI/UX Screens",
  "SEO & Content",
];

const avatarColors = [
  "#2767b1",
  "#915d38",
  "#af7b32",
  "#5d7f90",
  "#7a6a5c",
  "#8e5475",
  "#22735f",
  "#6556b8",
];

const icons = {
  search: (
      <>
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-4.3-4.3" />
      </>
  ),
  plus: <path d="M12 5v14M5 12h14" />,
  edit: (
      <>
        <path d="M12 20h9" />
        <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
      </>
  ),
  trash: (
      <>
        <path d="M3 6h18" />
        <path d="M8 6V4h8v2" />
        <path d="m19 6-1 14H6L5 6" />
      </>
  ),
  caret: <path d="m6 9 6 6 6-6" />,
  check: <path d="m5 12 4 4L19 6" />,
  close: <path d="M18 6 6 18M6 6l12 12" />,
};

const styles = `
.teams-page{padding:32px 26px;background:#f4f3fa;min-height:100vh}
.teams-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:25px}
.teams-header h1{margin:0;color:#121826;font-size:20px;font-weight:700}
.teams-actions{display:flex;align-items:center;gap:14px}
.search-box{width:min(260px,42vw);height:32px;display:flex;align-items:center;gap:9px;padding:0 11px;border:1px solid #dfe1eb;border-radius:4px;color:#8b93a4;background:#fff}
.search-box input{width:100%;border:0;outline:0;color:#283142;font-size:12px}
.search-box input::placeholder{color:#8992a6}
.create-button{min-height:32px;display:inline-flex;align-items:center;gap:8px;padding:0 16px;border-radius:4px;background:#1c32d1;color:#fff;box-shadow:0 2px 5px rgba(28,50,209,.25);cursor:pointer;font-size:12px;font-weight:700;border:0}
.create-button:hover,.primary-button:hover{background:#1528b6}
.teams-grid{display:grid;grid-template-columns:repeat(3,minmax(230px,1fr));gap:18px}
.empty-state{padding:80px 20px;color:#6b7280;text-align:center;font-size:14px}
.team-card{min-height:197px;padding:20px 18px;border:1px solid #d7d8e4;border-radius:9px;background:#fff;box-shadow:0 1px 2px rgba(17,24,39,.03)}
.team-card-header{display:flex;align-items:flex-start;justify-content:space-between;gap:10px;margin-bottom:26px}
.team-card h3,.team-card p,.members-block h4{margin:0}
.team-card h3{color:#0b1220;font-size:13px;font-weight:800;line-height:1.2}
.team-card p{margin-top:4px;color:#111827;font-size:12px;font-weight:500}
.card-actions{display:flex;gap:10px}
.icon-button{width:25px;height:25px;display:grid;place-items:center;border-radius:5px;cursor:pointer;border:0}
.icon-button.edit{background:#eef0ff;color:#1c32d1}
.icon-button.delete{background:#fff0f1;color:#dc4b5b}
.members-block h4{margin-bottom:12px;color:#0c1321;font-size:12px;font-weight:800}
.member-list{display:grid;gap:10px}
.member-row{display:flex;align-items:center;gap:10px;color:#111827;font-size:12px;font-weight:600}
.avatar{width:25px;height:25px;display:inline-grid;place-items:center;flex:0 0 auto;border-radius:50%;border:1px solid color-mix(in srgb,var(--avatar-color) 45%,transparent);background:color-mix(in srgb,var(--avatar-color) 24%,#fff);color:var(--avatar-color);font-size:9px;font-weight:800}
.avatar-small{width:17px;height:17px;font-size:7px}
.modal-anchor{position:fixed;inset:0;z-index:20;background:rgba(15,23,42,.25);display:grid;place-items:center;padding:16px}
.team-modal{width:min(352px,100%);padding:24px 24px 25px;border:1px solid #d7d8e4;border-radius:10px;background:#fff;box-shadow:0 16px 32px rgba(15,23,42,.22)}
.team-modal h2,.delete-dialog h2{margin:0 0 20px;color:#0c1321;font-size:20px;font-weight:800}
.form-field{position:relative;margin-bottom:14px}
.form-field label{display:block;margin-bottom:7px;color:#101827;font-size:12px;font-weight:700}
.form-field input,.form-field select,.multi-select{width:100%;min-height:32px;border:1px solid #cfd2df;border-radius:6px;background:#fff;color:#0f172a;outline:0;font-size:12px}
.form-field input,.form-field select{padding:0 10px}
.input-error{border-color:#dc4b5b!important}
.multi-select{display:flex;align-items:center;justify-content:space-between;gap:8px;padding:4px 8px;cursor:pointer;text-align:left}
.selected-items{display:flex;align-items:center;flex-wrap:wrap;gap:4px;min-width:0}
.placeholder{color:#818898}
.select-chip{min-height:20px;display:inline-flex;align-items:center;gap:4px;padding:2px 6px;border-radius:999px;background:#e8e9f7;color:#374151;cursor:pointer;font-size:11px;font-weight:500;border:0}
.select-menu{position:absolute;top:calc(100% + 4px);right:0;left:0;z-index:30;overflow:hidden;border:1px solid #d5d7e3;border-radius:5px;background:#fff;box-shadow:0 8px 18px rgba(15,23,42,.14)}
.select-option{width:100%;min-height:28px;display:flex;align-items:center;gap:8px;padding:6px 10px;background:#fff;color:#0f172a;cursor:pointer;text-align:left;font-size:12px;border:0}
.select-option:hover,.select-option.selected{background:#ededfb}
.select-option span:nth-child(2){flex:1}
.select-empty{padding:10px;color:#6b7280;font-size:12px}
.error-text{margin:5px 0 0;color:#dc4b5b;font-size:12px;font-weight:600}
.error-text.stacked{margin-top:-9px;margin-bottom:10px}
.modal-actions{display:grid;grid-template-columns:1fr 1fr;gap:13px;margin-top:20px}
.primary-button,.secondary-button,.danger-button{min-height:32px;border-radius:5px;cursor:pointer;font-size:12px;font-weight:700;border:0}
.primary-button{background:#1c32d1;color:#fff}
.secondary-button{border:1px solid #cdd0da;background:#eeeff3;color:#111827}
.danger-button{background:#dc4b5b;color:#fff}
.dialog-backdrop{position:fixed;inset:0;z-index:40;display:grid;place-items:center;padding:18px;background:rgba(15,23,42,.35)}
.delete-dialog{width:min(380px,100%);padding:26px;border-radius:10px;background:#fff;text-align:center;box-shadow:0 16px 36px rgba(15,23,42,.25)}
.delete-dialog p{margin:0;color:#596274;font-size:13px;line-height:1.5}
.delete-icon{width:44px;height:44px;display:grid;place-items:center;margin:0 auto 14px;border-radius:50%;background:#fff0f1;color:#dc4b5b}
@media(max-width:1100px){.teams-grid{grid-template-columns:repeat(2,minmax(230px,1fr))}}
@media(max-width:760px){.teams-page{padding:20px 16px}.teams-header{align-items:stretch;flex-direction:column;gap:14px}.teams-actions{align-items:stretch;flex-direction:column}.search-box{width:100%}.teams-grid{grid-template-columns:1fr}}
`;

function parseJson(value) {
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

function initials(name) {
  return name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase();
}

function getName(user) {
  const joinedName = [user.firstName, user.lastName].filter(Boolean).join(" ");
  return user.name || user.fullName || user.username || joinedName || user.email?.split("@")[0] || "";
}

function isIntern(user, key) {
  const storageKey = key.toLowerCase();
  const role = String(user.role || user.type || user.accountType || user.userType || "").toLowerCase();
  return storageKey.includes("intern") || role.includes("intern") || user.isIntern === true;
}

function normalizeUsers(value) {
  if (Array.isArray(value)) return value;

  if (value && typeof value === "object") {
    const objectValues = Object.values(value);
    const isObjectList = objectValues.every((item) => item && typeof item === "object");
    return isObjectList ? objectValues : [value];
  }

  return [];
}

function loadInternsFromStorage() {
  if (typeof localStorage === "undefined") return [];

  const interns = [];
  const seen = new Set();

  for (let index = 0; index < localStorage.length; index += 1) {
    const key = localStorage.key(index) || "";
    const users = normalizeUsers(parseJson(localStorage.getItem(key)));

    users.forEach((user, userIndex) => {
      const name = getName(user);
      const id = String(user._id || user.id || user.email || `${key}-${userIndex}-${name}`);

      if (!name || !isIntern(user, key) || seen.has(id)) return;

      seen.add(id);
      interns.push({
        id,
        name,
        avatar: initials(name),
        color: avatarColors[interns.length % avatarColors.length],
      });
    });
  }

  return interns;
}

function sameInterns(currentInterns, nextInterns) {
  return JSON.stringify(currentInterns) === JSON.stringify(nextInterns);
}

function Icon({ name }) {
  return (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        {icons[name]}
      </svg>
  );
}

function Avatar({ intern, small = false }) {
  return (
      <span className={small ? "avatar avatar-small" : "avatar"} style={{ "--avatar-color": intern.color }}>
      {intern.avatar}
    </span>
  );
}

function MultiSelect({ label, interns, selected, setSelected, single = false }) {
  const [open, setOpen] = useState(false);
  const selectedInterns = interns.filter((intern) => selected.includes(intern.id));

  const toggle = (id) => {
    if (selected.includes(id)) {
      setSelected(selected.filter((selectedId) => selectedId !== id));
      return;
    }

    setSelected(single ? [id] : [...selected, id]);
  };

  return (
      <div className="form-field">
        <label>{label}</label>

        <button className="multi-select" type="button" onClick={() => setOpen(!open)}>
        <span className="selected-items">
          {selectedInterns.length === 0 && <span className="placeholder">Select...</span>}

          {selectedInterns.map((intern) => (
              <button
                  className="select-chip"
                  type="button"
                  key={intern.id}
                  onClick={(event) => {
                    event.stopPropagation();
                    toggle(intern.id);
                  }}
              >
                <Avatar intern={intern} small />
                <span>{intern.name}</span>
                <Icon name="close" />
              </button>
          ))}
        </span>

          <Icon name="caret" />
        </button>

        {open && (
            <div className="select-menu">
              {interns.length === 0 && <div className="select-empty">No interns found from signup data.</div>}

              {interns.map((intern) => (
                  <button
                      className={selected.includes(intern.id) ? "select-option selected" : "select-option"}
                      type="button"
                      key={intern.id}
                      onClick={() => toggle(intern.id)}
                  >
                    <Avatar intern={intern} />
                    <span>{intern.name}</span>
                    {selected.includes(intern.id) && <Icon name="check" />}
                  </button>
              ))}
            </div>
        )}
      </div>
  );
}

function TeamModal({ team, mode, interns, close, save }) {
  const [form, setForm] = useState({
    name: team?.name || "",
    department: team?.department || departments[0],
    members: team?.members || [],
    leader: team?.leader ? [team.leader] : [],
  });

  const [errors, setErrors] = useState({});

  const setField = (key, value) => {
    setForm({ ...form, [key]: value });
  };

  const submit = () => {
    const nextErrors = {};

    if (!form.name.trim()) nextErrors.name = "Team name is required";
    if (form.members.length === 0) nextErrors.members = "Select at least one intern";
    if (form.leader.length === 0) nextErrors.leader = "Select a team leader";

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length === 0) {
      save({ ...form, leader: form.leader[0] });
    }
  };

  return (
      <div className="modal-anchor" onClick={close}>
        <section className="team-modal" onClick={(event) => event.stopPropagation()}>
          <h2>{mode === "create" ? "Create Team" : "Edit Team"}</h2>

          <div className="form-field">
            <label>Team Name</label>
            <input className={errors.name ? "input-error" : ""} value={form.name} onChange={(event) => setField("name", event.target.value)} />
            {errors.name && <p className="error-text">{errors.name}</p>}
          </div>

          <div className="form-field">
            <label>Select Department</label>
            <select value={form.department} onChange={(event) => setField("department", event.target.value)}>
              {departments.map((department) => (
                  <option key={department}>{department}</option>
              ))}
            </select>
          </div>

          <MultiSelect label="Select Interns" interns={interns} selected={form.members} setSelected={(members) => setField("members", members)} />
          {errors.members && <p className="error-text stacked">{errors.members}</p>}

          <MultiSelect label="Select Team Leader" interns={interns.filter((intern) => form.members.includes(intern.id))} selected={form.leader} setSelected={(leader) => setField("leader", leader)} single />
          {errors.leader && <p className="error-text stacked">{errors.leader}</p>}

          <div className="modal-actions">
            <button className="primary-button" type="button" onClick={submit}>
              {mode === "create" ? "Create Team" : "Save Changes"}
            </button>
            <button className="secondary-button" type="button" onClick={close}>
              Cancel
            </button>
          </div>
        </section>
      </div>
  );
}

function TeamCard({ team, interns, edit, remove }) {
  const teamMembers = interns.filter((intern) => team.members.includes(intern.id));

  return (
      <article className="team-card">
        <header className="team-card-header">
          <div>
            <h3>{team.name}</h3>
            <p>{team.department}</p>
          </div>

          <div className="card-actions">
            <button className="icon-button edit" type="button" title="Edit team" onClick={() => edit(team)}>
              <Icon name="edit" />
            </button>
            <button className="icon-button delete" type="button" title="Delete team" onClick={() => remove(team)}>
              <Icon name="trash" />
            </button>
          </div>
        </header>

        <div className="members-block">
          <h4>Members</h4>

          <div className="member-list">
            {teamMembers.slice(0, 4).map((intern) => (
                <div className="member-row" key={intern.id}>
                  <Avatar intern={intern} />
                  <span>{intern.name}</span>
                </div>
            ))}
          </div>
        </div>
      </article>
  );
}

export default function Teams() {
  const [interns, setInterns] = useState(loadInternsFromStorage);
  const [teams, setTeams] = useState([]);
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState(null);
  const [editTarget, setEditTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const refreshInterns = () => {
    const nextInterns = loadInternsFromStorage();
    setInterns((currentInterns) =>
        sameInterns(currentInterns, nextInterns) ? currentInterns : nextInterns
    );
  };

  useEffect(() => {
    window.addEventListener("storage", refreshInterns);
    window.addEventListener("intern-signup", refreshInterns);
    window.addEventListener("focus", refreshInterns);

    const refreshTimer = window.setInterval(refreshInterns, 1000);

    return () => {
      window.removeEventListener("storage", refreshInterns);
      window.removeEventListener("intern-signup", refreshInterns);
      window.removeEventListener("focus", refreshInterns);
      window.clearInterval(refreshTimer);
    };
  }, []);

  const filteredTeams = teams.filter((team) =>
      `${team.name} ${team.department}`.toLowerCase().includes(search.toLowerCase())
  );

  const openCreateModal = () => {
    refreshInterns();
    setModal("create");
  };

  const createTeam = (team) => {
    setTeams([...teams, { id: Date.now(), ...team }]);
    setModal(null);
  };

  const updateTeam = (team) => {
    setTeams(
        teams.map((existingTeam) =>
            existingTeam.id === editTarget.id ? { ...editTarget, ...team } : existingTeam
        )
    );
    setEditTarget(null);
  };

  const deleteTeam = () => {
    setTeams(teams.filter((team) => team.id !== deleteTarget.id));
    setDeleteTarget(null);
  };

  return (
      <main className="teams-page">
        <style>{styles}</style>

        <div className="teams-header">
          <h1>Teams</h1>

          <div className="teams-actions">
            <div className="search-box">
              <Icon name="search" />
              <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search teams..."
              />
            </div>

            <button className="create-button" type="button" onClick={openCreateModal}>
              <Icon name="plus" />
              CREATE TEAM
            </button>
          </div>
        </div>

        {filteredTeams.length === 0 ? (
            <div className="empty-state">No teams created yet.</div>
        ) : (
            <section className="teams-grid">
              {filteredTeams.map((team) => (
                  <TeamCard
                      key={team.id}
                      team={team}
                      interns={interns}
                      edit={setEditTarget}
                      remove={setDeleteTarget}
                  />
              ))}
            </section>
        )}

        {modal === "create" && (
            <TeamModal
                mode="create"
                interns={interns}
                close={() => setModal(null)}
                save={createTeam}
            />
        )}

        {editTarget && (
            <TeamModal
                mode="edit"
                team={editTarget}
                interns={interns}
                close={() => setEditTarget(null)}
                save={updateTeam}
            />
        )}

        {deleteTarget && (
            <div className="dialog-backdrop" onClick={() => setDeleteTarget(null)}>
              <section className="delete-dialog" onClick={(event) => event.stopPropagation()}>
                <div className="delete-icon">
                  <Icon name="trash" />
                </div>

                <h2>Delete Team?</h2>

                <p>
                  Are you sure you want to delete <strong>{deleteTarget.name}</strong>? This
                  action cannot be undone.
                </p>

                <div className="modal-actions">
                  <button className="danger-button" type="button" onClick={deleteTeam}>
                    Delete
                  </button>
                  <button className="secondary-button" type="button" onClick={() => setDeleteTarget(null)}>
                    Cancel
                  </button>
                </div>
              </section>
            </div>
        )}
      </main>
  );
}
