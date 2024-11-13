import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import axios from "axios";
const UpdateAd = () => {
  // set the initial values and states
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [type, setType] = useState("");
  const [image, setImage] = useState(null);
  const [message, setMessage] = useState("");

  const params = useParams();
  // get hold of the parameter id from the url on the frontend
  const adID = params.id;
  const navigate = useNavigate();
  // to lead the data initially from the server
  useEffect(() => {
    // How to get an ad given the id
    const getAd = async () => {
      //get hold of the token
      const token = localStorage.getItem("userToken");
      const getUrl = `${process.env.REACT_APP_BACKEND_URL}/api/ads/${adID}`;
      try {
        const response = await axios.get(getUrl);
        const data = response.data;
        console.log(data);
        //Deconstruct the data
        const { title, price, description, category, image, type } = data;
        setTitle(title);
        setPrice(Number(price));
        setDescription(description);
        setCategory(category);
        setImage(image);
        setType(type);
      } catch (error) {
        console.log(
          `An error ocurred while getting the data from the ad ${error}`
        );
      }
    };
    // Get the add and set the states
    getAd();
  }, []);

  //Prepare/create a form to send the data
  const formData = new FormData();

  // handle the modification of picture
  const handlePictureUpload = (event) => {
    const image = event.target.files[0];
    setImage(image);
    formData.append("image", image);
  };

  const handleSubmit = async (event) => {
    // prevent reload of the page
    event.preventDefault();

    try {
      // Get hold of the token to use it in the authorization for the request
      const token = localStorage.getItem("userToken");
      // console.log(localStorage.getItem("userToken"));
      formData.append("title", title);
      formData.append("price", price);
      formData.append("description", description);
      formData.append("category", category);
      formData.append("type", type);
      formData.append("image", image);

      try {
        const updateURL = `${process.env.REACT_APP_BACKEND_URL}/api/ads/update/${adID}`;
        const response = await axios.put(updateURL, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        });
        console.log(response);
        if (response.status === 200) {
          // Handle success
          console.log("Ad created successfully");
          alert("Ad successfully edited!");
          navigate("/myAds");
        } else {
          // Handle error, e.g., display an error message
          console.error("Failed to update the ad");
          console.log(updateURL);
        }
      } catch (error) {
        console.error("Error sending the update:", error);
      }
    } catch (error) {
      console.log("Error setting up the form, check the details again");
    }
  };

  // the encType in the form is crucial to be able to upload the file
  return (
    <div>
      <h3>What do you want to rent? </h3>
      <h4>{message}</h4>
      <p>Share what you have and make some money in the process</p>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <input
          value={title}
          type="text"
          name="title"
          placeholder="Title"
          onChange={(e) => setTitle(e.target.value)}
          autoComplete="off"
        />
        <input
          value={price}
          type="number"
          name="price"
          placeholder="$"
          onChange={(e) => setPrice(e.target.value)}
        />
        <br />
        <textarea
          value={description}
          name="description"
          placeholder="Describe what you rent..."
          onChange={(e) => setDescription(e.target.value)}
          autocomplete="off"
        ></textarea>
        <h3>Upload a picture for your ad</h3>
        <input type="file" name="image" onChange={handlePictureUpload} />
        <select
          value={category}
          name="category"
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">Select a Rental Category</option>
          <option value="electronics">Electronics</option>
          <option value="tools">Tools</option>
          <option value="sports_equipment">Sports Equipment</option>
          <option value="outdoor_gear">Outdoor Gear</option>
          <option value="music_equipment">Music Equipment</option>
          <option value="party_supplies">Party Supplies</option>
          <option value="vehicles">Vehicles</option>
          <option value="fashion_accessories">Fashion Accessories</option>
          <option value="books">Books</option>
          <option value="furniture">Furniture</option>
          <option value="other">Other</option>
        </select>
        <select
          value={type}
          name="type"
          onChange={(e) => setType(e.target.value)}
          required
        >
          <option value="">Select type of rental</option>
          <option value="daily">Daily </option>
          <option value="monthly">Monthly</option>
          <option value="hourly">Hourly</option>
        </select>
        <button type="submit">Submit</button>
      </form>
      <img
        height="300px"
        src={
          image ? `${process.env.REACT_APP_BACKEND_URL}/uploads/${image}` : ""
        }
        alt="Uploaded Preview"
      />
    </div>
  );

  //   } else {
  //     alert("Please login to adit an ad");
  //     navigate("/login");
  // //   }
};

export default UpdateAd;
