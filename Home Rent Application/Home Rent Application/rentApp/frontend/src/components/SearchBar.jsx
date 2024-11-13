import { useState } from "react";
import { useSearchParams } from "react-router-dom";
const SearchBar = ({ onSearch = (f) => f }) => {
  const [searchItem, setSearchItem] = useState("");
  const [category, setCategory] = useState("");
  // Use search parameters
  const [searchParams, setSearchParams] = useSearchParams();

  function handleChange(event) {
    setSearchItem(event.target.value);
  }

  function handleOnSubmit(event) {
    event.preventDefault();
    onSearch(searchItem, category);
  }

  return (
    <>
      <div>
        <form onSubmit={(e) => handleOnSubmit(e)}>
          <input
            value={searchItem}
            onChange={(e) => handleChange(e)}
            name="SearchBar"
            type="text"
            required
            autocomplete="off"
          ></input>
          <select
            name="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
            defaultValue={"other"}
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
          <button type="submit">Search</button>
        </form>
      </div>
    </>
  );
};

export default SearchBar;
