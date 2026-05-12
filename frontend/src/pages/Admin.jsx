import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import API_BASE from '../api';

function Admin() {
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({ name: '', price: '', category: '', image: '', description: '' });
  const [editingId, setEditingId] = useState(null);
  const navigate = useNavigate();

  const token = localStorage.getItem('token');

  const fetchProducts = async () => {
    const res = await axios.get(`${API_BASE}/products`);
    setProducts(res.data);
  };
  
  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    fetchProducts();
  }, [token, navigate]);

  

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      if (editingId) {
        await axios.put(`${API_BASE}/products/${editingId}`, formData, config);
      } else {
        await axios.post(`${API_BASE}/products`, formData, config);
      }
      setFormData({ name: '', price: '', category: '', image: '', description: '' });
      setEditingId(null);
      fetchProducts();
    } catch (err) {
      console.error(err);
      alert('Error saving product');
    }
  };

  const handleEdit = (product) => {
    setFormData(product);
    setEditingId(product._id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure?')) return;
    try {
      await axios.delete(`${API_BASE}/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchProducts();
    } catch (err) {
      console.error(err);
      alert('Error deleting product');
    }
  };

  return (
    <div>
      <h2>Admin Dashboard</h2>
      
      <div className="form-container" style={{ maxWidth: '600px', marginLeft: 0 }}>
        <h3>{editingId ? 'Edit Product' : 'Add New Product'}</h3>
        <form onSubmit={handleSubmit} style={{ marginTop: '1rem' }}>
          <div className="form-group"><label>Name</label><input type="text" name="name" value={formData.name} onChange={handleInputChange} required /></div>
          <div className="form-group"><label>Price</label><input type="number" name="price" value={formData.price} onChange={handleInputChange} required /></div>
          <div className="form-group"><label>Category</label><input type="text" name="category" value={formData.category} onChange={handleInputChange} required /></div>
          <div className="form-group"><label>Image URL</label><input type="text" name="image" value={formData.image} onChange={handleInputChange} required /></div>
          <div className="form-group"><label>Description</label><textarea name="description" value={formData.description} onChange={handleInputChange} required rows="3"></textarea></div>
          <button type="submit" className="btn">{editingId ? 'Update Product' : 'Add Product'}</button>
          {editingId && <button type="button" onClick={() => { setEditingId(null); setFormData({ name: '', price: '', category: '', image: '', description: '' }); }} className="btn btn-danger" style={{ marginLeft: '1rem' }}>Cancel</button>}
        </form>
      </div>

      <h3 style={{ marginTop: '2rem' }}>Product List</h3>
      <table className="admin-table">
        <thead><tr><th>Name</th><th>Price</th><th>Category</th><th>Actions</th></tr></thead>
        <tbody>
          {products.map(p => (
            <tr key={p._id}>
              <td>{p.name}</td>
              <td>${p.price}</td>
              <td>{p.category}</td>
              <td>
                <button onClick={() => handleEdit(p)} className="btn" style={{ marginRight: '0.5rem', padding: '0.25rem 0.5rem' }}>Edit</button>
                <button onClick={() => handleDelete(p._id)} className="btn btn-danger" style={{ padding: '0.25rem 0.5rem' }}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Admin;
