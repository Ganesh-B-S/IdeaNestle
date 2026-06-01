import { useState } from "react";
import "./Profile.css";

export default function Profile() {
  const currentUser = JSON.parse(
    localStorage.getItem("user") || "{}"
  );

  const [name, setName] = useState(
    currentUser.name || ""
  );

  const [email] = useState(
    currentUser.email || ""
  );

  const [bio, setBio] = useState(
    localStorage.getItem("bio") || ""
  );

  const [profilePic, setProfilePic] =
    useState(
      localStorage.getItem("profilePic") ||
        ""
    );

  function handleImageUpload(e) {
    const file = e.target.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onloadend = () => {
      setProfilePic(reader.result);
    };

    reader.readAsDataURL(file);
  }

  function saveProfile() {
    const updatedUser = {
      ...currentUser,
      name,
      email,
    };

    localStorage.setItem(
      "user",
      JSON.stringify(updatedUser)
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
      "Profile updated successfully 🎉"
    );

    window.location.reload();
  }

  return (
    <div className="profile-container">
      <h1>My Profile</h1>

      <div className="profile-avatar">

        {profilePic ? (
          <img
            src={profilePic}
            alt="Profile"
          />
        ) : (
          <div className="avatar-placeholder">
            👤
          </div>
        )}

        <input
          type="file"
          accept="image/*"
          onChange={
            handleImageUpload
          }
        />
      </div>

      <div className="profile-form">
        <div>
          <label>Name</label>
          <input
            value={name}
            onChange={(e) =>
              setName(
                e.target.value
              )
            }
          />
        </div>

        <div>
          <label>Email</label>
          <input
            value={email}
            disabled
          />
        </div>

        <div>
          <label>Bio</label>
          <textarea
            value={bio}
            onChange={(e) =>
              setBio(
                e.target.value
              )
            }
            placeholder="Tell us about yourself..."
          />
        </div>

        <button
          className="save-btn"
          onClick={saveProfile}
        >
          Save Changes
        </button>
      </div>
    </div>
  );
}