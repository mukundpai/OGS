from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class Product(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    subtitle = db.Column(db.String(100), nullable=False)
    price = db.Column(db.Float, nullable=False)
    image_pattern = db.Column(db.String(50), nullable=True) # pattern-1, pattern-2, etc. or URL
    image_url = db.Column(db.String(500), nullable=True) # For actual images
    badge = db.Column(db.String(50), nullable=True)
    badge_color = db.Column(db.String(20), nullable=True)
    badge_text_color = db.Column(db.String(20), nullable=True)
    category = db.Column(db.String(50), nullable=False) # F1, Anime, Cinema, Cricket

    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "subtitle": self.subtitle,
            "price": f"${int(self.price)}", # Format as string for frontend compatibility
            "price_raw": self.price,
            "image_pattern": self.image_pattern,
            "image_url": self.image_url,
            "badge": self.badge,
            "badge_color": self.badge_color,
            "badge_text_color": self.badge_text_color,
            "category": self.category
        }
