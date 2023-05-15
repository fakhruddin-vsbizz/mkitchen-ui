import React, { useContext, useState } from "react";
import axios from "axios";
import AuthContext from "../components/context/auth-context";
import { useNavigate } from "react-router-dom";

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState("");

  const authCtx = useContext(AuthContext);
  const navigate = useNavigate();
  console.log(newPassword);
  const handleResetSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = await fetch(
        "http://localhost:5001/admin/account_management",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: authCtx.userEmail,
            username: "mk admin",
            usertype: "mk admin",
            password: newPassword,
            action: "update_password",
          }),
        }
      );
      if (data) {
        console.log(data.json().then((data) => console.log(data)));
        authCtx.logout();
        navigate("/login");
      }
    } catch (error) {
      console.error(error);
      alert("Password reset email failed to send.");
    }
  };

  return (
    <form onSubmit={handleResetSubmit}>
      <label>
        New Password:
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
      </label>
      <button type="submit">Reset Password</button>
    </form>
  );
};

export default ResetPassword;
