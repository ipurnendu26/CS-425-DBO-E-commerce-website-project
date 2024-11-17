SELECT * FROM project.customerorder;
ALTER TABLE CustomerOrder MODIFY COLUMN userName VARCHAR(255);

DESCRIBE CustomerOrder;
SELECT id FROM orders WHERE id = <orderId>;

ALTER TABLE CustomerOrder MODIFY COLUMN userName VARCHAR(255);

ALTER TABLE customerorder 
ADD COLUMN orderid INT NOT NULL AUTO_INCREMENT PRIMARY KEY;
ALTER TABLE customerorder MODIFY COLUMN id INT NOT NULL AUTO_INCREMENT PRIMARY KEY;

ALTER TABLE customerorder 
MODIFY COLUMN orderid INT NOT NULL AUTO_INCREMENT PRIMARY KEY;

ALTER TABLE CustomerOrder MODIFY COLUMN creditCardNo VARCHAR(16);



SELECT id, name, total_price, delivery_method, status, delivery_date 
FROM orders 
WHERE user_id = 7;
