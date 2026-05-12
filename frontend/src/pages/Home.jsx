import { useState, useEffect } from 'react';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import API_BASE from '../api';
function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(`${API_BASE}/products`);
        setProducts(res.data);
      } catch (err) {
        console.error('Error fetching products', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  if (loading) return <div>Loading products...</div>;

  return (
    <div>
      <h2>Latest Products</h2>
      <div className="products-grid" style={{ marginTop: '2rem' }}>
        {products.map(product => (
          <ProductCard key={product._id} product={product} />
        ))}
        {products.length === 0 && <p>No products available.</p>}
      </div>
    </div>
  );
}

export default Home;
