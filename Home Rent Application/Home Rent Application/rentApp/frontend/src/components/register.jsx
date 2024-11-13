import React, { useState } from "react";
import axios from "axios";

const Register = ({ serverURL }) => {
  // State to manage form input values
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Handler for form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Perform sign-up logic here, e.g., make an API call
    const RegisterURL = `${process.env.REACT_APP_BACKEND_URL}/api/register`;
    try {
      const response = await axios.post(RegisterURL, {
        username,
        email,
        password,
      });
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }

    // Reset form after submission
    setUsername("");
    setEmail("");
    setPassword("");
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center"></div>
      <div className="col-md-6">
        <h2>Sign Up</h2>
        <form className="needs-validation" onSubmit={handleSubmit}>
          <label className="form-label">
            Username
            <input
              type="text"
              name="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autocomplete="off"
            />
          </label>
          <br />
          <label className="form-label">
            Email:
            <input
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>
          <br />
          <label className="form-label">
            Password:
            <input
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>
          <br />
          <button type="submit">Sign Up</button>
        </form>
      </div>
    </div>
  );
};

export default Register;
