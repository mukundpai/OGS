from app import app, db, Product

def update_product_images():
    with app.app_context():
        updates = {
            # F1
            "GRAND PRIX '24": "https://images.unsplash.com/photo-1532906619279-a782cd0f9c2c?q=80&w=1000&auto=format&fit=crop",
            "SENNA FOREVER": "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?q=80&w=1000&auto=format&fit=crop",
            "MONACO '88": "https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?q=80&w=1000&auto=format&fit=crop",
            
            # MotoGP
            "THE DOCTOR 46": "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?q=80&w=1000&auto=format&fit=crop",
            "DUCATI RED": "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?q=80&w=1000&auto=format&fit=crop",
            
            # Cricket
            "STADIUM GODS": "https://images.unsplash.com/photo-1531415074968-036ba1b575da?q=80&w=1000&auto=format&fit=crop",
            "KING KOHLI": "https://images.unsplash.com/photo-1624526267942-ab0ff8a3e972?q=80&w=1000&auto=format&fit=crop",
            "MSD 7": "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?q=80&w=1000&auto=format&fit=crop",
            
            # Anime
            "SHIBUYA ARC": "https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=1000&auto=format&fit=crop",
            "GEAR 5": "https://images.unsplash.com/photo-1618336753974-aae8e04506aa?q=80&w=1000&auto=format&fit=crop",
            "DOMAIN EXPANSION": "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=1000&auto=format&fit=crop",
            
            # Cinema
            "THE THALAIVAR": "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=1000&auto=format&fit=crop"
        }
        
        for title, url in updates.items():
            product = Product.query.filter_by(title=title).first()
            if product:
                product.image_url = url
                print(f"Updated image for: {title}")
            else:
                print(f"Product not found: {title}")
                
        db.session.commit()
        print("Product images updated successfully!")

if __name__ == "__main__":
    update_product_images()
