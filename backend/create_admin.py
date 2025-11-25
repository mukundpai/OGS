from app import app, db, User

def create_admin():
    with app.app_context():
        email = 'admin@oglabs.com'
        password = 'adminpassword2024'
        
        # Check if user exists
        user = User.query.filter_by(email=email).first()
        
        if user:
            print(f"User {email} already exists.")
            user.is_super_user = True
            user.full_name = 'OG Admin'
            user.set_password(password)
            db.session.commit()
            print(f"Updated {email} to Super User.")
        else:
            user = User(
                email=email,
                full_name='OG Admin',
                is_super_user=True
            )
            user.set_password(password)
            db.session.add(user)
            db.session.commit()
            print(f"Created new Super User: {email}")
            
        print("-" * 30)
        print(f"Email:    {email}")
        print(f"Password: {password}")
        print("-" * 30)

if __name__ == "__main__":
    create_admin()
