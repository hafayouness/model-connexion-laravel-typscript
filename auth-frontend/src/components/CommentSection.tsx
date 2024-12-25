import React, { useState } from "react";
import api from "../api";

interface CommentSectionProps {
  id: string;
}

const CommentSection: React.FC<CommentSectionProps> = ({ id }) => {
  const [content, setContent] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      console.log("ID du cours :", id);
      const response = await api.post(`/courses/${id}/comment`, {
        comment: content,
      });
      console.log("Commentaire ajouté :", response.data);
      alert("Comment added successfully!");
      window.location.reload();
      setContent("");
    } catch (error: any) {
      console.error("Erreur lors de l'ajout du commentaire :", error.response);
      setError("Failed to add the comment. Please try again.");
    }
  };

  return (
    <div
      className="w-full px-4 py-6 sm:px-6 md:px-8 lg:px-0"
      style={{ margin: "15px auto " }}
    >
      <form
        onSubmit={handleSubmit}
        className="max-w-lg mx-auto p-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg"
      >
        <textarea
          className="w-full h-32 p-4 border border-gray-300 rounded-lg shadow-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your comment here..."
        />
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

        {/* Bouton d'envoi */}
        <div className="flex justify-center mt-4">
          <button
            type="submit"
            className="w-full sm:w-auto bg-blue-500 text-white py-2 px-6 rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 dark:bg-blue-600 dark:hover:bg-blue-700"
          >
            Send a Comment
          </button>
        </div>
      </form>
    </div>
  );
};

export default CommentSection;
