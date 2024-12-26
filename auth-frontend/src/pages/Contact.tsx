import React, { useState } from "react";
import api from "../api";

const Contact: React.FC = () => {
  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    email: "",
    message: "",
  });
  const [success, setSuccess] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSuccess(false);
    try {
      await api.post("/contact", formData, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });
      alert("le message est envoyee en succes");
      setSuccess(true);
      setFormData({
        name: "",
        email: "",
        message: "",
      });
      setFormData({
        name: "",
        email: "",
        message: "",
      });
    } catch (err: any) {
      console.error("une erreur est survenu lors de l'envoie du message");
      alert("une erreur est survenu lors de l'envoie du message");
      setError("Une erreur est survenue lors de l'envoi du message");
    }
  };
  return (
    <div className="max-w-md my-3 mx-auto p-6 bg-white rounded-lg shadow-md ">
      <h2 className="text-2xl font-bold mb-6 text-center text-blue-500">
        Contactez-nous
      </h2>
      {success && (
        <div className="mb-4 p-4 bg-green-100 text-green-700 rounded">
          Message envoyé avec succès !
        </div>
      )}
      <form className="" onSubmit={handleSubmit}>
        <div className="my-4">
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Name :
          </label>
          <input
            type="text"
            id="name"
            name="name"
            className="w-full px-4 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            onChange={handleChange}
          />
        </div>
        <div className="my-4">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Email :
          </label>
          <input
            type="email"
            id="email"
            name="email"
            className="w-full px-4 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            onChange={handleChange}
          />
        </div>
        <div className="my-4">
          <label
            htmlFor="message"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Message :
          </label>
          <textarea
            id="message"
            name="message"
            placeholder="send your message"
            className="w-full px-4 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            rows={4}
            onChange={handleChange}
          />
        </div>

        <button
          type="submit"
          className="w-full my-2 py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          Envoyer
        </button>
      </form>
    </div>
  );
};

export default Contact;
