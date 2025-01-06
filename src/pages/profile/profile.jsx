import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faSave, faStar, faDownload, faBookmark, faHeart } from "@fortawesome/free-solid-svg-icons";
import { getUserProfileApi, uploadProfilePicApi, BASE_URL } from '../../api/Api';

const Profile = () => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState({ ...user });
  const [activeTab, setActiveTab] = useState('downloads');
  const [loading, setLoading] = useState(true);
  const [profilePic, setProfilePic] = useState(user?.profilePic || null);

  // Sample data (replace with actual API calls)
  const [downloads, setDownloads] = useState([]);
  const [prebooked, setPrebooked] = useState([]);
  const [saved, setSaved] = useState([]);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        const response = await getUserProfileApi(user?._id);
        if (response.data.success) {
          const userData = response.data.user;
          setUser(userData);
          setEditedUser(userData);
          
          // Update localStorage with latest user data
          localStorage.setItem('user', JSON.stringify(userData));

          // If you have these fields in your user data
          setDownloads(userData.downloads || []);
          setPrebooked(userData.prebooked || []);
          setSaved(userData.saved || []);
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user?._id) {
      fetchUserProfile();
    }
  }, [user?._id]);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    setEditedUser({ ...user });
  };

  const handleSaveProfile = async () => {
    try {
      // Add your API call here to update user profile
      // const response = await updateUserProfileApi(editedUser);
      localStorage.setItem('user', JSON.stringify(editedUser));
      setUser(editedUser);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handleProfilePicUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('profilePic', file);

      try {
        const response = await uploadProfilePicApi(formData);
        if (response.data.success) {
          setProfilePic(response.data.profilePic);
          // Update user in state and localStorage
          const updatedUser = { ...user, profilePic: response.data.profilePic };
          setUser(updatedUser);
          localStorage.setItem('user', JSON.stringify(updatedUser));
        }
      } catch (error) {
        console.error('Error uploading profile picture:', error);
      }
    }
  };

  if (loading) {
    return (
      <div style={{
        marginLeft: '260px',
        marginTop: '70px',
        width: 'calc(100% - 260px)',
        minHeight: 'calc(100vh - 70px)',
        backgroundColor: '#0a0a0a',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        color: '#00ff00'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <div style={{ marginTop: '1rem' }}>Loading Profile...</div>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'downloads', icon: faDownload, label: 'Downloads' },
    { id: 'prebooked', icon: faBookmark, label: 'Pre-booked' },
    { id: 'saved', icon: faHeart, label: 'Saved' }
  ];

  return (
    <div style={{
      marginLeft: '260px',
      marginTop: '70px',
      width: 'calc(100% - 260px)',
      minHeight: 'calc(100vh - 70px)',
      backgroundColor: '#0a0a0a',
      color: '#fff',
      padding: '40px'
    }}>
      {/* Profile Section */}
      <div style={{
        backgroundColor: '#1a1a1a',
        borderRadius: '12px',
        padding: '30px',
        border: '1px solid #333',
        marginBottom: '40px'
      }}>
        <div style={{
          display: 'flex',
          gap: '30px',
          marginBottom: isEditing ? '30px' : '0'
        }}>
          {/* Profile Picture Section */}
          <div style={{
            position: 'relative',
            width: '120px',
            height: '120px',
            borderRadius: '50%',
            overflow: 'hidden',
            border: '3px solid #333'
          }}>
            <img
              src={profilePic ? `${BASE_URL}${profilePic}` : '/assets/images/default-avatar.png'}
              alt="Profile"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
            />
            <label
              htmlFor="profile-pic-upload"
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                backgroundColor: 'rgba(0,0,0,0.7)',
                color: '#fff',
                textAlign: 'center',
                padding: '8px 0',
                cursor: 'pointer',
                fontSize: '12px'
              }}
            >
              Change Photo
              <input
                id="profile-pic-upload"
                type="file"
                accept="image/*"
                onChange={handleProfilePicUpload}
                style={{ display: 'none' }}
              />
            </label>
          </div>

          {/* User Info Section */}
          <div style={{ flex: 1 }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between',
              marginBottom: '8px'
            }}>
              {isEditing ? (
                <input
                  type="text"
                  value={editedUser.name}
                  onChange={e => setEditedUser({ ...editedUser, name: e.target.value })}
                  style={{
                    backgroundColor: '#333',
                    border: '1px solid #444',
                    color: '#fff',
                    padding: '8px 12px',
                    borderRadius: '4px',
                    width: '200px',
                    fontSize: '24px'
                  }}
                />
              ) : (
                <h2 style={{ margin: 0, fontSize: '24px' }}>{user.name}</h2>
              )}
              
              <button
                onClick={isEditing ? handleSaveProfile : handleEditToggle}
                style={{
                  backgroundColor: isEditing ? '#00ff00' : 'transparent',
                  color: isEditing ? '#000' : '#fff',
                  border: '1px solid #00ff00',
                  padding: '6px 16px',
                  borderRadius: '20px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '14px'
                }}
              >
                <FontAwesomeIcon icon={isEditing ? faSave : faEdit} />
                {isEditing ? 'Save' : 'Edit'}
              </button>
            </div>

            <div style={{ display: 'flex', gap: '20px', color: '#999', fontSize: '14px' }}>
              <span>{user.email}</span>
              <span>•</span>
              <span>Member since {new Date(user.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div style={{
        display: 'flex',
        gap: '20px',
        marginBottom: '30px',
        borderBottom: '1px solid #333',
        paddingBottom: '10px'
      }}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              backgroundColor: activeTab === tab.id ? '#00ff00' : 'transparent',
              color: activeTab === tab.id ? '#000' : '#fff',
              border: 'none',
              padding: '8px 20px',
              borderRadius: '20px',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <FontAwesomeIcon icon={tab.icon} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div style={{
        backgroundColor: '#1a1a1a',
        borderRadius: '12px',
        padding: '30px',
        border: '1px solid #333'
      }}>
        {activeTab === 'downloads' && (
          <div className="row g-4">
            {downloads.length > 0 ? (
              downloads.map(game => (
                <div key={game._id} className="col-md-4">
                  <GameCard game={game} />
                </div>
              ))
            ) : (
              <div style={{ textAlign: 'center', color: '#999' }}>
                No downloaded games yet
              </div>
            )}
          </div>
        )}

        {activeTab === 'prebooked' && (
          <div className="row g-4">
            {prebooked.length > 0 ? (
              prebooked.map(game => (
                <div key={game._id} className="col-md-4">
                  <GameCard game={game} />
                </div>
              ))
            ) : (
              <div style={{ textAlign: 'center', color: '#999' }}>
                No pre-booked games yet
              </div>
            )}
          </div>
        )}

        {activeTab === 'saved' && (
          <div className="row g-4">
            {saved.length > 0 ? (
              saved.map(game => (
                <div key={game._id} className="col-md-4">
                  <GameCard game={game} />
                </div>
              ))
            ) : (
              <div style={{ textAlign: 'center', color: '#999' }}>
                No saved games yet
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// Game Card Component
const GameCard = ({ game }) => (
  <div style={{
    backgroundColor: '#1a1a1a',
    borderRadius: '8px',
    overflow: 'hidden',
    border: '1px solid #333',
    transition: 'all 0.3s ease'
  }}>
    <img
      src={`http://localhost:5500${game.photo}`}
      alt={game.name}
      style={{
        width: '100%',
        height: '200px',
        objectFit: 'cover'
      }}
    />
    <div style={{ padding: '15px' }}>
      <h3 style={{ fontSize: '18px', marginBottom: '10px' }}>{game.name}</h3>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '5px',
        color: '#00ff00'
      }}>
        <FontAwesomeIcon icon={faStar} />
        <span>{game.rating}/10</span>
      </div>
    </div>
  </div>
);

export default Profile;
