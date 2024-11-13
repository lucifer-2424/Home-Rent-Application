import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router";
const Login = ({ handleLogin = (f) => f, serverURL }) => {
  // Set states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState(" ");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const LoginURL = `${process.env.REACT_APP_BACKEND_URL}/api/login`;
    try {
      const response = await axios.post(
        LoginURL,
        {
          email: email.toLocaleLowerCase(),
          password: password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = response.data;
      // console.log(data);
      if (data.token) {
        // console.log(data.token);
        localStorage.setItem("userToken", data.token);
        localStorage.setItem("username", data.username);
        console.log(localStorage.getItem("userToken"));
        setMessage(``);
        alert("You're back to Sharing");
        navigate("/myAds");
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.log(`error getting the server data ${error}`);
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <label>Email:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
          }}
          required
        />

        <label>Password:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit" onSubmit={handleSubmit}>
          Login
        </button>
      </form>
      {message ? <h1>{message}</h1> : <></>}
    </div>
  );
};

export default Login;
