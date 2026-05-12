import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import API_BASE from '../api';
function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`${API_BASE}/products/${id}`);
        setProduct(res.data);
      } catch (err) {
        console.error('Error fetching product', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (!product) return <div>Product not found</div>;

  return (
    <div className="container" style={{ display: 'flex', gap: '2rem', marginTop: '2rem' }}>
      <img src={product.image} alt={product.name} style={{ maxWidth: '500px', width: '100%', objectFit: 'cover', borderRadius: '8px' }} />
      <div>
        <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>{product.name}</h2>
        <p style={{ color: 'var(--primary)', fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>${product.price}</p>
        <p style={{ marginBottom: '1rem', background: '#e5e7eb', padding: '0.25rem 0.5rem', display: 'inline-block', borderRadius: '4px' }}>{product.category}</p>
        <p style={{ fontSize: '1.1rem', lineHeight: '1.6' }}>{product.description}</p>
        <Link to="/" className="btn" style={{ display: 'inline-block', marginTop: '2rem' }}>Back to Home</Link>
      </div>
    </div>
  );
}

export default ProductDetails;
