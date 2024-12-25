import axios from "axios";
import React, { useState, ChangeEvent, FormEvent } from "react";
import api from "../api";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const CreationCours: React.FC = () => {
  interface FormData {
    title: string;
    type: string;
    description: string;
    slug: string;
    level: "" | "primaire" | "college" | "lycee";
    sub_level: string;
  }

  const [formData, setFormData] = useState<FormData>({
    title: "",
    type: "",
    description: "",
    slug: "",
    level: "",
    sub_level: "",
  });
  const levels = [
    { label: "Primaire", value: "primaire" },
    { label: "Collège", value: "college" },
    { label: "Lycée", value: "lycee" },
    { label: "Université", value: "Université" },
  ];

  const [image, setImage] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputCharge = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
      ...(name === "level" && { sub_level: "" }),
    }));
  };
  const handleQuillChange = (value: string) => {
    setFormData({ ...formData, description: value });
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const convertImageToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  };

  const generateSlug = (text: string): string => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-");
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    const slug = generateSlug(formData.title);
    const formDataToSubmit = {
      title: formData.title,
      slug: slug,
      description: formData.description,
      type: formData.type,
      level: formData.level,
      sub_level: formData.sub_level,
      image: image ? await convertImageToBase64(image) : null,
    };

    try {
      const response = await api.post("/courses", formDataToSubmit, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log("response:", response.data);
      alert("Course created successfully!");
      setFormData({
        title: "",
        type: "",
        description: "",
        slug: "",
        level: "",
        sub_level: "",
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
        Create a Course
      </h1>
      <form onSubmit={handleSubmit}>
        <div>
          <div className="mb-4">
            <label htmlFor="title" className="block mb-2 text-gray-500 ml-3">
              Title :
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputCharge}
              className="px-4 py-2 border border-gray-300 rounded-md w-full"
              placeholder="Enter course title"
              required
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
                onChange={handleInputCharge}
                required
              >
                <option value="">Select Course Type</option>
                <option value="Informatique" className="text-black">
                  Informatique
                </option>
                <option value="Physique et Chimie" className="text-black">
                  Physique et Chimie
                </option>
                <option value="Mathématiques" className="text-black">
                  Mathématiques
                </option>
                <option value="Anglais" className="text-black">
                  Anglais
                </option>
                <option value="Français" className="text-black">
                  Français
                </option>
                <option value="Histoire" className="text-black">
                  Histoire
                </option>
                <option value="Géographie" className="text-black">
                  Géographie
                </option>
                <option value="Biologie" className="text-black">
                  Biologie
                </option>
                <option value="Économie" className="text-black">
                  Économie
                </option>
                <option value="Philosophie" className="text-black">
                  Philosophie
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
                onChange={handleInputCharge}
                required
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
                onChange={handleInputCharge}
                className="px-4 py-2 border border-gray-300 rounded-md w-full text-gray-400"
                required
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
                <option value="Backend Dev">Backend Dev</option>
                <option value="Frontend Dev">Frontend Dev</option>
              </select>
            </div>
          </div>
        </div>

        <div className="mb-4">
          <label htmlFor="image" className="block mb-2 text-gray-500 ml-3">
            Upload Image:
          </label>
          <input
            type="file"
            id="image"
            onChange={handleImageChange}
            className="px-4 py-2 border border-gray-300 rounded-md w-full"
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="description"
            className="block mb-2 text-gray-500 ml-3"
          >
            description :
          </label>

          <ReactQuill
            value={formData.description}
            onChange={handleQuillChange}
            placeholder="Ajoutez un contenu"
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
            onChange={handleInputCharge}
            placeholder="Enter course slug"
            required
          />
        </div>

        <button
          type="submit"
          className={`px-8 py-2 bg-blue-500 text-white rounded-md mx-auto block ${
            isLoading
              ? "bg-blue-300 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600"
          }`}
        >
          {isLoading ? "Creating..." : "Create Course"}
        </button>
      </form>
    </div>
  );
};

export default CreationCours;
