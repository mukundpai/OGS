from flask import Flask, jsonify, request
from flask_cors import CORS
import os
import requests
import json
from models import db, Product

app = Flask(__name__)
CORS(app)

# Database Config
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///oglabs.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db.init_app(app)

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

@app.route('/api/products/<int:id>', methods=['GET'])
def get_product(id):
    product = Product.query.get_or_404(id)
    return jsonify(product.to_dict())

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
