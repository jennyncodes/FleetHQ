# Flask backend for FleetHQ Food Truck Management System

from flask import Flask, request, jsonify
from flask_cors import CORS
import psycopg2
from psycopg2.extras import RealDictCursor
import os
from datetime import datetime
from dotenv import load_dotenv
load_dotenv()

app = Flask(__name__)
CORS(app)  # Enable CORS for React frontend

# Database connection configuration
DB_CONFIG = {
    'host': os.environ.get('DB_HOST'),
    'database': os.environ.get('DB_NAME'),
    'user': os.environ.get('DB_USER'),
    'password': os.environ.get('DB_PASSWORD'),
    'sslmode': 'require'
}

def get_db_connection():
    """Create and return a database connection"""
    try:
        conn = psycopg2.connect(**DB_CONFIG)
        return conn
    except Exception as e:
        print(f"Database connection error: {e}")
        raise

# Health check endpoint
@app.route('/')
def home():
    return jsonify({"status": "FleetHQ Backend is running"}), 200
 
@app.route('/api/health')
def health_check():
    """Check database connectivity"""
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute('SELECT 1')
        cur.close()
        conn.close()
        return jsonify({"status": "healthy", "database": "connected"}), 200
    except Exception as e:
        return jsonify({"status": "unhealthy", "error": str(e)}), 500
 
# ==================== DASHBOARD ENDPOINT ====================
 
@app.route('/api/dashboard/stats', methods=['GET'])
def get_dashboard_stats():
    """Get comprehensive dashboard statistics"""
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        
        stats = {}
        
        # 1. Total Trucks
        cur.execute("SELECT COUNT(*) FROM food_truck")
        stats['total_trucks'] = cur.fetchone()[0]
        
        # 2. Active Trucks
        cur.execute("SELECT COUNT(*) FROM food_truck WHERE status = 'Active'")
        stats['active_trucks'] = cur.fetchone()[0]
        
        # 3. Total Orders
        cur.execute("SELECT COUNT(*) FROM orders")
        stats['total_orders'] = cur.fetchone()[0]
        
        # 4. Total Revenue - using exact enum value 'Completed'
        cur.execute("""
            SELECT COALESCE(SUM(total_amount), 0) 
            FROM orders 
            WHERE status = 'Completed'
        """)
        stats['total_revenue'] = float(cur.fetchone()[0])
        
        # 5. Pending Orders - using exact enum value 'Pending'
        cur.execute("""
            SELECT COUNT(*) 
            FROM orders 
            WHERE status = 'Pending'
        """)
        stats['pending_orders'] = cur.fetchone()[0]
        
        # 6. Total Customers
        cur.execute("SELECT COUNT(*) FROM customer")
        stats['total_customers'] = cur.fetchone()[0]
        
        # 7. Today's Orders
        cur.execute("SELECT COUNT(*) FROM orders WHERE order_date = CURRENT_DATE")
        stats['todays_orders'] = cur.fetchone()[0]
        
        # 8. Completed Orders - using exact enum value 'Completed'
        cur.execute("""
            SELECT COUNT(*) 
            FROM orders 
            WHERE status = 'Completed'
        """)
        stats['completed_orders'] = cur.fetchone()[0]
        
        # 9. Recent Activity - last 5 orders with details
        # Using email instead of customer_name since customer table has no name column
        cur.execute("""
            SELECT 
                o.order_id,
                o.order_date,
                CAST(o.status AS TEXT) as status,
                o.total_amount,
                c.email as customer_email,
                f.truck_name
            FROM orders o
            JOIN customer c ON o.customer_id = c.customer_id
            JOIN food_truck f ON o.truck_id = f.truck_id
            ORDER BY o.order_date DESC
            LIMIT 5
        """)
        
        recent_orders = []
        for row in cur.fetchall():
            recent_orders.append({
                'order_id': row[0],
                'order_date': row[1].isoformat() if row[1] else None,
                'order_status': row[2],
                'total_amount': float(row[3]),
                'customer_name': row[4],  # This is actually email, but frontend expects customer_name
                'truck_name': row[5]
            })
        
        stats['recent_activity'] = recent_orders
        
        cur.close()
        conn.close()
        
        return jsonify(stats), 200
        
    except Exception as e:
        print(f"Error fetching dashboard stats: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500
 
# ==================== TRUCKS ENDPOINTS ====================
 
@app.route('/api/trucks', methods=['GET'])
def get_trucks():
    """Get all trucks - only selecting columns that exist"""
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        
        # Only select columns that actually exist in food_truck table
        cur.execute("""
            SELECT truck_id, truck_name, cuisine_type, 
                   CAST(status AS TEXT) as status, license_plate
            FROM food_truck
            ORDER BY truck_id
        """)
        
        trucks = []
        for row in cur.fetchall():
            trucks.append({
                'truck_id': row[0],
                'truck_name': row[1],
                'cuisine_type': row[2],
                'status': row[3],
                'license_plate': row[4]
            })
        
        cur.close()
        conn.close()
        
        return jsonify(trucks), 200
        
    except Exception as e:
        print(f"Error fetching trucks: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500
 
@app.route('/api/trucks/<int:truck_id>', methods=['GET'])
def get_truck(truck_id):
    """Get a specific truck by ID"""
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        
        cur.execute("""
            SELECT truck_id, truck_name, cuisine_type, 
                   CAST(status AS TEXT) as status, license_plate
            FROM food_truck
            WHERE truck_id = %s
        """, (truck_id,))
        
        row = cur.fetchone()
        
        if row:
            truck = {
                'truck_id': row[0],
                'truck_name': row[1],
                'cuisine_type': row[2],
                'status': row[3],
                'license_plate': row[4]
            }
            cur.close()
            conn.close()
            return jsonify(truck), 200
        else:
            cur.close()
            conn.close()
            return jsonify({"error": "Truck not found"}), 404
            
    except Exception as e:
        print(f"Error fetching truck: {e}")
        return jsonify({"error": str(e)}), 500
 
@app.route('/api/trucks', methods=['POST'])
def create_truck():
    """Create a new truck"""
    try:
        data = request.get_json()
        
        conn = get_db_connection()
        cur = conn.cursor()
        
        # Only insert columns that exist
        cur.execute("""
            INSERT INTO food_truck (truck_name, cuisine_type, status, license_plate)
            VALUES (%s, %s, %s, %s)
            RETURNING truck_id
        """, (
            data.get('truck_name'),
            data.get('cuisine_type'),
            data.get('status', 'Active'),
            data.get('license_plate')
        ))
        
        truck_id = cur.fetchone()[0]
        conn.commit()
        
        cur.close()
        conn.close()
        
        return jsonify({"message": "Truck created successfully", "truck_id": truck_id}), 201
        
    except Exception as e:
        print(f"Error creating truck: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500
 
@app.route('/api/trucks/<int:truck_id>', methods=['PUT'])
def update_truck(truck_id):
    """Update an existing truck"""
    try:
        data = request.get_json()
        
        conn = get_db_connection()
        cur = conn.cursor()
        
        # Only update columns that exist
        cur.execute("""
            UPDATE food_truck
            SET truck_name = %s,
                cuisine_type = %s,
                status = %s,
                license_plate = %s
            WHERE truck_id = %s
        """, (
            data.get('truck_name'),
            data.get('cuisine_type'),
            data.get('status'),
            data.get('license_plate'),
            truck_id
        ))
        
        conn.commit()
        
        cur.close()
        conn.close()
        
        return jsonify({"message": "Truck updated successfully"}), 200
        
    except Exception as e:
        print(f"Error updating truck: {e}")
        return jsonify({"error": str(e)}), 500
 
@app.route('/api/trucks/<int:truck_id>', methods=['DELETE'])
def delete_truck(truck_id):
    """Delete a truck"""
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        
        cur.execute("DELETE FROM food_truck WHERE truck_id = %s", (truck_id,))
        
        conn.commit()
        
        cur.close()
        conn.close()
        
        return jsonify({"message": "Truck deleted successfully"}), 200
        
    except Exception as e:
        print(f"Error deleting truck: {e}")
        return jsonify({"error": str(e)}), 500
 
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080, debug=True)
 