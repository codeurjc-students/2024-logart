import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "../utilities/api";

const Profile = () => {
  const { user, setUser } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    username: "",
    firstName: "",
    lastName: "",
    email: "",
    bio: "",
    profileImage: null,
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || "",
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        bio: user.bio || "",
        profileImage: null,
      });
    }
  }, [user]);
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "profileImage") {
      setFormData((prevState) => ({ ...prevState, profileImage: files[0] }));
    } else {
      setFormData((prevState) => ({ ...prevState, [name]: value }));
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    const data = new FormData();
    data.append("username", formData.username);
    data.append("firstName", formData.firstName);
    data.append("lastName", formData.lastName);
    data.append("email", formData.email);
    data.append("bio", formData.bio);
    if (formData.profileImage) {
      data.append("profileImage", formData.profileImage);
    }
    try {
      const response = await axios.put("/api/v1/users/profile", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setMessage(response.data.message);
      setUser(response.data.user);
    } catch (err) {
      console.error("Error al actualizar el perfil:", err);
      setError(err.response?.data?.message || "Error al actualizar el perfil");
    }
  };
  return (
    <section>
      <div className="min-h-screen  pt-24 flex items-center justify-center bg-gradient-to-r from-blue-950 via-blue-700 to-blue-900 opacity-90 p-4">
        <div
          className="bg-transparent bg-gradient-to-r from-white/10 to-black/25 p-8 rounded-lg shadow-lg border border-gray-400 shadow-black"
          style={{ backgroundSize: "80px" }}
        >
          <h2 className="text-3xl font-bold mb-6 text-white">Mi Perfil</h2>
          {error && (
            <div
              className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6"
              role="alert"
            >
              <span className="block sm:inline">{error}</span>
            </div>
          )}
          {message && (
            <div
              className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6"
              role="alert"
            >
              <span className="block sm:inline">{message}</span>
            </div>
          )}
          <form onSubmit={handleSubmit} encType="multipart/form-data">
            <div className="flex items-center mb-6">
              <div className="mr-4">
                {user.profileImage ? (
                  <img
                    data-testid="profile-image-src"
                    src={`https://localhost:8443${user.profileImage}`}
                    alt="Profile"
                    className="w-24 h-24 object-cover rounded-full border-2 border-gray-300"
                  />
                ) : (
                  <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center text-gray-500">
                    Sin Imagen
                  </div>
                )}
              </div>
              <div className="flex-1">
                <label
                  className="block mb-2 text-white font-medium"
                  htmlFor="profileImage"
                >
                  Foto de Perfil
                </label>
                <input
                  type="file"
                  name="profileImage"
                  accept="image/*"
                  onChange={handleChange}
                  data-testid="profile-image"
                  className="w-full text-gray-300"
                />
              </div>
            </div>
            <div className="mb-4">
              <label
                className="block mb-1 text-white font-medium"
                htmlFor="username"
              >
                Nombre de Usuario
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                data-testid="profile-username"
                onChange={handleChange}
                className="w-full px-4 py-2 bg-white/90 border border-gray-500 rounded focus:outline-none focus:ring-2 focus:ring-purple-300 text-gray-950 font-medium"
                required
              />
            </div>
            <div className="mb-4">
              <label
                className="block mb-1 text-white font-medium"
                htmlFor="firstName"
              >
                Nombre
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                data-testid="profile-firstname"
                onChange={handleChange}
                className="w-full px-4 py-2 bg-white/90 border border-gray-500 rounded focus:outline-none focus:ring-2 focus:ring-purple-300 text-gray-950 font-medium"
              />
            </div>
            <div className="mb-4">
              <label
                className="block mb-1 text-white font-medium"
                htmlFor="lastName"
              >
                Apellido
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                data-testid="profile-lastname"
                onChange={handleChange}
                className="w-full px-4 py-2 bg-white/90 border border-gray-500 rounded focus:outline-none focus:ring-2 focus:ring-purple-300 text-gray-950 font-medium"
              />
            </div>
            <div className="mb-4">
              <label
                className="block mb-1 text-white font-medium"
                htmlFor="email"
              >
                Correo Electrónico
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                data-testid="profile-email"
                onChange={handleChange}
                className="w-full px-4 py-2 bg-white/90 border border-gray-500 rounded focus:outline-none focus:ring-2 focus:ring-purple-300 text-gray-950 font-medium"
                required
              />
            </div>
            <div className="mb-6">
              <label
                className="block mb-2 text-white font-medium"
                htmlFor="bio"
              >
                Biografía
              </label>
              <textarea
                id="bio"
                name="bio"
                value={formData.bio}
                data-testid="profile-bio"
                onChange={handleChange}
                className="w-full px-4 py-2 bg-white/90 border border-gray-500 rounded focus:outline-none focus:ring-2 focus:ring-purple-300 text-gray-950 font-medium"
                rows="4"
                maxLength="500"
                placeholder="Escribe una breve biografía..."
              ></textarea>
              <p className="text-sm text-gray-400 mt-1">
                Máximo 500 caracteres.
              </p>
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-purple-700 hover:underline transition-colors duration-300 font-semibold"
              data-testid="profile-submit"
            >
              Actualizar Perfil
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Profile;
