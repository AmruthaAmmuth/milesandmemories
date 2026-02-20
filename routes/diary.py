from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, Diary, User

diary_bp = Blueprint('diary', __name__)

@diary_bp.route('', methods=['POST'])
@jwt_required()
def create_entry():
    user_id = get_jwt_identity()
    data = request.get_json()
    
    if not data or 'text' not in data:
        return jsonify({"message": "Text is required"}), 400
        
    entry = Diary(user_id=user_id, text=data['text'])
    db.session.add(entry)
    db.session.commit()
    
    return jsonify({
        "id": entry.id,
        "text": entry.text,
        "date": entry.date.isoformat()
    }), 201

@diary_bp.route('', methods=['GET'])
@jwt_required()
def get_entries():
    user_id = get_jwt_identity()
    user = db.session.get(User, user_id)
    user_ids = [user_id]
    if user and user.partner_id:
        user_ids.append(str(user.partner_id))
    entries = Diary.query.filter(Diary.user_id.in_(user_ids)).order_by(Diary.date.desc()).all()

    return jsonify([{
        "id": e.id,
        "text": e.text,
        "date": e.date.isoformat()
    } for e in entries]), 200

@diary_bp.route('/<int:id>', methods=['PUT'])
@jwt_required()
def update_entry(id):
    user_id = get_jwt_identity()
    entry = db.session.get(Diary, id)
    
    if not entry:
        return jsonify({"message": "Entry not found"}), 404
        
    if str(entry.user_id) != str(user_id):
        return jsonify({"message": "Not authorized"}), 401
        
    data = request.get_json()
    if 'text' in data:
        entry.text = data['text']
        db.session.commit()
        
    return jsonify({
        "id": entry.id,
        "text": entry.text,
        "date": entry.date.isoformat()
    }), 200

@diary_bp.route('/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_entry(id):
    user_id = get_jwt_identity()
    entry = db.session.get(Diary, id)
    
    if not entry:
        return jsonify({"message": "Entry not found"}), 404
        
    if str(entry.user_id) != str(user_id):
        return jsonify({"message": "Not authorized"}), 401
        
    db.session.delete(entry)
    db.session.commit()
    
    return jsonify({"message": "Entry removed"}), 200
