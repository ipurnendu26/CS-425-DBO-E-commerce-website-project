import React, { Component, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProductList from './components/ProductList';
import Cart from './components/Cart';
import Checkout from './components/Checkout';
import LoginForm from './components/LoginForm';
import SignupForm from './components/SignupForm';
import StoreManager from './components/StoreManager';
import Salesman from './components/Salesman';
import CustomerDashboard from './components/CustomerDashboard';
import Smartphones from './components/Smartphones';
import Laptops from './components/Laptops';
import HomeGadgets from './components/HomeGadgets';
import Wearables from './components/Wearables';
import Accessories from './components/Accessories';
import Profile from './components/Profile';
import ProductDetails from './components/ProductDetail';
import ReviewForm from './components/ReviewForm';
import Trending from './components/Trending';
import 'bootstrap/dist/css/bootstrap.min.css';
import PastOrders from './components/PastOrders';
import './App.css';
import Inventory from './components/Inventory';
import SalesReports from './components/SalesReports';
import '@fortawesome/fontawesome-free/css/all.min.css';
import CustomerService from './components/CustomerService';
import OpenTicket from './components/OpenTicket';
import TicketStatus from './components/TicketStatus';

const App = () => {
  const [cartItems, setCartItems] = useState([]);

  const addToCart = (product) => {
    setCartItems([...cartItems, product]);
  };

  const removeFromCart = (productId) => {
    setCartItems(cartItems.filter(item => item.id !== productId));
  };

  const handleCheckout = (customerInfo) => {
    console.log('Order completed:', customerInfo);
  };

  return (
    <Router>
      <Navbar />
      <Routes>
        {/* Home Page now redirects to Login */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        
        {/* Login and Signup Pages */}
        <Route path="/login" element={<LoginForm />} />
        <Route path="/signup" element={<SignupForm />} />

        {/* Role-based Routes */}
        <Route path="/store-manager" element={<StoreManager />} />
        <Route path="/salesman" element={<Salesman />} />
        <Route path="/customer" element={<CustomerDashboard />} />

        {/* Product Pages */}
        <Route path="/products/smartphones" element={<Smartphones addToCart={addToCart} />} />
        <Route path="/products/laptops" element={<Laptops addToCart={addToCart} />} />
        <Route path="/products/wearables" element={<Wearables addToCart={addToCart} />} />
        <Route path="/products/homegadgets" element={<HomeGadgets addToCart={addToCart} />} />
        <Route path="/products/accessories" element={<Accessories addToCart={addToCart} />} />
        <Route path="/products/:id" element={<ProductDetails addToCart={addToCart} />} />

        {/* Cart and Checkout */}
        <Route path="/cart" element={<Cart cartItems={cartItems} removeFromCart={removeFromCart} />} />
        <Route path="/checkout" element={<Checkout cartItems={cartItems} />} />

        {/* Additional Pages */}
        <Route path="/profile" element={<Profile />} />
        <Route path="/products/:id" element={<ProductDetails />} />
        <Route path="/write-review/:id" element={<ReviewForm />} />
        <Route path="/trending" element={<Trending />} /> 
        <Route path="/past-orders" element={<PastOrders />} />
        <Route path="/customer-service" element={<CustomerService />} />
        <Route path="/customer-service/open-ticket" element={<OpenTicket />} />
        <Route path="/customer-service/ticket-status" element={<TicketStatus />} />


        {/* Admin Pages */}
        <Route path="/inventory" element={<Inventory />} />
        <Route path="/sales-reports" element={<SalesReports />} />
      </Routes>
    </Router>
  );
};

export default App;
