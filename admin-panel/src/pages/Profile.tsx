import React from 'react';
import { ProfileSubscription } from '../components/profile/ProfileSubscription';
import './Profile.css';

const Profile: React.FC = () => {
  return (
    <div className="profile-page">
      <ProfileSubscription />
    </div>
  );
};

export default Profile;
