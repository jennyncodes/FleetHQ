-- =========================
-- FOOD_TRUCK
-- =========================
INSERT INTO FOOD_TRUCK (TRUCK_NAME, CUISINE_TYPE, STATUS, LICENSE_PLATE) VALUES
('Taco Loco',      'Mexican',    'Active',   'ABC1234'),
('Burger Barn',    'American',   'Active',   'XYZ5678'),
('Pho King',       'Vietnamese', 'Active',   'LMN9012'),
('Curry Express',  'Indian',     'Active',   'QRS3456'),
('Wok & Roll',     'Chinese',    'Inactive', 'DEF7890'),
('Gyro Galaxy',    'Greek',      'Active',   'GHI2345'),
('BBQ Bandits',    'American',   'Active',   'JKL6789'),
('Sushi Shuttle',  'Japanese',   'Inactive', 'MNO0123');

-- =========================
-- LOCATION
-- =========================
INSERT INTO LOCATION (LOCATION_ADDRESS, ZONE_TYPE, GPS_LAT, GPS_LONG) VALUES
('100 Main St, San Jose, CA',      'Downtown', 37.338200, -121.886300),
('200 Market Rd, Santa Clara, CA', 'Suburb',   37.354100, -121.955200),
('300 Park Ave, Milpitas, CA',     'Park',     37.432300, -121.899600),
('400 Tech Blvd, Sunnyvale, CA',   'Business', 37.368800, -122.036300),
('500 Fair Way, San Jose, CA',     'Event',    37.300000, -121.850000),
('600 Campus Dr, Santa Clara, CA', 'Business', 37.349600, -121.954000),
('700 River Rd, Alviso, CA',       'Park',     37.427100, -121.968600),
('800 Stadium Ln, San Jose, CA',   'Event',    37.331800, -121.900800);

-- =========================
-- CUSTOMER
-- =========================
INSERT INTO CUSTOMER (CUST_ADDRESS, EMAIL, PHONE) VALUES
('12 Elm St, San Jose, CA',      'alice@email.com', '4081112222'),
('34 Oak Ave, Sunnyvale, CA',    'bob@email.com',   '4082223333'),
('56 Pine Rd, Santa Clara, CA',  'carol@email.com', '4083334444'),
('78 Maple Dr, Milpitas, CA',    'dan@email.com',   '4084445555'),
('90 Cedar Ln, San Jose, CA',    'eva@email.com',   '4085556666'),
('11 Birch Ct, Alviso, CA',      'frank@email.com', '4086667777'),
('22 Walnut St, San Jose, CA',   'grace@email.com', '4087778888'),
('33 Spruce Ave, Sunnyvale, CA', 'henry@email.com', '4088889999');

-- =========================
-- EMPLOYEE / MANAGER / DRIVER
-- =========================
INSERT INTO EMPLOYEE (FNAME, LNAME, TRUCK_ID) VALUES
('Carlos', 'Rivera',  1),
('Diana',  'Chen',    2),
('Marcus', 'Webb',    3),
('Priya',  'Patel',   4),
('Jake',   'Torres',  5),
('Sofia',  'Kim',     6),
('Trevor', 'Nguyen',  7),
('Aisha',  'Okafor',  8),
('Logan',  'Murphy',  1),
('Mei',    'Zhang',   2);

INSERT INTO MANAGER (EMPLOYEE_ID) VALUES
(1), (2), (3);

INSERT INTO DRIVER (EMPLOYEE_ID, LICENSE_NUM) VALUES
(5,  'DL-CA-100234'),
(7,  'DL-CA-200456'),
(9,  'DL-CA-300678'),
(10, 'DL-CA-400890');

-- =========================
-- SCHEDULE
-- =========================
INSERT INTO SCHEDULE (TRUCK_ID, LOCATION_ID, STARTTIME, ENDTIME, SCHED_DATE, ASSIGNED_BY) VALUES
(1, 1, '08:00:00', '14:00:00', '2026-04-10', 1),
(2, 2, '10:00:00', '16:00:00', '2026-04-10', 2),
(3, 3, '09:00:00', '15:00:00', '2026-04-11', 1),
(4, 4, '11:00:00', '17:00:00', '2026-04-11', 3),
(5, 5, '08:00:00', '13:00:00', '2026-04-12', 2),
(6, 6, '12:00:00', '18:00:00', '2026-04-12', 1),
(7, 7, '07:00:00', '13:00:00', '2026-04-13', 3),
(8, 8, '10:00:00', '16:00:00', '2026-04-13', 2),
(1, 2, '14:00:00', '20:00:00', '2026-04-14', 1),
(2, 3, '09:00:00', '15:00:00', '2026-04-14', 3);

-- =========================
-- MENU / DISH
-- =========================
INSERT INTO MENU (TRUCK_ID, MENU_NAME, IS_ACTIVE) VALUES
(1, 'Taco Loco Main Menu',     TRUE),
(1, 'Taco Loco Specials',      TRUE),
(2, 'Burger Barn Classic',     TRUE),
(3, 'Pho King Noodles',        TRUE),
(4, 'Curry Express Mains',     TRUE),
(5, 'Wok & Roll Stir Fry',     FALSE),
(6, 'Gyro Galaxy Street Food', TRUE),
(7, 'BBQ Bandits Smokehouse',  TRUE);

INSERT INTO DISH (MENU_ID, DISH_NAME, PRICE, IS_AVAILABLE) VALUES
(1, 'Street Taco',           3.50,  TRUE),
(1, 'Burrito Bowl',          8.99,  TRUE),
(1, 'Quesadilla',            6.50,  TRUE),
(2, 'Al Pastor Taco',        4.25,  TRUE),
(3, 'Classic Burger',        7.99,  TRUE),
(3, 'Bacon Cheeseburger',    9.49,  TRUE),
(4, 'Beef Pho',             10.99,  TRUE),
(4, 'Chicken Pho',           9.99,  TRUE),
(5, 'Chicken Tikka Masala', 11.99,  TRUE),
(5, 'Vegetable Curry',       9.50,  TRUE),
(7, 'Classic Gyro',          8.99,  TRUE),
(8, 'Smoked Brisket Plate', 14.99,  TRUE);

-- =========================
-- INGREDIENT / DISH_INGREDIENT / INVENTORY
-- =========================
INSERT INTO INGREDIENT (INGREDIENT_NAME, UNIT, PER_COST) VALUES
('Tortilla',   'pc', 0.15),
('Beef',       'lb', 4.50),
('Chicken',    'lb', 3.20),
('Rice',       'lb', 0.80),
('Onion',      'lb', 0.50),
('Tomato',     'lb', 0.90),
('Cheese',     'lb', 3.00),
('Noodles',    'lb', 1.10),
('Broth',      'qt', 1.50),
('Pita Bread', 'pc', 0.40);

INSERT INTO DISH_INGREDIENT (DISH_ID, INGREDIENT_ID, REQUIRED_QUANTITY) VALUES
(1, 1, 2.00), (1, 2, 0.20), (1, 5, 0.05),
(2, 3, 0.25), (2, 4, 0.30), (2, 6, 0.10),
(3, 1, 1.00), (3, 7, 0.15),
(4, 1, 2.00), (4, 2, 0.20), (4, 6, 0.08),
(5, 2, 0.25), (5, 7, 0.10), (5, 6, 0.10),
(6, 2, 0.33), (6, 7, 0.15),
(7, 2, 0.30), (7, 8, 0.20), (7, 9, 0.50),
(8, 3, 0.25), (8, 8, 0.20), (8, 9, 0.50),
(9, 3, 0.35), (9, 5, 0.10),
(10, 3, 0.25), (10, 5, 0.12), (10, 6, 0.12),
(11, 10, 1.00), (11, 2, 0.20), (11, 5, 0.05),
(12, 2, 0.50), (12, 5, 0.10);

INSERT INTO INVENTORY (TRUCK_ID, INGREDIENT_ID, QUANTITY) VALUES
(1, 1, 120.00),
(1, 2,  25.00),
(1, 3,  18.00),
(2, 2,  20.00),
(2, 7,   8.00),
(3, 8,  22.00),
(3, 9,   9.00),
(4, 3,  16.00),
(4, 4,  14.00),
(6, 10,  6.00);

-- =========================
-- ORDERS / ORDER_ITEM
-- =========================
INSERT INTO ORDERS (CUSTOMER_ID, TRUCK_ID, ORDER_DATE, STATUS) VALUES
(1, 1, '2026-04-10', 'Completed'),
(2, 2, '2026-04-10', 'Completed'),
(3, 3, '2026-04-11', 'Completed'),
(4, 4, '2026-04-11', 'Completed'),
(5, 1, '2026-04-12', 'Completed'),
(6, 6, '2026-04-12', 'Pending'),
(7, 7, '2026-04-13', 'Pending'),
(8, 2, '2026-04-13', 'Cancelled'),
(1, 3, '2026-04-14', 'Completed'),
(3, 4, '2026-04-14', 'Pending');

INSERT INTO ORDER_ITEM (ORDER_ID, DISH_ID, QUANTITY) VALUES
(1,  1, 2),
(1,  2, 1),
(2,  5, 1),
(2,  6, 1),
(3,  7, 1),
(4,  9, 1),
(4, 10, 1),
(5,  1, 2),
(6, 11, 1),
(7, 12, 1),
(8,  6, 1),
(9,  7, 1),
(9,  8, 1),
(10, 9, 1);

-- =========================
-- EVENT / EVENT_BOOKING
-- =========================
INSERT INTO EVENT (EVENT_NAME, EVENT_DATE, EVENT_LOCATION) VALUES
('Summer Fest',  '2026-04-12', 5),
('Food Expo',    '2026-04-15', 8),
('Tech Picnic',  '2026-04-18', 6),
('Night Market', '2026-04-22', 1),
('Harvest Fair', '2026-05-20', 3),
('City Block',   '2026-05-28', 2),
('Fall Fiesta',  '2026-06-05', 5),
('Pho Festival', '2026-06-18', 7);

INSERT INTO EVENT_BOOKING (EVENT_ID, TRUCK_ID) VALUES
(1, 1),
(2, 2),
(3, 4),
(4, 6),
(5, 7),
(6, 3),
(7, 1),
(8, 3);

-- =========================
-- Other DML Statements
-- =========================

-- Mark a truck as inactive.
UPDATE FOOD_TRUCK
SET STATUS = 'Inactive'
WHERE TRUCK_ID = 4;

-- Mark a dish as unavailable.
UPDATE DISH
SET IS_AVAILABLE = FALSE
WHERE DISH_ID = 6;
