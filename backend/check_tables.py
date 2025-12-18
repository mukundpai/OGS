import sqlite3
import os

def check_tables():
    basedir = os.path.abspath(os.path.dirname(__file__))
    db_path = os.path.join(basedir, 'oglabs.db')
    print(f"Checking database at: {db_path}")

    if not os.path.exists(db_path):
        print(f"Database not found at {db_path}")
        return

    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    try:
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table'")
        tables = cursor.fetchall()
        
        if tables:
            print("\nTables found:")
            print("-" * 20)
            for table in tables:
                print(f"- {table[0]}")
                
                # If product table exists, count items
                if table[0] == 'product':
                    cursor.execute("SELECT count(*) FROM product")
                    count = cursor.fetchone()[0]
                    print(f"  (Contains {count} products)")
            print("-" * 20)
        else:
            print("\nNo tables found in the database.")
            
    except Exception as e:
        print(f"Error querying database: {e}")
    finally:
        conn.close()

if __name__ == "__main__":
    check_tables()
