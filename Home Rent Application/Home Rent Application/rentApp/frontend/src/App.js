import "./App.css";
import AdsList from "./components/AdsList";
import { useEffect, useState } from "react";
import "./adStyle.css";
import CreateAd from "./components/CreateAd";
import Navbar from "./components/Navbar";
import SearchBar from "./components/SearchBar";
import Categories from "./components/Categories";
import AdDetails from "./components/AdDetails";
import UserAds from "./components/UserAds";
import UpdateAd from "./components/UpdateAd";
import { Route, Routes, useNavigate } from "react-router";
import "bootstrap/dist/css/bootstrap.css";
// import "bootstrap/dist/js/bootstrap.bundle.min.js";

import Login from "./components/Login";
import About from "./components/About";
import Register from "./components/register";
import JokeApi from "./components/JokeApi";
import axios from "axios";
//SERVER URL
const serverURL = process.env.REACT_APP_BACKEND_URL;
function App() {
  const [initialAds, setAds] = useState([]);
  //Call the DataBase and get some ads to initialize
  //set User token
  const [token, setToken] = useState(null);
  const [username, setUsername] = useState("");
  // const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Load the initial Ads
  useEffect(() => {
    const fetchdata = async () => {
      // Get all the the adds from the backend
      const getURL = `${serverURL}/api/ads`;

      try {
        const data = await fetch(getURL);
        const response = await data.json();
        console.log(response);
        setAds(response);
      } catch (error) {
        console.log(`error getting the server data`);
      }
    };
    // call the function when mounted
    fetchdata();
  }, []);
  const navigate = useNavigate();

  function handleLogin(token, username) {
    console.log(token);
    // Set JWR token
    setToken(token);
    setUsername(username);
  }

  function handleLogout() {
    setUsername("");
    setToken("");
    localStorage.removeItem("userToken");
    localStorage.removeItem("username");

    alert("You are now logged out");
  }

  //Get searched items from the server
  const onSearch = async (searchitem, category) => {
    try {
      const searchstring = searchitem.replaceAll(" ", "+");
      //Construct the url with the query params
      const url = `${serverURL}/api/search?item=${searchstring}&category=${category}`;
      const response = await axios.get(url);
      if (response.status === 200) {
        setAds(response.data);
      } else {
        alert("No results for you search");
      }
    } catch (error) {
      alert("No results for you search");
      console.log(error);
    }

    // console.log(response);
  };

  return (
    <div className="bg-light">
      <div className="banner">
        <img className="banner-image" src="/pictures/banner.png"></img>
        <h1 className="AppTitle">ShareAll</h1>
      </div>

      <Navbar handleLogout={handleLogout} onSearch={onSearch} />

      <Routes>
        <Route path="/createAd" element={<CreateAd />} />
        <Route path="/" element={<AdsList ads={initialAds} />} />
        <Route path="/login" element={<Login />} />
        <Route path="/about" element={<About />} />
        <Route path="/myAds" element={<UserAds />} />
        <Route path="/register" element={<Register />} />
        <Route path="/updateAd/:id" element={<UpdateAd />} />
        <Route path="/adDetails/:id" element={<AdDetails />}></Route>
      </Routes>
      {/* <JokeApi /> */}
      <span>
        {/* <AdDetails adDetails={initialAds[0]} /> */}
        <Categories />
        {/* <UserAds /> */}
      </span>
    </div>
  );
}

export default App;
