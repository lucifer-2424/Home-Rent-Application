import React from "react";
import { Link, useNavigate } from "react-router-dom";
import SearchBar from "./SearchBar";
const Navbar = ({
  isLoggedIn,
  handleLogout = (f) => f,
  onSearch = (f) => f,
}) => {
  const navigate = useNavigate();
  const token = localStorage.getItem("userToken");

  return (
    <nav className="navbar navbar-expand-lg  navbar-dark bg-dark">
      <button
        class="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarNavAltMarkup"
        aria-controls="navbarNavAltMarkup"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
        <div className="navbar-nav">
          <Link className="nav-item nav-link" to="/">
            Home <span className="sr-only"></span>
          </Link>
          {token ? (
            <>
              <Link className="nav-item nav-link" to="/" onClick={handleLogout}>
                Logout
              </Link>
              <Link className="nav-item nav-link" to="/myAds">
                My Ads
              </Link>
            </>
          ) : (
            <Link className="nav-item nav-link" to="/login">
              Login
            </Link>
          )}
          {/* <Link className="nav-item nav-link" to="/categories">
            Categories
          </Link> */}
          <Link className="nav-item nav-link" to="/createAd">
            Share something
          </Link>

          <Link className="nav-item nav-link " to="/about">
            About
          </Link>
          <Link className="nav-item nav-link " to="/register">
            Register
          </Link>
        </div>
      </div>
      <SearchBar onSearch={onSearch} />
    </nav>
  );
};

export default Navbar;
