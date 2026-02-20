import os
from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
from werkzeug.utils import secure_filename
from models import db, Memory, User
import time

memory_bp = Blueprint('memory', __name__)

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@memory_bp.route('', methods=['POST'])
@jwt_required()
def upload_memory():
    user_id = get_jwt_identity()
    
    if 'image' not in request.files:
        return jsonify({"message": "No file uploaded"}), 400
        
    file = request.files['image']
    if file.filename == '':
        return jsonify({"message": "No file selected"}), 400
        
    if file and allowed_file(file.filename):
        filename = secure_filename(f"{time.time()}_{file.filename}")
        filepath = os.path.join(current_app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)
        
        category = request.form.get('category', 'Lovely')
        
        memory = Memory(
            user_id=user_id,
            image_path=f"/uploads/{filename}",
            category=category
        )
        db.session.add(memory)
        db.session.commit()
        
        return jsonify({
            "id": memory.id,
            "image_path": memory.image_path,
            "category": memory.category,
            "createdAt": memory.created_at.isoformat()
        }), 201
        
    return jsonify({"message": "Invalid file type"}), 400

@memory_bp.route('', methods=['GET'])
@jwt_required()
def get_memories():
    user_id = get_jwt_identity()
    user = db.session.get(User, user_id)
    user_ids = [user_id]
    if user and user.partner_id:
        user_ids.append(str(user.partner_id))
    memories = Memory.query.filter(Memory.user_id.in_(user_ids)).order_by(Memory.created_at.desc()).all()

    return jsonify([{
        "id": m.id,
        "image_path": m.image_path,
        "category": m.category,
        "createdAt": m.created_at.isoformat()
    } for m in memories]), 200

@memory_bp.route('/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_memory(id):
    user_id = get_jwt_identity()
    memory = db.session.get(Memory, id)
    
    if not memory:
        return jsonify({"message": "Memory not found"}), 404
        
    if str(memory.user_id) != str(user_id):
        return jsonify({"message": "Not authorized"}), 401
        
    # Optional: Delete file from disk
    # filepath = os.path.join(current_app.config['UPLOAD_FOLDER'], os.path.basename(memory.image_path))
    # if os.path.exists(filepath):
    #     os.remove(filepath)
        
    db.session.delete(memory)
    db.session.commit()
    
    return jsonify({"message": "Memory removed"}), 200
