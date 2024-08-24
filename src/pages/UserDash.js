import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../contexts/UserContext";
import "./pageStyles/dash.css";
import { Link } from "react-router-dom";

const UserDash = () => {
  const { user, bookings } = useContext(UserContext);
  const [credits, setCredits] = useState(0);

  useEffect(() => {
    if (user) {
      setCredits(user.credits);
    }
  }, [user]);

  return (
    <div className="dashboard-container">
      <h2>Welcome to Your Dashboard</h2>

      <div className="dashboard-section">
        <h3>Upcoming Bookings</h3>
        <ul>
          {bookings.length > 0 ? (
            bookings.map((booking) => (
              <li key={booking.id}>
                {booking.type} Photography - Date: {booking.date} - Status:{" "}
                {booking.status}
              </li>
            ))
          ) : (
            <li>No upcoming bookings</li>
          )}
        </ul>
      </div>

      <div className="dashboard-section">
        <h3>Credits</h3>
        <p>
          You have <strong>{credits} credits</strong> available.
        </p>
      </div>

      <div className="dashboard-section">
        <h3>Downloadable Content</h3>
        <button><Link to="/photo-gallery">Your Gallery</Link></button>
      </div>

      <div className="dashboard-section">
        <h3>Account Settings</h3>
        <button>Edit Profile</button>
        <button>Change Password</button>
        <button>Log Out</button>
      </div>
    </div>
  );
};

export default UserDash;
