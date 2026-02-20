from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token
from models import db, User, generate_couple_code

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    name = data.get('name')
    email = data.get('email')
    password = data.get('password')
    
    if not name or not email or not password:
        return jsonify({"message": "Please enter all fields."}), 400
        
    if User.query.filter_by(email=email).first():
        return jsonify({"message": "User already exists"}), 400
        
    hashed_pass = generate_password_hash(password)
    
    # Auto-generate unique couple code for the new user
    code = generate_couple_code()
    while User.query.filter_by(couple_code=code).first():
        code = generate_couple_code()
        
    new_user = User(name=name, email=email, password_hash=hashed_pass, couple_code=code)
    
    couple_code = data.get('couple_code')
    if couple_code:
        partner = User.query.filter_by(couple_code=couple_code).first()
        if partner:
            if not partner.partner_id:
                new_user.partner_id = partner.id
                partner.partner_id = -1 # Temporary placeholder to avoid race or logic issues before commit
            else:
                return jsonify({"message": "That couple code is already linked to someone else"}), 400
        else:
            return jsonify({"message": "Invalid couple code"}), 400

    db.session.add(new_user)
    db.session.commit()
    
    # Update partner link if joined
    if couple_code and partner:
        partner.partner_id = new_user.id
        db.session.commit()
    
    # Create token for user payload
    # Expected by frontend: token and user { id, name, email }
    token = create_access_token(identity=str(new_user.id))
    
    return jsonify({
        "token": token,
        "user": {
            "id": new_user.id,
            "name": new_user.name,
            "email": new_user.email
        }
    }), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    
    user = User.query.filter_by(email=email).first()
    
    if not user or not check_password_hash(user.password_hash, password):
        return jsonify({"message": "Invalid credentials"}), 400
        
    token = create_access_token(identity=str(user.id))
    
    return jsonify({
        "token": token,
        "user": {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "profile_image": user.profile_image
        }
    }), 200
