import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getAllProductsApi } from "../../api/Api"; // Import API call to fetch products
import { toast } from "react-toastify";
import { BASE_URL } from "../../api/Api";

const PreBook = () => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPreBookProducts = async () => {
      try {
        const response = await getAllProductsApi(); // Fetch all products
        if (response.data.success) {
          const preBookGames = response.data.data.filter(
            (product) => product.mode === "prebook"
          ); // Filter for "prebook" mode
          setGames(preBookGames);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
        toast.error("Failed to load games.");
      } finally {
        setLoading(false);
      }
    };

    fetchPreBookProducts();
  }, []);

  const cardImageStyle = {
    height: "200px",
    width: "100%",
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

  if (loading) {
    return <div style={{ color: "#fff", textAlign: "center", marginTop: "50px" }}>Loading...</div>;
  }

  if (games.length === 0) {
    return (
      <div style={{ color: "#fff", textAlign: "center", marginTop: "50px" }}>
        No games available for pre-booking.
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
          Pre-Book Games
        </h2>

        <div
          className="d-flex flex-wrap"
          style={{ gap: "25px", justifyContent: "center" }}
        >
          {games.map((game) => (
            <div
              key={game._id}
              style={cardStyle}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "#00ff00";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "#333";
              }}
            >
              <img
                src={`${BASE_URL}${game.photo}`}
                style={cardImageStyle}
                alt={game.name}
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
                    {game.name}
                  </h5>
                  <p
                    style={{
                      ...textEllipsisStyle,
                      color: "#999",
                      fontSize: "12px",
                    }}
                  >
                    Release Date: {new Date(game.releaseDate).toLocaleDateString()}
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
                  Pre-order Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PreBook;
