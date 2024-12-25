import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DOMPurify from "dompurify";
import { FaEdit, FaRegTrashAlt } from "react-icons/fa";
import api from "../api";
import { useAuth } from "../authContext";
import { FiHeart } from "react-icons/fi";
import { FaRegComment } from "react-icons/fa";
import { FcLike } from "react-icons/fc";

interface CourseCardProps {
  id?: string;
  title: string;
  description: string;
  imageUrl: string;
  type: string;
  level: string;
  sub_level: string;
}

const CourseCard: React.FC<CourseCardProps> = ({
  id,
  title,
  imageUrl,
  description,
  type,
  level,
  sub_level,
}) => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const { isAuthenticated } = useAuth();
  const [isHovered, setIsHovered] = useState(false);
  const [liked, setLiked] = useState(false);
  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const cleanDescription = DOMPurify.sanitize(description);
  const handleEdit = () => {
    navigate(`/update-course/${id}`);
    console.log("Update course clicked");
  };
  useEffect(() => {
    const fetchUser = async () => {
      try {
        if (!user) {
          const response = await api.get("/user");
          console.log("response", response.data);
          setUser(response.data);
        }
      } catch (error: any) {
        console.error(
          "Error fetching user:",
          error.response ? error.response.data : error.message
        );
        setUser(null);
      }
    };
    fetchUser();
  }, [id]);

  const handleDelete = async () => {
    if (!id) {
      alert("Course ID is missing!");
      return;
    }

    try {
      const response = await api.delete(`/courses/${id}`);
      alert(response.data.message);
      window.location.reload();
    } catch (error: any) {
      console.error(error.response?.data?.message || "Error deleting course");
    }
  };

  const handleLike = async () => {
    try {
      const response = await api.post(`/courses/${id}/toggle-like`);
      setLiked((prevState) => !prevState);
      alert(response.data.message);
      window.location.reload();
    } catch (error: any) {
      console.error("Error toggling like:", error.response);
    }
  };
  useEffect(() => {
    const fetchLikedStatus = async () => {
      try {
        const response = await api.get(`/courses/${id}/is-liked`);
        setLiked(response.data.isLiked);
      } catch (error: any) {
        console.error(
          "Error lors de la verification du statut de like",
          error.response
        );
      }
    };
    fetchLikedStatus();
  }, [id]);

  const handleRedirect = () => {
    const CourseData = {
      id,
      title,
      imageUrl,
      description: cleanDescription,
      type,
    };
    navigate("/full-Contenu", { state: CourseData });
  };

  return (
    <div
      className=" relative max-w-sm rounded overflow-hidden shadow-lg bg-white p-3"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <img src={imageUrl} alt={title} className="w-full h-48 object-cover" />

      <div className="pt-4">
        <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
        <div className="flex items-center justify-between">
          <p className="text-center italic text-gray-500">{type}</p>
          <p className="text-center italic text-gray-500">{sub_level}</p>
        </div>
        {user?.role === "professor" && isHovered && (
          <div className="flex items-center gap-2 absolute top-2 right-2  ">
            <button
              onClick={handleEdit}
              className=" p-2  bg-blue-500 text-white rounded-full  transition-opacity"
            >
              <FaEdit />
            </button>
            <button
              onClick={() => handleDelete()}
              className=" p-2  bg-red-500 text-white rounded-full  "
            >
              <FaRegTrashAlt />
            </button>
          </div>
        )}
        {user?.role === "student" && isHovered && (
          <div className="flex items-center gap-2 absolute top-2 right-2  ">
            <button
              onClick={handleLike}
              className="p-2 bg-white rounded-full  transition-opacity"
            >
              {liked ? <FcLike /> : <FiHeart />}
            </button>
            <button
              onClick={handleRedirect}
              className=" p-2  bg-green-500 text-white rounded-full  "
            >
              <FaRegComment />
            </button>
          </div>
        )}

        <button
          onClick={handleRedirect}
          className="text-blue-500 mt-2 mx-auto block"
        >
          Read More
        </button>
      </div>
    </div>
  );
};

export default CourseCard;
