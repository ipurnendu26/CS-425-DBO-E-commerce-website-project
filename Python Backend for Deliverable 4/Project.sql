CREATE DATABASE PROJECT;
USE PROJECT;
-- Customer Table
CREATE TABLE Customer (
    Customer_ID INT PRIMARY KEY,
    First_Name VARCHAR(50),
    Last_Name VARCHAR(50),
    Email VARCHAR(100) UNIQUE,
    Phone_No VARCHAR(20),
    Address VARCHAR(255),
    City VARCHAR(50),
    State VARCHAR(50),
    Country VARCHAR(50),
    Postal_Code VARCHAR(20),
    DOB DATE
);

SELECT * FROM CUSTOMER;

-- Product Table
CREATE TABLE Product (
    Product_ID INT PRIMARY KEY,
    P_Name VARCHAR(100),
    Description TEXT,
    Price DECIMAL(10, 2),
    Stock_Quantity INT,
    Category_ID INT,
    FOREIGN KEY (Category_ID) REFERENCES Category(Category_ID)
);

SELECT * FROM Product;



-- Orders Table
CREATE TABLE Orders (
    Order_ID INT PRIMARY KEY,
    Customer_ID INT,
    Order_Date DATE,
    Total_Amount DECIMAL(10, 2),
    FOREIGN KEY (Customer_ID) REFERENCES Customer(Customer_ID)
);

SELECT * FROM Orders;



-- Payments Table
CREATE TABLE Payments (
    Payment_ID INT PRIMARY KEY,
    Order_ID INT,
    Payment_Method VARCHAR(50),
    Payment_Amount DECIMAL(10, 2),
    Payment_Status VARCHAR(20),
    Payment_Date DATE,
    FOREIGN KEY (Order_ID) REFERENCES Orders(Order_ID)
);

SELECT * FROM payments;

-- Shipping Table
CREATE TABLE Shipping (
    Shipping_ID INT PRIMARY KEY,
    Order_ID INT,
    Shipping_Address VARCHAR(255),
    Shipping_Date DATE,
    Shipping_Method VARCHAR(50),
    Shipping_Status VARCHAR(20),
    FOREIGN KEY (Order_ID) REFERENCES Orders(Order_ID)
);


SELECT * FROM Shipping;



-- Shopping Cart Table
CREATE TABLE Shopping_Cart (
    Cart_ID INT PRIMARY KEY,
    Customer_ID INT,
    Add_Date DATE,
    Quantity INT,
    FOREIGN KEY (Customer_ID) REFERENCES Customer(Customer_ID)
);


SELECT * FROM Shopping_Cart;


-- Reviews Table
CREATE TABLE Reviews (
    Review_ID INT PRIMARY KEY,
    Customer_ID INT,
    Product_ID INT,
    Rating INT,
    Review_Text TEXT,
    Review_Date DATE,
    FOREIGN KEY (Customer_ID) REFERENCES Customer(Customer_ID),
    FOREIGN KEY (Product_ID) REFERENCES Product(Product_ID)
);

SELECT * FROM Reviews;



-- Category Table
CREATE TABLE Category (
    Category_ID INT PRIMARY KEY,
    C_Name VARCHAR(50),
    Description TEXT
);



SELECT * FROM Category ;





-- Shopping Cart - Product Bridge Table
CREATE TABLE Shopping_Cart_Product (
    Cart_ID INT,
    Product_ID INT,
    PRIMARY KEY (Cart_ID, Product_ID),
    FOREIGN KEY (Cart_ID) REFERENCES Shopping_Cart(Cart_ID),
    FOREIGN KEY (Product_ID) REFERENCES Product(Product_ID)
);
SELECT * FROM Shopping_Cart_Product ;



-- Order - Product Bridge Table
CREATE TABLE Order_Product (
    Order_ID INT,
    Product_ID INT,
    Quantity INT,
    PRIMARY KEY (Order_ID, Product_ID),
    FOREIGN KEY (Order_ID) REFERENCES Orders(Order_ID),
    FOREIGN KEY (Product_ID) REFERENCES Product(Product_ID)
);

SELECT * FROM Order_Product ;


-- customer - product Bridge Table
CREATE TABLE Customer_Product (
    Customer_ID INT,
    Product_ID INT,
    Purchase_Date DATE,
    PRIMARY KEY (Customer_ID, Product_ID),
    FOREIGN KEY (Customer_ID) REFERENCES Customer(Customer_ID),
    FOREIGN KEY (Product_ID) REFERENCES Product(Product_ID)
);

SELECT * FROM Customer_Product ;

-- INDEXES

-- 1.Indexes for Customer Table:
CREATE INDEX idx_customer_email ON Customer(Email);
CREATE INDEX idx_customer_name ON Customer(Last_Name, First_Name);


SHOW INDEX FROM Customer;






-- 2.Indexes for Product Table:
CREATE INDEX idx_product_name ON Product(P_Name);
CREATE INDEX idx_product_category ON Product(Category_ID);
CREATE INDEX idx_product_price ON Product(Price);

SHOW INDEX FROM Product;

-- 3.Indexes for Order Table:
CREATE INDEX idx_order_customer ON Orders(Customer_ID);
CREATE INDEX idx_order_date ON Orders(Order_Date);

SHOW INDEX FROM Orders;



-- Indexes for Payments Table:
CREATE INDEX idx_payment_order ON Payments(Order_ID);
CREATE INDEX idx_payment_date ON Payments(Payment_Date);
CREATE INDEX idx_payment_status ON Payments(Payment_Status);

SHOW INDEX FROM Payments;




-- Indexes for shipping Table:
CREATE INDEX idx_shipping_order ON Shipping(Order_ID);
CREATE INDEX idx_shipping_date ON Shipping(Shipping_Date);
CREATE INDEX idx_shipping_status ON Shipping(Shipping_Status);

SHOW INDEX FROM Shipping;



-- Indexes for Shooping_cart Table:
CREATE INDEX idx_cart_customer ON Shopping_Cart(Customer_ID);
CREATE INDEX idx_cart_date ON Shopping_Cart(Add_Date);

SHOW INDEX FROM Shopping_Cart;



-- Indexes for Reviews Table:
CREATE INDEX idx_review_product ON Reviews(Product_ID);
CREATE INDEX idx_review_customer ON Reviews(Customer_ID);
CREATE INDEX idx_review_date ON Reviews(Review_Date);

SHOW INDEX FROM Reviews;



-- Indexes for category Table:
CREATE INDEX idx_category_name ON Category(C_Name);

SHOW INDEX FROM Category;




-- Indexes for shopping cart- Product Table:
CREATE INDEX idx_cart_product ON Shopping_Cart_Product(Cart_ID, Product_ID);

SHOW INDEX FROM Shopping_Cart_Product;









-- Indexes for Order - Product Table:
CREATE INDEX idx_order_product ON Order_Product(Order_ID, Product_ID);

SHOW INDEX FROM Order_Product;




-- Indexes for Customer- Product Table:
CREATE INDEX idx_customer_product ON Customer_Product(Customer_ID, Product_ID);
CREATE INDEX idx_purchase_date ON Customer_Product(Purchase_Date);

SHOW INDEX FROM Customer_Product;



-- TEMPORARY TABLE
-- This temporary table combines recent order data with customer, product, category, shipping, and payment details for comprehensive order analysis within the last 30 days.
CREATE TEMPORARY TABLE recent_customer_orders AS
SELECT 
    o.Order_ID,
    c.Customer_ID,
    CONCAT(c.First_Name, ' ', c.Last_Name) AS Customer_Name,
    c.Email,
    o.Order_Date,
    o.Total_Amount,
    p.Product_ID,
    p.P_Name AS Product_Name,
    p.Price,
    op.Quantity,
    cat.C_Name AS Category_Name,
    s.Shipping_Method,
    s.Shipping_Status,
    s.Shipping_Date,
    pay.Payment_Method,
    pay.Payment_Status
FROM 
    Orders o
JOIN Customer c ON o.Customer_ID = c.Customer_ID
JOIN Order_Product op ON o.Order_ID = op.Order_ID
JOIN Product p ON op.Product_ID = p.Product_ID
JOIN Category cat ON p.Category_ID = cat.Category_ID
JOIN Shipping s ON o.Order_ID = s.Order_ID
JOIN Payments pay ON o.Order_ID = pay.Order_ID
WHERE 
    o.Order_Date >= DATE_SUB(CURDATE(), INTERVAL 30 DAY);
    
    SELECT * FROM recent_customer_orders;

 
 -- This query retrieves the top 10 best-selling products by summing up their quantities sold, ordered from highest to lowest total sales.
SELECT Product_Name, SUM(Quantity) AS Total_Sold
FROM recent_customer_orders
GROUP BY Product_Name
ORDER BY Total_Sold DESC
LIMIT 10;






-- This query counts and ranks shipping methods by popularity based on recent customer orders.
SELECT Shipping_Method, COUNT(*) AS Usage_Count
FROM recent_customer_orders
GROUP BY Shipping_Method
ORDER BY Usage_Count DESC;



-- This query counts and ranks payment methods by popularity from the recent customer orders.
SELECT Payment_Method, COUNT(*) AS Usage_Count
FROM recent_customer_orders
GROUP BY Payment_Method
ORDER BY Usage_Count DESC;





-- VIEWS
-- 1.Customer Order Summary View:
CREATE VIEW CustomerOrderSummary AS
SELECT 
    c.Customer_ID,
    CONCAT(c.First_Name, ' ', c.Last_Name) AS Customer_Name,
    c.Email,
    o.Order_ID,
    o.Order_Date,
    o.Total_Amount,
    p.Payment_Method,
    p.Payment_Status,
    s.Shipping_Method,
    s.Shipping_Status
FROM 
    Customer c
JOIN Orders o ON c.Customer_ID = o.Customer_ID
JOIN Payments p ON o.Order_ID = p.Order_ID
JOIN Shipping s ON o.Order_ID = s.Order_ID;
SELECT * FROM CustomerOrderSummary;
-- 2.Product Sales Analysis View:
CREATE VIEW ProductSalesAnalysis AS
SELECT 
    p.Product_ID,
    p.P_Name AS Product_Name,
    p.Price,
    cat.C_Name AS Category_Name,
    SUM(op.Quantity) AS Total_Quantity_Sold,
    SUM(op.Quantity * p.Price) AS Total_Revenue,
    AVG(r.Rating) AS Average_Rating
FROM 
    Product p
JOIN Category cat ON p.Category_ID = cat.Category_ID
LEFT JOIN Order_Product op ON p.Product_ID = op.Product_ID
LEFT JOIN Reviews r ON p.Product_ID = r.Product_ID
GROUP BY 
    p.Product_ID, p.P_Name, p.Price, cat.C_Name;
  
SELECT * FROM ProductSalesAnalysis;

  -- 3.Customer Shopping Cart View:
CREATE VIEW CustomerShoppingCart AS
SELECT 
    sc.Cart_ID,
    c.Customer_ID,
    CONCAT(c.First_Name, ' ', c.Last_Name) AS Customer_Name,
    p.Product_ID,
    p.P_Name AS Product_Name,
    p.Price,
    sc.Quantity,
    sc.Add_Date,
    (p.Price * sc.Quantity) AS Subtotal
FROM 
    Shopping_Cart sc
JOIN Customer c ON sc.Customer_ID = c.Customer_ID
JOIN Shopping_Cart_Product scp ON sc.Cart_ID = scp.Cart_ID
JOIN Product p ON scp.Product_ID = p.Product_ID;

SELECT * FROM CustomerShoppingCart;



-- 4.Customer Purchase History View:
CREATE VIEW CustomerPurchaseHistory AS
SELECT 
    cp.Customer_ID,
    CONCAT(c.First_Name, ' ', c.Last_Name) AS Customer_Name,
    cp.Product_ID,
    p.P_Name AS Product_Name,
    p.Price,
    cp.Purchase_Date,
    cat.C_Name AS Category_Name
FROM 
    Customer_Product cp
JOIN Customer c ON cp.Customer_ID = c.Customer_ID
JOIN Product p ON cp.Product_ID = p.Product_ID
JOIN Category cat ON p.Category_ID = cat.Category_ID;

SELECT * FROM CustomerPurchaseHistory;


-- 5. Product Review Summary View:
CREATE VIEW ProductReviewSummary AS
SELECT 
    p.Product_ID,
    p.P_Name AS Product_Name,
    AVG(r.Rating) AS Average_Rating,
    COUNT(r.Review_ID) AS Total_Reviews,
    MAX(r.Review_Date) AS Latest_Review_Date
FROM 
    Product p
LEFT JOIN Reviews r ON p.Product_ID = r.Product_ID
GROUP BY 
    p.Product_ID, p.P_Name;
    
SELECT * FROM ProductReviewSummary;


CREATE TABLE LowStockAlert (
    AlertID INT AUTO_INCREMENT PRIMARY KEY,
    Product_ID INT,
    CurrentStock INT,
    AlertDate DATETIME,
    FOREIGN KEY (Product_ID) REFERENCES Product(Product_ID)
);
    
 -- TRIGGERS
 -- 1.Update Product Stock After Order:
 -- This trigger automatically updates the product stock quantity after a new order is placed, and logs an alert if the stock falls below a threshold.  
 DELIMITER //
CREATE TRIGGER update_stock_after_order
AFTER INSERT ON Order_Product
FOR EACH ROW
BEGIN
    DECLARE stock_threshold INT DEFAULT 10;
    DECLARE current_stock INT;

    UPDATE Product
    SET Stock_Quantity = Stock_Quantity - NEW.Quantity
    WHERE Product_ID = NEW.Product_ID;
    
    -- Check if stock is low and log it
    SELECT Stock_Quantity INTO current_stock
    FROM Product
    WHERE Product_ID = NEW.Product_ID;
    
    IF current_stock <= stock_threshold THEN
        INSERT INTO LowStockAlert (Product_ID, CurrentStock, AlertDate)
        VALUES (NEW.Product_ID, current_stock, NOW());
    END IF;
END;
//
DELIMITER ;  


-- 1. Check the current stock of a product (let's use Product_ID 101)
SELECT Product_ID, Stock_Quantity FROM Product WHERE Product_ID = 101;

-- 2. Insert a new order
INSERT INTO Orders (Order_ID, Customer_ID, Order_Date, Total_Amount) 
VALUES (9999, 1, CURDATE(), 999.99);

INSERT INTO Order_Product (Order_ID, Product_ID, Quantity) 
VALUES (9999, 101, 5);

-- 3. Check the updated stock
SELECT Product_ID, Stock_Quantity FROM Product WHERE Product_ID = 101;

-- 4. Check if a low stock alert was created (if the stock fell below 10)
SELECT * FROM LowStockAlert WHERE Product_ID = 101 ORDER BY AlertDate DESC LIMIT 1;





-- 2.Prevent Negative Stock:
-- This trigger prevents updating a product's stock quantity to a negative value, raising an error if such an update is attempted.
DELIMITER //
CREATE TRIGGER prevent_negative_stock
BEFORE UPDATE ON Product
FOR EACH ROW
BEGIN
    IF NEW.Stock_Quantity < 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Cannot have negative stock quantity';
    END IF;
END;
//
DELIMITER ;

UPDATE Product SET Stock_Quantity = -5 WHERE Product_ID = 101;





-- 3.Calculate Order Total:
-- This trigger automatically updates the total amount of an order in the Orders table whenever a new product is added to the order in the Order_Product table.
DELIMITER //
CREATE TRIGGER calculate_order_total
AFTER INSERT ON Order_Product
FOR EACH ROW
BEGIN
    DECLARE product_price DECIMAL(10,2);
    
    SELECT Price INTO product_price
    FROM Product
    WHERE Product_ID = NEW.Product_ID;
    
    UPDATE Orders
    SET Total_Amount = Total_Amount + (NEW.Quantity * product_price)
    WHERE Order_ID = NEW.Order_ID;
END;
//
DELIMITER ;


-- Step 1: Insert a new order with initial Total_Amount of 0
INSERT INTO Orders (Order_ID, Customer_ID, Order_Date, Total_Amount)
VALUES (9999, 1, CURDATE(), 0);

-- Step 2: Insert a new product into this order
INSERT INTO Order_Product (Order_ID, Product_ID, Quantity)
VALUES (9999, 101, 2);

-- Step 3: Check the updated Total_Amount in the Orders table
SELECT Order_ID, Total_Amount
FROM Orders
WHERE Order_ID = 9999;

-- Step 4: Verify the calculation
SELECT o.Order_ID, o.Total_Amount, p.Price, op.Quantity, (p.Price * op.Quantity) AS Expected_Total
FROM Orders o
JOIN Order_Product op ON o.Order_ID = op.Order_ID
JOIN Product p ON op.Product_ID = p.Product_ID
WHERE o.Order_ID = 9999;


-- STORED PROCEDURES
-- 1.Create New Order:
-- This stored procedure creates a new order, updates product stock, and generates a shipping record in a single transaction, ensuring data consistency across multiple tables.
DELIMITER //
CREATE PROCEDURE create_new_order(
    IN p_customer_id INT,
    IN p_product_id INT,
    IN p_quantity INT,
    OUT p_order_id INT
)
BEGIN
    DECLARE v_total_amount DECIMAL(10,2);
    DECLARE v_product_price DECIMAL(10,2);
    DECLARE v_stock_quantity INT;
    DECLARE v_error_message VARCHAR(255);
    
    DECLARE exit handler for sqlexception
    BEGIN
        GET DIAGNOSTICS CONDITION 1 @sqlstate = RETURNED_SQLSTATE, 
            @errno = MYSQL_ERRNO, @text = MESSAGE_TEXT;
        SET @full_error = CONCAT("ERROR ", @errno, " (", @sqlstate, "): ", @text);
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = @full_error;
    END;
    
    -- Check if customer exists
    IF NOT EXISTS (SELECT 1 FROM Customer WHERE Customer_ID = p_customer_id) THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Customer does not exist';
    END IF;
    
    -- Check if product exists and get stock quantity
    SELECT Price, Stock_Quantity INTO v_product_price, v_stock_quantity
    FROM Product
    WHERE Product_ID = p_product_id;
    
    IF v_product_price IS NULL THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Product does not exist';
    END IF;
    
    -- Check if enough stock
    IF v_stock_quantity < p_quantity THEN
        SET v_error_message = CONCAT('Insufficient stock. Available: ', v_stock_quantity, ', Requested: ', p_quantity);
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = v_error_message;
    END IF;
    
    -- Calculate total amount
    SET v_total_amount = p_quantity * v_product_price;
    
    -- Create new order
    INSERT INTO Orders (Customer_ID, Order_Date, Total_Amount)
    VALUES (p_customer_id, CURDATE(), v_total_amount);
    
    SET p_order_id = LAST_INSERT_ID();
    
    -- Add product to order
    INSERT INTO Order_Product (Order_ID, Product_ID, Quantity)
    VALUES (p_order_id, p_product_id, p_quantity);
    
    -- Update product stock
    UPDATE Product
    SET Stock_Quantity = Stock_Quantity - p_quantity
    WHERE Product_ID = p_product_id;
    
    -- Create shipping record
    INSERT INTO Shipping (Order_ID, Shipping_Address, Shipping_Date, Shipping_Method, Shipping_Status)
    SELECT p_order_id, CONCAT(Address, ', ', City, ', ', State, ' ', Postal_Code), 
           DATE_ADD(CURDATE(), INTERVAL 3 DAY), 'Standard', 'Processing'
    FROM Customer
    WHERE Customer_ID = p_customer_id;
    
END //
DELIMITER ;


SET @customer_id = 1;  -- Make sure this customer exists
SET @product_id = 101;  -- Make sure this product exists
SET @quantity = 1;  -- Make sure this is less than or equal to available stock
SET @new_order_id = 0;

CALL create_new_order(@customer_id, @product_id, @quantity, @new_order_id);

SELECT @new_order_id;


-- 2. Get Customer Order History:
-- This stored procedure retrieves a customer's order history, including order details, product information, shipping status, and payment status, for a given customer ID.
DELIMITER //
CREATE PROCEDURE get_customer_order_history(
    IN p_customer_id INT
)
BEGIN
    SELECT o.Order_ID, o.Order_Date, o.Total_Amount,
           p.P_Name AS Product_Name, op.Quantity,
           s.Shipping_Status, pay.Payment_Status
    FROM Orders o
    JOIN Order_Product op ON o.Order_ID = op.Order_ID
    JOIN Product p ON op.Product_ID = p.Product_ID
    LEFT JOIN Shipping s ON o.Order_ID = s.Order_ID
    LEFT JOIN Payments pay ON o.Order_ID = pay.Order_ID
    WHERE o.Customer_ID = p_customer_id
    ORDER BY o.Order_Date DESC;
END;
//
DELIMITER ;

CALL get_customer_order_history(3);

-- FUNCTIONS
-- 1. Calculate Customer Lifetime Value
-- This function calculates the total amount spent by a specific customer across all their orders, providing their lifetime value to the business.
DELIMITER //
CREATE FUNCTION calculate_customer_lifetime_value(
    p_customer_id INT
) RETURNS DECIMAL(10,2)
DETERMINISTIC
BEGIN
    DECLARE total_value DECIMAL(10,2);
    
    SELECT SUM(Total_Amount) INTO total_value
    FROM Orders
    WHERE Customer_ID = p_customer_id;
    
    RETURN IFNULL(total_value, 0);
END;
//
DELIMITER ;

SELECT 
    Customer_ID,
    CONCAT(First_Name, ' ', Last_Name) AS Customer_Name,
    calculate_customer_lifetime_value(Customer_ID) AS Lifetime_Value
FROM 
    Customer
WHERE 
    Customer_ID IN (1, 2, 3);


-- 2. Get Product Rating:
-- This function calculates and returns the average rating for a specific product based on its reviews, returning 0 if no reviews exist.
DELIMITER //
CREATE FUNCTION get_product_rating(
    p_product_id INT
) RETURNS DECIMAL(3,2)
DETERMINISTIC
BEGIN
    DECLARE avg_rating DECIMAL(3,2);
    
    SELECT AVG(Rating) INTO avg_rating
    FROM Reviews
    WHERE Product_ID = p_product_id;
    
    RETURN IFNULL(avg_rating, 0);
END;
//
DELIMITER 

SELECT 
    p.Product_ID,
    p.P_Name AS Product_Name,
    get_product_rating(p.Product_ID) AS Function_Rating,
    IFNULL(AVG(r.Rating), 0) AS Calculated_Rating,
    COUNT(r.Review_ID) AS Number_of_Reviews
FROM 
    Product p
LEFT JOIN 
    Reviews r ON p.Product_ID = r.Product_ID
GROUP BY 
    p.Product_ID, p.P_Name
ORDER BY 
    p.Product_ID;








-- 3.Check Product Availability:
-- This function checks if a specified quantity of a product is available in stock, returning TRUE if there's enough stock and FALSE otherwise.
DELIMITER //
CREATE FUNCTION is_product_available(
    p_product_id INT,
    p_quantity INT
) RETURNS BOOLEAN
DETERMINISTIC
BEGIN
    DECLARE available_stock INT;
    
    SELECT Stock_Quantity INTO available_stock
    FROM Product
    WHERE Product_ID = p_product_id;
    
    RETURN available_stock >= p_quantity;
END;
//
DELIMITER ;

SELECT 
    p.Product_ID,
    p.P_Name AS Product_Name,
    p.Stock_Quantity,
    is_product_available(p.Product_ID, 1) AS Available_1,
    is_product_available(p.Product_ID, 10) AS Available_10,
    is_product_available(p.Product_ID, 50) AS Available_50,
    is_product_available(p.Product_ID, 100) AS Available_100,
    is_product_available(p.Product_ID, p.Stock_Quantity) AS Available_All,
    is_product_available(p.Product_ID, p.Stock_Quantity + 1) AS Available_OverStock
FROM 
    Product p;



-- 1.Top 5 customers by total purchase amount:

SELECT c.Customer_ID, CONCAT(c.First_Name, ' ', c.Last_Name) AS Customer_Name, 
       SUM(o.Total_Amount) AS Total_Spent
FROM Customer c
JOIN Orders o ON c.Customer_ID = o.Customer_ID
GROUP BY c.Customer_ID, Customer_Name
ORDER BY Total_Spent DESC
LIMIT 5;





-- 2. Monthly sales trend:
SELECT DATE_FORMAT(Order_Date, '%Y-%m') AS Month, 
       SUM(Total_Amount) AS Monthly_Sales
FROM Orders
GROUP BY Month
ORDER BY Month;



-- 3. Product popularity by category: 
SELECT c.C_Name AS Category, p.P_Name AS Product, 
       COUNT(op.Order_ID) AS Times_Ordered
FROM Category c
JOIN Product p ON c.Category_ID = p.Category_ID
LEFT JOIN Order_Product op ON p.Product_ID = op.Product_ID
GROUP BY c.C_Name, p.P_Name
ORDER BY c.C_Name, Times_Ordered DESC;




-- 4.Average order value by customer location:
SELECT c.State, AVG(o.Total_Amount) AS Avg_Order_Value
FROM Customer c
JOIN Orders o ON c.Customer_ID = o.Customer_ID
GROUP BY c.State
ORDER BY Avg_Order_Value DESC;




-- 5.Customers who haven't placed an order in the last 30 days:
SELECT c.Customer_ID, CONCAT(c.First_Name, ' ', c.Last_Name) AS Customer_Name
FROM Customer c
LEFT JOIN Orders o ON c.Customer_ID = o.Customer_ID 
    AND o.Order_Date >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
WHERE o.Order_ID IS NULL;



-- 6. Products with low stock (less than 10 items):
SELECT Product_ID, P_Name, Stock_Quantity
FROM Product
WHERE Stock_Quantity < 10
ORDER BY Stock_Quantity;



-- 7. Customer retention rate (customers who made a purchase in both the current and previous month):
WITH CurrentMonthCustomers AS (
    SELECT DISTINCT Customer_ID
    FROM Orders
    WHERE Order_Date >= DATE_FORMAT(CURDATE() - INTERVAL 1 MONTH, '%Y-%m-01')
),
PreviousMonthCustomers AS (
    SELECT DISTINCT Customer_ID
    FROM Orders
    WHERE Order_Date >= DATE_FORMAT(CURDATE() - INTERVAL 2 MONTH, '%Y-%m-01')
    AND Order_Date < DATE_FORMAT(CURDATE() - INTERVAL 1 MONTH, '%Y-%m-01')
)
SELECT 
    COUNT(DISTINCT cmc.Customer_ID) AS RetainedCustomers,
    COUNT(DISTINCT pmc.Customer_ID) AS PreviousMonthCustomers,
    COUNT(DISTINCT cmc.Customer_ID) / COUNT(DISTINCT pmc.Customer_ID) * 100 AS RetentionRate
FROM PreviousMonthCustomers pmc
LEFT JOIN CurrentMonthCustomers cmc ON pmc.Customer_ID = cmc.Customer_ID;



-- 8.Rolling 3-month average of sales:
SELECT 
    DATE_FORMAT(Order_Date, '%Y-%m') AS Month,
    SUM(Total_Amount) AS Monthly_Sales,
    AVG(SUM(Total_Amount)) OVER (
        ORDER BY DATE_FORMAT(Order_Date, '%Y-%m')
        ROWS BETWEEN 2 PRECEDING AND CURRENT ROW
    ) AS Rolling_3_Month_Avg
FROM Orders
GROUP BY Month
ORDER BY Month;



-- 9 Rank products by sales within their category:
SELECT 
    c.C_Name AS Category,
    p.P_Name AS Product,
    SUM(op.Quantity * p.Price) AS Total_Sales,
    RANK() OVER (
        PARTITION BY c.Category_ID 
        ORDER BY SUM(op.Quantity * p.Price) DESC
    ) AS Sales_Rank
FROM Category c
JOIN Product p ON c.Category_ID = p.Category_ID
JOIN Order_Product op ON p.Product_ID = op.Product_ID
GROUP BY c.Category_ID, p.Product_ID
ORDER BY c.C_Name, Sales_Rank;



-- 10. Customer segmentation by total spend (OLAP query):
SELECT 
    CASE 
        WHEN Total_Spent < 100 THEN 'Low Spender'
        WHEN Total_Spent BETWEEN 100 AND 500 THEN 'Medium Spender'
        ELSE 'High Spender'
    END AS Customer_Segment,
    COUNT(*) AS Customer_Count,
    AVG(Total_Spent) AS Avg_Spend
FROM (
    SELECT c.Customer_ID, SUM(o.Total_Amount) AS Total_Spent
    FROM Customer c
    JOIN Orders o ON c.Customer_ID = o.Customer_ID
    GROUP BY c.Customer_ID
) AS CustomerSpend
GROUP BY Customer_Segment
WITH ROLLUP;



-- 11. Product cross-sell analysis:
SELECT 
    p1.P_Name AS Product1,
    p2.P_Name AS Product2,
    COUNT(*) AS Co_occurrence
FROM Order_Product op1
JOIN Order_Product op2 ON op1.Order_ID = op2.Order_ID AND op1.Product_ID < op2.Product_ID
JOIN Product p1 ON op1.Product_ID = p1.Product_ID
JOIN Product p2 ON op2.Product_ID = p2.Product_ID
GROUP BY p1.Product_ID, p2.Product_ID
ORDER BY Co_occurrence DESC
LIMIT 10;



-- 12. Customer lifetime value calculation:
SELECT 
    c.Customer_ID,
    CONCAT(c.First_Name, ' ', c.Last_Name) AS Customer_Name,
    COUNT(DISTINCT o.Order_ID) AS Total_Orders,
    SUM(o.Total_Amount) AS Total_Spent,
    AVG(o.Total_Amount) AS Avg_Order_Value,
    DATEDIFF(MAX(o.Order_Date), MIN(o.Order_Date)) / 365.0 AS Years_Active,
    SUM(o.Total_Amount) / (DATEDIFF(MAX(o.Order_Date), MIN(o.Order_Date)) / 365.0) AS Annual_Value
FROM Customer c
JOIN Orders o ON c.Customer_ID = o.Customer_ID
GROUP BY c.Customer_ID
ORDER BY Annual_Value DESC
LIMIT 10;



-- 13. Seasonal sales analysis (OLAP query):
SELECT 
    YEAR(Order_Date) AS Year,
    QUARTER(Order_Date) AS Quarter,
    SUM(Total_Amount) AS Quarterly_Sales,
    SUM(SUM(Total_Amount)) OVER (PARTITION BY YEAR(Order_Date) ORDER BY QUARTER(Order_Date)) AS Cumulative_Yearly_Sales
FROM Orders
GROUP BY Year, Quarter
WITH ROLLUP;






-- 14.Customer purchase frequency distribution:
WITH PurchaseFrequency AS (
    SELECT Customer_ID, COUNT(DISTINCT Order_ID) AS Order_Count
    FROM Orders
    GROUP BY Customer_ID
)
SELECT 
    CASE 
        WHEN Order_Count = 1 THEN 'One-time'
        WHEN Order_Count BETWEEN 2 AND 5 THEN '2-5 times'
        WHEN Order_Count BETWEEN 6 AND 10 THEN '6-10 times'
        ELSE 'More than 10 times'
    END AS Purchase_Frequency,
    COUNT(*) AS Customer_Count,
    AVG(Order_Count) AS Avg_Orders
FROM PurchaseFrequency
GROUP BY Purchase_Frequency
ORDER BY MIN(Order_Count);




-- 15. Product review sentiment analysis (assuming a sentiment score in the review text):
SELECT 
    p.Product_ID,
    p.P_Name,
    AVG(r.Rating) AS Avg_Rating,
    COUNT(r.Review_ID) AS Review_Count,
    SUM(CASE WHEN r.Review_Text LIKE '%great%' OR r.Review_Text LIKE '%excellent%' THEN 1 ELSE 0 END) AS Positive_Reviews,
    SUM(CASE WHEN r.Review_Text LIKE '%poor%' OR r.Review_Text LIKE '%bad%' THEN 1 ELSE 0 END) AS Negative_Reviews
FROM Product p
LEFT JOIN Reviews r ON p.Product_ID = r.Product_ID
GROUP BY p.Product_ID, p.P_Name
HAVING Review_Count > 0
ORDER BY Avg_Rating DESC, Review_Count DESC;


DESC CUSTOMER;


























