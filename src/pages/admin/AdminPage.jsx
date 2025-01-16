import React, { useState, useEffect } from 'react';
import {
  createProductApi,
  getAllProductsApi,
  updateProductApi,
  deleteProductApi,
} from '../../api/Api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { BASE_URL } from '../../api/Api';
import Logo from '../../components/Logo';

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState('download'); // Modes: 'download', 'buy', 'prebook'
  const [products, setProducts] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: [],
    type: 'PC', // Options: 'PC', 'Mobile'
    price: '',
    releaseDate: '',
    photo: null,
    isGlobal: false,
    mode: 'download', // Options: 'download', 'buy', 'prebook'
  });
  const [showAllProducts, setShowAllProducts] = useState(false);

  const predefinedCategories = [
    'Action',
    'Horror',
    'Adventure',
    'Racing',
    'Sports',
    'Puzzle',
    'Role-Playing',
    'Strategy',
    'Simulation',
    'Casual',
  ];

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await getAllProductsApi();
      if (response.data.success) {
        setProducts(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, files, checked } = e.target;

    if (name === 'category') {
      const selectedCategories = Array.from(
        e.target.selectedOptions,
        (option) => option.value
      );
      setFormData((prev) => ({
        ...prev,
        category: selectedCategories,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === 'file' ? files[0] : type === 'checkbox' ? checked : value,
      }));
    }
  };

  const handleEdit = (product) => {
    setEditingId(product._id);
    setFormData({
      name: product.name,
      description: product.description,
      category: product.category, // Already an array
      type: product.type,
      price: product.price || '',
      releaseDate: product.releaseDate
        ? new Date(product.releaseDate).toISOString().split('T')[0]
        : '',
      isGlobal: product.isGlobal,
      mode: product.mode,
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteProductApi(id);
        fetchProducts();
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();

    Object.keys(formData).forEach((key) => {
      if (
        (formData.mode === 'download' && (key === 'price' || key === 'releaseDate')) ||
        formData[key] === null
      ) {
        return;
      }

      if (key === 'category') {
        formDataToSend.append(key, JSON.stringify(formData.category));
      } else {
        formDataToSend.append(key, formData[key]);
      }
    });

    try {
      if (editingId) {
        await updateProductApi(editingId, formDataToSend);
      } else {
        await createProductApi(formDataToSend);
      }

      setFormData({
        name: '',
        description: '',
        category: [],
        type: 'PC',
        price: '',
        releaseDate: '',
        photo: null,
        isGlobal: false,
        mode: activeTab,
      });
      setEditingId(null);
      fetchProducts();
    } catch (error) {
      console.error('Error saving product:', error);
    }
  };

  const filteredProducts = products.filter((product) => product.mode === activeTab);

  return (
    <div
      style={{
        marginLeft: '260px',
        marginTop: '70px',
        padding: '40px',
        backgroundColor: '#0a0a0a',
        minHeight: 'calc(100vh - 70px)',
        color: '#fff',
      }}
    >
      <div className="d-flex justify-content-between align-items-center mb-4">
        <Logo width="150px" />
        <button
          className={`btn ${showAllProducts ? 'btn-success' : 'btn-outline-success'}`}
          onClick={() => setShowAllProducts(!showAllProducts)}
        >
          {showAllProducts ? 'Show Product Tabs' : 'Manage All Products'}
        </button>
      </div>

      {!showAllProducts ? (
        <>
          <div style={{ marginBottom: '30px' }}>
            <div className="btn-group" role="group">
              {['download', 'buy', 'prebook'].map((tab) => (
                <button
                  key={tab}
                  className={`btn ${activeTab === tab ? 'btn-success' : 'btn-outline-success'}`}
                  onClick={() => {
                    setActiveTab(tab);
                    setFormData((prev) => ({ ...prev, mode: tab }));
                  }}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)} Products
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="mb-5">
            <h3>{editingId ? 'Edit Product' : 'Add New Product'}</h3>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">Product Name</label>
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
                  {['PC', 'Mobile'].map((platform) => (
                    <button
                      key={platform}
                      type="button"
                      className={`btn ${
                        formData.type === platform ? 'btn-success' : 'btn-outline-success'
                      }`}
                      onClick={() => setFormData((prev) => ({ ...prev, type: platform }))}
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
                  multiple
                  value={formData.category}
                  onChange={handleInputChange}
                  className="form-select bg-dark text-white"
                  required
                >
                  {predefinedCategories.map((cat, index) => (
                    <option key={index} value={cat}>
                      {cat}
                    </option>
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
                {editingId ? 'Update Product' : 'Add Product'}
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
                      category: [],
                      type: 'PC',
                      price: '',
                      releaseDate: '',
                      photo: null,
                      isGlobal: false,
                      mode: activeTab,
                    });
                  }}
                >
                  Cancel Edit
                </button>
              )}
            </div>
          </form>

          <h3>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Products</h3>
          <div className="row g-4">
            {filteredProducts.map((product) => (
              <div key={product._id} className="col-md-4">
                <div className="card bg-dark">
                  <img
                    src={`${BASE_URL}${product.photo}`}
                    className="card-img-top"
                    alt={product.name}
                    style={{ height: '200px', objectFit: 'cover' }}
                  />
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-start">
                      <h5 className="card-title">{product.name}</h5>
                      <div className="badge bg-success">{product.type}</div>
                    </div>
                    <p className="card-text">{product.description}</p>
                    <div className="d-flex justify-content-between align-items-center">
                      {product.mode === 'buy' && (
                        <div className="text-success">${product.price}</div>
                      )}
                      {product.mode === 'prebook' && (
                        <div className="text-info">
                          {new Date(product.releaseDate).toLocaleDateString()}
                        </div>
                      )}
                      {product.mode === 'download' && <div>-</div>}
                      <div>
                        <button
                          className="btn btn-sm btn-warning me-2"
                          onClick={() => handleEdit(product)}
                        >
                          <FontAwesomeIcon icon={faEdit} />
                        </button>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => handleDelete(product._id)}
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
          <h2 className="mb-4">Manage All Products</h2>
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
                {products.map((product) => (
                  <tr key={product._id}>
                    <td>
                      <img
                        src={`${BASE_URL}${product.photo}`}
                        alt={product.name}
                        style={{
                          width: '50px',
                          height: '50px',
                          objectFit: 'cover',
                          borderRadius: '4px',
                        }}
                      />
                    </td>
                    <td>{product.name}</td>
                    <td>{product.category.join(', ')}</td>
                    <td>
                      <span
                        className={`badge ${
                          product.type === 'PC' ? 'bg-primary' : 'bg-success'
                        }`}
                      >
                        {product.type}
                      </span>
                    </td>
                    <td>
                      <span className="badge bg-info">{product.mode}</span>
                    </td>
                    <td>
                      {product.mode === 'buy' && `$${product.price}`}
                      {product.mode === 'prebook' &&
                        new Date(product.releaseDate).toLocaleDateString()}
                      {product.mode === 'download' && '-'}
                    </td>
                    <td>
                      <span
                        className={`badge ${
                          product.isGlobal ? 'bg-success' : 'bg-secondary'
                        }`}
                      >
                        {product.isGlobal ? 'Yes' : 'No'}
                      </span>
                    </td>
                    <td>
                      <button
                        className="btn btn-sm btn-warning me-2"
                        onClick={() => {
                          handleEdit(product);
                          setShowAllProducts(false);
                          setActiveTab(product.mode);
                        }}
                      >
                        <FontAwesomeIcon icon={faEdit} />
                      </button>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDelete(product._id)}
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
