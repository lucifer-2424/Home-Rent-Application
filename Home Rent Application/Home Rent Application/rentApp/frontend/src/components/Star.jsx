import { BsStarFill, BsStarHalf } from "react-icons/bs";

const Star = ({ gold }) => {
  let colorstar;
  gold ? (colorstar = "gold") : (colorstar = "gray");
  return <BsStarFill color={colorstar} />;
};

export default Star;
