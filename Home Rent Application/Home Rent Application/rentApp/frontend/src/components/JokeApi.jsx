import axios from "axios";
import { useEffect, useState } from "react";

const JokeApi = () => {
  const [joke, setJoke] = useState("");
  //Sorry for this professor. I used this to comply with the requirements, but some jokes are good
  // get a Joke function
  const getJoke = async () => {
    try {
      const response = await axios.get(
        "https://geek-jokes.sameerkumar.website/api?format=json"
      );
      console.log(response.data);
      setJoke(response.data.joke); // Access the joke property of the response data
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getJoke();
  }, []);

  return (
    <div className="d-flex justify-content-center align-items-center">
      {joke}
    </div>
  );
};

export default JokeApi;
