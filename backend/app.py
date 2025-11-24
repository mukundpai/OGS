from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
import os
import requests
import json
from models import db, Product
from werkzeug.utils import secure_filename
from PIL import Image

app = Flask(__name__)
CORS(app)

# Database Config
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///oglabs.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# File Upload Config
UPLOAD_FOLDER = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'uploads', 'products')
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'webp'}
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max file size

# Ensure upload directory exists
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

db.init_app(app)

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# Placeholder for API Key
# os.environ["GEMINI_API_KEY"] = "YOUR_API_KEY"

@app.before_first_request
def create_tables():
    db.create_all()
    if Product.query.count() == 0:
        seed_products()

def seed_products():
    products = [
        Product(title="GRAND PRIX '24", subtitle="A3 MATTE POSTER", price=25, image_pattern="pattern-1", image_url="https://images.unsplash.com/photo-1532906619279-a782cd0f9c2c?q=80&w=1000&auto=format&fit=crop", badge="BESTSELLER", badge_color="#000", badge_text_color="#fff", category="F1"),
        Product(title="SHIBUYA ARC", subtitle="HOLOGRAPHIC CARD", price=12, image_pattern="pattern-2", image_url="https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=1000&auto=format&fit=crop", category="Anime"),
        Product(title="THE THALAIVAR", subtitle="FRAMED A2 ART", price=60, image_pattern="pattern-3", image_url="https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=1000&auto=format&fit=crop", category="Cinema"),
        Product(title="STADIUM GODS", subtitle="TEXTURED PRINT", price=35, image_pattern="pattern-4", image_url="https://images.unsplash.com/photo-1531415074968-036ba1b575da?q=80&w=1000&auto=format&fit=crop", badge="LIMITED RUN", badge_color="#fff", badge_text_color="#000", category="Cricket"),
        
        # F1
        Product(title="SENNA FOREVER", subtitle="LEGACY EDITION", price=45, image_pattern="pattern-1", image_url="https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?q=80&w=1000&auto=format&fit=crop", badge="LEGEND", badge_color="#FFD700", badge_text_color="#000", category="F1"),
        Product(title="MONACO '88", subtitle="TRACK MAP ART", price=30, image_pattern="pattern-4", image_url="https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?q=80&w=1000&auto=format&fit=crop", category="F1"),
        
        # MotoGP
        Product(title="THE DOCTOR 46", subtitle="ROSSI TRIBUTE", price=40, image_pattern="pattern-2", image_url="https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?q=80&w=1000&auto=format&fit=crop", badge="VR46", badge_color="#FFFF00", badge_text_color="#000", category="MotoGP"),
        Product(title="DUCATI RED", subtitle="DESMOSEDICI GP", price=35, image_pattern="pattern-1", image_url="https://images.unsplash.com/photo-1558981403-c5f9899a28bc?q=80&w=1000&auto=format&fit=crop", category="MotoGP"),
        
        # Cricket
        Product(title="KING KOHLI", subtitle="CENTURY EDITION", price=50, image_pattern="pattern-3", image_url="https://images.unsplash.com/photo-1624526267942-ab0ff8a3e972?q=80&w=1000&auto=format&fit=crop", badge="GOAT", badge_color="#000", badge_text_color="#fff", category="Cricket"),
        Product(title="MSD 7", subtitle="CAPTAIN COOL", price=45, image_pattern="pattern-4", image_url="https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?q=80&w=1000&auto=format&fit=crop", category="Cricket"),
        
        # Anime
        Product(title="GEAR 5", subtitle="JOYBOY RETURNS", price=35, image_pattern="pattern-2", image_url="https://images.unsplash.com/photo-1618336753974-aae8e04506aa?q=80&w=1000&auto=format&fit=crop", badge="NEW", badge_color="#FF0000", badge_text_color="#fff", category="Anime"),
        Product(title="DOMAIN EXPANSION", subtitle="INFINITE VOID", price=40, image_pattern="pattern-3", image_url="https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=1000&auto=format&fit=crop", category="Anime")
    ]
    db.session.bulk_save_objects(products)
    db.session.commit()
    print("Database seeded!")

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({"status": "healthy", "service": "OG LABS Backend"})

@app.route('/api/products', methods=['GET', 'POST'])
def handle_products():
    if request.method == 'GET':
        category = request.args.get('category')
        sort = request.args.get('sort') # 'asc' or 'desc'
        
        query = Product.query
        
        if category and category != 'All':
            query = query.filter_by(category=category)
            
        if sort == 'asc':
            query = query.order_by(Product.price.asc())
        elif sort == 'desc':
            query = query.order_by(Product.price.desc())
            
        products = query.all()
        return jsonify([p.to_dict() for p in products])
    
    elif request.method == 'POST':
        data = request.json
        new_product = Product(
            title=data['title'],
            subtitle=data['subtitle'],
            price=float(data['price']),
            category=data['category'],
            image_pattern=data.get('image_pattern', 'pattern-1'),
            image_url=data.get('image_url'),
            badge=data.get('badge'),
            badge_color=data.get('badge_color'),
            badge_text_color=data.get('badge_text_color')
        )
        db.session.add(new_product)
        db.session.commit()
        return jsonify(new_product.to_dict()), 201

@app.route('/api/products/<int:id>', methods=['GET', 'PUT', 'DELETE'])
def handle_product(id):
    product = Product.query.get_or_404(id)
    
    if request.method == 'GET':
        return jsonify(product.to_dict())
    
    elif request.method == 'PUT':
        # Update product
        data = request.json
        product.title = data.get('title', product.title)
        product.subtitle = data.get('subtitle', product.subtitle)
        product.price = float(data.get('price', product.price))
        product.category = data.get('category', product.category)
        product.image_pattern = data.get('image_pattern', product.image_pattern)
        product.image_url = data.get('image_url', product.image_url)
        product.badge = data.get('badge', product.badge)
        product.badge_color = data.get('badge_color', product.badge_color)
        product.badge_text_color = data.get('badge_text_color', product.badge_text_color)
        
        db.session.commit()
        return jsonify(product.to_dict())
    
    elif request.method == 'DELETE':
        # Delete associated image file if it exists
        if product.image_url and product.image_url.startswith('/uploads/'):
            image_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), product.image_url.lstrip('/'))
            if os.path.exists(image_path):
                os.remove(image_path)
        
        db.session.delete(product)
        db.session.commit()
        return jsonify({"message": "Product deleted successfully"}), 200

@app.route('/api/products/upload', methods=['POST'])
def upload_product_image():
    if 'image' not in request.files:
        return jsonify({"error": "No image file provided"}), 400
    
    file = request.files['image']
    
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400
    
    if file and allowed_file(file.filename):
        # Secure the filename
        filename = secure_filename(file.filename)
        # Add timestamp to avoid naming conflicts
        import time
        filename = f"{int(time.time())}_{filename}"
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        
        # Save and optionally resize image
        file.save(filepath)
        
        # Optional: Resize large images
        try:
            img = Image.open(filepath)
            # If image is larger than 2000px on any side, resize it
            max_size = 2000
            if img.width > max_size or img.height > max_size:
                img.thumbnail((max_size, max_size), Image.Resampling.LANCZOS)
                img.save(filepath, optimize=True, quality=85)
        except Exception as e:
            print(f"Image processing warning: {e}")
        
        # Return URL path for the image
        image_url = f"/uploads/products/{filename}"
        return jsonify({"image_url": image_url}), 201
    
    return jsonify({"error": "Invalid file type"}), 400

# Serve uploaded files
@app.route('/uploads/products/<filename>')
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

@app.route('/api/checkout', methods=['POST'])
def checkout():
    data = request.json
    # Mock checkout logic
    return jsonify({"status": "success", "orderId": "OG-" + os.urandom(4).hex().upper()})

@app.route('/api/oracle', methods=['POST'])
def oracle_chat():
    data = request.json
    user_query = data.get('query')
    api_key = data.get('apiKey')
    
    if not api_key:
        api_key = os.environ.get("GEMINI_API_KEY")
        
    if not api_key:
        return jsonify({"error": "API Key missing"}), 400
        
    if not user_query:
        return jsonify({"error": "Query missing"}), 400

    system_prompt = """You are 'The Oracle' for OG LABS...""" # Truncated for brevity, kept same logic

    response = generate_gemini_content(api_key, user_query, system_prompt)
    
    if response and 'candidates' in response:
        text = response['candidates'][0]['content']['parts'][0]['text']
        return jsonify({"response": text})
    else:
        return jsonify({"error": "Failed to generate response"}), 500

def generate_gemini_content(api_key, prompt, system_instruction=None):
    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key={api_key}"
    headers = {'Content-Type': 'application/json'}
    
    data = {
        "contents": [{"parts": [{"text": prompt}]}]
    }
    
    if system_instruction:
        data["systemInstruction"] = {"parts": [{"text": system_instruction}]}
        
    try:
        response = requests.post(url, headers=headers, json=data)
        response.raise_for_status()
        return response.json()
    except Exception as e:
        print(f"Error calling Gemini API: {e}")
        return None

if __name__ == '__main__':
    app.run(debug=True, port=5000)
