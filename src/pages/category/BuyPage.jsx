import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getAllProductsApi } from "../../api/Api"; // Updated to fetch products
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faGamepad, faMobile, faShoppingCart } from "@fortawesome/free-solid-svg-icons";
import { BASE_URL } from "../../api/Api";

const BuyPage = () => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const response = await getAllProductsApi(); // Fetch all products
        if (response.data.success) {
          // Filter only games that are for sale (mode: 'buy')
          const buyableGames = response.data.data.filter((game) => game.mode === "buy");
          setGames(buyableGames);
        }
      } catch (error) {
        console.error("Error fetching games:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGames();
  }, []);

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
          color: "#00ff00",
        }}
      >
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (games.length === 0) {
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
          color: "#fff",
        }}
      >
        <h3>No games available for purchase at the moment.</h3>
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
        color: "#fff",
      }}
    >
      <h2 style={{ marginBottom: "30px" }}>Buy Games</h2>
      <p style={{ color: "#999", marginBottom: "30px" }}>
        Explore and purchase the latest games available on PrePlay
      </p>

      <div className="row g-4">
        {games.map((game) => (
          <div key={game._id} className="col-md-4 col-lg-3">
            <Link to={`/product/${game._id}`} style={{ textDecoration: "none" }}>
              <div
                style={{
                  backgroundColor: "#1a1a1a",
                  borderRadius: "12px",
                  overflow: "hidden",
                  border: "1px solid #333",
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                  height: "100%",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-5px)";
                  e.currentTarget.style.boxShadow = "0 6px 20px rgba(0, 255, 0, 0.3)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <div style={{ position: "relative" }}>
                  <img
                    src={`${BASE_URL}${game.photo}`}
                    alt={game.name}
                    style={{
                      width: "100%",
                      height: "200px",
                      objectFit: "cover",
                    }}
                  />
                  {game.isGlobal && (
                    <div
                      style={{
                        position: "absolute",
                        top: "10px",
                        right: "10px",
                        backgroundColor: "#333",
                        color: "#fff",
                        padding: "4px 12px",
                        borderRadius: "12px",
                        fontSize: "12px",
                      }}
                    >
                      Global
                    </div>
                  )}
                </div>

                <div style={{ padding: "20px" }}>
                  <h3
                    style={{
                      color: "#fff",
                      fontSize: "18px",
                      marginBottom: "10px",
                    }}
                  >
                    {game.name}
                  </h3>

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "15px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "5px",
                        color: "#00ff00",
                      }}
                    >
                      <FontAwesomeIcon icon={faStar} />
                      <span>{game.rating || "N/A"}</span>
                    </div>
                    <span style={{ color: "#999" }}>
                      <FontAwesomeIcon
                        icon={game.type === "PC" ? faGamepad : faMobile}
                        className="me-2"
                      />
                      {game.type}
                    </span>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <span
                      style={{
                        color: "#00ff00",
                        fontSize: "20px",
                        fontWeight: "bold",
                      }}
                    >
                      ${game.price}
                    </span>
                    <button
                      style={{
                        backgroundColor: "#00ff00",
                        color: "#000",
                        border: "none",
                        padding: "8px 16px",
                        borderRadius: "20px",
                        fontWeight: "bold",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      <FontAwesomeIcon icon={faShoppingCart} />
                      Buy Now
                    </button>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BuyPage;
