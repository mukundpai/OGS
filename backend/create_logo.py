from PIL import Image, ImageDraw, ImageFont
import os

def create_logo():
    # Dimensions
    size = (512, 512)
    bg_color = (0, 0, 0) # Black
    text_color = (255, 255, 255) # White
    
    # Create image
    img = Image.new('RGB', size, bg_color)
    draw = ImageDraw.Draw(img)
    
    # Draw text
    # Since we might not have a specific font, we'll draw simple shapes or use default
    # For "OG", let's try to draw it or use a default font if available
    try:
        # Try to use a system font like Arial or similar
        font_path = "arial.ttf" 
        font = ImageFont.truetype(font_path, 200)
    except:
        # Fallback to default
        font = ImageFont.load_default()
        
    text = "OG"
    
    # Get text size to center it
    # Using getbbox for newer PIL versions
    left, top, right, bottom = draw.textbbox((0, 0), text, font=font)
    text_width = right - left
    text_height = bottom - top
    
    x = (size[0] - text_width) / 2
    y = (size[1] - text_height) / 2
    
    draw.text((x, y), text, font=font, fill=text_color)
    
    # Save to frontend/public
    output_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'frontend', 'public', 'og-logo.png'))
    img.save(output_path)
    print(f"Logo saved to {output_path}")

if __name__ == "__main__":
    create_logo()
