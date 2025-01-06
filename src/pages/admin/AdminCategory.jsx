import React, { useState } from "react";
import { toast } from "react-toastify";
import { createCategoryApi } from "../../api/Api";
import { useNavigate } from "react-router-dom";
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const CreateCategoryForm = () => {
  const [categoryData, setCategoryData] = useState({
    price: "",
    name: "",
    info: "",
    photo: null,
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCategoryData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setCategoryData((prevData) => ({
      ...prevData,
      photo: e.target.files[0],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("price", categoryData.price);
    formData.append("name", categoryData.name);
    formData.append("info", categoryData.info);
    if (categoryData.photo) {
      formData.append("photo", categoryData.photo);
    }

    try {
      const response = await createCategoryApi(formData);
      if (response.data.success) {
        toast.success("Category created successfully");
        navigate("/admin/list");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Error creating category");
    }
  };

  const handleAdminPanel = () => {
    navigate("/admin/list");
  };

  const handleAdminBooked = () => {
    navigate("/book/adminbook");
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-2 d-flex flex-column align-items-center">
          <button
            type="button"
            className="btn btn-primary mb-3 shadow-sm"
            onClick={handleAdminPanel}
          >
            Admin Panel
          </button>
          <button
            type="button"
            className="btn btn-secondary mb-3 shadow-sm"
            onClick={handleAdminBooked}
          >
            Booked Categories
          </button>
          <div className="border-end" style={{ height: "100%", width: "2px", backgroundColor: "#ccc" }}></div>
        </div>
        <div className="col-md-8">
          <div className="card shadow-lg border-0">
            <div className="card-header bg-gradient bg-success text-white text-center">
              <h2 className="mb-0">Create Category</h2>
            </div>
            <div className="card-body p-5">
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="form-label fs-5">Price</label>
                  <input
                    type="number"
                    name="price"
                    value={categoryData.price}
                    onChange={handleChange}
                    className="form-control shadow-sm"
                    placeholder="Enter price"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="form-label fs-5">Category Name</label>
                  <input
                    type="text"
                    name="name"
                    value={categoryData.name}
                    onChange={handleChange}
                    className="form-control shadow-sm"
                    placeholder="Enter category name"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="form-label fs-5">Information</label>
                  <textarea
                    name="info"
                    value={categoryData.info}
                    onChange={handleChange}
                    className="form-control shadow-sm"
                    placeholder="Enter information"
                    required
                    rows="4"
                  ></textarea>
                </div>
                <div className="mb-4">
                  <label className="form-label fs-5">Photo</label>
                  <input
                    type="file"
                    name="photo"
                    onChange={handleFileChange}
                    className="form-control shadow-sm"
                    required
                  />
                </div>
                <button type="submit" className="btn btn-success w-100 shadow-sm">
                  Save
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
      <style jsx>{`
        .container {
          background-color: #f8f9fc;
          padding: 50px;
          border-radius: 15px;
          box-shadow: 0px 10px 30px rgba(0, 0, 0, 0.1);
        }

        .card {
          border-radius: 20px;
        }

        .card-header {
          border-radius: 20px 20px 0 0;
          background: linear-gradient(45deg, #28a745, #218838);
        }

        .btn {
          border-radius: 50px;
          font-weight: 500;
          transition: transform 0.3s ease;
        }

        .btn:hover {
          transform: translateY(-2px);
        }

        .btn-success {
          background-color: #28a745;
          border: none;
        }

        .btn-success:hover {
          background-color: #218838;
        }

        .btn-primary {
          background-color: #007bff;
          border: none;
        }

        .btn-primary:hover {
          background-color: #0056b3;
        }

        .btn-secondary {
          background-color: #6c757d;
          border: none;
        }

        .btn-secondary:hover {
          background-color: #5a6268;
        }

        .form-label {
          font-weight: bold;
          color: #333;
        }

        .form-control {
          border-radius: 10px;
          padding: 12px;
          font-size: 16px;
        }

        .border-end {
          border-right: 2px solid #ccc;
        }
      `}</style>
    </div>
  );
};

export default CreateCategoryForm;
