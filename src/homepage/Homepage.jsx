import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getCategoriesApi } from "../api/Api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { BASE_URL } from "../api/Api";

const Homepage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getCategoriesApi();
        if (response.data.success) {
          // Sort categories by rating in descending order
          const sortedCategories = response.data.categories
            .sort((a, b) => b.rating - a.rating)
            .slice(0, 5); // Get top 5 rated categories
          setCategories(sortedCategories);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % categories.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + categories.length) % categories.length);
  };

  // Auto-advance carousel every 5 seconds
  useEffect(() => {
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, [categories.length]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div
      style={{
        marginLeft: "260px",
        marginTop: "70px",
        backgroundColor: "#0a0a0a",
        minHeight: "calc(100vh - 70px)",
        color: "#fff",
      }}
    >
      {/* Top Rated Carousel */}
      <div
        style={{
          position: "relative",
          height: "500px",
          overflow: "hidden",
        }}
      >
        {categories.map((category, index) => (
            <Link
            key={category._id}
              to={`/category/${category._id}`}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              opacity: index === currentSlide ? 1 : 0,
              transition: "opacity 0.5s ease-in-out",
              textDecoration: "none",
              color: "#fff",
            }}
          >
            {/* Background Image */}
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                backgroundImage: `url(${BASE_URL}${category.photo})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                filter: "blur(10px)",
                opacity: 0.3,
              }}
            />
            {/* Content */}
            <div
              style={{
                position: "relative",
                height: "100%",
                display: "flex",
                alignItems: "center",
                padding: "0 100px",
                gap: "30px",
              }}
            >
              {/* Game Image */}
              <img
                src={`${BASE_URL}${category.photo}`}
                alt={category.name}
                style={{
                  width: "300px",
                  height: "400px",
                  objectFit: "cover",
                  borderRadius: "12px",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
                }}
              />

              {/* Game Info */}
              <div>
                <h1 style={{ fontSize: "48px", marginBottom: "20px" }}>
                  {category.name}
                </h1>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "20px",
                    marginBottom: "20px",
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
                    <span style={{ fontSize: "24px" }}>{category.rating}</span>
                  </div>
                  <span style={{ color: "#999" }}>{category.type}</span>
                </div>
                <p
                  style={{
                    fontSize: "18px",
                    color: "#ccc",
                    maxWidth: "600px",
                    lineHeight: "1.6",
                  }}
                >
                  {category.description}
                </p>
              </div>
            </div>
          </Link>
        ))}

        {/* Navigation Buttons */}
        <button
          onClick={(e) => {
            e.preventDefault();
            prevSlide();
          }}
          style={{
            position: "absolute",
            left: "20px",
            top: "50%",
            transform: "translateY(-50%)",
            backgroundColor: "rgba(0,0,0,0.5)",
            color: "#fff",
            border: "none",
            borderRadius: "50%",
            width: "40px",
            height: "40px",
            cursor: "pointer",
            zIndex: 2,
          }}
        >
          <FontAwesomeIcon icon={faChevronLeft} />
        </button>
        <button
          onClick={(e) => {
            e.preventDefault();
            nextSlide();
          }}
          style={{
            position: "absolute",
            right: "20px",
            top: "50%",
            transform: "translateY(-50%)",
            backgroundColor: "rgba(0,0,0,0.5)",
            color: "#fff",
            border: "none",
            borderRadius: "50%",
            width: "40px",
            height: "40px",
            cursor: "pointer",
            zIndex: 2,
          }}
        >
          <FontAwesomeIcon icon={faChevronRight} />
        </button>

        {/* Slide Indicators */}
        <div
          style={{
            position: "absolute",
            bottom: "20px",
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            gap: "10px",
            zIndex: 2,
          }}
        >
          {categories.map((_, index) => (
            <button
              key={index}
              onClick={(e) => {
                e.preventDefault();
                setCurrentSlide(index);
              }}
              style={{
                width: "10px",
                height: "10px",
                borderRadius: "50%",
                backgroundColor: index === currentSlide ? "#00ff00" : "#fff",
                border: "none",
                cursor: "pointer",
              }}
            />
          ))}
        </div>
      </div>

      {/* Category Cards Section */}
      <div style={{ padding: "40px" }}>
        <h2 style={{ marginBottom: "30px" }}>All Games</h2>
        <div className="row g-4">
          {categories.map((category) => (
            <div key={category._id} className="col-md-4 col-lg-3">
              <Link to={`/category/${category._id}`} style={{ textDecoration: "none" }}>
                <div
                  style={{
                    backgroundColor: "#1a1a1a",
                    borderRadius: "10px",
                    overflow: "hidden",
                    border: "1px solid #333",
                    transition: "transform 0.3s ease, box-shadow 0.3s ease",
                    cursor: "pointer",
                    height: "100%",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-5px)";
                    e.currentTarget.style.boxShadow =
                      "0 6px 20px rgba(0, 255, 0, 0.3)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  <div
                    style={{
                      position: "relative",
                      height: "200px", // Fixed height for the card image
                      overflow: "hidden",
                    }}
                  >
                    <img
                      src={`${BASE_URL}${category.photo}`}
                      alt={category.name}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  </div>
                  <div style={{ padding: "15px", color: "#fff" }}>
                    <h5
                      style={{
                        margin: "0 0 10px 0",
                        fontSize: "16px",
                        fontWeight: "bold",
                      }}
                    >
                      {category.name}
                    </h5>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "5px",
                          color: "#00ff00",
                          fontSize: "14px",
                        }}
                      >
                        <FontAwesomeIcon icon={faStar} />
                        <span>{category.rating}</span>
                      </div>
                      <span style={{ color: "#999", fontSize: "14px" }}>
                        {category.type}
                      </span>
                    </div>
                </div>
              </div>
            </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Homepage;
