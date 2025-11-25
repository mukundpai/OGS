import sqlite3
import os

# Path to the database
db_path = os.path.join('backend', 'instance', 'oglabs.db')

def add_rating_column():
    if not os.path.exists(db_path):
        print(f"Database not found at {db_path}")
        return

    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    try:
        # Check if column exists
        cursor.execute("PRAGMA table_info(gallery_submission)")
        columns = [info[1] for info in cursor.fetchall()]
        
        if 'rating' not in columns:
            print("Adding 'rating' column to gallery_submission table...")
            cursor.execute("ALTER TABLE gallery_submission ADD COLUMN rating INTEGER DEFAULT 5")
            conn.commit()
            print("Column added successfully.")
        else:
            print("'rating' column already exists.")
            
    except Exception as e:
        print(f"An error occurred: {e}")
    finally:
        conn.close()

if __name__ == "__main__":
    add_rating_column()
