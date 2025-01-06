import React, { useState, useEffect } from "react";
import { getAllCategoriesApi } from "../../api/Api"; // Import the API call function
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";

const TopCharts = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const cardImageStyle = {
    height: "200px",
    width: "200px",
    objectFit: "cover",
  };

  const cardStyle = {
    width: "200px",
    backgroundColor: "#0a0a0a",
    border: "1px solid #333",
    borderRadius: "4px",
    overflow: "hidden",
    transition: "all 0.3s ease",
    textDecoration: "none",
  };

  const textEllipsisStyle = {
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getAllCategoriesApi(); // Call the backend API to fetch categories
        if (response.data.success && response.data.categories) {
          // Sort categories by rating in descending order
          const sortedCategories = response.data.categories.sort(
            (a, b) => b.rating - a.rating
          );
          setCategories(sortedCategories);
        }
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return (
      <div
        style={{
          marginLeft: "260px",
          marginTop: "70px",
          width: "calc(100% - 260px)",
          minHeight: "calc(100vh - 70px)",
          backgroundColor: "#0a0a0a",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          color: "#fff",
        }}
      >
        Loading...
      </div>
    );
  }

  return (
    <div
      className="main-content"
      style={{
        marginLeft: "260px",
        marginTop: "70px",
        width: "calc(100% - 260px)",
        minHeight: "calc(100vh - 70px)",
        backgroundColor: "#0a0a0a",
        position: "relative",
      }}
    >
      <div style={{ padding: "40px 20px" }}>
        <h2
          style={{
            color: "#fff",
            marginBottom: "30px",
            fontSize: "24px",
            fontWeight: "normal",
          }}
        >
          Top Charts
        </h2>

        <div
          className="d-flex flex-wrap"
          style={{ gap: "25px", justifyContent: "center" }}
        >
          {categories.map((category) => (
            <div
              key={category._id}
              style={cardStyle}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "#00ff00";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "#333";
              }}
            >
              <img
                src={category.photo || `assets/images/placeholder.jpg`} // Use category photo or a placeholder
                style={cardImageStyle}
                alt={category.name}
              />
              <div
                style={{
                  padding: "10px",
                  height: "100px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <div>
                  <h5
                    style={{
                      ...textEllipsisStyle,
                      color: "#fff",
                      marginBottom: "4px",
                      fontSize: "14px",
                    }}
                  >
                    {category.name}
                  </h5>
                  <p
                    style={{
                      color: "#00ff00",
                      fontSize: "12px",
                      marginBottom: "4px",
                    }}
                  >
                    <FontAwesomeIcon icon={faStar} /> {category.rating || 0} Rating
                  </p>
                </div>
                <button
                  style={{
                    width: "100%",
                    padding: "6px",
                    backgroundColor: "transparent",
                    border: "1px solid #333",
                    color: "#fff",
                    borderRadius: "4px",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    fontSize: "12px",
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = "#00ff00";
                    e.target.style.color = "#000";
                    e.target.style.borderColor = "#00ff00";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = "transparent";
                    e.target.style.color = "#fff";
                    e.target.style.borderColor = "#333";
                  }}
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TopCharts;
