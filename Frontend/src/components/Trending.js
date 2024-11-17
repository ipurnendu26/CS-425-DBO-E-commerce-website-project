import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';
import { PieChart, Pie, Cell, Tooltip as PieTooltip } from 'recharts';
import '../Css/Trending.css'; 
import axios from 'axios';

const COLOR_PALETTE = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#FF3333'];

const Trending = () => {
  const [zipCodeData, setZipCodeData] = useState([]);
  const [soldProductsData, setSoldProductsData] = useState([]);
  const [ratedProductsData, setRatedProductsData] = useState([]);
  const [popularProductsData, setPopularProductsData] = useState([]);
  const [categories, setCategories] = useState([]);

  
  useEffect(() => {
    const fetchTrendingInfo = async () => {
      try {
        const [zipCodesResponse, soldProductsResponse, ratedProductsResponse, popularProductsData] = await Promise.all([
          fetch('http://localhost:3001/trending/top-zipcodes'),
          fetch('http://localhost:3001/trending/most-sold'),
          fetch('http://localhost:3001/trending/most-liked'),
          fetch('http://localhost:3001/trending/popular-products')
        ]);

        if (zipCodesResponse.ok) {
          const zipCodes = await zipCodesResponse.json();
          setZipCodeData(zipCodes);
        }

        if (soldProductsResponse.ok) {
          const soldProducts = await soldProductsResponse.json();
          setSoldProductsData(soldProducts);
        }

        if (ratedProductsResponse.ok) {
          const ratedProducts = await ratedProductsResponse.json();
          setRatedProductsData(ratedProducts);
        }
        if (popularProductsData.ok) {
          const data = await popularProductsData.json();
          setPopularProductsData(data);
        }
      } catch (error) {
        console.error('Error fetching trending data:', error);
      }

      axios.get('http://localhost:3001/trending/popular-products-by-category')
      .then((response) => {
        const groupedData = response.data.reduce((acc, item) => {
          if (!acc[item.category_name]) {
            acc[item.category_name] = [];
          }
          acc[item.category_name].push(item);
          return acc;
        }, {});
        setCategories(groupedData);
      })
      .catch((error) => {
        console.error('Error fetching popular products by category:', error);
      });
    };

    fetchTrendingInfo();
  }, []);

  // Data for the Pie Chart (Most Sold Products)
  const pieChartData = soldProductsData.map((product) => ({
    name: product.orderName,
    value: parseInt(product.totalSold, 10),
  }));

  // Data for the Bar Chart (Top Rated Products)
  const ratedBarData = ratedProductsData.map((product) => ({
    name: product._id,
    value: parseFloat(product.averageRating),
  }));

  const barChartData = popularProductsData.map((product) => ({
    category: product.category_name,
    name: product.product_name,
    items_sold: parseInt(product.items_sold, 10),
    total_revenue: parseFloat(product.total_revenue),
  }));

  return (
    <div className="trending-container">
      <section className="chart-section">
        <h2>Top Locations by Orders</h2>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={zipCodeData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="store_location" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="totalOrders" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      </section>

      <section className="chart-section">
        <h2>Most Sold Products</h2>
        <ResponsiveContainer width="100%" height={400}>
          <PieChart>
            <Pie
              data={pieChartData}
              cx="50%"
              cy="50%"
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              outerRadius={150}
              dataKey="value"
            >
              {pieChartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLOR_PALETTE[index % COLOR_PALETTE.length]} />
              ))}
            </Pie>
            <PieTooltip />
          </PieChart>
        </ResponsiveContainer>
      </section>
      <section>
      <h2 className="text-center mb-4">Popular Products by Category</h2>
      {Object.keys(categories).length === 0 ? (
        <p className="text-center">No data available</p>
      ) : (
        Object.keys(categories).map((category) => (
          <div key={category} className="mb-5">
            <h3 className="mb-3">{category}</h3>
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th>Product Name</th>
                  <th>Items Sold</th>
                  <th>Total Revenue</th>
                </tr>
              </thead>
              <tbody>
                {categories[category].map((product) => (
                  <tr key={product.product_name}>
                    <td>{product.product_name}</td>
                    <td>{product.items_sold}</td>
                    <td>${product.total_revenue.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))
      )}
      </section>
      
    </div>
  );
};

export default Trending;
