import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaEdit, FaTrash } from "react-icons/fa";
import { Link } from "react-router-dom";

const UserAds = () => {
  const [ads, setAds] = useState([]);
  // get the user token
  const token = localStorage.getItem("userToken");
  console.log(token);
  //get the ads on loading
  useEffect(() => {
    getAds();
  }, []);

  const handleDelete = async (adId) => {
    // TODO Implement delete functionality
    const deleteUrl = `${process.env.REACT_APP_BACKEND_URL}/api/users/ads/${adId}`;
    const response = await axios.delete(deleteUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("Deleting ad with id:", adId);
    getAds();
  };

  const getAds = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/users/ads`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response);
      // Set the ads from the response
      setAds(response.data);
    } catch (error) {
      console.error("Error fetching ads:", error);
    }
  };
  if (localStorage.getItem("userToken")) {
    return (
      <div className="mt-5">
        <table className="table table-dark">
          <thead>
            <tr>
              <th scope="col">Title</th>
              <th scope="col">Category</th>
              <th scope="col">Price</th>
              <th scope="col">Actions</th>
            </tr>
          </thead>
          <tbody>
            {ads ? (
              ads.map((ad, i) => (
                <tr key={i}>
                  <td>{ad.title}</td>
                  <td>{ad.category}</td>
                  <td>{ad.price}</td>
                  <td>
                    <Link to={`/updateAd/${ad._id}`}>
                      <FaEdit />
                    </Link>

                    <FaTrash
                      onClick={() => handleDelete(ad._id)}
                      style={{ cursor: "pointer" }}
                    />
                  </td>
                </tr>
              ))
            ) : (
              <tr>No ads to show</tr>
            )}
          </tbody>
        </table>
      </div>
    );
  } else {
    return <h1>Please Login to see your ads</h1>;
  }
};

export default UserAds;
