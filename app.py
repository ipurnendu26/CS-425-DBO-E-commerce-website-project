from flask import Flask, request, jsonify
import mysql.connector
from mysql.connector import Error
from flask_cors import CORS
import os
from dotenv import load_dotenv
from datetime import datetime

# Load environment variables from .env
load_dotenv()

app = Flask(__name__)
CORS(app)

# Database connection configuration
db_config = {
    'host': 'localhost',
    'user': 'root',
    'password': 'rishabh',  # Replace with your MySQL root password
    'database': 'project'
}

# Connect to the MySQL database
def get_db_connection():
    try:
        connection = mysql.connector.connect(**db_config)
        if connection.is_connected():
            return connection
    except Error as e:
        print(f"Error connecting to MySQL: {e}")
        return None

# Endpoint to register a new user
@app.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
    name = data.get('name')
    email = data.get('email')
    password = data.get('password')
    role = data.get('role')

    if not all([name, email, password, role]):
        return jsonify({"message": "All fields are required"}), 400

    query = "INSERT INTO users (name, email, password, role) VALUES (%s, %s, %s, %s)"
    connection = get_db_connection()
    cursor = connection.cursor()

    try:
        cursor.execute(query, (name, email, password, role))
        connection.commit()
        return jsonify({"message": "User registered successfully"}), 200
    except Error as e:
        print(f"Error registering user: {e}")
        return jsonify({"message": "Error registering user", "error": str(e)}), 500
    finally:
        cursor.close()
        connection.close()

# Endpoint to log in a user
@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    if not all([email, password]):
        return jsonify({"message": "Email and password are required"}), 400

    query = "SELECT * FROM users WHERE email = %s"
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)

    try:
        cursor.execute(query, (email,))
        user = cursor.fetchone()

        if not user or user['password'] != password:
            return jsonify({"message": "Invalid email or password"}), 401

        return jsonify({
            "message": "Login successful",
            "id": user['id'],
            "role": user['role'],
            "email": user['email'],
            "name": user['name']
        }), 200
    except Error as e:
        print(f"Error logging in user: {e}")
        return jsonify({"message": "Internal server error", "error": str(e)}), 500
    finally:
        cursor.close()
        connection.close()


# Get all products or filter by category
@app.route('/products', methods=['GET'])
def get_products():
    category = request.args.get('category')
    query = "SELECT * FROM products"
    params = ()

    if category:
        query += " WHERE category = %s"
        params = (category,)

    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)

    try:
        cursor.execute(query, params)
        results = cursor.fetchall()
        return jsonify(results), 200
    except Error as e:
        print(f"Error fetching products: {e}")
        return jsonify({"message": "Error fetching products", "error": str(e)}), 500
    finally:
        cursor.close()
        connection.close()

# Add a new product
@app.route('/products', methods=['POST'])
def add_product():
    data = request.get_json()
    required_fields = ['name', 'price', 'description', 'category', 'accessories', 'image', 'discount', 'rebate', 'warranty']
    
    # Validate all required fields are provided
    if not all(field in data for field in required_fields):
        return jsonify({"message": "All fields are required"}), 400

    query = """
        INSERT INTO products (name, price, description, category, accessories, image, discount, rebate, warranty)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
    """
    params = (data['name'], data['price'], data['description'], data['category'],
              data['accessories'], data['image'], data['discount'], data['rebate'], data['warranty'])

    connection = get_db_connection()
    cursor = connection.cursor()

    try:
        cursor.execute(query, params)
        connection.commit()
        return jsonify({"message": "Product added successfully", "productId": cursor.lastrowid}), 201
    except Error as e:
        print(f"Error adding product: {e}")
        return jsonify({"message": "Error adding product", "error": str(e)}), 500
    finally:
        cursor.close()
        connection.close()

# Update a product
@app.route('/products/<int:id>', methods=['PUT'])
def update_product(id):
    data = request.get_json()
    required_fields = ['name', 'price', 'description', 'category', 'accessories', 'image']

    # Validate all required fields are provided
    if not all(field in data for field in required_fields):
        return jsonify({"message": "All fields are required"}), 400

    query = """
        UPDATE products
        SET name = %s, price = %s, description = %s, category = %s, accessories = %s, image = %s
        WHERE id = %s
    """
    params = (data['name'], data['price'], data['description'], data['category'],
              data['accessories'], data['image'], id)

    connection = get_db_connection()
    cursor = connection.cursor()

    try:
        cursor.execute(query, params)
        connection.commit()

        if cursor.rowcount == 0:
            return jsonify({"message": "Product not found"}), 404

        return jsonify({"message": "Product updated successfully"}), 200
    except Error as e:
        print(f"Error updating product: {e}")
        return jsonify({"message": "Error updating product", "error": str(e)}), 500
    finally:
        cursor.close()
        connection.close()

# Delete a product
@app.route('/products/<int:id>', methods=['DELETE'])
def delete_product(id):
    query = "DELETE FROM products WHERE id = %s"
    connection = get_db_connection()
    cursor = connection.cursor()

    try:
        cursor.execute(query, (id,))
        connection.commit()

        if cursor.rowcount == 0:
            return jsonify({"message": "Product not found"}), 404

        return jsonify({"message": "Product deleted successfully"}), 200
    except Error as e:
        print(f"Error deleting product: {e}")
        return jsonify({"message": "Error deleting product", "error": str(e)}), 500
    finally:
        cursor.close()
        connection.close()


# Place an order
@app.route('/place-order', methods=['POST'])
def place_order():
    data = request.get_json()
    user_id = data.get('userId')
    name = data.get('name')
    total_price = data.get('totalPrice')
    delivery_method = data.get('deliveryMethod')
    store_location = data.get('storeLocation')
    delivery_date = data.get('deliveryDate')
    cart_items = data.get('cartItems', [])
    address = data.get('address')
    credit_card = data.get('creditCard')

    # Validate required fields
    if not all([user_id, name, total_price, delivery_method, cart_items, address, credit_card]) or (
        delivery_method == 'inStorePickup' and not store_location):
        return jsonify({"message": "Missing required order information"}), 400

    today_date = datetime.today().strftime('%Y-%m-%d')
    order_query = """
        INSERT INTO orders (user_id, name, total_price, delivery_method, store_location, status, delivery_date, product_id, quantity, order_date)
        VALUES (%s, %s, %s, %s, %s, 'pending', %s, %s, %s, %s)
    """

    connection = get_db_connection()
    cursor = connection.cursor()

    try:
        for item in cart_items:
            # Insert each cart item into the orders table
            cursor.execute(order_query, (
                user_id, name, total_price, delivery_method, store_location,
                delivery_date, item['product_id'], item['quantity'], today_date
            ))
            connection.commit()

            # Update product stock
            stock_update_query = "UPDATE products SET stock = stock - %s WHERE id = %s"
            cursor.execute(stock_update_query, (item['quantity'], item['product_id']))
            connection.commit()

            # Insert into CustomerOrder table
            customer_order_query = """
                INSERT INTO CustomerOrder (userName, orderName, orderPrice, userAddress, creditCardNo)
                VALUES (%s, %s, %s, %s, %s)
            """
            cursor.execute(customer_order_query, (
                name, item['name'], item['price'], address, credit_card
            ))
            connection.commit()

        return jsonify({"message": "Order placed successfully"}), 200
    except Error as e:
        print(f"Error placing order: {e}")
        return jsonify({"message": "Error placing order", "error": str(e)}), 500
    finally:
        cursor.close()
        connection.close()

# Get past orders for a specific user
@app.route('/past-orders/<int:user_id>', methods=['GET'])
def get_past_orders(user_id):
    query = """
        SELECT id, name, total_price, delivery_method, status, delivery_date
        FROM orders
        WHERE user_id = %s
    """

    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)

    try:
        cursor.execute(query, (user_id,))
        results = cursor.fetchall()
        return jsonify(results), 200
    except Error as e:
        print(f"Error fetching past orders: {e}")
        return jsonify({"message": "Error fetching past orders", "error": str(e)}), 500
    finally:
        cursor.close()
        connection.close()

# Cancel an order
@app.route('/cancel-order/<int:order_id>', methods=['DELETE'])
def cancel_order(order_id):
    if not order_id:
        return jsonify({"message": "Invalid order ID"}), 400

    query = "DELETE FROM orders WHERE id = %s"

    connection = get_db_connection()
    cursor = connection.cursor()

    try:
        cursor.execute(query, (order_id,))
        connection.commit()

        if cursor.rowcount == 0:
            return jsonify({"message": "Order not found"}), 404

        return jsonify({"message": "Order deleted successfully"}), 200
    except Error as e:
        print(f"Error deleting order: {e}")
        return jsonify({"message": "Error deleting order", "error": str(e)}), 500
    finally:
        cursor.close()
        connection.close()

# Add an order
@app.route('/orders', methods=['POST'])
def add_order():
    data = request.get_json()
    user_id = data.get('user_id')
    total_price = data.get('total_price')
    delivery_method = data.get('delivery_method')
    store_location = data.get('store_location')
    delivery_date = data.get('delivery_date')

    if not all([user_id, total_price, delivery_method, store_location, delivery_date]):
        return jsonify({"message": "All fields are required"}), 400

    query = """
        INSERT INTO orders (user_id, name, total_price, delivery_method, store_location, delivery_date)
        VALUES (%s, %s, %s, %s, %s, %s)
    """
    connection = get_db_connection()
    cursor = connection.cursor()

    try:
        cursor.execute(query, (user_id, total_price, delivery_method, store_location, delivery_date))
        connection.commit()
        return jsonify({"message": "Order added successfully"}), 201
    except Error as e:
        print(f"Error adding order: {e}")
        return jsonify({"message": "Error adding order", "error": str(e)}), 500
    finally:
        cursor.close()
        connection.close()

# Fetch all orders
@app.route('/orders', methods=['GET'])
def fetch_orders():
    query = "SELECT * FROM orders"

    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)

    try:
        cursor.execute(query)
        results = cursor.fetchall()
        return jsonify(results), 200
    except Error as e:
        print(f"Error fetching orders: {e}")
        return jsonify({"message": "Error fetching orders", "error": str(e)}), 500
    finally:
        cursor.close()
        connection.close()

# Update an order
@app.route('/orders/<int:id>', methods=['PUT'])
def update_order(id):
    data = request.get_json()
    total_price = data.get('total_price')
    delivery_method = data.get('delivery_method')
    store_location = data.get('store_location')
    delivery_date = data.get('delivery_date')
    status = data.get('status')

    if not all([total_price, delivery_method, store_location, delivery_date, status]):
        return jsonify({"message": "All fields are required"}), 400

    query = """
        UPDATE orders
        SET total_price = %s, delivery_method = %s, store_location = %s, delivery_date = %s, status = %s
        WHERE id = %s
    """
    connection = get_db_connection()
    cursor = connection.cursor()

    try:
        cursor.execute(query, (total_price, delivery_method, store_location, delivery_date, status, id))
        connection.commit()

        if cursor.rowcount == 0:
            return jsonify({"message": "Order not found"}), 404

        return jsonify({"message": "Order updated successfully"}), 200
    except Error as e:
        print(f"Error updating order: {e}")
        return jsonify({"message": "Error updating order", "error": str(e)}), 500
    finally:
        cursor.close()
        connection.close()

# Delete an order
@app.route('/orders/<int:id>', methods=['DELETE'])
def delete_order(id):
    query = "DELETE FROM orders WHERE id = %s"

    connection = get_db_connection()
    cursor = connection.cursor()

    try:
        cursor.execute(query, (id,))
        connection.commit()

        if cursor.rowcount == 0:
            return jsonify({"message": "Order not found"}), 404

        return jsonify({"message": "Order deleted successfully"}), 200
    except Error as e:
        print(f"Error deleting order: {e}")
        return jsonify({"message": "Error deleting order", "error": str(e)}), 500
    finally:
        cursor.close()
        connection.close()

# Fetch product details by ID
@app.route('/products/<int:id>', methods=['GET'])
def fetch_product_by_id(id):
    query = "SELECT * FROM products WHERE id = %s"

    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)

    try:
        cursor.execute(query, (id,))
        result = cursor.fetchone()

        if not result:
            return jsonify({"message": "Product not found"}), 404

        return jsonify(result), 200
    except Error as e:
        print(f"Error fetching product details: {e}")
        return jsonify({"message": "Error fetching product details", "error": str(e)}), 500
    finally:
        cursor.close()
        connection.close()

# Top five zip codes with maximum product sales
@app.route('/trending/top-zipcodes', methods=['GET'])
def get_top_zipcodes():
    query = """
        SELECT store_location, COUNT(store_location) AS totalOrders
        FROM orders
        GROUP BY store_location
        ORDER BY totalOrders DESC
        LIMIT 5
    """
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)

    try:
        cursor.execute(query)
        results = cursor.fetchall()
        print('Top zip codes query results:', results)  # Log the results for debugging
        return jsonify(results), 200
    except Error as e:
        print(f"Error fetching top zip codes: {e}")
        return jsonify({"message": "Error fetching top zip codes", "error": str(e)}), 500
    finally:
        cursor.close()
        connection.close()

# Top five most sold products
@app.route('/trending/most-sold', methods=['GET'])
def get_most_sold_products():
    query = """
        SELECT orderName, COUNT(orderName) AS totalSold
        FROM CustomerOrder
        GROUP BY orderName
        ORDER BY totalSold DESC
        LIMIT 5
    """
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)

    try:
        cursor.execute(query)
        results = cursor.fetchall()
        print('Most sold products query results:', results)  # Log the results for debugging
        return jsonify(results), 200
    except Error as e:
        print(f"Error fetching most sold products: {e}")
        return jsonify({"message": "Error fetching most sold products", "error": str(e)}), 500
    finally:
        cursor.close()
        connection.close()

# Fetch all store locations
@app.route('/store-locations', methods=['GET'])
def get_store_locations():
    query = "SELECT * FROM store_locations"
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)

    try:
        cursor.execute(query)
        results = cursor.fetchall()
        return jsonify(results), 200
    except Error as e:
        print(f"Error fetching store locations: {e}")
        return jsonify({"message": "Error fetching store locations", "error": str(e)}), 500
    finally:
        cursor.close()
        connection.close()


# Get accessories for a specific product
@app.route('/accessories', methods=['GET'])
def get_accessories():
    product_id = request.args.get('productId')  # Get productId from query parameters
    if not product_id:
        return jsonify({"message": "Product ID is required"}), 400

    query = "SELECT * FROM accessories WHERE product_id = %s"
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)

    try:
        cursor.execute(query, (product_id,))
        results = cursor.fetchall()
        return jsonify(results), 200
    except Error as e:
        print(f"Error fetching accessories: {e}")
        return jsonify({"message": "Error fetching accessories", "error": str(e)}), 500
    finally:
        cursor.close()
        connection.close()

# Get a table of all products and available stock
@app.route('/inventory/products', methods=['GET'])
def get_products_inventory():
    query = """
        SELECT name, price, stock 
        FROM products
        ORDER BY name
    """
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)

    try:
        cursor.execute(query)
        results = cursor.fetchall()
        return jsonify(results), 200
    except Error as e:
        print(f"Error fetching inventory: {e}")
        return jsonify({"message": "Error fetching inventory", "error": str(e)}), 500
    finally:
        cursor.close()
        connection.close()

# Get data for Bar Chart (product names and stock levels)
@app.route('/inventory/products/bar-chart', methods=['GET'])
def get_bar_chart_data():
    query = """
        SELECT name, stock 
        FROM products
        ORDER BY name
    """
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)

    try:
        cursor.execute(query)
        results = cursor.fetchall()
        return jsonify(results), 200
    except Error as e:
        print(f"Error fetching bar chart data: {e}")
        return jsonify({"message": "Error fetching bar chart data", "error": str(e)}), 500
    finally:
        cursor.close()
        connection.close()

# Get all products currently on sale (with a discount)
@app.route('/inventory/products/sale', methods=['GET'])
def get_products_on_sale():
    query = """
        SELECT name, price, discount
        FROM products
        WHERE discount IS NOT NULL
        ORDER BY name
    """
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)

    try:
        cursor.execute(query)
        results = cursor.fetchall()
        return jsonify(results), 200
    except Error as e:
        print(f"Error fetching products on sale: {e}")
        return jsonify({"message": "Error fetching products on sale", "error": str(e)}), 500
    finally:
        cursor.close()
        connection.close()

# API: Get all products with manufacturer rebates
@app.route('/inventory/products/rebates', methods=['GET'])
def get_products_with_rebates():
    query = """
        SELECT name, price, rebate
        FROM products
        WHERE rebate IS NOT NULL
        ORDER BY name
    """
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)

    try:
        cursor.execute(query)
        results = cursor.fetchall()
        return jsonify(results), 200
    except Error as e:
        print(f"Error fetching products with rebates: {e}")
        return jsonify({"message": "Error fetching products with rebates", "error": str(e)}), 500
    finally:
        cursor.close()
        connection.close()

# API: Fetch product sales (name, price, total sales)
@app.route('/sales-report/products-sold', methods=['GET'])
def get_products_sold():
    query = """
        SELECT p.name, p.price, COUNT(o.id) AS items_sold, 
               SUM(o.total_price) AS total_sales
        FROM orders o
        JOIN products p ON o.product_id = p.id
        GROUP BY p.name, p.price
    """
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)

    try:
        cursor.execute(query)
        results = cursor.fetchall()
        return jsonify(results), 200
    except Error as e:
        print(f"Error fetching sold products: {e}")
        return jsonify({"message": "Error fetching sold products", "error": str(e)}), 500
    finally:
        cursor.close()
        connection.close()

# API: Fetch product sales chart (product names and total sales)
@app.route('/sales-report/products-sales-chart', methods=['GET'])
def get_products_sales_chart():
    query = """
        SELECT p.name, SUM(o.total_price) AS total_sales
        FROM orders o
        JOIN products p ON o.product_id = p.id
        GROUP BY p.name
    """
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)

    try:
        cursor.execute(query)
        results = cursor.fetchall()
        return jsonify(results), 200
    except Error as e:
        print(f"Error fetching sales chart data: {e}")
        return jsonify({"message": "Error fetching sales chart data", "error": str(e)}), 500
    finally:
        cursor.close()
        connection.close()

# API: Fetch total daily sales transactions
@app.route('/sales-report/daily-sales', methods=['GET'])
def get_daily_sales():
    query = """
        SELECT DATE(o.order_date) AS date, SUM(o.total_price) AS total_sales
        FROM orders o
        GROUP BY DATE(o.order_date)
        ORDER BY date DESC
    """
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)

    try:
        cursor.execute(query)
        results = cursor.fetchall()
        return jsonify(results), 200
    except Error as e:
        print(f"Error fetching daily sales: {e}")
        return jsonify({"message": "Error fetching daily sales", "error": str(e)}), 500
    finally:
        cursor.close()
        connection.close()

# API: Get top 5 customers by total purchase amount
@app.route('/sales-report/top-customers', methods=['GET'])
def get_top_customers():
    query = """
        SELECT u.name AS customer_name, u.email, SUM(o.total_price) AS total_spent
        FROM orders o
        JOIN users u ON o.user_id = u.id
        GROUP BY u.id
        ORDER BY total_spent DESC
        LIMIT 5
    """
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)

    try:
        cursor.execute(query)
        results = cursor.fetchall()
        return jsonify(results), 200
    except Error as e:
        print(f"Error fetching top customers: {e}")
        return jsonify({"message": "Error fetching top customers", "error": str(e)}), 500
    finally:
        cursor.close()
        connection.close()

# API: Get popular products by category
@app.route('/trending/popular-products-by-category', methods=['GET'])
def get_popular_products_by_category():
    query = """
        SELECT 
          p.category AS category_name,
          p.name AS product_name,
          COUNT(o.id) AS items_sold,
          SUM(o.total_price) AS total_revenue
        FROM orders o
        JOIN products p ON o.product_id = p.id
        GROUP BY p.category, p.name
        ORDER BY p.category ASC, items_sold DESC
    """
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)

    try:
        cursor.execute(query)
        results = cursor.fetchall()
        return jsonify(results), 200
    except Error as e:
        print(f"Error fetching popular products by category: {e}")
        return jsonify({"message": "Error fetching popular products by category", "error": str(e)}), 500
    finally:
        cursor.close()
        connection.close()


# API: Get customers who haven't placed an order in the last 30 days
@app.route('/customers/inactive', methods=['GET'])
def get_inactive_customers():
    query = """
        SELECT u.name AS customer_name, u.email
        FROM users u
        LEFT JOIN orders o ON u.id = o.user_id 
              AND o.order_date >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
        WHERE o.id IS NULL
    """
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)

    try:
        cursor.execute(query)
        results = cursor.fetchall()
        return jsonify(results), 200
    except Error as e:
        print(f"Error fetching inactive customers: {e}")
        return jsonify({"message": "Error fetching inactive customers", "error": str(e)}), 500
    finally:
        cursor.close()
        connection.close()

# API: Retention data for 2 interval days
@app.route('/sales-report/customer-retention', methods=['GET'])
def get_customer_retention():
    query = """
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
        LEFT JOIN users u ON cmc.user_id = u.id
    """
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)

    try:
        cursor.execute(query)
        results = cursor.fetchone()  # Fetch the first result
        return jsonify(results or {}), 200
    except Error as e:
        print(f"Error calculating customer retention rate: {e}")
        return jsonify({"message": "Error calculating customer retention rate", "error": str(e)}), 500
    finally:
        cursor.close()
        connection.close()

# API: 2 days average sale
@app.route('/sales-report/average-sales', methods=['GET'])
def get_average_sales():
    query = """
        SELECT 
          ROUND(SUM(total_price) / 2, 2) AS average_sales
        FROM orders
        WHERE order_date >= CURDATE() - INTERVAL 2 DAY
    """
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)

    try:
        cursor.execute(query)
        result = cursor.fetchone()  # Fetch the first result
        return jsonify(result or {"average_sales": 0}), 200
    except Error as e:
        print(f"Error fetching average sales: {e}")
        return jsonify({"message": "Error fetching average sales", "error": str(e)}), 500
    finally:
        cursor.close()
        connection.close()

# API: Customer Segmentation Analysis
@app.route('/analytics/customer-segmentation', methods=['GET'])
def customer_segmentation():
    query = """
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
        GROUP BY CustomerSegment WITH ROLLUP
    """
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)

    try:
        cursor.execute(query)
        results = cursor.fetchall()
        return jsonify(results), 200
    except Error as e:
        print(f"Error fetching customer segmentation data: {e}")
        return jsonify({"message": "Error fetching customer segmentation data", "error": str(e)}), 500
    finally:
        cursor.close()
        connection.close()

# API: Product Cross-Sell Analysis
@app.route('/analytics/product-cross-sell', methods=['GET'])
def product_cross_sell():
    query = """
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
        LIMIT 10
    """
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)

    try:
        cursor.execute(query)
        results = cursor.fetchall()
        return jsonify(results), 200
    except Error as e:
        print(f"Error fetching cross-sell data: {e}")
        return jsonify({"message": "Error fetching cross-sell data", "error": str(e)}), 500
    finally:
        cursor.close()
        connection.close()

# API: Customer Lifetime Value Calculation
@app.route('/analytics/customer-lifetime-value', methods=['GET'])
def customer_lifetime_value():
    query = """
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
        LIMIT 10
    """
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)

    try:
        cursor.execute(query)
        results = cursor.fetchall()
        return jsonify(results), 200
    except Error as e:
        print(f"Error fetching customer lifetime value data: {e}")
        return jsonify({"message": "Error fetching customer lifetime value data", "error": str(e)}), 500
    finally:
        cursor.close()
        connection.close()

# API: Seasonal Sales Analysis
@app.route('/analytics/seasonal-sales-analysis', methods=['GET'])
def seasonal_sales_analysis():
    query = """
        SELECT 
          YEAR(order_date) AS Year,
          QUARTER(order_date) AS Quarter,
          SUM(total_price) AS Quarterly_Sales,
          SUM(SUM(total_price)) OVER (PARTITION BY YEAR(order_date) ORDER BY QUARTER(order_date)) AS Cumulative_Yearly_Sales
        FROM orders
        GROUP BY Year, Quarter WITH ROLLUP
    """
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)

    try:
        cursor.execute(query)
        results = cursor.fetchall()
        return jsonify(results), 200
    except Error as e:
        print(f"Error fetching seasonal sales analysis data: {e}")
        return jsonify({"message": "Error fetching seasonal sales analysis data", "error": str(e)}), 500
    finally:
        cursor.close()
        connection.close()

# API: Customer Purchase Frequency Distribution
@app.route('/analytics/purchase-frequency', methods=['GET'])
def purchase_frequency():
    query = """
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
        ORDER BY MIN(OrderCount)
    """
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)

    try:
        cursor.execute(query)
        results = cursor.fetchall()
        print('Purchase Frequency Query Results:', results)  # Log the results
        return jsonify(results), 200
    except Error as e:
        print(f"Error fetching purchase frequency data: {e}")
        return jsonify({"message": "Error fetching purchase frequency data", "error": str(e)}), 500
    finally:
        cursor.close()
        connection.close()

# API: Auto-completion search
@app.route('/autocomplete', methods=['GET'])
def autocomplete():
    search_term = request.args.get('q')  # Get the search term from the query parameters

    if not search_term:
        return jsonify({"message": "Search term is required"}), 400

    query = """
        SELECT id, name 
        FROM products 
        WHERE name LIKE %s 
        LIMIT 10
    """
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)

    try:
        cursor.execute(query, (f"%{search_term}%",))
        results = cursor.fetchall()
        return jsonify(results), 200
    except Error as e:
        print(f"Error fetching autocomplete suggestions: {e}")
        return jsonify({"message": "Error fetching autocomplete suggestions", "error": str(e)}), 500
    finally:
        cursor.close()
        connection.close()

# Start the server
if __name__ == '__main__':
    app.run(port=3001, debug=True)
