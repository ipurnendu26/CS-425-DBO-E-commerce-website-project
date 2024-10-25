import mysql.connector
from mysql.connector import Error
from datetime import datetime

class EcommerceDatabase:
    def __init__(self, host='localhost', database='PROJECT', user='root', password='purnenduK@123'):
        """Initialize the database connection and create tables."""
        try:
            self.conn = mysql.connector.connect(
                host=host,
                database=database,
                user=user,
                password=password
            )
            if self.conn.is_connected():
                print("Connected to MySQL database")
                self.cursor = self.conn.cursor()
                self.create_tables()  # Call to create tables upon initialization
        except Error as e:
            print(f"Error: {e}")

    def create_tables(self):
        """Create the necessary tables for the ecommerce database."""
        tables = [
            """
            CREATE TABLE IF NOT EXISTS Customer (
                Customer_ID INT PRIMARY KEY,
                First_Name VARCHAR(50) NOT NULL,
                Last_Name VARCHAR(50) NOT NULL,
                Email VARCHAR(100) UNIQUE NOT NULL,
                Phone_No VARCHAR(20),
                Address VARCHAR(255),
                City VARCHAR(50),
                State VARCHAR(50),
                Country VARCHAR(50),
                Postal_Code VARCHAR(20),
                DOB DATE
            )
            """,
            """
            CREATE TABLE IF NOT EXISTS Category (
                Category_ID INT PRIMARY KEY,
                C_Name VARCHAR(50) NOT NULL,
                Description TEXT
            )
            """,
            """
            CREATE TABLE IF NOT EXISTS Product (
                Product_ID INT PRIMARY KEY,
                P_Name VARCHAR(100) NOT NULL,
                Description TEXT,
                Price DECIMAL(10, 2),
                Stock_Quantity INT,
                Category_ID INT,
                FOREIGN KEY (Category_ID) REFERENCES Category(Category_ID)
            )
            """,
            """
            CREATE TABLE IF NOT EXISTS Orders (
                Order_ID INT PRIMARY KEY,
                Customer_ID INT,
                Order_Date DATE,
                Total_Amount DECIMAL(10, 2),
                FOREIGN KEY (Customer_ID) REFERENCES Customer(Customer_ID)
            )
            """,
            """
            CREATE TABLE IF NOT EXISTS Payments (
                Payment_ID INT PRIMARY KEY,
                Order_ID INT,
                Payment_Method VARCHAR(50) NOT NULL,
                Payment_Amount DECIMAL(10, 2),
                Payment_Status VARCHAR(20),
                Payment_Date DATE,
                FOREIGN KEY (Order_ID) REFERENCES Orders(Order_ID)
            )
            """,
            """
            CREATE TABLE IF NOT EXISTS Shipping (
                Shipping_ID INT PRIMARY KEY,
                Order_ID INT,
                Shipping_Address VARCHAR(255) NOT NULL,
                Shipping_Date DATE,
                Shipping_Method VARCHAR(50),
                Shipping_Status VARCHAR(20),
                FOREIGN KEY (Order_ID) REFERENCES Orders(Order_ID)
            )
            """,
            """
            CREATE TABLE IF NOT EXISTS Shopping_Cart (
                Cart_ID INT PRIMARY KEY,
                Customer_ID INT,
                Add_Date DATE,
                Quantity INT,
                FOREIGN KEY (Customer_ID) REFERENCES Customer(Customer_ID)
            )
            """,
            """
            CREATE TABLE IF NOT EXISTS Reviews (
                Review_ID INT PRIMARY KEY,
                Customer_ID INT,
                Product_ID INT,
                Rating INT,
                Review_Text TEXT,
                Review_Date DATE,
                FOREIGN KEY (Customer_ID) REFERENCES Customer(Customer_ID),
                FOREIGN KEY (Product_ID) REFERENCES Product(Product_ID)
            )
            """
        ]

        # Execute each table creation query
        for table_query in tables:
            self.cursor.execute(table_query)
        self.conn.commit()  # Commit changes to the database

    def create_record(self, table, **kwargs):
        """Insert a new record into the specified table."""
        columns = ', '.join(kwargs.keys())  # Create a comma-separated string of column names
        placeholders = ', '.join(['%s' for _ in kwargs])  # Create placeholders for values
        query = f'INSERT INTO {table} ({columns}) VALUES ({placeholders})'  # Formulate the insert query
        
        try:
            self.cursor.execute(query, list(kwargs.values()))  # Execute the query with values
            self.conn.commit()  # Commit changes
            return self.cursor.lastrowid  # Return the ID of the last inserted record
        except Error as e:
            print(f"Error: {e}")
            return None

    def read_record(self, table, id_column=None, id_value=None):
        """Read records from the specified table. Optionally filter by a specific ID."""
        if id_value:  # If an ID value is provided, fetch that specific record
            query = f'SELECT * FROM {table} WHERE {id_column} = %s'
            self.cursor.execute(query, (id_value,))
            return self.cursor.fetchone()  # Return a single record
        else:  # If no ID value is provided, fetch all records
            query = f'SELECT * FROM {table}'
            self.cursor.execute(query)
            return self.cursor.fetchall()  # Return all records

    def update_record(self, table, id_column, id_value, **kwargs):
        """Update an existing record in the specified table."""
        update_fields = ', '.join([f"{k} = %s" for k in kwargs.keys()])  # Prepare update fields
        query = f'UPDATE {table} SET {update_fields} WHERE {id_column} = %s'  # Formulate the update query
        self.cursor.execute(query, list(kwargs.values()) + [id_value])  # Execute the query with values
        self.conn.commit()  # Commit changes

    def delete_record(self, table, id_column, id_value):
        """Delete a record from the specified table based on its ID."""
        query = f'DELETE FROM {table} WHERE {id_column} = %s'  # Formulate the delete query
        self.cursor.execute(query, (id_value,))  # Execute the delete query
        self.conn.commit()  # Commit changes

    def close(self):
        """Close the database connection."""
        if self.conn.is_connected():
            self.cursor.close()  # Close the cursor
            self.conn.close()  # Close the connection
            print("MySQL connection closed")

def main():
    """Main function to handle user interactions with the ecommerce database."""
    db = EcommerceDatabase()  # Initialize the database connection

    while True:
        print("\nEcommerce Database Operations")
        print("1. Customer")
        print("2. Product")
        print("3. Orders")
        print("4. Payments")
        print("5. Shipping")
        print("6. Shopping Cart")
        print("7. Reviews")
        print("8. Category")
        print("9. Exit")

        choice = input("Enter your choice (1-9): ")

        if choice == '9':  # Exit the loop if the user chooses to exit
            break

        operation = input("Enter operation (create/read/update/delete): ").lower()  # Get the desired operation

        # Map user choices to table names and ID columns
        if choice == '1':
            table = 'Customer'
            id_column = 'Customer_ID'
        elif choice == '2':
            table = 'Product'
            id_column = 'Product_ID'
        elif choice == '3':
            table = 'Orders'
            id_column = 'Order_ID'
        elif choice == '4':
            table = 'Payments'
            id_column = 'Payment_ID'
        elif choice == '5':
            table = 'Shipping'
            id_column = 'Shipping_ID'
        elif choice == '6':
            table = 'Shopping_Cart'
            id_column = 'Cart_ID'
        elif choice == '7':
            table = 'Reviews'
            id_column = 'Review_ID'
        elif choice == '8':
            table = 'Category'
            id_column = 'Category_ID'
        else:
            print("Invalid choice. Please try again.")  # Handle invalid choices
            continue

        if operation == 'create':
            data = {}
            db.cursor.execute(f"DESCRIBE {table}")  # Get the structure of the table
            columns = db.cursor.fetchall()  # Fetch column details
            for column in columns:  # Ask for all columns, including primary keys
                value = input(f"Enter {column[0]}: ")
                data[column[0]] = value  # Store user input in the data dictionary
            record_id = db.create_record(table, **data)  # Create a new record
            if record_id:
                print(f"Created {table} record with ID: {record_id}")  # Confirmation message
            else:
                print(f" created {table} record")

        elif operation == 'read':
            id_value = input(f"Enter {id_column} (leave blank to read all records): ")
            if id_value:
                record = db.read_record(table, id_column, id_value)  # Fetch a specific record
                print(f"{table} record: {record}")
            else:
                records = db.read_record(table)  # Fetch all records
                print(f"All records in {table}:")
                for record in records:
                    print(record)  # Print each record

        elif operation == 'update':
            id_value = input(f"Enter {id_column}: ")
            data = {}
            db.cursor.execute(f"DESCRIBE {table}")  # Get the structure of the table
            columns = db.cursor.fetchall()  # Fetch column details
            for column in columns:  # Ask for new values for all columns except ID
                value = input(f"Enter new {column[0]} (leave blank to keep current): ")
                if value:  # Only update if a new value is provided
                    data[column[0]] = value
            db.update_record(table, id_column, id_value, **data)  # Update the record
            print(f"Updated {table} record with {id_column}: {id_value}")

        elif operation == 'delete':
            id_value = input(f"Enter {id_column}: ")
            db.delete_record(table, id_column, id_value)  # Delete the specified record
            print(f"Deleted {table} record with {id_column}: {id_value}")

        else:
            print("Invalid operation. Please try again.")  # Handle invalid operations

    db.close()  # Close the database connection

if __name__ == "__main__":
    main()  # Run the main function
