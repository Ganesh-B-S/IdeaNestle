import { useEffect, useState } from "react";
import "./Profile.css";

const API = import.meta.env.VITE_API_URL;

export default function Profile() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");
  const [profilePicture, setProfilePicture] =
    useState("");

  const [message, setMessage] =
    useState("");

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    try {
      const token =
        localStorage.getItem("token");

      const res = await fetch(
        `${API}/api/profile`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      setName(data.name || "");
      setEmail(data.email || "");
      setBio(data.bio || "");
      setProfilePicture(
        data.profile_picture || ""
      );
    } catch (error) {
      console.error(error);
    }
  }

  async function saveProfile() {
    try {
      const token =
        localStorage.getItem("token");

      const res = await fetch(
        `${API}/api/profile`,
        {
          method: "PUT",
          headers: {
            "Content-Type":
              "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name,
            bio,
            profile_picture:
              profilePicture,
          }),
        }
      );

      const data = await res.json();

      setMessage(data.message);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="profile-page">
      <div className="profile-card">
        <h1>My Profile</h1>

        <div className="avatar-section">
          <img
            src={
              profilePicture ||
              "/default-avatar.jpg"
            }
            alt="Profile"
            className="avatar"
          />

          <input
            type="text"
            placeholder="Profile Image URL"
            value={profilePicture}
            onChange={(e) =>
              setProfilePicture(
                e.target.value
              )
            }
          />
        </div>

        <div className="form-group">
          <label>Full Name</label>

          <input
            type="text"
            value={name}
            onChange={(e) =>
              setName(e.target.value)
            }
          />
        </div>

        <div className="form-group">
          <label>Email</label>

          <input
            type="email"
            value={email}
            disabled
          />
        </div>

        <div className="form-group">
          <label>Bio</label>

          <textarea
            rows="4"
            placeholder="Tell us about yourself..."
            value={bio}
            onChange={(e) =>
              setBio(e.target.value)
            }
          />
        </div>

        <button
          className="save-btn"
          onClick={saveProfile}
        >
          Save Changes
        </button>

        {message && (
          <p
            style={{
              textAlign: "center",
              marginTop: "15px",
            }}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
}