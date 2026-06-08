import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getContentById,
  updateContent
} from "../../services/contentService";
import { toast } from "react-hot-toast";

const EditContentPage = () => {

  const { id } = useParams();
  const navigate = useNavigate();

  const [content, setContent] = useState(null);
  const [file, setFile] = useState(null);

  const [formData, setFormData] =
    useState({
      title: "",
      description: "",
      uploadProvider: "DRIVE",
      googleDriveLink: "",
      scheduledDate: ""
    });

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {

      const response =
        await getContentById(id);

      const data = response.data;

      setContent(data);

      setFormData({
        title: data.title,
        description: data.description,
        uploadProvider:
          data.uploadProvider,
        googleDriveLink:
          data.uploadProvider === "DRIVE"
            ? data.mediaUrl
            : "",
        scheduledDate:
          data.scheduledDate
      });

    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    const multipartData =
      new FormData();

    if (file) {
      multipartData.append(
        "file",
        file
      );
    }

    multipartData.append(
      "data",
      new Blob(
        [
          JSON.stringify({
            title:
              formData.title,
            description:
              formData.description,
            uploadProvider:
              formData.uploadProvider,
            googleDriveLink:
              formData.googleDriveLink,
            scheduledDate:
              formData.scheduledDate
          })
        ],
        {
          type:
            "application/json"
        }
      )
    );

    try {

      await updateContent(
        id,
        multipartData
      );

      toast.success(
        "Content updated successfully"
      );

      navigate(
        `/content/view/${id}`
      );

    } catch (error) {

      toast.error(
        error.response?.data?.message ||
        "Failed to update content"
      );

    }
  };

  if (!content) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto p-6">

      <h1 className="text-2xl font-bold mb-6">
        Edit Content
      </h1>

      <form
        onSubmit={handleSubmit}
        className="space-y-4"
      >

        <input
          type="text"
          placeholder="Title"
          value={formData.title}
          onChange={(e) =>
            setFormData({
              ...formData,
              title: e.target.value
            })
          }
          className="w-full p-3 border rounded-lg"
        />

        <textarea
          value={formData.description}
          placeholder="Description"
          onChange={(e) =>
            setFormData({
              ...formData,
              description:
                e.target.value
            })
          }
          className="w-full p-3 border rounded-lg"
        />

        <select
          value={
            formData.uploadProvider
          }
          onChange={(e) =>
            setFormData({
              ...formData,
              uploadProvider:
                e.target.value
            })
          }
          className="w-full p-3 border rounded-lg"
        >
          <option value="DRIVE">
            Google Drive
          </option>

          <option value="CLOUDNARY">
            Cloudinary Upload
          </option>
        </select>

        {formData.uploadProvider ===
        "DRIVE" ? (

          <input
            type="text"
            placeholder="Google Drive Link"
            value={
              formData.googleDriveLink
            }
            onChange={(e) =>
              setFormData({
                ...formData,
                googleDriveLink:
                  e.target.value
              })
            }
            className="w-full p-3 border rounded-lg"
          />

        ) : (

          <input
            type="file"
            onChange={(e) =>
              setFile(
                e.target.files[0]
              )
            }
            className="w-full p-3 border rounded-lg"
          />

        )}

        <input
          type="date"
          value={
            formData.scheduledDate
          }
          onChange={(e) =>
            setFormData({
              ...formData,
              scheduledDate:
                e.target.value
            })
          }
          className="w-full p-3 border rounded-lg"
        />

        <div className="flex gap-3">

          <button
            type="button"
            onClick={() =>
              navigate(-1)
            }
            className="px-5 py-3 border rounded-lg"
          >
            Cancel
          </button>

          <button
            type="submit"
            className="
              px-5
              py-3
              bg-blue-600
              text-white
              rounded-lg
            "
          >
            Update Content
          </button>

        </div>

      </form>

    </div>
  );
};

export default EditContentPage;