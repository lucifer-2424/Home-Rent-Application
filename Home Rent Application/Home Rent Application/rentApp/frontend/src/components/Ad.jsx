import { useNavigate } from "react-router";
import UserRating from "./UserRating";
import { Link } from "react-router-dom";

const Ad = ({
  ad: { _id, user_reviews, description, title, price, category, image, type },
}) => {
  const navigate = useNavigate();

  const imageUrl = `http://localhost:5000/uploads/${image}`;
  return (
    <div className="image-container">
      <Link to={`/adDetails/${_id}`}>
        <img src={imageUrl} />
        <p>
          {title} <br />
          <br></br>${price}, {type}
          <br />
          <UserRating rating={user_reviews} />
        </p>
      </Link>
    </div>
  );
};

export default Ad;
