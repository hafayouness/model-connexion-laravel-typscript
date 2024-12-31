import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import DOMPurify from "dompurify";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { docco } from "react-syntax-highlighter/dist/esm/styles/hljs";
import CommentSection from "./CommentSection";
import api from "../api";
import { FaEdit, FaRegTrashAlt } from "react-icons/fa";
import { FiHeart } from "react-icons/fi";
import { FcLike } from "react-icons/fc";
import { MouseEventHandler } from "react";
import RecentsCourse from "./recentsCourse";

const CoursePdf: React.FC = () => {
  const location = useLocation();
  const { id, title, imageUrl, description, type } = location.state || {};
  const [comments, setComments] = useState<Comment[]>([]);
  const [editCommentId, setEditCommentId] = useState<number | null>(null);
  const [editText, setEditText] = useState("");
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [likesCount, setLikesCount] = useState<number>(0);
  const [commentLikes, setCommentLikes] = useState<{ [key: number]: boolean }>(
    {}
  );
  const [commentLikeCounts, setCommentLikeCounts] = useState<{
    [key: number]: number;
  }>({});
  const initializeLikes = async () => {
    const likesState: { [key: number]: boolean } = {};
    const countsState: { [key: number]: number } = {};

    for (const comment of comments) {
      try {
        const response = await api.get(`/comments/${comment.id}/isLiked`);
        likesState[comment.id] = response.data.isLiked;
        countsState[comment.id] = response.data.likesCount || 0;
      } catch (error) {
        console.error(
          `Error fetching like status for comment ${comment.id}:`,
          error
        );
      }
    }

    setCommentLikes(likesState);
    setCommentLikeCounts(countsState);
  };
  useEffect(() => {
    if (comments.length > 0) {
      initializeLikes();
    }
  }, [comments]);
  const handleLike = async (commentId: number) => {
    // Optimistic update
    setCommentLikes((prev) => ({
      ...prev,
      [commentId]: !prev[commentId],
    }));
    setCommentLikeCounts((prev) => ({
      ...prev,
      [commentId]: prev[commentId] + (commentLikes[commentId] ? -1 : 1),
    }));

    try {
      const response = await api.post(`/comments/${commentId}/like`);

      if (response.data.message) {
      }
    } catch (error) {
      setCommentLikes((prev) => ({
        ...prev,
        [commentId]: !prev[commentId],
      }));
      setCommentLikeCounts((prev) => ({
        ...prev,
        [commentId]: prev[commentId] + (commentLikes[commentId] ? 1 : -1),
      }));
      console.error("Error toggling like:", error);
    }
  };

  const cleanDescription = DOMPurify.sanitize(description);
  const commentsSectionRef = useRef<HTMLDivElement>(null);

  const scrollToComments = () => {
    commentsSectionRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const Description: React.FC<{ cleanDescription: string }> = ({
    cleanDescription,
  }) => {
    const [formattedDescription, setFormattedDescription] =
      useState<string>("");

    useEffect(() => {
      const styleHeadersAndCode = (html: string) => {
        const tempDiv = document.createElement("div");
        tempDiv.innerHTML = html;

        const headers = tempDiv.querySelectorAll("h1, h2, h3, h4, h5, h6");
        headers.forEach((header) => {
          if (header instanceof HTMLElement) {
            header.style.fontWeight = "bold";
            header.style.fontSize = "24px";
          }
        });

        return tempDiv.innerHTML;
      };

      const transformedDescription = styleHeadersAndCode(
        cleanDescription || ""
      );

      setFormattedDescription(transformedDescription);
    }, [cleanDescription]);

    const renderDescription = () => {
      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = formattedDescription;

      const children = Array.from(tempDiv.childNodes).map((node, index) => {
        if (node.nodeName === "PRE") {
          const codeContent = node.textContent || "";
          return (
            <div className="relative mb-4" key={index}>
              <button
                className="absolute top-2 right-2 bg-blue-500 text-white px-2 py-1 rounded shadow hover:bg-blue-600"
                onClick={() => copyCode(codeContent)}
              >
                Copy Code
              </button>

              <SyntaxHighlighter
                language="bash"
                style={docco}
                wrapLines={true}
                lineProps={{ style: { wordBreak: "break-all" } }}
              >
                {codeContent}
              </SyntaxHighlighter>
            </div>
          );
        }
        return (
          <div
            key={index}
            dangerouslySetInnerHTML={{ __html: node.textContent || "" }}
          />
        );
      });

      return children;
    };

    const copyCode = (code: string) => {
      navigator.clipboard.writeText(code).then(() => {
        alert("Code copied!");
      });
    };

    return (
      <div className="description mt-6 text-gray-800 dark:text-gray-200">
        {renderDescription()}
      </div>
    );
  };
  const getComments = async () => {
    try {
      const response = await api.get(`/courses/${id}/comments`);
      setComments(response.data);
      console.log(response.data);
    } catch (error: any) {
      console.error("Erreur lors de la récupération des commentaires :", error);
    }
  };

  useEffect(() => {
    getComments();
  }, [id]);

  const handleEdit = async (id: number, newText: string) => {
    try {
      const response = await api.put(`/comments/${id}`, { comment: newText });
      console.log(response.data);
      alert("comment updated succesFully");
      setComments(
        comments.map((comment) =>
          comment.id === id ? { ...comment, comment: newText } : comment
        )
      );
    } catch (error: any) {
      console.error("Error updating comment:", error);
      alert("Failed to update comment");
    }
  };

  const handledelete = async (id: number) => {
    try {
      await api.delete(`/comments/${id}`);
      setComments(comments.filter((comment) => comment.id !== id));
    } catch (error: any) {
      console.error("Error deleting comment:", error);
    }
  };

  const getlikes = async () => {
    try {
      const response = await api.get(`/comments/${id}/isLiked`);
      setIsLiked(response.data.isLiked);
      console.log(response.data.isLiked);
    } catch (error) {
      console.error("Error checking if liked:", error);
    }
  };
  useEffect(() => {
    getlikes();
  }, [id]);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await api.get("/index?limit=3");
        console.log(response.data);
      } catch (error: any) {
        console.error("Error fetching courses:", error);
      }
    };

    fetchCourse();
  }, []);

  useEffect(() => {
    const fetchLikedStatus = async () => {
      try {
        const response = await api.get(`/comments/${id}/isLiked`);
        setIsLiked(response.data.isLiked);
        console.log(response.data.isLiked);
      } catch (error: any) {
        console.error(
          "Error lors de la verification du statut de like",
          error.response
        );
      }
    };
    fetchLikedStatus();
  }, [id]);

  return (
    <div className="w-full max-w-full sm:max-w-screen-lg mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-center text-gray-800 dark:text-gray-100 mt-12">
          {title}
        </h1>
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-auto rounded-lg mt-6 shadow-md"
        />
        <p className="text-center italic text-gray-600 dark:text-gray-400 mt-4">
          {type}
        </p>
      </div>

      <Description cleanDescription={cleanDescription} />

      <div ref={commentsSectionRef} className="mt-12">
        <hr className="border-gray-300 dark:border-gray-600" />
        <div className="mt-6">
          <CommentSection id={id.toString()} />
        </div>
      </div>

      <div
        className="mt-6 mb-10 "
        style={{ width: "520px", margin: "12px auto " }}
      >
        {comments.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400">
            No comments yet. Be the first to comment!
          </p>
        ) : (
          <ul className="space-y-6">
            {comments.map((comment) => (
              <li
                key={comment.id}
                className="flex flex-col sm:flex-row items-start sm:space-x-4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow"
              >
                <img
                  src={`http://localhost:8000/storage/${comment.user?.profile_photo}`}
                  alt={comment.user.name}
                  className="w-12 h-12 rounded-full object-contain mb-4 sm:mb-0"
                />
                <div className="sm:flex-1">
                  <p className="font-semibold text-gray-800 dark:text-gray-100">
                    {comment.user.name}
                  </p>
                  {editCommentId === comment.id ? (
                    <div>
                      <textarea
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        className="w-full p-2 border rounded"
                      />
                      <button
                        onClick={() => {
                          handleEdit(comment.id, editText);
                          setEditCommentId(null);
                        }}
                        className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditCommentId(null)}
                        className="mt-2 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 ml-2"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <p className="text-gray-600 dark:text-gray-300">
                      {comment.comment}
                    </p>
                  )}
                </div>

                <div className="flex space-x-4 mt-2">
                  <button
                    className="text-black flex items-center gap-1"
                    onClick={() => handleLike(comment.id)}
                  >
                    <span className="text-xs">
                      {commentLikeCounts[comment.id] || 0}
                    </span>
                    {commentLikes[comment.id] ? <FcLike /> : <FiHeart />}
                  </button>
                  <button
                    className="text-blue-500 hover:text-blue-700"
                    onClick={() => {
                      setEditCommentId(comment.id);
                      setEditText(comment.comment);
                    }}
                  >
                    <FaEdit />
                  </button>
                  <button
                    className="text-red-500 hover:text-red-700"
                    onClick={() => handledelete(comment.id)}
                  >
                    <FaRegTrashAlt />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default CoursePdf;
