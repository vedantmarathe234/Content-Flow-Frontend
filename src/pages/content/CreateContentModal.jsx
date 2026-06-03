import React, { useState, useEffect } from "react";
import Select from "react-select";
import API from "../../services/api";
import { toast } from "react-hot-toast";
import { createContent } from "../../services/contentService";

const CreateContentModal = ({ isOpen, onClose, onRefresh }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    contentType: "INDIVIDUAL",
    departmentId: null,
    teamId: null,
    uploadProvider: "DRIVE",
    googleDriveLink: "",
    scheduledDate: ""
  });

  const [departments, setDepartments] = useState([]);
  const [teams, setTeams] = useState([]);
  const [file, setFile] = useState(null);

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      const res = await API.get("/departments/all");

      setDepartments(
        res.data.map((dept) => ({
          value: dept.id,
          label: dept.name,
        }))
      );
    } catch (error) {
      console.error(error);
    }
  };

  const handleDepartmentChange = async (selected) => {
    setFormData((prev) => ({
      ...prev,
      departmentId: selected.value,
      teamId: null,
    }));

    try {
      const res = await API.get(
        `/teams/department/${selected.value}`
      );

      setTeams(
        res.data.map((team) => ({
          value: team.id,
          label: team.name,
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
  <div className="grid grid-cols-2 gap-3">

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
        Department
      </label>

      <Select
        options={departments}
        styles={customStyles}
        menuPortalTarget={document.body}
        onChange={handleDepartmentChange}
        placeholder="Select Department"
      />
    </div>

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
  <label className="block
text-xs
font-bold
text-slate-500
uppercase
mb-1">
    Upload Provider
  </label>

  <select
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
    value={formData.uploadProvider}
    onChange={(e) =>
      setFormData({
        ...formData,
        uploadProvider: e.target.value,
      })
    }
  >
    <option value="DRIVE">
      Google Drive Link
    </option>

    <option value="CLOUDNARY">
      Upload File
    </option>
  </select>
</div>


          {formData.uploadProvider === "DRIVE" ? (

  <div>
    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
      Google Drive Link
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
      value={formData.googleDriveLink}
      onChange={(e) =>
        setFormData({
          ...formData,
          googleDriveLink: e.target.value,
        })
      }
    />
  </div>

) : (

  <div>
    <label className="block
text-xs
font-bold
text-slate-500
uppercase
mb-1">
      Upload File
    </label>

    <input
      type="file"
      className="
w-full
p-2
border
border-slate-200
rounded-lg
focus:ring-2
focus:ring-blue-500
outline-none
transition-all
text-sm
"
      onChange={(e) =>
        setFile(e.target.files[0])
      }
    />
  </div>

)}

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