import axios from "axios";
import React, {
  useState,
  useEffect,
  ChangeEvent,
  FormEvent,
  useRef,
} from "react";
import api from "../api";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Navigate, useNavigate, useParams } from "react-router-dom";

interface FormData {
  id: string;
  title: string;
  type: string;
  description: string;
  slug: string;
  level: string;
  sub_level: string;
  image_url: string;
}

interface UpdateCourseProps {
  id?: string;
}

const UpdateCourse: React.FC<UpdateCourseProps> = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    id: "",
    title: "",
    type: "",
    description: "",
    slug: "",
    level: "",
    image_url: "",
    sub_level: "",
  });
  const [image, setImage] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const levels = [
    { label: "Primaire", value: "primaire" },
    { label: "Collège", value: "college" },
    { label: "Lycée", value: "lycee" },
    { label: "Université", value: "Université" },
  ];

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        const response = await api.get(`/courses/${id}`);
        const course = response.data;
        console.log(course);
        setFormData({
          id: course.id,
          title: course.title,
          type: course.type,
          description: course.description,
          slug: course.slug,
          image_url: course.image_url,
          level: course.level,
          sub_level: course.sub_level,
        });
      } catch (err) {
        setError("Failed to load course data");
      }
    };
    fetchCourseData();
  }, [id]);

  const hiddenFileInput = useRef<HTMLInputElement | null>(null);

  const handleClick = () => {
    hiddenFileInput.current?.click();
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setFormData((prevFormData) => ({
          ...prevFormData,
          image_url: reader.result as string, // Base64 de l'image
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };
  const handleQuillChange = (value: string) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      description: value,
    }));
  };
  const generateSlug = (text: string): string => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-");
  };

  const handleUpdate = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const formDataToSubmit = {
        ...formData,
        slug: generateSlug(formData.title),
      };
      const response = await api.put(`/courses/${id}`, formDataToSubmit, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log("response:", response.data);
      alert("Course updated successfully!");
      navigate("/courses");
      setFormData({
        id: "",
        title: "",
        type: "",
        description: "",
        slug: "",
        level: "",
        sub_level: "",
        image_url: "",
      });
      setImage(null);
    } catch (err) {
      console.log("error");
      if (axios.isAxiosError(err)) {
        setError(err.response?.data.message || "An error occurred");
      } else {
        setError("An unexpected error occurred");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="container mx-auto p-4 shadow-lg mt-10"
      style={{ width: "600px" }}
    >
      <h1 className="text-3xl font-bold mb-4 text-center text-blue-500">
        Update a Course
      </h1>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <form onSubmit={handleUpdate}>
        <div className="mb-4">
          <label htmlFor="title" className="block mb-2 text-gray-500 ml-3">
            Title :
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="px-4 py-2 border border-gray-300 rounded-md w-full"
            placeholder="Enter course title"
          />
        </div>
        <div className="flex items-center gap-2">
          <div className="mb-4">
            <label htmlFor="type" className="block mb-2 text-gray-500 ml-3">
              Course Type :
            </label>
            <select
              id="type"
              name="type"
              className="px-4 py-2 border border-gray-300 rounded-md w-full text-gray-400"
              value={formData.type}
              onChange={handleChange}
            >
              <option value="">Select Course Type</option>
              <option value="Informatique" className="text-black">
                Informatique
              </option>
              <option value="Physique & Chimie" className="text-black">
                Physique & Chimie
              </option>
            </select>
          </div>
          <div className="mb-4">
            <label htmlFor="level" className="block mb-2 text-gray-500 ml-3">
              Course Level :
            </label>
            <select
              id="level"
              name="level"
              className="px-4 py-2 border border-gray-300 rounded-md w-full text-gray-400"
              value={formData.level}
              onChange={handleChange}
            >
              <option value="">Select Course Level</option>
              {levels.map((level) => (
                <option
                  key={level.value}
                  value={level.value}
                  className="text-black"
                >
                  {level.label}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label htmlFor="level" className="block mb-2 text-gray-500 ml-3">
              Sub-Level
            </label>
            <select
              id="sub_level"
              name="sub_level"
              value={formData.sub_level}
              onChange={handleChange}
              className="px-4 py-2 border border-gray-300 rounded-md w-full text-gray-400"
            >
              <option value="">Select Sub-Level</option>
              <option value="primaire">1ère année </option>
              <option value="primaire">2ère année </option>
              <option value="primaire">3ère année </option>
              <option value="primaire">4ère année </option>
              <option value="primaire">5ère année </option>
              <option value="primaire">6ère année </option>
              <option value="college">7ère année </option>
              <option value="college">8ère année </option>
              <option value="college">9ère année </option>
              <option value="lycee">Tronc commun </option>
              <option value="lycee">1ère bac </option>
              <option value="lycee">2ère bac </option>
              <option value="info-back">Backend Dev</option>
              <option value="info-front">Frontend Dev</option>
            </select>
          </div>
        </div>
        <div className="mb-4">
          <label htmlFor="level" className="block mb-2 text-gray-500 ml-3">
            Upload Image:
          </label>

          {formData.image_url && (
            <div className="mt-4 text-center">
              <img
                src={formData.image_url}
                alt="Aperçu"
                className="h-40 w-auto border border-gray-300 rounded-md mx-auto "
                onClick={handleClick}
              />
            </div>
          )}

          <input
            type="file"
            ref={hiddenFileInput}
            onChange={handleImageUpload}
            accept="image/*"
            style={{ display: "none" }}
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="description"
            className="block mb-2 text-gray-500 ml-3"
          >
            Description :
          </label>

          <ReactQuill
            value={formData.description}
            onChange={handleQuillChange}
            placeholder="Add content"
            className="bg-white rounded-md"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="slug" className="block mb-2 text-gray-500 ml-3">
            Slug :
          </label>
          <input
            type="text"
            id="slug"
            name="slug"
            className="px-4 py-2 border border-gray-300 rounded-md w-full"
            value={formData.slug}
            onChange={handleChange}
            // readOnly
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-md w-full"
          disabled={isLoading}
        >
          {isLoading ? "Updating..." : "Update Course"}
        </button>
      </form>
    </div>
  );
};

export default UpdateCourse;
