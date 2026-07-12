import code
import os

from app import app
from models import db, Product, User, Order, GallerySubmission, bcrypt

def start_shell():
    banner = """
    ========================================================
     OGS Interactive Database Shell 
    ========================================================
    Context is automatically set up!
    
    Available Objects:
    - app: Flask application
    - db: SQLAlchemy database session
    - Product, User, Order, GallerySubmission: Models
    - bcrypt: Password hashing utility
    
    Examples:
    >>> User.query.all()
    >>> Product.query.first()
    >>> new_user = User(email="test@test.com", full_name="Test")
    >>> db.session.add(new_user)
    >>> db.session.commit()
    ========================================================
    """
    
    ctx = {
        'app': app,
        'db': db,
        'Product': Product,
        'User': User,
        'Order': Order,
        'GallerySubmission': GallerySubmission,
        'bcrypt': bcrypt
    }
    
    with app.app_context():
        try:
            import IPython
            from traitlets.config import Config
            c = Config()
            c.InteractiveShellApp.exec_lines = [
                "print('IPython Shell Loaded with Flask Context')"
            ]
            IPython.start_ipython(argv=[], config=c, user_ns=ctx)
        except ImportError:
            code.interact(banner=banner, local=ctx)

if __name__ == '__main__':
    start_shell()
