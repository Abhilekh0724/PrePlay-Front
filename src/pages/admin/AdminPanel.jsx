import React, { useEffect, useState } from "react";
import {
  getCategoriesApi,
  deleteCategoryApi,
  updateCategoryApi,
} from "../../api/Api"; // Update the path to your actual api.js location
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const AdminCategoryList = () => {
  const [categories, setCategories] = useState([]);
  const [editingCategory, setEditingCategory] = useState(null);
  const [name, setName] = useState('');
  const [info, setInfo] = useState('');
  const [photo, setPhoto] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await getCategoriesApi();
      if (response.data.success) {
        setCategories(response.data.categories);
      } else {
        console.error("Failed to fetch categories:", response.data.message);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await deleteCategoryApi(id);
      if (response.data.success) {
        toast.success('Category deleted successfully');
        fetchCategories(); // Refresh the list
      } else {
        toast.error('Failed to delete category');
      }
    } catch (error) {
      toast.error('Error deleting category');
    }
  };

  const handleUpdate = (category) => {
    setEditingCategory(category);
    setName(category.name);
    setInfo(category.info);
    setPhoto(null);
  };

  const handleUpdateSubmit = async () => {
    const formData = new FormData();
    formData.append('name', name);
    formData.append('info', info);
    if (photo) {
      formData.append('photo', photo);
    }

    try {
      const response = await updateCategoryApi(editingCategory._id, formData);
      if (response.data.success) {
        toast.success('Category updated successfully');
        setEditingCategory(null);
        fetchCategories(); // Refresh the list
      } else {
        toast.error('Failed to update category');
      }
    } catch (error) {
      toast.error('Error updating category');
    }
  };

  return (
    <div className="container">
      <h2>Admin Category List</h2>
      {editingCategory && (
        <div className="edit-form">
          <h3>Update Category</h3>
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <textarea
            placeholder="Information"
            value={info}
            onChange={(e) => setInfo(e.target.value)}
          />
          <input
            type="file"
            onChange={(e) => setPhoto(e.target.files[0])}
          />
          <button onClick={handleUpdateSubmit} className="btn-submit">Submit</button>
          <button onClick={() => setEditingCategory(null)} className="btn-cancel">Cancel</button>
        </div>
      )}
      <table className="table mt-2">
        <thead className="table-dark">
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Information</th>
            <th>Photo</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((category, index) => (
            <tr key={category._id}>
              <td>{index + 1}</td>
              <td>{category.name}</td>
              <td>{category.info}</td>
              <td>
                <img
                  src={`http://localhost:5500${category.photo}`}
                  alt={category.name}
                  style={{ maxWidth: "100px", maxHeight: "100px" }}
                />
              </td>
              <td>
                <button onClick={() => handleUpdate(category)} className="btn-update">Update</button>
                <button onClick={() => handleDelete(category._id)} className="btn-delete">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <style jsx>{`
        .edit-form {
          margin-bottom: 20px;
          background-color: #f9f9f9;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }

        .edit-form input,
        .edit-form textarea {
          display: block;
          width: 100%;
          margin-bottom: 10px;
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 16px;
        }

        .edit-form button {
          padding: 10px 20px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          margin-right: 10px;
          font-size: 16px;
        }

        .btn-submit {
          background-color: #28a745;
          color: #fff;
        }

        .btn-cancel {
          background-color: #dc3545;
          color: #fff;
        }

        .btn-update {
          background-color: #28a745;
          color: #fff;
          margin-bottom: 10px;
        }

        .btn-delete {
          background-color: #dc3545;
          color: #fff;
        }

        .btn-update,
        .btn-delete {
          padding: 8px 12px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }

        .btn-update:hover {
          background-color: #218838;
        }

        .btn-delete:hover {
          background-color: #c82333;
        }

        .table td {
          vertical-align: middle;
        }
      `}</style>
    </div>
  );
};

export default AdminCategoryList;
