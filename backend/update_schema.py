import sqlite3
from app import app, db

def update_schema():
    # 1. Add column to existing table
    try:
        conn = sqlite3.connect('oglabs.db')
        cursor = conn.cursor()
        cursor.execute("ALTER TABLE user ADD COLUMN is_super_user BOOLEAN DEFAULT 0")
        conn.commit()
        conn.close()
        print("Added is_super_user column to user table.")
    except sqlite3.OperationalError as e:
        print(f"Column might already exist: {e}")

    # 2. Create new tables
    with app.app_context():
        db.create_all()
        print("Created new tables (Order, GallerySubmission).")

if __name__ == "__main__":
    update_schema()
