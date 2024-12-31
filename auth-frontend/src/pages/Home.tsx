import React, { useEffect, useState } from "react";
import image from "../assets/albert-vincent-wu-Tgyzloxnw6E-unsplash.jpg";
import RecentsCourse from "../components/recentsCourse";
import api from "../api";
import CourseCard from "../components/CourseCard";
import { useLocation } from "react-router-dom";

const Home = () => {
  const stats: Stats = {
    students: 1250,
    courses: 46,
    ratings: 5250,
    experience: 30,
  };
  const location = useLocation();
  const { id } = location.state || {};
  const [courses, setCourses] = useState<Course[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await api.get("/index?limit=4");
        console.log(response.data);
      } catch (error: any) {
        console.error("Error fetching courses:", error);
      }
    };

    fetchCourse();
  }, []);
  const getComments = async () => {
    try {
      const response = await api.get(`comments?limit=3`);
      setComments(response.data);
      console.log(response.data);
    } catch (error: any) {
      console.error("Erreur lors de la récupération des commentaires :", error);
    }
  };
  useEffect(() => {
    getComments();
  }, [id]);

  return (
    <div style={{ maxWidth: "1020px", margin: "0 auto" }}>
      <div className="flex flex-col md:flex-row w-full">
        <div className="w-full md:w-1/2 p-4">
          <h1 className="text-blue-500 text-3xl mb-4">
            Welcome to Savoir+, providing educational support courses in Morocco
          </h1>
          <p className="text-gray-700 text-md md:text-xl text-center md:text-left">
            The virtual classes of Savoir+ replace a home tutor and evening
            courses to enhance your professional and personal skills. Don't
            hesitate any longer!
          </p>
        </div>

        <div className="w-full md:w-1/2 p-4">
          <img
            src={image}
            alt="Educational support"
            className="w-full h-[250px] object-cover rounded-lg"
          />
        </div>
      </div>
      <section
        className="grid grid-cols-4 gap-8 mb-12 mt-20 bg-blue-500 p-5"
        style={{ borderRadius: "20px 10px 20px 10px" }}
      >
        <div className="text-center">
          <h3 className="text-3xl font-bold text-white">{stats.students}+</h3>
          <p className="text-gray-300">Students</p>
        </div>
        <div className="text-center">
          <h3 className="text-3xl font-bold text-white">{stats.courses}+</h3>
          <p className="text-gray-300">Courses</p>
        </div>
        <div className="text-center">
          <h3 className="text-3xl font-bold text-white">{stats.ratings}+</h3>
          <p className="text-gray-300">Reviews</p>
        </div>
        <div className="text-center">
          <h3 className="text-3xl font-bold text-white">{stats.experience}+</h3>
          <p className="text-gray-300">Years Experience</p>
        </div>
      </section>

      <section>
        <div className="">
          <RecentsCourse />
        </div>
      </section>
      <section className="mb-12 mt-10 mr-3 ml-3">
        <h2 className="text-2xl font-bold mb-8 text-center text-blue-500">
          What Did Our Students Say About Us?
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {comments.map((comment) => (
            <div key={comment.id} className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center mb-4">
                <img
                  src={`http://localhost:8000/storage/${comment.user.profile_photo}`}
                  alt=""
                  className="w-10 h-10 rounded-full mr-4 object-contain"
                />
                <h3 className="font-semibold">{comment.user.name}</h3>
              </div>
              <p className="text-gray-600">{comment.comment}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
