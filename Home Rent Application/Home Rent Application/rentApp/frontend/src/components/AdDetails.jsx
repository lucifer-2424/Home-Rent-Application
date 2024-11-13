import { useParams } from "react-router";
import UserRating from "./UserRating";
import { useEffect, useState } from "react";
import axios from "axios";

const AdDetails = () => {
  // set the initial values and states
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [type, setType] = useState("");
  const [image, setImage] = useState(null);
  const [message, setMessage] = useState("");
  //Set states
  const params = useParams();
  //get the adID
  const adId = params.id;

  useEffect(() => {
    // How to get an ad given the id
    const getAd = async () => {
      //get hold of the token
      const token = localStorage.getItem("userToken");
      const getUrl = `http://localhost:5000/api/ads/${adId}`;
      try {
        const response = await axios.get(getUrl);
        const data = response.data;
        console.log(data);
        //Deconstruct the data
        const { title, price, description, category, image, user, type } = data;
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

  return (
    <>
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-6 text-center">
            <img
              src={`http://localhost:5000/uploads/${image}`}
              className="img-fluid"
              alt="item"
            />
          </div>
        </div>
        <div className="row justify-content-center mt-3">
          <div className="col-md-6 text-center">
            <h2>{title}</h2>
            <h3>${price}</h3>
            <h3>
              {type}, {category}
            </h3>
            <p>{description}</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdDetails;
