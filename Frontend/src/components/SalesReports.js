import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import "../Css/SalesReport.css"; // New CSS file for modern design

const SalesReport = () => {
  const [soldItems, setSoldItems] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [dailyTransactions, setDailyTransactions] = useState([]);
  const [topCustomers, setTopCustomers] = useState([]);
  const [inactiveCustomers, setInactiveCustomers] = useState([]);
  const [retentionRate, setRetentionRate] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch all sold products
    axios
      .get("http://localhost:3001/sales-report/products-sold")
      .then((response) => {
        setSoldItems(response.data);
      })
      .catch((error) => {
        console.error("Error fetching sold products:", error);
      });

    // Fetch sales data for the bar chart
    axios
      .get("http://localhost:3001/sales-report/products-sales-chart")
      .then((response) => {
        setChartData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching sales chart data:", error);
      });

    // Fetch daily sales transactions
    axios
      .get("http://localhost:3001/sales-report/daily-sales")
      .then((response) => {
        setDailyTransactions(response.data);
      })
      .catch((error) => {
        console.error("Error fetching daily transactions:", error);
      });

    // Fetch top customers data
    axios
      .get("http://localhost:3001/sales-report/top-customers")
      .then((response) => {
        setTopCustomers(response.data);
      })
      .catch((error) => {
        console.error("Error fetching top customers:", error);
      });

    // Fetch customers who haven't placed an order in the last 30 days
    axios
      .get("http://localhost:3001/customers/inactive")
      .then((response) => {
        setInactiveCustomers(response.data);
      })
      .catch((error) => {
        console.error("Error fetching inactive customers:", error);
      });

    axios
      .get("http://localhost:3001/analytics/retention-rate")
      .then((response) => {
        setRetentionRate(response.data);
      })
      .catch((error) => {
        console.error("Error fetching retention rate:", error);
      });

    const fetchRetentionRate = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3001/sales-report/customer-retention"
        );
        console.log("Retention rate data:", response.data); // Log the response for debugging
        setRetentionRate(response.data);
      } catch (err) {
        console.error("Error fetching retention rate:", err);
        setError("Failed to fetch retention rate");
      }
    };

    fetchRetentionRate();
  }, []);

  // Calculate maximum total sales for Y-axis scaling
  const getMaxSalesValue = () => {
    if (chartData.length === 0) return 0;
    return Math.max(...chartData.map((item) => item.total_sales)) + 500; // Adding buffer for readability
  };

  const formatRetentionRate = (rate) => {
    return rate !== null && !isNaN(rate)
      ? `${parseFloat(rate).toFixed(2)}%`
      : "N/A";
  };

  return (
    <div className="sales-container">
      <h1 className="main-title">Sales Overview</h1>

      {/* Products Sold Table */}
      <section>
        <h2>Products Sold</h2>
        <table className="styled-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Price ($)</th>
              <th>Units Sold</th>
              <th>Total Sales ($)</th>
            </tr>
          </thead>
          <tbody>
            {soldItems.map((item) => (
              <tr key={item.id}>
                <td>{item.name}</td>
                <td>{item.price}</td>
                <td>{item.items_sold}</td>
                <td>{item.total_sales}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* Product Sales Bar Chart */}
      <section>
        <h2>Sales Chart</h2>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis domain={[0, getMaxSalesValue()]} />
            <Tooltip />
            <Bar dataKey="total_sales" fill="#6a82fb" />
          </BarChart>
        </ResponsiveContainer>
      </section>

      {/* Daily Sales Table */}
      <section>
        <h2>Daily Sale</h2>
        <table className="styled-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Total Sales ($)</th>
            </tr>
          </thead>
          <tbody>
            {dailyTransactions.map((transaction) => (
              <tr key={transaction.date}>
                <td>{new Date(transaction.date).toLocaleDateString()}</td>
                <td>{transaction.total_sales}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section>
        <h2 className="main-title">Top 5 Customers</h2>
        <table className="styled-table">
          <thead>
            <tr>
              <th>Customer Name</th>
              <th>Email</th>
              <th>Total Purchase Amount ($)</th>
            </tr>
          </thead>
          <tbody>
            {topCustomers.map((customer, index) => (
              <tr key={index}>
                <td>{customer.customer_name}</td>
                <td>{customer.email}</td>
                <td>{customer.total_spent.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section>
        <h2>Inactive Customers (Last 30 Days)</h2>
        {inactiveCustomers.length === 0 ? (
          <p>No inactive customers in the last 30 days.</p>
        ) : (
          <table className="styled-table">
            <thead>
              <tr>
                <th>Customer Name</th>
                <th>Email</th>
              </tr>
            </thead>
            <tbody>
              {inactiveCustomers.map((customer, index) => (
                <tr key={index}>
                  <td>{customer.customer_name}</td>
                  <td>{customer.email}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      <section>
        <h1>Customer Retention Rate</h1>
        {error && <p className="error">{error}</p>} 
        {retentionRate ? (
          <div className="retention-rate">
            <p>Retained Customers: {retentionRate.RetainedCustomers || 0}</p>
            <p>
              Previous Period Customers:{" "}
              {retentionRate.PreviousPeriodCustomers || 0}
            </p>
            <p>
              Retention Rate:
              {retentionRate.RetentionRate &&
              !isNaN(retentionRate.RetentionRate)
                ? `${parseFloat(retentionRate.RetentionRate).toFixed(2)}%`
                : "N/A"}
            </p>
            <p>
              Retained Customers Names:{" "}
              {retentionRate.RetainedCustomerNames || "N/A"}
            </p>
          </div>
        ) : (
          <p>Loading retention rate...</p>
        )}
      </section>
    </div>
  );
};

export default SalesReport;
