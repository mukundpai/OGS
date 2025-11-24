from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from datetime import datetime

db = SQLAlchemy()
bcrypt = Bcrypt()

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    full_name = db.Column(db.String(100), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def set_password(self, password):
        """Hash and set the user's password"""
        self.password_hash = bcrypt.generate_password_hash(password).decode('utf-8')

    def check_password(self, password):
        """Verify the user's password"""
        return bcrypt.check_password_hash(self.password_hash, password)

    def to_dict(self):
        return {
            "id": self.id,
            "email": self.email,
            "full_name": self.full_name,
            "created_at": self.created_at.isoformat() if self.created_at else None
        }

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
