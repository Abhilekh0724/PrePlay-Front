import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getCategoriesApi } from "../../api/Api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faTrophy, faMedal, faAward } from "@fortawesome/free-solid-svg-icons";
import { BASE_URL } from "../../api/Api";

const TopCharts = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getCategoriesApi();
        if (response.data.success) {
          // Sort categories by rating in descending order
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

  const getRankIcon = (index) => {
    switch(index) {
      case 0:
        return <FontAwesomeIcon icon={faTrophy} style={{ color: '#FFD700' }} />;
      case 1:
        return <FontAwesomeIcon icon={faMedal} style={{ color: '#C0C0C0' }} />;
      case 2:
        return <FontAwesomeIcon icon={faAward} style={{ color: '#CD7F32' }} />;
      default:
        return `#${index + 1}`;
    }
  };

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
      <h2 style={{ marginBottom: '30px' }}>Top Rated Games</h2>
      
      <div className="row g-4">
        {categories.map((game, index) => (
          <div key={game._id} className="col-md-6 col-lg-4">
            <Link to={`/category/${game._id}`} style={{ textDecoration: 'none' }}>
              <div style={{
                backgroundColor: '#1a1a1a',
                borderRadius: '12px',
                overflow: 'hidden',
                border: '1px solid #333',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                cursor: 'pointer',
                position: 'relative'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(0, 255, 0, 0.3)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}>
                {/* Rank Badge */}
                <div style={{
                  position: 'absolute',
                  top: '10px',
                  left: '10px',
                  backgroundColor: 'rgba(0,0,0,0.8)',
                  color: '#fff',
                  padding: '8px 12px',
                  borderRadius: '20px',
                  fontSize: '16px',
                  zIndex: 1
                }}>
                  {getRankIcon(index)}
                </div>

                <img
                  src={`${BASE_URL}${game.photo}`}
                  alt={game.name}
                  style={{
                    width: '100%',
                    height: '250px',
                    objectFit: 'cover'
                  }}
                />
                
                <div style={{ padding: '20px' }}>
                  <h3 style={{ 
                    color: '#fff',
                    marginBottom: '10px',
                    fontSize: '20px'
                  }}>{game.name}</h3>
                  
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px',
                      color: '#00ff00'
                    }}>
                      <FontAwesomeIcon icon={faStar} />
                      <span style={{ fontSize: '18px' }}>{game.rating}</span>
                    </div>
                    
                    <span style={{
                      color: '#999',
                      backgroundColor: '#0a0a0a',
                      padding: '4px 12px',
                      borderRadius: '15px',
                      fontSize: '14px'
                    }}>
                      {game.category}
                    </span>
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

export default TopCharts;
