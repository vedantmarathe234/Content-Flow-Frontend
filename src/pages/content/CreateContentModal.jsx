import React, { useState, useEffect } from "react";
import Select from "react-select";
import API from "../../services/api";
import { toast } from "react-hot-toast";
import { createContent } from "../../services/contentService";

const CreateContentModal = ({ isOpen, onClose, onRefresh,selectedDate }) => {
const [formData, setFormData] = useState({
  title: "",
  description: "",
  contentType: "INDIVIDUAL",
  departmentId: null,
  teamId: null,
  uploadProvider: "DRIVE",
  googleDriveLink: "",
  scheduledDate: selectedDate || ""
});

const [sourceSelected, setSourceSelected] = useState(false);

useEffect(() => {
  if (selectedDate) {
    setFormData(prev => ({
      ...prev,
      scheduledDate: selectedDate
    }));
  }
}, [selectedDate]);

  const [teams, setTeams] = useState([]);
  const [file, setFile] = useState(null);

  useEffect(() => {
  fetchTeams();
}, []);

const fetchTeams = async () => {
  try {
    const { data } = await API.get("/teams/my-team");

    setTeams(
      data.map(team => ({
        value: team.id,
        label: `${team.name} (${team.departmentName})`
      }))
    );
  } catch (error) {
    console.error(error);
  }
};

 const handleSubmit = async (e) => {
  e.preventDefault();
  if (!formData.title.trim()) {
  toast.error("Title is required");
  return;
}

if (!formData.description.trim()) {
  toast.error("Description is required");
  return;
}

if (!formData.scheduledDate) {
  toast.error("Scheduled date is required");
  return;
}

if (
  formData.contentType === "TEAM" &&
  !formData.teamId
) {
  toast.error("Please select a team");
  return;
}

if (
  formData.uploadProvider === "DRIVE" &&
  !formData.googleDriveLink
) {
  toast.error("Please enter a Google Drive link");
  return;
}

if (
  formData.uploadProvider === "CLOUDNARY" &&
  !file
) {
  toast.error("Please select a file");
  return;
}

  const multipartData = new FormData();

  if (file) {
    multipartData.append("file", file);
  }

  multipartData.append(
    "data",
    new Blob(
      [
        JSON.stringify({
          title: formData.title,
          description: formData.description,
          uploadProvider: formData.uploadProvider,
          googleDriveLink: formData.googleDriveLink,
          scheduledDate: formData.scheduledDate,
          teamId: formData.teamId,
        }),
      ],
      { type: "application/json" }
    )
  );

  try {
   await createContent(multipartData);

    toast.success("Content created successfully");

    onRefresh();
    onClose();

  } catch (error) {
    console.error(error);
    toast.error("Failed to create content");
  }
};



  const customStyles = {
    control: (provided) => ({
      ...provided,
      borderRadius: "10px",
      borderColor: "#e2e8f0",
      minHeight: "42px",
      fontSize: "14px",
    }),
    menuPortal: (base) => ({
      ...base,
      zIndex: 9999,
    }),
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
 <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl animate-in fade-in zoom-in duration-300">
<div className="p-5 pb-0 border-b border-slate-100">
  <h2 className="text-xl font-bold text-slate-800">
    Create Content
  </h2>
</div>
 
<form
  onSubmit={handleSubmit}
  className="
    p-5 pt-0
    space-y-4
    overflow-y-auto
    flex-1
  "
>

          <div>
            <label className="block
text-xs
font-bold
text-slate-500
uppercase
mb-1">
              Content Type
            </label>

            <div className="flex gap-2">

              <button
                type="button"
                onClick={() =>
                  setFormData((prev) => ({
                    ...prev,
                    contentType: "INDIVIDUAL",
                    departmentId: null,
                    teamId: null,
                  }))
                }
                className={`flex-1 py-2 rounded-lg border ${
                  formData.contentType === "INDIVIDUAL"
                    ? "bg-blue-600 text-white"
                    : "bg-white"
                }`}
              >
                Individual
              </button>

              <button
                type="button"
                onClick={() =>
                  setFormData((prev) => ({
                    ...prev,
                    contentType: "TEAM",
                  }))
                }
                className={`flex-1 py-2 rounded-lg border ${
                  formData.contentType === "TEAM"
                    ? "bg-blue-600 text-white"
                    : "bg-white"
                }`}
              >
                Team
              </button>

            </div>
          </div>

          <div>
            <label className="block
text-xs
font-bold
text-slate-500
uppercase
mb-1">
              Title
            </label>

            <input
              type="text"
              className="w-full
p-2
border
border-slate-200
rounded-lg
focus:ring-2
focus:ring-blue-500
outline-none
transition-all
text-sm"
              value={formData.title}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  title: e.target.value,
                })
              }
            />
          </div>

          <div>
            <label className="block
text-xs
font-bold
text-slate-500
uppercase
mb-1">
              Description
            </label>

            <textarea
              rows={formData.contentType === "TEAM" ? 1 : 5}
              className="w-full
p-2
border
border-slate-200
rounded-lg
focus:ring-2
focus:ring-blue-500
outline-none
transition-all
text-sm"
              value={formData.description}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  description: e.target.value,
                })
              }
            />
          </div>

         {formData.contentType === "TEAM" && (
  <div className="grid grid gap-3">

  
    <div>
      <label
        className="
        block
        text-xs
        font-bold
        text-slate-500
        uppercase
        mb-1
        "
      >
        Team
      </label>

      <Select
        options={teams}
        styles={customStyles}
        menuPortalTarget={document.body}
        placeholder="Select Team"
        onChange={(selected) =>
          setFormData((prev) => ({
            ...prev,
            teamId: selected.value,
          }))
        }
      />
    </div>

  </div>
)}


    <div>
  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
    Media Source
  </label>

  {!sourceSelected ? (
    <select
      className="w-full p-2 border rounded-lg"
      onChange={(e) => {
        setFormData({
          ...formData,
          uploadProvider: e.target.value,
        });

        setSourceSelected(true);
      }}
      defaultValue=""
    >
      <option value="" disabled>
        Select Media Source
      </option>

      <option value="DRIVE">
        Google Drive
      </option>

      <option value="CLOUDNARY">
        Upload File
      </option>
    </select>
  ) : formData.uploadProvider === "DRIVE" ? (
    <>
      <input
        type="text"
        placeholder="Paste Google Drive Link"
        className="w-full p-2 border rounded-lg"
        value={formData.googleDriveLink}
        onChange={(e) =>
          setFormData({
            ...formData,
            googleDriveLink: e.target.value,
          })
        }
      />

      <button
        type="button"
        className="text-blue-600 text-sm mt-2"
        onClick={() => setSourceSelected(false)}
      >
        Change Source
      </button>
    </>
  ) : (
    <>
      <input
        type="file"
        className="w-full p-2 border rounded-lg"
        onChange={(e) =>
          setFile(e.target.files[0])
        }
      />

      <button
        type="button"
        className="text-blue-600 text-sm mt-2"
        onClick={() => setSourceSelected(false)}
      >
        Change Source
      </button>
    </>
  )}
</div>

          <div>
            <label className="block
text-xs
font-bold
text-slate-500
uppercase
mb-1">
              Scheduled Date
            </label>

            <input
              type="date"
              className="w-full
p-2
border
border-slate-200
rounded-lg
focus:ring-2
focus:ring-blue-500
outline-none
transition-all
text-sm"
              value={formData.scheduledDate}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  scheduledDate: e.target.value,
                })
              }
            />
          </div>

         <div className="flex gap-3 pt-2">

  <button
    type="button"
    onClick={onClose}
    className="
    flex-1
    py-2
    border
    border-slate-200
    rounded-lg
    font-semibold
    text-slate-600
    hover:bg-slate-50
    transition-all
    "
  >
    Cancel
  </button>

  <button
    type="submit"
    className="
    flex-1
    py-2
    bg-blue-600
    hover:bg-blue-700
    text-white
    rounded-lg
    font-semibold
    shadow-md
    transition-all
    "
  >
    Create Content
  </button>

</div>

        </form>
      </div>
    </div>
  );
};

export default CreateContentModal;