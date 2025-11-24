"""
Populate Products from Assets
This script copies images from the assets folder to the uploads folder
and creates product entries in the database using these real poster images.
"""

import os
import shutil
from app import app, db, Product

# Paths
ASSETS_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'assets')
UPLOADS_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'uploads', 'products')

# Product data for each poster
# You can customize these based on what each poster represents
PRODUCTS_DATA = [
    # F1 Posters
    {"title": "MONACO GRAND PRIX", "subtitle": "Limited Edition Print", "price": 45, "category": "F1", "badge": "BESTSELLER", "badge_color": "#000", "badge_text_color": "#fff"},
    {"title": "SILVERSTONE LEGEND", "subtitle": "A2 Matte Poster", "price": 50, "category": "F1"},
    {"title": "SPA FRANCORCHAMPS", "subtitle": "Track Art", "price": 40, "category": "F1"},
    {"title": "MONZA SPEED", "subtitle": "Classic Circuit", "price": 45, "category": "F1", "badge": "LIMITED", "badge_color": "#FF0000", "badge_text_color": "#fff"},
    {"title": "SUZUKA CURVES", "subtitle": "Premium Print", "price": 55, "category": "F1"},
    {"title": "INTERLAGOS RAIN", "subtitle": "Iconic Moment", "price": 60, "category": "F1"},
    {"title": "AUSTIN SPEED", "subtitle": "COTA Special", "price": 42, "category": "F1"},
    {"title": "RED BULL RACING", "subtitle": "Team Tribute", "price": 48, "category": "F1"},
    
    # MotoGP Posters
    {"title": "VALENTINO ROSSI", "subtitle": "The Doctor Legacy", "price": 65, "category": "MotoGP", "badge": "LEGEND", "badge_color": "#FFD700", "badge_text_color": "#000"},
    {"title": "MUGELLO MAGIC", "subtitle": "Track Poster", "price": 40, "category": "MotoGP"},
    {"title": "DUCATI PASSION", "subtitle": "Italian Pride", "price": 50, "category": "MotoGP"},
    {"title": "MARC MARQUEZ", "subtitle": "Champion Series", "price": 55, "category": "MotoGP"},
    {"title": "PHILLIP ISLAND", "subtitle": "Coastal Circuit", "price": 45, "category": "MotoGP"},
    {"title": "YAMAHA BLUE", "subtitle": "Factory Racing", "price": 48, "category": "MotoGP"},
    {"title": "ASSEN TT", "subtitle": "Cathedral of Speed", "price": 42, "category": "MotoGP"},
    
    # Cricket Posters
    {"title": "VIRAT KOHLI", "subtitle": "Century King", "price": 50, "category": "Cricket", "badge": "GOAT", "badge_color": "#000", "badge_text_color": "#fff"},
    {"title": "MS DHONI", "subtitle": "Captain Cool", "price": 55, "category": "Cricket"},
    {"title": "SACHIN LEGACY", "subtitle": "Master Blaster", "price": 60, "category": "Cricket", "badge": "LEGEND", "badge_color": "#FFD700", "badge_text_color": "#000"},
    {"title": "IPL MOMENTS", "subtitle": "T20 Glory", "price": 35, "category": "Cricket"},
    {"title": "WORLD CUP 2011", "subtitle": "Historic Win", "price": 45, "category": "Cricket"},
    {"title": "ROHIT SHARMA", "subtitle": "Hitman Series", "price": 48, "category": "Cricket"},
    {"title": "EDEN GARDENS", "subtitle": "Stadium Print", "price": 40, "category": "Cricket"},
    
    # Anime Posters
    {"title": "LUFFY GEAR 5", "subtitle": "Sun God Awakening", "price": 40, "category": "Anime", "badge": "NEW", "badge_color": "#FF0000", "badge_text_color": "#fff"},
    {"title": "GOJO SATORU", "subtitle": "Limitless Power", "price": 45, "category": "Anime"},
    {"title": "NARUTO HOKAGE", "subtitle": "Believe It!", "price": 38, "category": "Anime"},
    {"title": "EREN TITAN", "subtitle": "Attack on Titan", "price": 42, "category": "Anime"},
    {"title": "DEMON SLAYER", "subtitle": "Tanjiro's Journey", "price": 40, "category": "Anime"},
    {"title": "MY HERO ACADEMIA", "subtitle": "Plus Ultra!", "price": 35, "category": "Anime"},
    {"title": "DEATH NOTE", "subtitle": "Light vs L", "price": 45, "category": "Anime"},
    {"title": "DRAGON BALL Z", "subtitle": "Saiyan Legend", "price": 50, "category": "Anime", "badge": "CLASSIC", "badge_color": "#FF8C00", "badge_text_color": "#000"},
    
    # Cinema Posters
    {"title": "THALAIVAR RAJINI", "subtitle": "Superstar Edition", "price": 55, "category": "Cinema"},
    {"title": "VIKRAM LEGACY", "subtitle": "Kamal Haasan", "price": 60, "category": "Cinema"},
    {"title": "RRR EPIC", "subtitle": "Rise Roar Revolt", "price": 50, "category": "Cinema", "badge": "BLOCKBUSTER", "badge_color": "#000", "badge_text_color": "#fff"},
    {"title": "KGF CHAPTER 2", "subtitle": "Rocky Bhai", "price": 48, "category": "Cinema"},
    {"title": "BAHUBALI", "subtitle": "Epic Saga", "price": 52, "category": "Cinema"},
    {"title": "3 IDIOTS", "subtitle": "All is Well", "price": 40, "category": "Cinema"},
    {"title": "INCEPTION", "subtitle": "Dream Within Dream", "price": 55, "category": "Cinema"},
]

def populate_products():
    """Copy images and create products"""
    
    with app.app_context():
        # Clear existing products (optional - comment out if you want to keep existing)
        print("Clearing existing products...")
        Product.query.delete()
        db.session.commit()
        
        # Get all image files from assets
        image_files = [f for f in os.listdir(ASSETS_DIR) if f.lower().endswith(('.jpg', '.jpeg', '.png', '.webp'))]
        
        print(f"Found {len(image_files)} images in assets folder")
        print(f"Have {len(PRODUCTS_DATA)} product entries defined")
        
        # Ensure uploads directory exists
        os.makedirs(UPLOADS_DIR, exist_ok=True)
        
        # Create products with images
        created_count = 0
        for idx, product_data in enumerate(PRODUCTS_DATA):
            if idx >= len(image_files):
                print(f"Warning: Not enough images for all products. Stopping at {idx}")
                break
            
            # Get image file
            image_filename = image_files[idx]
            source_path = os.path.join(ASSETS_DIR, image_filename)
            
            # Create new filename with timestamp to avoid conflicts
            import time
            ext = os.path.splitext(image_filename)[1]
            new_filename = f"{int(time.time())}_{idx}{ext}"
            dest_path = os.path.join(UPLOADS_DIR, new_filename)
            
            # Copy image to uploads folder
            shutil.copy2(source_path, dest_path)
            print(f"Copied: {image_filename} -> {new_filename}")
            
            # Create product with image URL
            product = Product(
                title=product_data.get('title'),
                subtitle=product_data.get('subtitle'),
                price=product_data.get('price'),
                category=product_data.get('category'),
                image_pattern=product_data.get('image_pattern', 'pattern-1'),
                image_url=f"/uploads/products/{new_filename}",
                badge=product_data.get('badge'),
                badge_color=product_data.get('badge_color'),
                badge_text_color=product_data.get('badge_text_color')
            )
            
            db.session.add(product)
            created_count += 1
        
        # Commit all products
        db.session.commit()
        print(f"\n✅ Successfully created {created_count} products with real poster images!")
        print(f"Images copied to: {UPLOADS_DIR}")

if __name__ == '__main__':
    populate_products()
