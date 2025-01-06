import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { searchCategoriesApi } from "../../api/Api"; // Adjust the import path as necessary
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { BASE_URL } from "../../api/Api";

const SearchPage = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const query = new URLSearchParams(location.search).get("query");

  useEffect(() => {
    const fetchResults = async () => {
      if (!query) return;
      
      try {
        setLoading(true);
        const response = await searchCategoriesApi(query);
        if (response.data.success) {
          setResults(response.data.categories);
        }
      } catch (error) {
        console.error("Error searching categories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [query]);

  if (loading) {
    return (
      <div
        style={{
          marginLeft: "260px",
          marginTop: "70px",
          padding: "40px",
          backgroundColor: "#0a0a0a",
          minHeight: "calc(100vh - 70px)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          color: "#00ff00"
        }}
      >
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        marginLeft: "260px",
        marginTop: "70px",
        padding: "40px",
        backgroundColor: "#0a0a0a",
        minHeight: "calc(100vh - 70px)",
        color: "#fff"
      }}
    >
      <h2 style={{ marginBottom: "30px" }}>Search Results for "{query}"</h2>
      
      {results.length === 0 ? (
        <div style={{ textAlign: "center", color: "#999" }}>
          No results found for "{query}"
        </div>
      ) : (
        <div className="row g-4">
          {results.map(game => (
            <div key={game._id} className="col-md-4 col-lg-3">
              <Link to={`/category/${game._id}`} style={{ textDecoration: "none" }}>
                <div
                  style={{
                    backgroundColor: "#1a1a1a",
                    borderRadius: "10px",
                    overflow: "hidden",
                    border: "1px solid #333",
                    transition: "transform 0.3s ease, box-shadow 0.3s ease",
                    cursor: "pointer"
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = "translateY(-5px)";
                    e.currentTarget.style.boxShadow = "0 6px 20px rgba(0, 255, 0, 0.3)";
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  <img
                    src={`${BASE_URL}${game.photo}`}
                    alt={game.name}
                    style={{
                      width: "100%",
                      height: "200px",
                      objectFit: "cover"
                    }}
                  />
                  <div style={{ padding: "15px", color: "#fff" }}>
                    <h5 style={{ margin: "0 0 10px 0" }}>{game.name}</h5>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center"
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "5px",
                          color: "#00ff00"
                        }}
                      >
                        <FontAwesomeIcon icon={faStar} />
                        <span>{game.rating}</span>
                      </div>
                      <span style={{ color: "#999" }}>{game.type}</span>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchPage;
