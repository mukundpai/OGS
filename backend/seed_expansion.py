from app import app, db, Product

def add_trending_products():
    with app.app_context():
        new_products = [
            # F1
            Product(title="SENNA FOREVER", subtitle="LEGACY EDITION", price=45, image_pattern="pattern-1", badge="LEGEND", badge_color="#FFD700", badge_text_color="#000", category="F1"),
            Product(title="MONACO '88", subtitle="TRACK MAP ART", price=30, image_pattern="pattern-4", category="F1"),
            
            # MotoGP
            Product(title="THE DOCTOR 46", subtitle="ROSSI TRIBUTE", price=40, image_pattern="pattern-2", badge="VR46", badge_color="#FFFF00", badge_text_color="#000", category="MotoGP"),
            Product(title="DUCATI RED", subtitle="DESMOSEDICI GP", price=35, image_pattern="pattern-1", category="MotoGP"),
            
            # Cricket
            Product(title="KING KOHLI", subtitle="CENTURY EDITION", price=50, image_pattern="pattern-3", badge="GOAT", badge_color="#000", badge_text_color="#fff", category="Cricket"),
            Product(title="MSD 7", subtitle="CAPTAIN COOL", price=45, image_pattern="pattern-4", category="Cricket"),
            
            # Anime
            Product(title="GEAR 5", subtitle="JOYBOY RETURNS", price=35, image_pattern="pattern-2", badge="NEW", badge_color="#FF0000", badge_text_color="#fff", category="Anime"),
            Product(title="DOMAIN EXPANSION", subtitle="INFINITE VOID", price=40, image_pattern="pattern-3", category="Anime")
        ]
        
        for product in new_products:
            # Check if exists to avoid duplicates (simple check by title)
            exists = Product.query.filter_by(title=product.title).first()
            if not exists:
                db.session.add(product)
                print(f"Added: {product.title}")
            else:
                print(f"Skipped (Exists): {product.title}")
                
        db.session.commit()
        print("Trending products added successfully!")

if __name__ == "__main__":
    add_trending_products()
