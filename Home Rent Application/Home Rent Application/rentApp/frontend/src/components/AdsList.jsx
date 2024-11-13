import { useEffect } from "react";
import Ad from "./Ad";

const AdsList = ({ ads, fetchdata = (f) => f }) => {
  useEffect(() => fetchdata(), []);
  return (
    <div className="adList mt-5">
      {ads.map((e, i) => (
        <Ad key={e._id} ad={e} />
      ))}
    </div>
  );
};

export default AdsList;
