Plug Point Web Application
This project is a full-stack web application tailored for a retailer specializing in E-commerce technology products. It offers users an engaging platform to browse a wide range of tech products and place orders. The backend is powered by Python using Flask, Flask-SQLAlchemy, and Flask-CORS, with MySQL managing user and order data. The frontend, built with React, provides features such as detailed product listings, review submission and management, and interactive data visualizations showcasing trending tech products.

Features
User Roles:

Customer: Can browse products, write reviews, and place orders.
Store Manager: Oversees store-related tasks.

Customers can opt for home delivery or in-store pickup.
Each order includes user details, shipping address, product information, and total price.
Product Reviews:

Customers can leave reviews for purchased products, including ratings, and product details.
Trending Products Page:


The application features rich data visualization and reporting capabilities across various pages:

Inventory Page: 
- Displays product reviews alongside available stock information.
- Includes a bar chart visualization representing the stock levels of each product, providing a quick overview of inventory status.

Sales Report Page: 
- Offers comprehensive sales insights through multiple data views:
- Product Sold: Displays total sales figures.
- Sales Chart: Visualizes sales trends over time.
- Daily Sales: Breaks down sales data by day.
- Top 5 Customers: Highlights the top buyers by purchase value.
- Inactive Customers: Lists customers who haven't made a purchase in the last 30 days.
- Customer Retention Rate: Tracks retention performance every two days.
- Customer Segmentation: Groups customers based on behavior and demographics.
- Customer Lifetime Value: Projects the total revenue a customer generates over their relationship with the business.
- Seasonal Sale Analysis: Examines sales patterns during different seasons.
- Purchase Frequency Distribution: Analyzes how frequently customers make purchases.

Trending Page: 
- Highlights popular trends and locations:
- Top Locations: Displays areas with the highest number of orders.
- Most Sold Items: Lists the top-selling products.
- Popular Items by Category: Showcases the most favored products within each category.

These features empower the retailer with actionable insights to optimize inventory, enhance customer engagement, and drive sales performance.


Tech Stack
Backend:
Python (Flask, Flask-SQLAlchemy, Flask-CORS)
Express
MySQL (for users, products, and orders)

Frontend:
React.js
Bootstrap
Chart.js (for data visualization)


Setup Instructions
Prerequisites
Ensure the following are installed:
Python (version 3.8 or higher)
MySQL (version 8.0 or higher)
Git
Node.js and npm (for frontend)

Backend Setup
Clone the repository and navigate to the backend folder.

Install required Python packages:

bash
Copy code
pip install flask flask-sqlalchemy pymongo python-dotenv flask-cors
Create a .env file in the backend folder with the following content:

plaintext
Copy code
MYSQL_HOST=localhost
MYSQL_USER=root
MYSQL_PASSWORD=<your_mysql_password>
MYSQL_DATABASE=project
Start the backend server:

bash
Copy code
python app.py
The backend will run on http://localhost:5000.

MySQL Configuration:
Create a MySQL database called project.
Use the provided schemas to set up the necessary tables for users, products, CustomerOrder, and orders.
Run this command to install all the required files
npm install express mysql2 cors body-parser uuid dotenv axios multer xml2js axios


plaintext
Copy code
MYSQL_HOST=localhost
MYSQL_USER=root
MYSQL_PASSWORD=<your_mysql_password>
MYSQL_DATABASE=project
PORT=3001


Step 2: Frontend Setup
Install frontend dependencies:

Start the frontend server:
bash
cd your folder
Copy code
npm install
npm start
The frontend will be accessible at http://localhost:3000.

3. Database Setup
MySQL Setup
Create MySQL tables:

Run the following SQL commands to create the required tables:

sql
Copy code
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL
);

CREATE TABLE products (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    description TEXT,
    category VARCHAR(100),
    accessories VARCHAR(255),
    image VARCHAR(255),
    discount DECIMAL(5, 2),
    rebate DECIMAL(5, 2),
    warranty INT,
    stock INT
);

CREATE TABLE CustomerOrder (
    orderid INT AUTO_INCREMENT,
    userName VARCHAR(255) NOT NULL,
    orderName VARCHAR(255) NOT NULL,
    orderPrice DECIMAL(10, 2) NOT NULL,
    userAddress TEXT NOT NULL,
    creditCardNo VARCHAR(16) NOT NULL,
    PRIMARY KEY (orderid, userName, orderName)
);

CREATE TABLE orders (
    id INT PRIMARY KEY,
    user_id INT NOT NULL,
    total_price DECIMAL(10, 2) NOT NULL,
    delivery_method VARCHAR(50) NOT NULL,
    store_location VARCHAR(100),
    status VARCHAR(50) NOT NULL,
    order_date DATETIME NOT NULL,
    delivery_date DATETIME NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    store_id INT,
    name VARCHAR(50)
);

CREATE TABLE store_locations (
    storeID INT PRIMARY KEY,
    street VARCHAR(255) NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(50) NOT NULL,
    zipcode VARCHAR(10) NOT NULL
);

Insert sample data:
You can insert CSV files from the SQL CSV Data Folder
Add at least 20 records to the users, products, CustomerOrder, and orders tables for testing purposes.


4. Queries used in the backend to display the data
    1. Table of all products and available stock
        SELECT name, price, stock 
        FROM products
        ORDER BY name;
    2. To get data for Bar Chart (product names and stock levels)
        SELECT name, stock 
        FROM products
        ORDER BY name;
    3. To get all products currently on sale (with a discount)
        SELECT name, price, discount
        FROM products
        WHERE discount IS NOT NULL
        ORDER BY name;
    4. To get all products with manufacturer rebates
        SELECT name, price, rebate
        FROM products
        WHERE rebate IS NOT NULL
        ORDER BY name;
    5. Fetch product sales (name, price, total sales)
        SELECT p.name, p.price, COUNT(o.id) AS items_sold, 
           SUM(o.total_price) AS total_sales
        FROM orders o
        JOIN products p ON o.product_id = p.id
        GROUP BY p.name, p.price
    6. Fetch product sales chart (product names and total sales)
        SELECT p.name, SUM(o.total_price) AS total_sales
        FROM orders o
        JOIN products p ON o.product_id = p.id
        GROUP BY p.name
    7. Fetch total daily sales transactions
        SELECT DATE(o.order_date) AS date, SUM(o.total_price) AS total_sales
        FROM orders o
        GROUP BY DATE(o.order_date)
        ORDER BY date DESC
    8. Get top 5 customers by total purchase amount
        SELECT u.name AS customer_name, u.email, SUM(o.total_price) AS total_spent
        FROM orders o
        JOIN users u ON o.user_id = u.id
        GROUP BY u.id
        ORDER BY total_spent DESC
        LIMIT 5;
    9. Get popular products by category
        SELECT 
          p.category AS category_name,
          p.name AS product_name,
          COUNT(o.id) AS items_sold,
          SUM(o.total_price) AS total_revenue
            FROM orders o
        JOIN products p ON o.product_id = p.id
        GROUP BY p.category, p.name
        ORDER BY p.category ASC, items_sold DESC;
    10. Get customers who haven't placed an order in the last 30 days
        SELECT u.name AS customer_name, u.email
        FROM users u
        LEFT JOIN orders o ON u.id = o.user_id 
              AND o.order_date >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
        WHERE o.id IS NULL
    11. To retention data of 2 interval days
        WITH CurrentPeriodCustomers AS (
          SELECT DISTINCT user_id
          FROM orders
          WHERE order_date >= CURDATE() - INTERVAL 2 DAY
        ),
        PreviousPeriodCustomers AS (
          SELECT DISTINCT user_id
          FROM orders
          WHERE order_date >= CURDATE() - INTERVAL 4 DAY
            AND order_date < CURDATE() - INTERVAL 2 DAY
        )
        SELECT 
          COUNT(DISTINCT cmc.user_id) AS RetainedCustomers,
          COUNT(DISTINCT pmc.user_id) AS PreviousPeriodCustomers,
          (COUNT(DISTINCT cmc.user_id) / COUNT(DISTINCT pmc.user_id)) * 100 AS RetentionRate,
          GROUP_CONCAT(DISTINCT u.name) AS RetainedCustomerNames
        FROM PreviousPeriodCustomers pmc
        LEFT JOIN CurrentPeriodCustomers cmc ON pmc.user_id = cmc.user_id
        LEFT JOIN users u ON cmc.user_id = u.id;
    12. 2 days average sale
        SELECT 
          ROUND(SUM(total_price) / 2, 2) AS average_sales
        FROM orders
        WHERE order_date >= CURDATE() - INTERVAL 2 DAY;
    13. Customer Segmentation analysis
            SELECT 
          CASE 
            WHEN TotalSpent < 1500 THEN 'Low Spender'
            WHEN TotalSpent BETWEEN 1500 AND 3500 THEN 'Medium Spender'
            ELSE 'High Spender'
          END AS CustomerSegment,
          COUNT(*) AS CustomerCount,
          AVG(TotalSpent) AS AvgSpend
            FROM (
          SELECT u.id AS CustomerID, u.name AS CustomerName, SUM(o.total_price) AS TotalSpent
          FROM users u
          JOIN orders o ON u.id = o.user_id
          GROUP BY u.id, u.name
            ) AS CustomerSpend
            GROUP BY CustomerSegment WITH ROLLUP;
    14. Product Cross-Sell Analysis
            SELECT 
            p1.name AS Product1,
            p2.name AS Product2,
            COUNT(*) AS CoOccurrence
            FROM orders o1
            JOIN orders o2 ON o1.order_id = o2.order_id AND o1.product_id < o2.product_id
            JOIN products p1 ON o1.product_id = p1.id
            JOIN products p2 ON o2.product_id = p2.id
            GROUP BY p1.name, p2.name, p1.id, p2.id
            ORDER BY CoOccurrence DESC
            LIMIT 10;
    15. Customer Lifetime Value Calculation
          SELECT 
            u.id AS CustomerID,
            u.name AS CustomerName,
            COUNT(DISTINCT o.id) AS TotalOrders,
            SUM(o.total_price) AS TotalSpent,
            AVG(o.total_price) AS AvgOrderValue,
            IFNULL(DATEDIFF(MAX(o.order_date), MIN(o.order_date)) / 365.0, 0) AS YearsActive,
            IFNULL(SUM(o.total_price) / (DATEDIFF(MAX(o.order_date), MIN(o.order_date)) / 365.0), 0) AS AnnualValue
            FROM users u
            JOIN orders o ON u.id = o.user_id
            GROUP BY u.id, u.name
            ORDER BY AnnualValue DESC
            LIMIT 10;
    16. Seasonal Sales Analysis
        SELECT 
          YEAR(order_date) AS Year,
          QUARTER(order_date) AS Quarter,
          SUM(total_price) AS Quarterly_Sales,
          SUM(SUM(total_price)) OVER (PARTITION BY YEAR(order_date) ORDER BY QUARTER(order_date)) AS Cumulative_Yearly_Sales
        FROM orders
        GROUP BY Year, Quarter WITH ROLLUP;
    17. Customer Purchase Frequency Distribution
            WITH PurchaseFrequency AS (
          SELECT user_id, COUNT(DISTINCT id) AS OrderCount
          FROM orders
          GROUP BY user_id
        )
        SELECT 
          CASE 
            WHEN OrderCount = 1 THEN 'One-time'
            WHEN OrderCount BETWEEN 2 AND 5 THEN '2-5 times'
            WHEN OrderCount BETWEEN 6 AND 10 THEN '6-10 times'
            ELSE 'More than 10 times'
          END AS PurchaseFrequency,
          COUNT(*) AS CustomerCount,
          AVG(OrderCount) AS AvgOrders
        FROM PurchaseFrequency
        GROUP BY PurchaseFrequency
        ORDER BY MIN(OrderCount);

5. Usage
Visit http://localhost:3000 to explore products.




