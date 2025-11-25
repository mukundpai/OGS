import sqlite3
import os

def inspect():
    db_path = 'oglabs.db'
    if not os.path.exists(db_path):
        print(f"Database file {db_path} not found!")
        return

    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    # List tables
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
    tables = cursor.fetchall()
    print("Tables:", tables)
    
    for table in tables:
        table_name = table[0]
        print(f"\nColumns in {table_name}:")
        cursor.execute(f"PRAGMA table_info({table_name})")
        columns = cursor.fetchall()
        for col in columns:
            print(col)

    conn.close()

if __name__ == "__main__":
    inspect()
