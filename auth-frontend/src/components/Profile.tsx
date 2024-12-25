import React, { useEffect, useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";

const Profile: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState<string>("");
  const [profilePhoto, setProfilePhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [photoUpdateTimestamp, setPhotoUpdateTimestamp] = useState<number>(
    Date.now()
  );
  const navigate = useNavigate();

  const fetchUser = async () => {
    try {
      // const token = localStorage.getItem("authToken");
      const response = await api.get("/user");
      setUser(response.data);
      setName(response.data.name);
      setEmail(response.data.email);
    } catch (error: any) {
      console.error("Error fetching user:", error.message);
    }
  };

  useEffect(() => {
    if (!user) {
      fetchUser();
    }
  }, [user]);

  const convertToBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });

  const handleUpdateProfile = async (event: React.FormEvent) => {
    event.preventDefault();

    setLoading(true);

    try {
      const token = localStorage.getItem("authToken");
      let base64Photo = user?.profile_photo;

      if (profilePhoto) {
        base64Photo = await convertToBase64(profilePhoto);
      }

      const updateData = {
        name,
        email,
        profile_photo: base64Photo,
      };

      const response = await api.put(`/user/${user?.id}`, updateData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      alert("Profile updated successfully");

      setUser(response.data.user);
      setPhotoUpdateTimestamp(Date.now());
      setName(response.data.user.name);
      setEmail(response.data.user.email);
      setPhotoPreview(null); // Clear preview
    } catch (error: any) {
      console.error("Error updating profile:", error.message);
      alert("Failed to update profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const preview = URL.createObjectURL(file);
      setPhotoPreview(preview);
      setProfilePhoto(file);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-center text-3xl font-semibold mt-10">Profile</h2>
      {user ? (
        <form
          className="mt-10 flex flex-col items-center justify-center"
          onSubmit={handleUpdateProfile}
        >
          <div className="mb-4">
            <label htmlFor="photo" className="cursor-pointer">
              <div className="w-24 h-24 rounded-full flex items-center justify-center overflow-hidden border-2 border-blue-500 hover:border-blue-700">
                <img
                  src={
                    photoPreview ||
                    `http://localhost:8000/storage/${user?.profile_photo}?t=${photoUpdateTimestamp}`
                  }
                  alt="Profile Preview"
                  className="w-full h-full object-cover"
                />
              </div>
            </label>
            <input
              id="photo"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handlePhotoChange}
            />
          </div>

          <div className="w-full max-w-sm">
            <label className="block text-gray-500 mb-1">Username:</label>
            <input
              type="text"
              className="w-full rounded-md border p-2"
              placeholder="Enter your full name"
              onChange={(e) => setName(e.target.value)}
              value={name}
              required
            />
          </div>
          <div className="w-full max-w-sm mt-4">
            <label className="block text-gray-500 mb-1">Email:</label>
            <input
              type="email"
              className="w-full rounded-md border p-2"
              placeholder="Enter your email"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              required
            />
          </div>
          <div className="w-full max-w-sm mt-4">
            <label className="block text-gray-500 mb-1">Role:</label>
            <input
              type="text"
              className="w-full rounded-md border p-2"
              value={user?.role}
              disabled
            />
          </div>
          <div className="mt-6 flex justify-center items-center gap-4">
            <button
              type="submit"
              className="px-8 py-2 bg-blue-500 text-white rounded-md"
              disabled={loading}
            >
              {loading ? "Updating..." : "Update Profile"}
            </button>
            {user.role === "professor" && (
              <button
                type="button"
                className="px-8 py-2 bg-green-500 text-white rounded-md"
                onClick={() => navigate("/create-course")}
              >
                Create a Course
              </button>
            )}
          </div>
        </form>
      ) : (
        <p className="min-h-screen text-center my-10">Loading...</p>
      )}
    </div>
  );
};

export default Profile;
