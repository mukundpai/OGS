import os
import shutil
import sqlite3
import time
from app import app

def seed_gallery():
    # Force absolute path for DB
    basedir = os.path.abspath(os.path.dirname(__file__))
    db_path = os.path.join(basedir, 'instance', 'oglabs.db')
    print(f"Using Database (sqlite3): {db_path}")

    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    # 0. Schema Migration: Add is_super_user if missing
    try:
        cursor.execute("PRAGMA table_info(user)")
        columns = [info[1] for info in cursor.fetchall()]
        if 'user' in [row[0] for row in cursor.execute("SELECT name FROM sqlite_master WHERE type='table'")] and 'is_super_user' not in columns:
            print("Migrating: Adding is_super_user column to user table...")
            cursor.execute("ALTER TABLE user ADD COLUMN is_super_user BOOLEAN DEFAULT 0")
            conn.commit()
    except Exception as e:
        print(f"Migration warning: {e}")

    # 1. Ensure tables exist (basic check)
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='user'")
    if not cursor.fetchone():
        print("User table missing! Creating tables via raw SQL...")
        
        # Create User table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS user (
                id INTEGER PRIMARY KEY,
                email VARCHAR(120) NOT NULL UNIQUE,
                password_hash VARCHAR(255) NOT NULL,
                full_name VARCHAR(100) NOT NULL,
                is_super_user BOOLEAN DEFAULT 0,
                created_at DATETIME
            )
        """)
    
    # Ensure Order table exists
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS "order" (
            id INTEGER PRIMARY KEY,
            user_id INTEGER NOT NULL,
            total_amount FLOAT NOT NULL,
            status VARCHAR(20),
            created_at DATETIME,
            FOREIGN KEY(user_id) REFERENCES user(id)
        )
    """)
    
    # Ensure GallerySubmission table exists
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS gallery_submission (
            id INTEGER PRIMARY KEY,
            user_id INTEGER NOT NULL,
            image_url VARCHAR(500) NOT NULL,
            location VARCHAR(100),
            caption TEXT,
            products_featured VARCHAR(500),
            likes INTEGER DEFAULT 0,
            is_featured BOOLEAN DEFAULT 0,
            is_approved BOOLEAN DEFAULT 0,
            created_at DATETIME,
            FOREIGN KEY(user_id) REFERENCES user(id)
        )
    """)
    print("Tables verified/created.")

    # 2. Check/Create User
    print("Checking for community user...")
    cursor.execute("SELECT id FROM user WHERE email = ?", ('community@oglabs.com',))
    user_row = cursor.fetchone()
    
    if not user_row:
        print("Creating community user...")
        # We need a password hash. For simplicity in seed, we can use a dummy or import bcrypt
        # But let's just insert a dummy hash since this is a seed script
        dummy_hash = '$2b$12$DUMMYHASHFORSEEDINGONLY......................' 
        cursor.execute("""
            INSERT INTO user (email, full_name, password_hash, is_super_user, created_at)
            VALUES (?, ?, ?, ?, datetime('now'))
        """, ('community@oglabs.com', 'OG Community Member', dummy_hash, 0))
        user_id = cursor.lastrowid
        
        # Add mock order
        cursor.execute("""
            INSERT INTO "order" (user_id, total_amount, status, created_at)
            VALUES (?, ?, ?, datetime('now'))
        """, (user_id, 100.0, 'completed'))
    else:
        user_id = user_row[0]
        print(f"User exists with ID: {user_id}")

    # 3. Seed Gallery Submissions
    gallery_upload_folder = os.path.join(basedir, 'uploads', 'gallery')
    os.makedirs(gallery_upload_folder, exist_ok=True)
    
    artifacts_dir = r"C:\Users\mukun\.gemini\antigravity\brain\3db96685-ce55-40b2-9622-9b0c7c6bd679"
    sample_images = [
        ("uploaded_image_0_1764048178770.jpg", "Corner vibes with the monochrome collection. 🖤", "Bangalore, IN", 1),
        ("uploaded_image_1_1764048178770.jpg", "Grid layout finally complete! #OGLABS", "Mumbai, IN", 0),
        ("uploaded_image_2_1764048178770.jpg", "Asymmetric setup for the win.", "Delhi, IN", 0),
        ("uploaded_image_3_1764048178770.jpg", "Adding some color to the workspace.", "Chennai, IN", 1),
        ("uploaded_image_4_1764048178770.png", "Gaming setup upgraded with these prints.", "Hyderabad, IN", 0),
        ("uploaded_image_1764048934625.png", "Fresh from the drop. The quality is insane.", "New York, USA", 1)
    ]

    for i, (filename, caption, location, featured) in enumerate(sample_images):
        src_path = os.path.join(artifacts_dir, filename)
        if os.path.exists(src_path):
            # Copy file
            new_filename = f"seed_{int(time.time())}_{i}_{filename}"
            dst_path = os.path.join(gallery_upload_folder, new_filename)
            shutil.copy(src_path, dst_path)
            
            image_url = f"/uploads/gallery/{new_filename}"
            
            # Check if exists
            cursor.execute("SELECT id FROM gallery_submission WHERE image_url = ?", (image_url,))
            if not cursor.fetchone():
                cursor.execute("""
                    INSERT INTO gallery_submission (
                        user_id, image_url, location, caption, 
                        likes, is_featured, is_approved, created_at
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'))
                """, (user_id, image_url, location, caption, 10 + i*5, featured, 1))
                print(f"Added submission: {caption}")
        else:
            print(f"Source image not found: {src_path}")

    conn.commit()
    conn.close()
    print("Gallery seeding complete (Raw SQL)!")

if __name__ == "__main__":
    seed_gallery()
