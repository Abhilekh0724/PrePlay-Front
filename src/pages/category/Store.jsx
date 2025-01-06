import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getCategoriesApi } from "../../api/Api";
import { toast } from "react-toastify";

const Store = () => {
  const [games, setGames] = useState([]);

  const cardImageStyle = {
    height: '200px',
    width: '200px',
    objectFit: 'cover',
  };

  const cardStyle = {
    width: '200px',
    backgroundColor: '#0a0a0a',
    border: '1px solid #333',
    borderRadius: '4px',
    overflow: 'hidden',
    transition: 'all 0.3s ease',
    textDecoration: 'none'
  };

  const textEllipsisStyle = {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  };

  return (
    <div className="main-content" style={{
      marginLeft: '260px',
      marginTop: '70px',
      width: 'calc(100% - 260px)',
      minHeight: 'calc(100vh - 70px)',
      backgroundColor: '#0a0a0a',
      position: 'relative'
    }}>
      <div style={{ padding: '40px 20px' }}>
        <h2 style={{ 
          color: '#fff',
          marginBottom: '30px',
          fontSize: '24px',
          fontWeight: 'normal'
        }}>
          Game Store
        </h2>
        
        <div className="d-flex flex-wrap" style={{ gap: '25px', justifyContent: 'center' }}>
          {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
            <div
              key={item}
              style={cardStyle}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = '#00ff00';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = '#333';
              }}
            >
              <img
                src={`assets/images/${item}.jpg`}
                style={cardImageStyle}
                alt={`Game ${item}`}
              />
              <div style={{ 
                padding: '10px',
                height: '100px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}>
                <div>
                  <h5 style={{ 
                    ...textEllipsisStyle,
                    color: '#fff',
                    marginBottom: '4px',
                    fontSize: '14px'
                  }}>
                    Game Title {item}
                  </h5>
                  <p style={{ 
                    ...textEllipsisStyle,
                    color: '#999',
                    fontSize: '12px'
                  }}>
                    ${29.99}
                  </p>
                </div>
                <button
                  style={{
                    width: '100%',
                    padding: '6px',
                    backgroundColor: 'transparent',
                    border: '1px solid #333',
                    color: '#fff',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    fontSize: '12px'
                  }}
                  onMouseEnter={e => {
                    e.target.style.backgroundColor = '#00ff00';
                    e.target.style.color = '#000';
                    e.target.style.borderColor = '#00ff00';
                  }}
                  onMouseLeave={e => {
                    e.target.style.backgroundColor = 'transparent';
                    e.target.style.color = '#fff';
                    e.target.style.borderColor = '#333';
                  }}
                >
                  Buy Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Store; 