import React, { useState } from "react";
import { useNavigate } from "react-router";
import axios from "axios";
const CreateAd = ({ fetchdata = (f) => f, serverURL }) => {
  const navigate = useNavigate();
  // Get the user JWT token
  const token = localStorage.getItem("userToken");
  // set the initial values and states
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState(null);
  const [message, setMessage] = useState("");
  const [type, setType] = useState("");
  //Prepare a form to send the data
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
    // console.log(localStorage.getItem("userToken"));
    formData.append("title", title);
    formData.append("price", price);
    formData.append("description", description);
    formData.append("category", category);
    formData.append("image", image);
    formData.append("type", type);

    console.log(formData);
    try {
      const reqURL = `${process.env.REACT_APP_BACKEND_URL}/api/ads/create`;
      const response = await axios.post(reqURL, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response);
      if (response.status === 200) {
        // Handle success, e.g., redirect to a success page
        console.log("Ad created successfully");
        alert("Great, you are now sharing!");
        navigate("/");
      } else {
        // Handle error, e.g., display an error message
        console.error("Failed to create ad");
      }
    } catch (error) {
      console.error("Error creating ad:", error);
    }
  };

  if (token) {
    console.log(token);
    // the encType in the form is crucial to be able to upload the file
    return (
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <h3 className="mb-4"> What do you want to rent? </h3>
            <h4 className="text-danger">{message}</h4>
            <p>Share what you have and make some money in the process</p>
            <form
              className="mb-3"
              onSubmit={handleSubmit}
              encType="multipart/form-data"
            >
              <div className="mb-3">
                <input
                  value={title}
                  type="text"
                  name="title"
                  placeholder="Title"
                  onChange={(e) => setTitle(e.target.value)}
                  autoComplete="off"
                  required
                />
                <input
                  value={price}
                  type="number"
                  name="price"
                  placeholder="$"
                  onChange={(e) => setPrice(e.target.value)}
                  required
                />
                <br />
                <textarea
                  name="description"
                  value={description}
                  placeholder="Describe what you rent..."
                  onChange={(e) => setDescription(e.target.value)}
                  autocomplete="off"
                  required
                ></textarea>
                <h3>Upload a picture for your ad</h3>
                <input
                  type="file"
                  name="image"
                  onChange={handlePictureUpload}
                  required
                />
                <select
                  name="category"
                  onChange={(e) => setCategory(e.target.value)}
                  required
                >
                  <option value="">Select a Rental Category</option>
                  <option value="electronics">Electronics</option>
                  <option value="tools">Tools</option>
                  <option value="sports_equipment">Sports Equipment</option>
                  <option value="outdoor_gear">Outdoor Gear</option>
                  <option value="music_equipment">Music Equipment</option>
                  <option value="party_supplies">Party Supplies</option>
                  <option value="vehicles">Vehicles</option>
                  <option value="fashion_accessories">
                    Fashion Accessories
                  </option>
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
              </div>

              <button type="submit">Submit</button>
            </form>
            <img
              height="200px"
              src={image ? URL.createObjectURL(image) : "/pictures/logo1.jpeg"}
              alt="Uploaded Preview"
            />
          </div>
        </div>
      </div>
    );
  } else {
    alert("Please login to create an ad");
    navigate("/login");
  }
};

export default CreateAd;
