from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, Message, User

message_bp = Blueprint('message', __name__)

@message_bp.route('', methods=['POST'])
@jwt_required()
def send_message():
    user_id = get_jwt_identity()
    data = request.get_json()
    
    if not data or 'text' not in data:
        return jsonify({"message": "Text is required"}), 400
        
    message = Message(
        sender_id=user_id,
        receiver_id=data.get('receiver_id'), # Nullable
        text=data['text']
    )
    
    db.session.add(message)
    db.session.commit()
    
    return jsonify({
        "id": message.id,
        "text": message.text,
        "receiver_id": message.receiver_id,
        "createdAt": message.created_at.isoformat()
    }), 201

@message_bp.route('', methods=['GET'])
@jwt_required()
def get_messages():
    user_id = get_jwt_identity()
    user = db.session.get(User, user_id)
    user_ids = [user_id]
    if user and user.partner_id:
        user_ids.append(str(user.partner_id))
    messages = Message.query.filter(Message.sender_id.in_(user_ids)).order_by(Message.created_at.desc()).all()
    
    return jsonify([{
        "id": m.id,
        "text": m.text,
        "receiver_id": m.receiver_id,
        "createdAt": m.created_at.isoformat()
    } for m in messages]), 200
