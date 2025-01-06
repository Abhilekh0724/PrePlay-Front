import React, { useState } from "react";
import { useHistory } from "react-router-dom";

const SearchForm = () => {
  const [query, setQuery] = useState("");
  const history = useHistory();

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      history.push(`/search?query=${query}`);
    }
  };

  return (
    <form onSubmit={handleSearch} className="search-form">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search for categories..."
        className="form-control"
      />
      <button type="submit" className="btn btn-primary">Search</button>
    </form>
  );
};

export default SearchForm;
