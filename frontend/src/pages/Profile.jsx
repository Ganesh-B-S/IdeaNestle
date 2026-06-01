import { useState, useEffect } from "react";
import "./Profile.css";

export default function Profile() {
  const user = JSON.parse(
    localStorage.getItem("user") || "{}"
  );

  const [name, setName] = useState(
    user.name || ""
  );

  const [email] = useState(
    user.email || ""
  );

  const [bio, setBio] = useState("");

  const [profilePic, setProfilePic] =
    useState("");

  useEffect(() => {
    const savedBio =
      localStorage.getItem("bio");

    const savedPic =
      localStorage.getItem(
        "profilePic"
      );

    if (savedBio) {
      setBio(savedBio);
    }

    if (savedPic) {
      setProfilePic(savedPic);
    }
  }, []);

  function handleImageUpload(e) {
    const file =
      e.target.files?.[0];

    if (!file) return;

    const reader =
      new FileReader();

    reader.onloadend = () => {
      setProfilePic(
        reader.result
      );
    };

    reader.readAsDataURL(file);
  }

  function handleSave() {
    const updatedUser = {
      ...user,
      name,
    };

    localStorage.setItem(
      "user",
      JSON.stringify(
        updatedUser
      )
    );

    localStorage.setItem(
      "bio",
      bio
    );

    localStorage.setItem(
      "profilePic",
      profilePic
    );

    alert(
      "Profile updated successfully!"
    );

    window.location.reload();
  }

  return (
    <div className="profile-page">
      <div className="profile-card">

        <h1>
          My Profile
        </h1>

        <div className="avatar-section">

          {profilePic ? (
            <img
              src={profilePic}
              alt="Profile"
              className="avatar"
            />
          ) : (
            <div className="avatar-placeholder">
              👤
            </div>
          )}

          <label className="upload-btn">
            Upload Photo

            <input
              type="file"
              accept="image/*"
              onChange={
                handleImageUpload
              }
              hidden
            />
          </label>

        </div>

        <div className="form-group">
          <label>
            Full Name
          </label>

          <input
            type="text"
            value={name}
            onChange={(e) =>
              setName(
                e.target.value
              )
            }
          />
        </div>

        <div className="form-group">
          <label>
            Email
          </label>

          <input
            type="email"
            value={email}
            disabled
          />
        </div>

        <div className="form-group">
          <label>
            Bio
          </label>

          <textarea
            rows="5"
            value={bio}
            onChange={(e) =>
              setBio(
                e.target.value
              )
            }
            placeholder="Tell everyone about yourself..."
          />
        </div>

        <button
          className="save-btn"
          onClick={handleSave}
        >
          Save Changes
        </button>

      </div>
    </div>
  );
}