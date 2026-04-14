# main.py
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
CORS(app) 

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

# ==================== HEALTH CHECK ====================

@app.route('/')
def home():
    """Health check endpoint"""
    return jsonify({
        'status': 'online',
        'message': 'FleetHQ API is running',
        'version': '1.0',
        'timestamp': datetime.now().isoformat()
    })

@app.route('/api/health')
def health_check():
    """Detailed health check with database connection test"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute('SELECT 1')
        cursor.close()
        conn.close()
        
        return jsonify({
            'status': 'healthy',
            'database': 'connected',
            'timestamp': datetime.now().isoformat()
        })
    except Exception as e:
        return jsonify({
            'status': 'unhealthy',
            'database': 'disconnected',
            'error': str(e),
            'timestamp': datetime.now().isoformat()
        }), 500

# ==================== TRUCKS API ====================

@app.route('/api/trucks', methods=['GET'])
def get_trucks():
    """Get all trucks"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        
        cursor.execute("""
            SELECT truck_id, truck_name, cuisine_type, status, license_plate, 
                   created_at, updated_at
            FROM FoodTrucks
            ORDER BY truck_id
        """)
        
        trucks = cursor.fetchall()
        cursor.close()
        conn.close()
        
        return jsonify(trucks)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/trucks/<int:truck_id>', methods=['GET'])
def get_truck(truck_id):
    """Get a specific truck by ID"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        
        cursor.execute("""
            SELECT truck_id, truck_name, cuisine_type, status, license_plate,
                   created_at, updated_at
            FROM FoodTrucks
            WHERE truck_id = %s
        """, (truck_id,))
        
        truck = cursor.fetchone()
        cursor.close()
        conn.close()
        
        if truck:
            return jsonify(truck)
        else:
            return jsonify({'error': 'Truck not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/trucks', methods=['POST'])
def create_truck():
    """Create a new truck"""
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['truck_name', 'cuisine_type', 'license_plate']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'Missing required field: {field}'}), 400
        
        conn = get_db_connection()
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        
        cursor.execute("""
            INSERT INTO FoodTrucks (truck_name, cuisine_type, status, license_plate)
            VALUES (%s, %s, %s, %s)
            RETURNING truck_id, truck_name, cuisine_type, status, license_plate, created_at
        """, (
            data['truck_name'],
            data['cuisine_type'],
            data.get('status', 'Active'),
            data['license_plate']
        ))
        
        new_truck = cursor.fetchone()
        conn.commit()
        cursor.close()
        conn.close()
        
        return jsonify(new_truck), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/trucks/<int:truck_id>', methods=['PUT'])
def update_truck(truck_id):
    """Update an existing truck"""
    try:
        data = request.get_json()
        
        conn = get_db_connection()
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        
        # Build dynamic update query
        update_fields = []
        values = []
        
        if 'truck_name' in data:
            update_fields.append('truck_name = %s')
            values.append(data['truck_name'])
        if 'cuisine_type' in data:
            update_fields.append('cuisine_type = %s')
            values.append(data['cuisine_type'])
        if 'status' in data:
            update_fields.append('status = %s')
            values.append(data['status'])
        if 'license_plate' in data:
            update_fields.append('license_plate = %s')
            values.append(data['license_plate'])
        
        update_fields.append('updated_at = CURRENT_TIMESTAMP')
        values.append(truck_id)
        
        query = f"""
            UPDATE FoodTrucks
            SET {', '.join(update_fields)}
            WHERE truck_id = %s
            RETURNING truck_id, truck_name, cuisine_type, status, license_plate, updated_at
        """
        
        cursor.execute(query, values)
        updated_truck = cursor.fetchone()
        conn.commit()
        cursor.close()
        conn.close()
        
        if updated_truck:
            return jsonify(updated_truck)
        else:
            return jsonify({'error': 'Truck not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/trucks/<int:truck_id>', methods=['DELETE'])
def delete_truck(truck_id):
    """Delete a truck"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        cursor.execute("""
            DELETE FROM FoodTrucks
            WHERE truck_id = %s
        """, (truck_id,))
        
        deleted_count = cursor.rowcount
        conn.commit()
        cursor.close()
        conn.close()
        
        if deleted_count > 0:
            return jsonify({'message': 'Truck deleted successfully'}), 200
        else:
            return jsonify({'error': 'Truck not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# ==================== DASHBOARD STATS ====================

@app.route('/api/dashboard/stats', methods=['GET'])
def get_dashboard_stats():
    """Get dashboard statistics"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        
        # Get truck counts
        cursor.execute("""
            SELECT 
                COUNT(*) as total_trucks,
                COUNT(*) FILTER (WHERE status = 'Active') as active_trucks,
                COUNT(*) FILTER (WHERE status = 'Inactive') as inactive_trucks
            FROM FoodTrucks
        """)
        truck_stats = cursor.fetchone()
        
        # Get order counts (if Orders table exists)
        try:
            cursor.execute("""
                SELECT 
                    COUNT(*) as total_orders,
                    COUNT(*) FILTER (WHERE order_status = 'Pending') as pending_orders,
                    COUNT(*) FILTER (WHERE order_status = 'Completed') as completed_orders,
                    COALESCE(SUM(total_amount), 0) as total_revenue,
                    COUNT(*) FILTER (WHERE DATE(order_time) = CURRENT_DATE) as today_orders
                FROM Orders
            """)
            order_stats = cursor.fetchone()
        except:
            order_stats = {
                'total_orders': 0,
                'pending_orders': 0,
                'completed_orders': 0,
                'total_revenue': 0,
                'today_orders': 0
            }
        
        # Get customer count (if Customers table exists)
        try:
            cursor.execute("SELECT COUNT(*) as total_customers FROM Customers")
            customer_stats = cursor.fetchone()
        except:
            customer_stats = {'total_customers': 0}
        
        cursor.close()
        conn.close()
        
        # Combine all stats
        stats = {
            **truck_stats,
            **order_stats,
            **customer_stats
        }
        
        return jsonify(stats)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# ==================== ERROR HANDLERS ====================

@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Endpoint not found'}), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({'error': 'Internal server error'}), 500

# ==================== RUN APPLICATION ====================

if __name__ == '__main__':
    # For local development
    app.run(host='0.0.0.0', port=8080, debug=True)