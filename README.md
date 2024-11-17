    SmartHomes Web Application
This project is a full-stack web application designed for a retailer of SmartHome products. It enables users to explore available smart products, submit reviews, and place orders. The backend is powered by Node.js, Express, MySQL for user and order management, and MongoDB for product reviews. The frontend is built with React, and features include product listings, review management, and data visualizations for trending products.

Features
User Roles:

Customer: Can browse products, write reviews, and place orders.
Salesman: Manages customer accounts and order details.
Store Manager: Oversees store-related tasks.
Order Management:

Customers can opt for home delivery or in-store pickup.
Each order includes user details, shipping address, product information, and total price.
Product Reviews:

Customers can leave reviews for purchased products, including ratings, product details, and feedback.
Trending Products Page:

Displays charts with data on the top 5 most liked products, top 5 zip codes for highest sales, and top 5 most sold products.
Tech Stack
Backend:
Node.js
Express
MySQL (for users, products, and orders)
MongoDB (for storing product reviews)
Frontend:
React.js
Bootstrap
Chart.js (for data visualization)
Setup Instructions
1. Prerequisites
Ensure the following are installed:

Node.js (version 16 or higher)
MySQL (version 8.0 or higher)
MongoDB (version 4.0 or higher)
MongoDB Compass (to view and manage MongoDB data)
Git
npm (or yarn)
2. Installation
Step 1: Clone the Repository
bash
Copy code
git clone <repository-url>
cd smarthomes
Step 2: Backend Setup
Install backend dependencies:

bash
Copy code
cd smarthomes-backend
npm install
MySQL Configuration:

Create a MySQL database called smarthomes.
Use the provided schemas to set up the necessary tables for users, products, CustomerOrder, and orders.
MongoDB Configuration:

Run this command to install all the required files
npm install express mysql2 cors body-parser uuid dotenv axios multer xml2js axios


plaintext
Copy code
MYSQL_HOST=localhost
MYSQL_USER=root
MYSQL_PASSWORD=<your_mysql_password>
MYSQL_DATABASE=smarthomes
MONGO_URI=mongodb://localhost:27017/smartHome
PORT=3001
Start the backend server:

bash
Copy code
node server.js
Step 3: Frontend Setup
Install frontend dependencies:

bash
Copy code
cd ../smarthomes-frontend
npm install
Start the frontend server:

bash
Copy code
npm start
The frontend will be accessible at http://localhost:3000.

3. Database Setup
MySQL Setup
Create MySQL tables:

Run the following SQL commands to create the required tables:

sql
Copy code
CREATE TABLE users (
    id INT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL
);

CREATE TABLE products (
    id INT PRIMARY KEY,
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
    store_id INT
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

Add at least 20 records to the users, products, CustomerOrder, and orders tables for testing purposes.

CREATE TABLE tickets (
    ticket_id INT AUTO_INCREMENT PRIMARY KEY,
    ticket_number VARCHAR(36) NOT NULL UNIQUE,
    customer_name VARCHAR(100),
    customer_email VARCHAR(100),
    product VARCHAR(50),
    description TEXT,
    image_path VARCHAR(255),
    decision ENUM('Refund Order', 'Replace Order', 'Escalate to Human Agent') DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);



4. Usage
Frontend:

Visit http://localhost:3000 to explore products.
Use the Trending page to view statistics like the top sold products and sales by zip code.
Write and read reviews on individual product pages.
Backend:

