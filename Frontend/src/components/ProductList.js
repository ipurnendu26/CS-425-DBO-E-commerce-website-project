import React from 'react';
import { Link } from 'react-router-dom';

const ProductList = () => {
  const categories = [
    {
      id: 1,
      name: 'Smartphones',
      description: 'Innovative mobile devices that combine communication, computing, and entertainment into a compact and user-friendly design.',
      link: '/products/smartphones'
    },
    {
      id: 2,
      name: 'Laptops',
      description: 'High-performance portable computers designed for productivity, entertainment, and gaming, offering sleek designs and advanced features.',
      link: '/products/laptops'
    },
    {
      id: 3,
      name: 'Home Gadgets',
      description: 'Smart devices that simplify home management, improve comfort, and bring cutting-edge technology to everyday living',
      link: '/products/homegadgets'
    },
    {
      id: 4,
      name: 'Wearables',
      description: 'Stylish and functional tech gadgets, such as smartwatches and fitness bands, that track health and keep you connected on the go.',
      link: '/products/wearables'
    },
    {
      id: 5,
      name: 'Accessories',
      description: 'Essential tech add-ons, including chargers, cases, earbuds, and keyboards, that enhance usability and convenience for your devices',
      link: '/products/accessories'
    }    
  ];

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Product Categories</h2>
      <div className="row">
        {categories.map(category => (
          <div className="col-md-4 mb-4" key={category.id}>
            <div className="card h-100">
              <div className="card-body">
                <h5 className="card-title">{category.name}</h5>
                <p className="card-text">{category.description}</p>
                {/* Use Link to redirect to respective category */}
                <Link to={category.link} className="btn btn-secondary">
                  Shop {category.name}
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductList;