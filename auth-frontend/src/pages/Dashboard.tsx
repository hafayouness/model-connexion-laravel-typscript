import React, { useEffect, useState } from "react";
import api from "../api";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

interface Course {
  id: number;
  title: string;
  type: string;
  sub_level: string;
}

interface Comment {
  id: number;
  comment: string;
  user: {
    name: string;
  };
}

const Dashboard = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const usersResponse = await api.get("/users");

        const usersData = Array.isArray(usersResponse.data)
          ? usersResponse.data
          : usersResponse.data.users || [];
        setUsers(usersData);

        const coursesResponse = await api.get("/index");
        const coursesData = Array.isArray(coursesResponse.data)
          ? coursesResponse.data
          : [];
        setCourses(coursesData);

        // Fetch comments
        const commentsResponse = await api.get("/comments");
        const commentsData = Array.isArray(commentsResponse.data)
          ? commentsResponse.data
          : [];
        setComments(commentsData);

        setLoading(false);
      } catch (err) {
        setError("Une erreur est survenue lors du chargement des données");
        setLoading(false);
        console.error("Error fetching data:", err);
      }
    };

    fetchData();
  }, []);

  console.log("Users data:", users);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl">Chargement...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-center">Dashboard</h1>

      <section className="w-full md:w-[48%] mx-auto mb-5">
        <h2 className="text-xl font-semibold mb-4 text-center">Users Table</h2>
        <table className="w-full table-auto border-collapse border border-gray-300">
          <thead className="bg-gray-200">
            <tr>
              <th className="border border-gray-300 p-2">ID</th>
              <th className="border border-gray-300 p-2">Name</th>
              <th className="border border-gray-300 p-2">Email</th>
              <th className="border border-gray-300 p-2">Role</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(users) && users.length > 0 ? (
              users.map((user) => (
                <tr key={user.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {user.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {user.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {user.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        user.role === "professor"
                          ? "bg-green-100 text-green-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="text-center py-4">
                  Aucun utilisateur trouvé
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </section>

      <section className="w-full md:w-[80%] mx-auto mb-5">
        <h2 className="text-xl font-semibold mb-5 text-center ">
          Courses Table
        </h2>
        <table className="w-full table-auto border-collapse border border-gray-300">
          <thead className="bg-gray-200">
            <tr>
              <th className="border border-gray-300 p-2">ID</th>
              <th className="border border-gray-300 p-2">Title</th>
              <th className="border border-gray-300 p-2">Type</th>
              <th className="border border-gray-300 p-2">Sublevel</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(courses) && courses.length > 0 ? (
              courses.map((course) => (
                <tr key={course.id}>
                  <td className="border border-gray-300 p-2">{course.id}</td>
                  <td className="border border-gray-300 p-2">{course.title}</td>
                  <td className="border border-gray-300 p-2">{course.type}</td>
                  <td className="border border-gray-300 p-2">
                    {course.sub_level}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="text-center py-4">
                  Aucun cours trouvé
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </section>

      <section className="mx-auto w-full md:w-[70%] mb-5">
        <h2 className="text-xl font-semibold mb-4 text-center">
          Comments Table
        </h2>
        <table className="w-full table-auto border-collapse border border-gray-300">
          <thead className="bg-gray-200">
            <tr>
              <th className="border border-gray-300 p-2">ID</th>
              <th className="border border-gray-300 p-2">Comment</th>
              <th className="border border-gray-300 p-2">User</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(comments) && comments.length > 0 ? (
              comments.map((comment) => (
                <tr key={comment.id}>
                  <td className="border border-gray-300 p-2">{comment.id}</td>
                  <td className="border border-gray-300 p-2">
                    {comment.comment}
                  </td>
                  <td className="border border-gray-300 p-2">
                    {comment.user.name}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className="text-center py-4">
                  Aucun commentaire trouvé
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </section>
    </div>
  );
};

export default Dashboard;
