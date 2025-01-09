import React, { useState, useEffect } from 'react';
import { createCategoryApi, getCategoriesApi, updateCategoryApi, deleteCategoryApi } from '../../api/Api';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import { BASE_URL } from '../../api/Api';
import Logo from '../../components/Logo';

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState('download'); // 'download', 'buy', 'prebook'
  const [categories, setCategories] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    type: 'PC', // 'PC' or 'Mobile'
    price: '',
    releaseDate: '',
    photo: null,
    isGlobal: false,
    mode: 'download' // 'download', 'buy', or 'prebook'
  });
  const [showAllCategories, setShowAllCategories] = useState(false);

  const predefinedCategories = [
    "Action",
    "Horror",
    "Adventure",
    "Racing",
    "Sports",
    "Puzzle",
    "Role-Playing",
    "Strategy",
    "Simulation",
    "Casual"
  ];

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await getCategoriesApi();
      if (response.data.success) {
        setCategories(response.data.categories);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, files, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'file' ? files[0] : 
              type === 'checkbox' ? checked : value
    }));
  };

  const handleEdit = (category) => {
    setEditingId(category._id);
    setFormData({
      name: category.name,
      description: category.description,
      category: category.category,
      type: category.type,
      price: category.price || '',
      releaseDate: category.releaseDate ? new Date(category.releaseDate).toISOString().split('T')[0] : '',
      isGlobal: category.isGlobal,
      mode: category.mode
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this game?')) {
      try {
        await deleteCategoryApi(id);
        fetchCategories();
      } catch (error) {
        console.error("Error deleting category:", error);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    
    Object.keys(formData).forEach(key => {
      if (formData[key] !== null) {
        formDataToSend.append(key, formData[key]);
      }
    });

    try {
      if (editingId) {
        await updateCategoryApi(editingId, formDataToSend);
      } else {
        await createCategoryApi(formDataToSend);
      }

      setFormData({
        name: '',
        description: '',
        category: '',
        type: 'PC',
        price: '',
        releaseDate: '',
        photo: null,
        isGlobal: false,
        mode: activeTab
      });
      setEditingId(null);
      fetchCategories();
    } catch (error) {
      console.error("Error saving category:", error);
    }
  };

  const filteredCategories = categories.filter(cat => cat.mode === activeTab);

  return (
    <div style={{
      marginLeft: '260px',
      marginTop: '70px',
      padding: '40px',
      backgroundColor: '#0a0a0a',
      minHeight: 'calc(100vh - 70px)',
      color: '#fff'
    }}>
      {/* Toggle View Button */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <Logo width="150px" />
        <button
          className={`btn ${showAllCategories ? 'btn-success' : 'btn-outline-success'}`}
          onClick={() => setShowAllCategories(!showAllCategories)}
        >
          {showAllCategories ? 'Show Category Tabs' : 'Manage All Categories'}
        </button>
      </div>

      {!showAllCategories ? (
        <>
          {/* Tabs */}
          <div style={{ marginBottom: '30px' }}>
            <div className="btn-group" role="group">
              {['download', 'buy', 'prebook'].map(tab => (
                <button
                  key={tab}
                  className={`btn ${activeTab === tab ? 'btn-success' : 'btn-outline-success'}`}
                  onClick={() => {
                    setActiveTab(tab);
                    setFormData(prev => ({ ...prev, mode: tab }));
                  }}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)} Games
                </button>
              ))}
            </div>
          </div>

          {/* Add/Edit Game Form */}
          <form onSubmit={handleSubmit} className="mb-5">
            <h3>{editingId ? 'Edit Game' : 'Add New Game'}</h3>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">Game Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="form-control bg-dark text-white"
                  required
                />
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label">Platform</label>
                <div className="btn-group w-100">
                  {['PC', 'Mobile'].map(platform => (
                    <button
                      key={platform}
                      type="button"
                      className={`btn ${formData.type === platform ? 'btn-success' : 'btn-outline-success'}`}
                      onClick={() => setFormData(prev => ({ ...prev, type: platform }))}
                    >
                      {platform}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="form-control bg-dark text-white"
                rows="3"
                required
              />
            </div>

            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="form-select bg-dark text-white"
                  required
                >
                  <option value="">Select Category</option>
                  {predefinedCategories.map((cat, index) => (
                    <option key={index} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {activeTab !== 'download' && (
                <div className="col-md-6 mb-3">
                  <label className="form-label">
                    {activeTab === 'buy' ? 'Price ($)' : 'Release Date'}
                  </label>
                  <input
                    type={activeTab === 'buy' ? 'number' : 'date'}
                    name={activeTab === 'buy' ? 'price' : 'releaseDate'}
                    value={activeTab === 'buy' ? formData.price : formData.releaseDate}
                    onChange={handleInputChange}
                    className="form-control bg-dark text-white"
                    required
                  />
                </div>
              )}
            </div>

            <div className="mb-3">
              <label className="form-label">Photo</label>
              <input
                type="file"
                name="photo"
                onChange={handleInputChange}
                className="form-control bg-dark text-white"
                accept="image/*"
                required
              />
            </div>

            <div className="mb-3 form-check">
              <input
                type="checkbox"
                name="isGlobal"
                checked={formData.isGlobal}
                onChange={handleInputChange}
                className="form-check-input"
              />
              <label className="form-check-label">Global Release</label>
            </div>

            <div className="mt-3">
              <button type="submit" className="btn btn-success me-2">
                {editingId ? 'Update Game' : 'Add Game'}
              </button>
              {editingId && (
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => {
                    setEditingId(null);
                    setFormData({
                      name: '',
                      description: '',
                      category: '',
                      type: 'PC',
                      price: '',
                      releaseDate: '',
                      photo: null,
                      isGlobal: false,
                      mode: activeTab
                    });
                  }}
                >
                  Cancel Edit
                </button>
              )}
            </div>
          </form>

          {/* Games List */}
          <h3>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Games</h3>
          <div className="row g-4">
            {filteredCategories.map(category => (
              <div key={category._id} className="col-md-4">
                <div className="card bg-dark">
                  <img 
                    src={`${BASE_URL}${category.photo}`}
                    className="card-img-top"
                    alt={category.name}
                    style={{ height: '200px', objectFit: 'cover' }}
                  />
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-start">
                      <h5 className="card-title">{category.name}</h5>
                      <div className="badge bg-success">{category.type}</div>
                    </div>
                    <p className="card-text">{category.description}</p>
                    <div className="d-flex justify-content-between align-items-center">
                      {category.mode === 'buy' && (
                        <div className="text-success">${category.price}</div>
                      )}
                      {category.mode === 'prebook' && (
                        <div className="text-info">
                          {new Date(category.releaseDate).toLocaleDateString()}
                        </div>
                      )}
                      <div>
                        <button
                          className="btn btn-sm btn-warning me-2"
                          onClick={() => handleEdit(category)}
                        >
                          <FontAwesomeIcon icon={faEdit} />
                        </button>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => handleDelete(category._id)}
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <>
          <h2 className="mb-4">Manage All Categories</h2>
          
          {/* Categories Table */}
          <div className="table-responsive">
            <table className="table table-dark table-hover">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Platform</th>
                  <th>Mode</th>
                  <th>Price/Release Date</th>
                  <th>Global</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.map(category => (
                  <tr key={category._id}>
                    <td>
                      <img 
                        src={`${BASE_URL}${category.photo}`}
                        alt={category.name}
                        style={{ 
                          width: '50px', 
                          height: '50px', 
                          objectFit: 'cover',
                          borderRadius: '4px'
                        }}
                      />
                    </td>
                    <td>{category.name}</td>
                    <td>{category.category}</td>
                    <td>
                      <span className={`badge ${category.type === 'PC' ? 'bg-primary' : 'bg-success'}`}>
                        {category.type}
                      </span>
                    </td>
                    <td>
                      <span className="badge bg-info">
                        {category.mode}
                      </span>
                    </td>
                    <td>
                      {category.mode === 'buy' && `$${category.price}`}
                      {category.mode === 'prebook' && new Date(category.releaseDate).toLocaleDateString()}
                      {category.mode === 'download' && '-'}
                    </td>
                    <td>
                      <span className={`badge ${category.isGlobal ? 'bg-success' : 'bg-secondary'}`}>
                        {category.isGlobal ? 'Yes' : 'No'}
                      </span>
                    </td>
                    <td>
                      <button
                        className="btn btn-sm btn-warning me-2"
                        onClick={() => {
                          handleEdit(category);
                          setShowAllCategories(false);
                          setActiveTab(category.mode);
                        }}
                      >
                        <FontAwesomeIcon icon={faEdit} />
                      </button>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDelete(category._id)}
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};
  
export default AdminPage;
