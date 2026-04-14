/* ================================================================
Query 1
English:
Which menu item was most popular across all locations?
Phase 2 Step 7 Query 2.
Expected output:
DISH_ID | DISH_NAME   | TRUCK_NAME | TOTAL_QTY_SOLD
1       | Street Taco | Taco Loco  | 4
*/
WITH dish_totals AS (
    SELECT
        d.DISH_ID,
        d.DISH_NAME,
        ft.TRUCK_NAME,
        SUM(oi.QUANTITY) AS TOTAL_QTY_SOLD
    FROM ORDER_ITEM oi
    JOIN ORDERS o
        ON oi.ORDER_ID = o.ORDER_ID
    JOIN DISH d
        ON oi.DISH_ID = d.DISH_ID
    JOIN MENU m
        ON d.MENU_ID = m.MENU_ID
    JOIN FOOD_TRUCK ft
        ON m.TRUCK_ID = ft.TRUCK_ID
    WHERE o.STATUS <> 'Cancelled'
    GROUP BY d.DISH_ID, d.DISH_NAME, ft.TRUCK_NAME
),
max_qty AS (
    SELECT MAX(TOTAL_QTY_SOLD) AS TOP_QTY
    FROM dish_totals
)
SELECT
    dt.DISH_ID,
    dt.DISH_NAME,
    dt.TRUCK_NAME,
    dt.TOTAL_QTY_SOLD
FROM dish_totals dt
JOIN max_qty mq
    ON dt.TOTAL_QTY_SOLD = mq.TOP_QTY
ORDER BY dt.DISH_NAME;

/* ================================================================
Query 2
English:
What are the average daily sales for each day of the week?
Phase 2 Step 7 Query 9.
Expected output:
DAY_NAME | DAY_COUNT | AVG_DAILY_SALES
Friday   | 1         | 33.47
Tuesday  | 1         | 32.97
Saturday | 1         | 32.48
Sunday   | 1         | 15.99
Monday   | 1         | 14.99
*/
WITH daily_totals AS (
    SELECT
        o.ORDER_DATE,
        TRIM(TO_CHAR(o.ORDER_DATE, 'Day')) AS DAY_NAME,
        SUM(o.TOTAL_AMOUNT) AS DAILY_TOTAL
    FROM ORDERS o
    WHERE o.STATUS <> 'Cancelled'
    GROUP BY o.ORDER_DATE, TRIM(TO_CHAR(o.ORDER_DATE, 'Day'))
)
SELECT
    dt.DAY_NAME,
    COUNT(*) AS DAY_COUNT,
    ROUND(AVG(dt.DAILY_TOTAL), 2) AS AVG_DAILY_SALES
FROM daily_totals dt
GROUP BY dt.DAY_NAME
HAVING COUNT(*) >= 1
ORDER BY AVG_DAILY_SALES DESC, dt.DAY_NAME ASC;

/* ================================================================
Query 3
English:
Which locations received the least amount of customers?
Phase 2 Step 7 Query 7.
Expected output:
LOCATION_ID | LOCATION_ADDRESS             | CUSTOMER_COUNT
5           | 500 Fair Way, San Jose, CA   | 0
8           | 800 Stadium Ln, San Jose, CA | 0
*/
SELECT
    x.LOCATION_ID,
    x.LOCATION_ADDRESS,
    x.CUSTOMER_COUNT
FROM (
    SELECT
        l.LOCATION_ID,
        l.LOCATION_ADDRESS,
        COUNT(DISTINCT o.CUSTOMER_ID) AS CUSTOMER_COUNT
    FROM LOCATION l
    LEFT JOIN SCHEDULE s
        ON l.LOCATION_ID = s.LOCATION_ID
    LEFT JOIN ORDERS o
        ON s.TRUCK_ID = o.TRUCK_ID
       AND s.SCHED_DATE = o.ORDER_DATE
       AND o.STATUS <> 'Cancelled'
    GROUP BY l.LOCATION_ID, l.LOCATION_ADDRESS
) AS x
WHERE x.CUSTOMER_COUNT = (
    SELECT MIN(y.CUSTOMER_COUNT)
    FROM (
        SELECT
            l2.LOCATION_ID,
            COUNT(DISTINCT o2.CUSTOMER_ID) AS CUSTOMER_COUNT
        FROM LOCATION l2
        LEFT JOIN SCHEDULE s2
            ON l2.LOCATION_ID = s2.LOCATION_ID
        LEFT JOIN ORDERS o2
            ON s2.TRUCK_ID = o2.TRUCK_ID
           AND s2.SCHED_DATE = o2.ORDER_DATE
           AND o2.STATUS <> 'Cancelled'
        GROUP BY l2.LOCATION_ID
    ) AS y
)
ORDER BY x.LOCATION_ID;

/* ================================================================
Query 4
English:
Which items are frequently sold together?
Phase 2 Step 7 Query 10.
Expected output:
ITEM_1               | ITEM_2              | FREQUENCY
Beef Pho             | Chicken Pho         | 1
Chicken Tikka Masala | Vegetable Curry     | 1
Classic Burger       | Bacon Cheeseburger  | 1
Street Taco          | Burrito Bowl        | 1
*/
SELECT
    d1.DISH_NAME AS ITEM_1,
    d2.DISH_NAME AS ITEM_2,
    COUNT(*) AS FREQUENCY
FROM ORDER_ITEM oi1
JOIN ORDER_ITEM oi2
    ON oi1.ORDER_ID = oi2.ORDER_ID
   AND oi1.DISH_ID < oi2.DISH_ID
JOIN ORDERS o
    ON oi1.ORDER_ID = o.ORDER_ID
JOIN DISH d1
    ON oi1.DISH_ID = d1.DISH_ID
JOIN DISH d2
    ON oi2.DISH_ID = d2.DISH_ID
WHERE o.STATUS = 'Completed'
GROUP BY d1.DISH_NAME, d2.DISH_NAME
HAVING COUNT(*) >= 1
ORDER BY FREQUENCY DESC, ITEM_1, ITEM_2;

/* ================================================================
Query 5
English:
Which ingredients are low-stock across the fleet?
Phase 2 Step 7 Query 8.
Expected output:
TRUCK_NAME   | INGREDIENT_NAME | QUANTITY
Gyro Galaxy  | Pita Bread      | 6.00
Burger Barn  | Cheese          | 8.00
Pho King     | Broth           | 9.00
*/
SELECT
    ft.TRUCK_NAME,
    i.INGREDIENT_NAME,
    inv.QUANTITY
FROM INVENTORY inv
JOIN FOOD_TRUCK ft
    ON inv.TRUCK_ID = ft.TRUCK_ID
JOIN INGREDIENT i
    ON inv.INGREDIENT_ID = i.INGREDIENT_ID
WHERE inv.QUANTITY < 10
ORDER BY inv.QUANTITY ASC, ft.TRUCK_NAME ASC;

/* ================================================================
Query 6
English:
List all upcoming events in the next two weeks with truck bookings,
including event details and assigned trucks.
Phase 2 Step 7 Query 12.
Expected output as of 2026-04-10:
EVENT_NAME   | EVENT_DATE  | LOCATION_ADDRESS                | TRUCK_NAME
Summer Fest  | 2026-04-12  | 500 Fair Way, San Jose, CA      | Taco Loco
Food Expo    | 2026-04-15  | 800 Stadium Ln, San Jose, CA    | Burger Barn
Tech Picnic  | 2026-04-18  | 600 Campus Dr, Santa Clara, CA  | Curry Express
Night Market | 2026-04-22  | 100 Main St, San Jose, CA       | Gyro Galaxy
*/
SELECT
    e.EVENT_NAME,
    e.EVENT_DATE,
    l.LOCATION_ADDRESS,
    ft.TRUCK_NAME
FROM EVENT e
JOIN EVENT_BOOKING eb
    ON e.EVENT_ID = eb.EVENT_ID
JOIN FOOD_TRUCK ft
    ON eb.TRUCK_ID = ft.TRUCK_ID
JOIN LOCATION l
    ON e.EVENT_LOCATION = l.LOCATION_ID
WHERE e.EVENT_DATE BETWEEN CURRENT_DATE AND (CURRENT_DATE + INTERVAL '14 days')
ORDER BY e.EVENT_DATE, e.EVENT_NAME, ft.TRUCK_NAME;

/* ================================================================
Query 7
English:
What is the complete weekly schedule for all currently active trucks,
showing which truck will be at which location for each time slot?
Phase 2 Step 7 Query 13.
Expected output as of 2026-04-10:
TRUCK_NAME   | LOCATION_ADDRESS               | SCHED_DATE  | STARTTIME | ENDTIME
Taco Loco    | 100 Main St, San Jose, CA      | 2026-04-10  | 08:00:00  | 14:00:00
Burger Barn  | 200 Market Rd, Santa Clara, CA | 2026-04-10  | 10:00:00  | 16:00:00
Pho King     | 300 Park Ave, Milpitas, CA     | 2026-04-11  | 09:00:00  | 15:00:00
Gyro Galaxy  | 600 Campus Dr, Santa Clara, CA | 2026-04-12  | 12:00:00  | 18:00:00
BBQ Bandits  | 700 River Rd, Alviso, CA       | 2026-04-13  | 07:00:00  | 13:00:00
Burger Barn  | 300 Park Ave, Milpitas, CA     | 2026-04-14  | 09:00:00  | 15:00:00
Taco Loco    | 200 Market Rd, Santa Clara, CA | 2026-04-14  | 14:00:00  | 20:00:00
*/
SELECT
    ft.TRUCK_NAME,
    l.LOCATION_ADDRESS,
    s.SCHED_DATE,
    s.STARTTIME,
    s.ENDTIME
FROM SCHEDULE s
JOIN FOOD_TRUCK ft
    ON s.TRUCK_ID = ft.TRUCK_ID
JOIN LOCATION l
    ON s.LOCATION_ID = l.LOCATION_ID
WHERE s.SCHED_DATE BETWEEN CURRENT_DATE AND (CURRENT_DATE + INTERVAL '7 days')
  AND ft.STATUS = 'Active'
ORDER BY s.SCHED_DATE, s.STARTTIME, ft.TRUCK_NAME;

/* ================================================================
Query 8
English:
What menu items are available from Taco Loco at its current location right now?
Phase 2 Step 7 Query 14.
Expected output when run on 2026-04-10 between 08:00:00 and 14:00:00:
TRUCK_NAME | LOCATION_ADDRESS           | DISH_NAME       | PRICE
Taco Loco  | 100 Main St, San Jose, CA  | Al Pastor Taco  | 4.25
Taco Loco  | 100 Main St, San Jose, CA  | Burrito Bowl    | 8.99
Taco Loco  | 100 Main St, San Jose, CA  | Quesadilla      | 6.50
Taco Loco  | 100 Main St, San Jose, CA  | Street Taco     | 3.50
*/
SELECT
    ft.TRUCK_NAME,
    l.LOCATION_ADDRESS,
    v.DISH_NAME,
    v.PRICE
FROM FOOD_TRUCK ft
JOIN SCHEDULE s
    ON ft.TRUCK_ID = s.TRUCK_ID
JOIN LOCATION l
    ON s.LOCATION_ID = l.LOCATION_ID
JOIN v_active_menu_items v
    ON ft.TRUCK_ID = v.TRUCK_ID
WHERE ft.TRUCK_NAME = 'Taco Loco'
  AND s.SCHED_DATE = CURRENT_DATE
  AND CURRENT_TIME BETWEEN s.STARTTIME AND s.ENDTIME
ORDER BY v.DISH_NAME;
