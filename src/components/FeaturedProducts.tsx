import React, { useState, useEffect } from 'react';
import { ShoppingCart, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const FeaturedProducts = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [products, setProducts] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const navigate = useNavigate();
  
  useEffect(() => {
    // Initialize sample products if not exists
    const initializeSampleProducts = () => {
      return [
        {
          id: 1,
          name: 'iPhone 15 Pro',
          description: 'Apple iPhone 15 Pro 128GB',
          price: 45000,
          discountPercentage: 10,
          categoryId: 5,
          imageUrl: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500&h=500&fit=crop',
          featured: true,
          rating_avg: 4.8,
          rating_count: 245
        },
        {
          id: 2,
          name: 'MacBook Air M2',
          description: 'Apple MacBook Air 13" M2 Chip 256GB',
          price: 35000,
          discountPercentage: 5,
          categoryId: 6,
          imageUrl: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=500&h=500&fit=crop',
          featured: true,
          rating_avg: 4.9,
          rating_count: 189
        },
        {
          id: 5,
          name: 'Şık Kadın Elbise',
          description: 'Şık ve modern kadın elbise',
          price: 450,
          discountPercentage: 25,
          categoryId: 8,
          imageUrl: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500&h=500&fit=crop',
          featured: true,
          rating_avg: 4.6,
          rating_count: 134
        }
      ];
    };

    const storedProducts = JSON.parse(localStorage.getItem('products') || '[]');
    
    if (storedProducts.length === 0) {
      const sampleProducts = initializeSampleProducts();
      // Store all sample products (including non-featured ones)
      const allSampleProducts = [
        ...sampleProducts,
        {
          id: 3,
          name: 'Nike Air Max 270',
          description: 'Nike Air Max 270 Erkek Spor Ayakkabı',
          price: 2500,
          discountPercentage: 20,
          categoryId: 4,
          imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&h=500&fit=crop',
          featured: false,
          rating_avg: 4.5,
          rating_count: 156
        },
        {
          id: 4,
          name: 'Klasik Beyaz Erkek Gömlek',
          description: 'Klasik kesim beyaz erkek gömlek',
          price: 299,
          discountPercentage: 15,
          categoryId: 7,
          imageUrl: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=500&h=500&fit=crop',
          featured: false,
          rating_avg: 4.3,
          rating_count: 89
        }
      ];
      localStorage.setItem('products', JSON.stringify(allSampleProducts));
      setProducts(sampleProducts); // Only featured products for this component
    } else {
      const featuredProducts = storedProducts.filter(product => product.featured);
      setProducts(featuredProducts);
    }
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);

    const storedFavorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    setFavorites(storedFavorites);
  }, []);

  const addToFavorites = (product) => {
    if (!isAuthenticated) {
      if (window.confirm('Favorilere eklemek için üye olmanız gerekmektedir. Üye olmak ister misiniz?')) {
        navigate('/kayit');
      }
      return;
    }

    const isAlreadyFavorite = favorites.some((fav) => fav.id === product.id);
    
    if (!isAlreadyFavorite) {
      const updatedFavorites = [...favorites, product];
      setFavorites(updatedFavorites);
      localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
      alert('Ürün favorilere eklendi!');
    } else {
      const updatedFavorites = favorites.filter((fav) => fav.id !== product.id);
      setFavorites(updatedFavorites);
      localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
      alert('Ürün favorilerden çıkarıldı!');
    }
  };

  const isFavorite = (productId) => {
    return favorites.some((fav) => fav.id === productId);
  };

  const addToCart = (product) => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingItem = cart.find(item => item.id === product.id);

    if (existingItem) {
      existingItem.quantity += 1;
      localStorage.setItem('cart', JSON.stringify(cart));
    } else {
      const newItem = { ...product, quantity: 1 };
      localStorage.setItem('cart', JSON.stringify([...cart, newItem]));
    }

    alert('Ürün sepete eklendi!');
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {products.map((product) => (
        <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="relative">
            <img
              onClick={() => navigate(`/urun/${product.id}`)}
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-48 object-cover cursor-pointer hover:scale-105 transition-transform"
            />
            {product.discountPercentage > 0 && (
              <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded">
                %{product.discountPercentage} İndirim
              </div>
            )}
          </div>
          
          <div className="p-4">
            <h3 
              onClick={() => navigate(`/urun/${product.id}`)}
              className="text-lg font-semibold mb-2 cursor-pointer hover:text-indigo-600 transition-colors"
            >
              {product.name}
            </h3>
            <div className="flex justify-between items-center">
              <div>
                {product.discountPercentage > 0 ? (
                  <>
                    <span className="text-gray-500 line-through">
                      {product.price} TL
                    </span>
                    <span className="text-xl font-bold text-red-500 ml-2">
                      {(product.price * (1 - product.discountPercentage / 100)).toFixed(2)} TL
                    </span>
                  </>
                ) : (
                  <span className="text-xl font-bold">{product.price} TL</span>
                )}
              </div>
              <div className="flex space-x-2">
                <button 
                  onClick={() => addToFavorites(product)}
                  className={`p-2 rounded-full transition-colors ${
                    isFavorite(product.id)
                      ? 'text-red-500 bg-red-50'
                      : 'text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  <Heart className="h-5 w-5" fill={isFavorite(product.id) ? 'currentColor' : 'none'} />
                </button>
                <button 
                  onClick={() => addToCart(product)}
                  className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-full"
                >
                  <ShoppingCart className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FeaturedProducts;