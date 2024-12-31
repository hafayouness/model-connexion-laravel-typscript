import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import CourseCard from "./CourseCard";

const RecentsCourse: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.get("/index?limit=6");
        const data = response.data;

        const formattedData = data.map((course: any) => ({
          ...course,
          imageUrl: course.image_url,
        }));

        setCourses(formattedData);
      } catch (err) {
        setError("Failed to fetch courses. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-500">
        Recent Courses
      </h1>

      {loading ? (
        <div className="flex items-center justify-center w-full h-96">
          <p className="text-gray-500 text-center">Loading...</p>
        </div>
      ) : error ? (
        <div className="flex items-center justify-center w-full h-96">
          <p className="text-red-500 text-center">{error}</p>
        </div>
      ) : courses.length > 0 ? (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6  mx-auto">
          {courses.map((course) => (
            <CourseCard
              key={course.id}
              id={course.id}
              title={course.title ?? "No title"}
              description={course.description ?? "No description available"}
              imageUrl={course.imageUrl ?? ""}
              type={course.type ?? "N/A"}
              level={course.level ?? "N/A"}
              sub_level={course.sub_level ?? "N/A"}
            />
          ))}
        </div>
      ) : (
        <div className="flex items-center justify-center w-full h-96">
          <p className="text-gray-500 text-center">No courses available</p>
        </div>
      )}
    </div>
  );
};

export default RecentsCourse;
