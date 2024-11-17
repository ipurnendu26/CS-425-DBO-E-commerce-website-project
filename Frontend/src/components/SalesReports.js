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
  const [averageSales, setAverageSales] = useState(0);
  const [segmentationData, setSegmentationData] = useState([]);
  const [crossSellData, setCrossSellData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [lifetimeValueData, setLifetimeValueData] = useState([]);
  const [seasonalSalesData, setSeasonalSalesData] = useState([]);
  const [purchaseFrequencyData, setPurchaseFrequencyData] = useState([]);

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

    //Retention rate of 2 days interval
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

    const fetchSegmentationData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3001/analytics/customer-segmentation"
        );
        setSegmentationData(response.data);
      } catch (err) {
        console.error("Error fetching customer segmentation data:", err);
        setError("Failed to fetch customer segmentation data");
      }
    };

    // const fetchCrossSellData = async () => {
    //   setIsLoading(true);
    //   try {
    //     const response = await axios.get(
    //       "http://localhost:3001/analytics/product-cross-sell"
    //     );
    //     setCrossSellData(response.data);
    //   } catch (err) {
    //     console.error("Error fetching cross-sell data:", err);
    //     setError("Failed to fetch cross-sell data");
    //   } finally {
    //     setIsLoading(false);
    //   }
    // };

    const fetchLifetimeValueData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3001/analytics/customer-lifetime-value"
        );
        setLifetimeValueData(response.data);
      } catch (err) {
        console.error("Error fetching customer lifetime value data:", err);
        setError("Failed to fetch customer lifetime value data");
      }
    };

    const fetchSeasonalSalesData = async () => {
      try {
        const response = await axios.get('http://localhost:3001/analytics/seasonal-sales-analysis');
        setSeasonalSalesData(response.data);
      } catch (err) {
        console.error('Error fetching seasonal sales data:', err);
        setError('Failed to fetch seasonal sales data');
      }
    };


    const fetchPurchaseFrequencyData = async () => {
      try {
        const response = await axios.get("http://localhost:3001/analytics/purchase-frequency");
        setPurchaseFrequencyData(response.data);
      } catch (err) {
        console.error("Error fetching purchase frequency data:", err);
        setError("Failed to fetch purchase frequency data");
      }
    };
  
    fetchPurchaseFrequencyData();

    fetchSeasonalSalesData();
    fetchLifetimeValueData();
    // fetchCrossSellData();
    fetchSegmentationData();
    fetchRetentionRate();

    // Fetch average sales for the last 2 days
    axios
      .get("http://localhost:3001/sales-report/average-sales")
      .then((response) => {
        setAverageSales(response.data.average_sales || 0);
      })
      .catch((error) => {
        console.error("Error fetching average sales:", error);
      });
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

      <br></br>
      <br></br>
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

      <br></br>
      <br></br>
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

      <br></br>
      <br></br>

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

      <br></br>
      <br></br>

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

      <br></br>
      <br></br>

      <section>
        <h1>Customer Retention Rate Every 2 Days</h1>
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

      <br></br>
      <br></br>

      <section>
        <h2>2-Day Average Sales</h2>
        <p className="average-sales">
          {averageSales ? `$${averageSales.toFixed(2)}` : "No data available"}
        </p>
      </section>

      <br></br>
      <br></br>

      <section>
        <h1 className="main-title">Customer Segmentation</h1>
        {error && <p className="error">{error}</p>}
        <table className="styled-table">
          <thead>
            <tr>
              <th>Customer Segment</th>
              <th>Customer Count</th>
              <th>Average Spend ($)</th>
            </tr>
          </thead>
          <tbody>
            {segmentationData.map((segment, index) => (
              <tr key={index}>
                <td>{segment.CustomerSegment || "Total"}</td>
                <td>{segment.CustomerCount || 0}</td>
                <td>
                  {segment.AvgSpend
                    ? `$${parseFloat(segment.AvgSpend).toFixed(2)}`
                    : "N/A"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <br></br>
      <br></br>

      {/* <section>
        <h2>Product Cross-Sell Analysis</h2>
        {isLoading ? (
          <p>Loading cross-sell data...</p> // Display this while the data is being fetched
        ) : error ? (
          <p className="error">{error}</p> // Display this if there's an error
        ) : crossSellData.length > 0 ? (
          <table className="styled-table">
            <thead>
              <tr>
                <th>Product 1</th>
                <th>Product 2</th>
                <th>Co-Occurrence</th>
              </tr>
            </thead>
            <tbody>
              {crossSellData.map((item, index) => (
                <tr key={index}>
                  <td>{item.Product1}</td>
                  <td>{item.Product2}</td>
                  <td>{item.CoOccurrence}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No cross-sell data available.</p>
        )}
      </section> */}

      <section>
  <h1>Customer Lifetime Value</h1>
  {error && <p className="error">{error}</p>}
  {lifetimeValueData.length > 0 ? (
    <table className="styled-table">
      <thead>
        <tr>
          <th>Customer Name</th>
          <th>Total Orders</th>
          <th>Total Spent ($)</th>
          <th>Avg Order Value ($)</th>
          <th>Years Active</th>
          <th>Annual Value ($)</th>
        </tr>
      </thead>
      <tbody>
        {lifetimeValueData.map((item, index) => (
          <tr key={index}>
            <td>{item.CustomerName}</td>
            <td>{item.TotalOrders}</td>
            <td>{item.TotalSpent}</td>
            <td>
              {item.AvgOrderValue ? parseFloat(item.AvgOrderValue).toFixed(2) : "N/A"}
            </td>
            <td>
              {item.YearsActive && !isNaN(item.YearsActive)
                ? parseFloat(item.YearsActive).toFixed(2)
                : "N/A"}
            </td>
            <td>
              {item.AnnualValue ? parseFloat(item.AnnualValue).toFixed(2) : "N/A"}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  ) : (
    <p>No customer lifetime value data available.</p>
  )}
</section>



<section>
  <h2>Seasonal Sales Analysis</h2>
  {error && <p className="error">{error}</p>}
  {seasonalSalesData.length > 0 ? (
    <table className="styled-table">
      <thead>
        <tr>
          <th>Year</th>
          <th>Quarter</th>
          <th>Quarterly Sales ($)</th>
          <th>Cumulative Yearly Sales ($)</th>
        </tr>
      </thead>
      <tbody>
        {seasonalSalesData.map((item, index) => (
          <tr key={index}>
            <td>{item.Year || "Total"}</td>
            <td>{item.Quarter || "Total"}</td>
            <td>{item.Quarterly_Sales ? `$${parseFloat(item.Quarterly_Sales).toFixed(2)}` : "N/A"}</td>
            <td>{item.Cumulative_Yearly_Sales ? `$${parseFloat(item.Cumulative_Yearly_Sales).toFixed(2)}` : "N/A"}</td>
          </tr>
        ))}
      </tbody>
    </table>
  ) : (
    <p>No seasonal sales data available.</p>
  )}
</section>



<section>
  <h2>Customer Purchase Frequency Distribution</h2>
  {error && <p className="error">{error}</p>}
  {purchaseFrequencyData.length > 0 ? (
    <table className="styled-table">
      <thead>
        <tr>
          <th>Purchase Frequency</th>
          <th>Customer Count</th>
          <th>Average Orders</th>
        </tr>
      </thead>
      <tbody>
        {purchaseFrequencyData.map((item, index) => (
          <tr key={index}>
            <td>{item.PurchaseFrequency}</td>
            <td>{item.CustomerCount}</td>
            <td>{item.AvgOrders ? parseFloat(item.AvgOrders).toFixed(2) : "N/A"}</td>
          </tr>
        ))}
      </tbody>
    </table>
  ) : (
    <p>No purchase frequency data available.</p>
  )}
</section>


    </div>
  );
};

export default SalesReport;
