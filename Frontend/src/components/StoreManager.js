import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../Css/StoreManager.css'; // Import the modern CSS

const StoreManager = () => {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    description: '',
    category: 'smart doorbell',
    accessories: '',
    image: '',
    discount: '',
    rebate: '',
    warranty: 0,
  });
  const [editProduct, setEditProduct] = useState(null);

  // Fetch products when component mounts
  useEffect(() => {
    loadProducts();
  }, []);

  // Load product data from the API
  const loadProducts = () => {
    axios.get('http://localhost:3001/products')
      .then((response) => setProducts(response.data))
      .catch((error) => console.error('Failed to fetch products', error));
  };

  // Add a new product
  const addProduct = (e) => {
    e.preventDefault();
    axios.post('http://localhost:3001/products', newProduct)
      .then(() => {
        alert('Product successfully added!');
        loadProducts(); // Refresh product list
        resetNewProduct();
      })
      .catch((error) => console.error('Failed to add product', error));
  };

  // Reset new product form after adding
  const resetNewProduct = () => {
    setNewProduct({
      name: '',
      price: '',
      description: '',
      category: 'smart doorbell',
      accessories: '',
      image: '',
      discount: '',
      rebate: '',
      warranty: 0,
    });
  };

  // Update product
  const updateProduct = (e) => {
    e.preventDefault();
    axios.put(`http://localhost:3001/products/${editProduct.id}`, editProduct)
      .then(() => {
        alert('Product successfully updated!');
        loadProducts();
        setEditProduct(null); // Reset edit form
      })
      .catch((error) => console.error('Failed to update product', error));
  };

  // Delete a product
  const deleteProduct = (id) => {
    axios.delete(`http://localhost:3001/products/${id}`)
      .then(() => {
        alert('Product deleted successfully!');
        loadProducts(); // Refresh product list
      })
      .catch((error) => console.error('Failed to delete product', error));
  };

  // Handle input changes for add and edit forms
  const handleInputChange = (e, isEdit = false) => {
    const { name, value } = e.target;
    isEdit
      ? setEditProduct({ ...editProduct, [name]: value })
      : setNewProduct({ ...newProduct, [name]: value });
  };



  const [customers, setCustomers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [newCustomer, setNewCustomer] = useState({
    name: '',
    email: '',
    password: '',
    role: 'customer'
  });
  const [newOrder, setNewOrder] = useState({
    user_id: '',
    total_price: '',
    delivery_method: 'homeDelivery',
    store_location: '',
    delivery_date: ''
  });
  const [editOrder, setEditOrder] = useState(null);

  useEffect(() => {
    fetchCustomers();
    fetchOrders();
  }, []);

  // Fetch all customers
  const fetchCustomers = () => {
    axios.get('http://localhost:3001/customers')
      .then(response => {
        setCustomers(response.data);
      })
      .catch(error => {
        console.error('Error fetching customers:', error);
      });
  };

  // Fetch all orders
  const fetchOrders = () => {
    axios.get('http://localhost:3001/orders')
      .then(response => {
        setOrders(response.data);
      })
      .catch(error => {
        console.error('Error fetching orders:', error);
      });
  };

  // Handle customer creation
  const handleAddCustomer = (e) => {
    e.preventDefault();
    axios.post('http://localhost:3001/customers', newCustomer)
      .then(response => {
        alert('Customer created successfully');
        fetchCustomers();
        setNewCustomer({
          name: '',
          email: '',
          password: '',
          role: 'customer'
        });
      })
      .catch(error => {
        console.error('Error creating customer:', error);
      });
  };

  // Handle order creation
  const handleAddOrder = (e) => {
    e.preventDefault();
    axios.post('http://localhost:3001/orders', newOrder)
      .then(response => {
        alert('Order added successfully');
        fetchOrders();
        setNewOrder({
          user_id: '',
          total_price: '',
          delivery_method: 'homeDelivery',
          store_location: '',
          delivery_date: ''
        });
      })
      .catch(error => {
        console.error('Error adding order:', error);
      });
  };

  // Handle order update
  const handleUpdateOrder = (e) => {
    e.preventDefault();
    axios.put(`http://localhost:3001/orders/${editOrder.id}`, editOrder)
      .then(response => {
        alert('Order updated successfully');
        fetchOrders();
        setEditOrder(null); // Reset the form
      })
      .catch(error => {
        console.error('Error updating order:', error);
      });
  };

  // Handle order deletion
  const handleDeleteOrder = (orderId) => {
    axios.delete(`http://localhost:3001/orders/${orderId}`)
      .then(response => {
        alert('Order deleted successfully');
        fetchOrders();
      })
      .catch(error => {
        console.error('Error deleting order:', error);
      });
  };

  // Handle input change for customers and orders
  const handleInputChangeCustomer = (e, isOrderEdit = false, isCustomer = false) => {
    const { name, value } = e.target;

    if (isOrderEdit && editOrder) {
      setEditOrder({ ...editOrder, [name]: value });
    } else if (isCustomer) {
      setNewCustomer({ ...newCustomer, [name]: value });
    } else {
      setNewOrder({ ...newOrder, [name]: value });
    }
  };

  return (
    <div className="store-manager-container">
      <h1>Welcome to Store Manager Dashboard</h1>
      <p>Manage your product inventory - Add, Edit, or Remove products.</p>

      {/* Add Product Form */}
      <form onSubmit={addProduct} className="form-container">
        <h3>Add New Product</h3>
        <input
          type="text"
          name="name"
          placeholder="Product Name"
          value={newProduct.name}
          onChange={handleInputChange}
          required
        />
        <input
          type="number"
          name="price"
          placeholder="Price"
          value={newProduct.price}
          onChange={handleInputChange}
          required
        />
        <textarea
          name="description"
          placeholder="Description"
          value={newProduct.description}
          onChange={handleInputChange}
        />
        <select
          name="category"
          value={newProduct.category}
          onChange={handleInputChange}
          required
        >
          <option value="Smartphones">Smart Phones</option>
            <option value="Laptops">Laptops</option>
            <option value="Home Gadgets">Home Gadgets</option>
            <option value="Wearables">Wearables</option>
            <option value="Accessories">Accessories</option>
        </select>
        <textarea
          name="accessories"
          placeholder="Accessories"
          value={newProduct.accessories}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="image"
          placeholder="Image URL"
          value={newProduct.image}
          onChange={handleInputChange}
        />
        <input
          type="number"
          name="discount"
          placeholder="Discount"
          value={newProduct.discount}
          onChange={handleInputChange}
        />
        <input
          type="number"
          name="rebate"
          placeholder="Rebate"
          value={newProduct.rebate}
          onChange={handleInputChange}
        />
        <select
          name="warranty"
          value={newProduct.warranty}
          onChange={handleInputChange}
        >
          <option value="0">No Warranty</option>
          <option value="1">Warranty Included</option>
        </select>
        <button type="submit">Add Product</button>
      </form>

      {/* Edit Product Form */}
      {editProduct && (
        <form onSubmit={updateProduct} className="form-container">
          <h3>Edit Product</h3>
          <input
            type="text"
            name="name"
            placeholder="Product Name"
            value={editProduct.name}
            onChange={(e) => handleInputChange(e, true)}
            required
          />
          <input
            type="number"
            name="price"
            placeholder="Price"
            value={editProduct.price}
            onChange={(e) => handleInputChange(e, true)}
            required
          />
          <textarea
            name="description"
            placeholder="Description"
            value={editProduct.description}
            onChange={(e) => handleInputChange(e, true)}
          />
          <select
            name="category"
            value={editProduct.category}
            onChange={(e) => handleInputChange(e, true)}
            required
          >
            <option value="Smartphones">Smart Phones</option>
            <option value="Laptops">Laptops</option>
            <option value="Home Gadgets">Home Gadgets</option>
            <option value="Wearables">Wearables</option>
            <option value="Accessories">Accessories</option>
          </select>
          <textarea
            name="accessories"
            placeholder="Accessories"
            value={editProduct.accessories}
            onChange={(e) => handleInputChange(e, true)}
          />
          <input
            type="text"
            name="image"
            placeholder="Image URL"
            value={editProduct.image}
            onChange={(e) => handleInputChange(e, true)}
          />
          <input
            type="number"
            name="discount"
            placeholder="Discount"
            value={editProduct.discount}
            onChange={(e) => handleInputChange(e, true)}
          />
          <input
            type="number"
            name="rebate"
            placeholder="Rebate"
            value={editProduct.rebate}
            onChange={(e) => handleInputChange(e, true)}
          />
          <select
            name="warranty"
            value={editProduct.warranty}
            onChange={(e) => handleInputChange(e, true)}
          >
            <option value="0">No Warranty</option>
            <option value="1">Warranty Included</option>
          </select>
          <button type="submit">Update Product</button>
        </form>
      )}

      {/* Product List */}
      <h3>Product List</h3>
      <table className="product-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Price</th>
            <th>Description</th>
            <th>Category</th>
            <th>Accessories</th>
            <th>Discount</th>
            <th>Rebate</th>
            <th>Warranty</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td>{product.name}</td>
              <td>{product.price}</td>
              <td>{product.description}</td>
              <td>{product.category}</td>
              <td>{product.accessories}</td>
              <td>{product.discount}</td>
              <td>{product.rebate}</td>
              <td>{product.warranty === 1 ? 'Yes' : 'No'}</td>
              <td>
                <button
                  className="edit-btn"
                  onClick={() => setEditProduct(product)}
                >
                  Edit
                </button>
                <button
                  className="delete-btn"
                  onClick={() => deleteProduct(product.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
<br></br>
<br></br>
      <h3>Order List</h3>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Customer</th>
            <th>Total Price</th>
            <th>Delivery Method</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td>{order.id}</td>
              <td>{order.user_id}</td>
              <td>{order.total_price}</td>
              <td>{order.delivery_method}</td>
              <td>{order.status}</td>
              <td>
                <button
                  className="btn btn-primary btn-sm me-2"
                  onClick={() => setEditOrder(order)}
                >
                  Edit
                </button>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleDeleteOrder(order.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Update Order Form */}
      {editOrder && (
        <form onSubmit={handleUpdateOrder} className="mb-4">
          <h3>Update Order</h3>
          <div className="mb-3">
            <input
              type="number"
              className="form-control"
              placeholder="Total Price"
              name="total_price"
              value={editOrder.total_price}
              onChange={(e) => handleInputChangeCustomer(e, true)}
              required
            />
          </div>
          <div className="mb-3">
            <select
              className="form-select"
              name="delivery_method"
              value={editOrder.delivery_method}
              onChange={(e) => handleInputChangeCustomer(e, true)}
              required
            >
              <option value="homeDelivery">Home Delivery</option>
              <option value="inStorePickup">In-store Pickup</option>
            </select>
          </div>
          <div className="mb-3">
            <input
              type="date"
              className="form-control"
              name="delivery_date"
              value={editOrder.delivery_date}
              onChange={(e) => handleInputChangeCustomer(e, true)}
              required
            />
          </div>
          <div className="mb-3">
            <select
              className="form-select"
              name="status"
              value={editOrder.status}
              onChange={(e) => handleInputChangeCustomer(e, true)}
              required
            >
              <option value="pending">Pending</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="canceled">Canceled</option>
            </select>
          </div>
          <button type="submit" className="btn btn-warning">Update Order</button>
        </form>
      )}
    </div>
  );
};

export default StoreManager;
