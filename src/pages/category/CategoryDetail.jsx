import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getCategoryByIdApi, postReviewApi, getReviewsByCategoryApi } from '../../api/Api';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faComment, 
  faStar, 
  faUser, 
  faDownload, 
  faGamepad,
  faGlobe,
  faDesktop,
  faMobile
} from "@fortawesome/free-solid-svg-icons";
import { BASE_URL } from '../../api/Api';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CategoryDetail = () => {
  const { id } = useParams();
  const [category, setCategory] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({
    rating: 5,
    comment: ''
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const categoryResponse = await getCategoryByIdApi(id);
        if (categoryResponse.data.success) {
          setCategory(categoryResponse.data.category);
        }

        const reviewsResponse = await getReviewsByCategoryApi(id);
        if (reviewsResponse.data.success) {
          setReviews(reviewsResponse.data.reviews);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error('Error fetching data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const calculateAverageRating = () => {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return (sum / reviews.length).toFixed(1);
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user) {
        toast.error('Please login to submit a review');
        return;
      }

      const reviewData = {
        categoryId: id,
        userId: user._id,
        rating: newReview.rating,
        comment: newReview.comment
      };

      const response = await postReviewApi(reviewData);
      if (response.data.success) {
        const updatedReviews = await getReviewsByCategoryApi(id);
        if (updatedReviews.data.success) {
          setReviews(updatedReviews.data.reviews);
          setNewReview({ rating: 5, comment: '' });
          toast.success('Review posted successfully!');
        }
      }
    } catch (error) {
      console.error("Error posting review:", error);
      toast.error('Error posting review');
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
      backgroundColor: '#0a0a0a',
      minHeight: 'calc(100vh - 70px)',
      color: '#fff'
    }}>
      {/* Hero Section */}
      <div style={{
        position: 'relative',
        height: '500px',
        overflow: 'hidden'
      }}>
        {/* Background Image */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundImage: `url(${BASE_URL}${category?.photo})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'blur(10px)',
          opacity: 0.3
        }} />

        {/* Content */}
        <div style={{
          position: 'relative',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          padding: '0 100px',
          gap: '30px'
        }}>
          {/* Game Image */}
          <img
            src={`${BASE_URL}${category?.photo}`}
            alt={category?.name}
            style={{
              width: '300px',
              height: '400px',
              objectFit: 'cover',
              borderRadius: '12px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.5)'
            }}
          />

          {/* Game Info */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
              <h1 style={{ fontSize: '48px', margin: 0 }}>{category?.name}</h1>
              {category?.isGlobal && (
                <FontAwesomeIcon icon={faGlobe} style={{ color: '#00ff00', fontSize: '24px' }} />
              )}
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '20px',
              marginBottom: '20px'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                color: '#00ff00'
              }}>
                <FontAwesomeIcon icon={faStar} />
                <span style={{ fontSize: '24px' }}>{calculateAverageRating()}</span>
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                color: '#999'
              }}>
                <FontAwesomeIcon icon={category?.type === 'PC' ? faDesktop : faMobile} />
                <span>{category?.type}</span>
              </div>
            </div>

            <p style={{
              fontSize: '18px',
              color: '#ccc',
              maxWidth: '600px',
              lineHeight: '1.6',
              marginBottom: '30px'
            }}>
              {category?.description}
            </p>

            <button style={{
              backgroundColor: '#00ff00',
              color: '#000',
              border: 'none',
              padding: '15px 40px',
              borderRadius: '30px',
              fontSize: '18px',
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={e => e.target.style.backgroundColor = '#00cc00'}
            onMouseLeave={e => e.target.style.backgroundColor = '#00ff00'}
            >
              <FontAwesomeIcon icon={faDownload} />
              Download Now
            </button>
          </div>
        </div>
      </div>

      {/* Tabs Section */}
      <div style={{ padding: '40px' }}>
        <div style={{
          display: 'flex',
          gap: '20px',
          marginBottom: '30px',
          borderBottom: '1px solid #333'
        }}>
          {['overview', 'reviews'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                backgroundColor: 'transparent',
                color: activeTab === tab ? '#00ff00' : '#fff',
                border: 'none',
                borderBottom: `2px solid ${activeTab === tab ? '#00ff00' : 'transparent'}`,
                padding: '10px 20px',
                fontSize: '16px',
                cursor: 'pointer',
                textTransform: 'capitalize'
              }}
            >
              <FontAwesomeIcon 
                icon={tab === 'overview' ? faGamepad : faComment} 
                style={{ marginRight: '8px' }}
              />
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' ? (
          <div>
            {/* Add game details, requirements, etc. */}
          </div>
        ) : (
          <div>
            {/* Reviews Form */}
            <div style={{
              backgroundColor: '#1a1a1a',
              padding: '30px',
              borderRadius: '12px',
              marginBottom: '30px'
            }}>
              <h3 style={{ marginBottom: '20px' }}>Write a Review</h3>
              <form onSubmit={handleReviewSubmit}>
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ marginBottom: '10px', display: 'block' }}>Rating</label>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    {[1, 2, 3, 4, 5].map((num) => (
                      <FontAwesomeIcon
                        key={num}
                        icon={faStar}
                        style={{
                          color: num <= newReview.rating ? '#00ff00' : '#333',
                          fontSize: '24px',
                          cursor: 'pointer'
                        }}
                        onClick={() => setNewReview(prev => ({ ...prev, rating: num }))}
                      />
                    ))}
                  </div>
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <textarea
                    value={newReview.comment}
                    onChange={(e) => setNewReview(prev => ({ ...prev, comment: e.target.value }))}
                    placeholder="Write your review here..."
                    style={{
                      width: '100%',
                      padding: '15px',
                      backgroundColor: '#0a0a0a',
                      border: '1px solid #333',
                      borderRadius: '8px',
                      color: '#fff',
                      minHeight: '100px'
                    }}
                  />
                </div>

                <button
                  type="submit"
                  style={{
                    backgroundColor: '#00ff00',
                    color: '#000',
                    border: 'none',
                    padding: '10px 30px',
                    borderRadius: '20px',
                    fontWeight: 'bold',
                    cursor: 'pointer'
                  }}
                >
                  Post Review
                </button>
              </form>
            </div>

            {/* Reviews List */}
            <div>
              {reviews.map(review => (
                <div
                  key={review._id}
                  style={{
                    backgroundColor: '#1a1a1a',
                    padding: '20px',
                    borderRadius: '12px',
                    marginBottom: '20px'
                  }}
                >
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: '15px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <FontAwesomeIcon
                        icon={faUser}
                        style={{
                          color: '#00ff00',
                          backgroundColor: '#0a0a0a',
                          padding: '10px',
                          borderRadius: '50%'
                        }}
                      />
                      <div>
                        <h5 style={{ margin: 0, color: '#fff' }}>
                          {review.userId?.firstName} {review.userId?.lastName}
                        </h5>
                        <small style={{ color: '#666' }}>
                          {new Date(review.createdAt).toLocaleDateString()}
                        </small>
                      </div>
                    </div>
                    <div style={{ color: '#00ff00' }}>
                      {review.rating} <FontAwesomeIcon icon={faStar} />
                    </div>
                  </div>
                  <p style={{ margin: 0, color: '#ccc' }}>{review.comment}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryDetail;
