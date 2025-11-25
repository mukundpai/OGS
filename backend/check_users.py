import sqlite3
import os

def check_users():
    basedir = os.path.abspath(os.path.dirname(__file__))
    db_path = os.path.join(basedir, 'oglabs.db')
    print(f"Checking database at: {db_path}")

    if not os.path.exists(db_path):
        print(f"Database not found at {db_path}")
        return

    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    try:
        # Check if user table exists
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='user'")
        if not cursor.fetchone():
            print("User table does not exist.")
            return

        cursor.execute("SELECT count(*) FROM user")
        count = cursor.fetchone()[0]
        print(f"\nTotal registered users: {count}")
        
        if count > 0:
            print("\nUser List:")
            print("-" * 50)
            cursor.execute("SELECT id, email, full_name, is_super_user FROM user")
            users = cursor.fetchall()
            for u in users:
                role = "ADMIN" if u[3] else "User"
                print(f"ID {u[0]}: {u[1]} | {u[2]} | [{role}]")
            print("-" * 50)
            
    except Exception as e:
        print(f"Error querying database: {e}")
    finally:
        conn.close()

if __name__ == "__main__":
    check_users()
