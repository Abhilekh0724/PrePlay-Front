import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getCategoriesApi } from "../../api/Api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faGamepad, faMobile } from "@fortawesome/free-solid-svg-icons";
import { BASE_URL } from "../../api/Api";

const TopCharts = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getCategoriesApi();
        if (response.data.success) {
          const sortedCategories = response.data.categories.sort((a, b) => b.rating - a.rating);
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

  if (loading) {
    return (
      <div style={{
        marginLeft: '260px',
        marginTop: '70px',
        padding: '40px',
        backgroundColor: '#0a0a0a',
        minHeight: 'calc(100vh - 70px)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        color: '#00ff00'
      }}>
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      marginLeft: '260px',
      marginTop: '70px',
      padding: '40px',
      backgroundColor: '#0a0a0a',
      minHeight: 'calc(100vh - 70px)',
      color: '#fff'
    }}>
      <h2 style={{ marginBottom: '30px' }}>Top Charts</h2>
      <p style={{ color: '#999', marginBottom: '30px' }}>
        Discover the most fun and engaging mobile games worldwide on PrePlay, ranked in real-time and curated for your ultimate gaming experience.
      </p>
      
      <div className="games-list">
        {categories.map((game, index) => (
          <Link 
            key={game._id} 
            to={`/category/${game._id}`} 
            style={{ textDecoration: 'none' }}
          >
            <div style={{
              display: 'flex',
              alignItems: 'center',
              padding: '15px',
              backgroundColor: '#1a1a1a',
              borderRadius: '12px',
              marginBottom: '15px',
              transition: 'all 0.3s ease',
              cursor: 'pointer',
              border: '1px solid #333',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.backgroundColor = '#222';
              e.currentTarget.style.transform = 'translateX(10px)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.backgroundColor = '#1a1a1a';
              e.currentTarget.style.transform = 'translateX(0)';
            }}>
              {/* Rank Number */}
              <div style={{
                width: '30px',
                fontSize: '24px',
                fontWeight: 'bold',
                color: '#666',
                marginRight: '20px'
              }}>
                {index + 1}
              </div>

              {/* Game Image */}
              <div style={{
                width: '80px',
                height: '80px',
                marginRight: '20px',
                borderRadius: '15px',
                overflow: 'hidden'
              }}>
                <img
                  src={`${BASE_URL}${game.photo}`}
                  alt={game.name}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                />
              </div>

              {/* Game Info */}
              <div style={{ flex: 1 }}>
                <h3 style={{ 
                  color: '#fff',
                  marginBottom: '5px',
                  fontSize: '18px'
                }}>{game.name}</h3>
                
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '15px'
                }}>
                  <span style={{ color: '#999' }}>
                    <FontAwesomeIcon icon={game.type === 'PC' ? faGamepad : faMobile} className="me-2" />
                    {game.category}
                  </span>
                  <span style={{ color: '#999' }}>•</span>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                    color: '#00ff00'
                  }}>
                    <FontAwesomeIcon icon={faStar} />
                    <span>{game.rating}</span>
                  </div>
                </div>
              </div>

              {/* Global Badge if applicable */}
              {game.isGlobal && (
                <div style={{
                  backgroundColor: '#333',
                  color: '#fff',
                  padding: '4px 12px',
                  borderRadius: '12px',
                  fontSize: '12px'
                }}>
                  Global
                </div>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default TopCharts;
