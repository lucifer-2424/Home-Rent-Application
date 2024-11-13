import Star from "./Star";

const UserRating = ({ rating }) => {
  const stars = Array(5).fill(null);
  stars.length = 5;

  console.log(stars.length);
  return (
    <>
      {stars.map((e, i) => (
        <Star key={i} gold={i < rating} />
      ))}
    </>
  );
};

export default UserRating;
