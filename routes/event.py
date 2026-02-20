from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, Event, User
from datetime import datetime

event_bp = Blueprint('event', __name__)

@event_bp.route('', methods=['POST'])
@jwt_required()
def create_event():
    user_id = get_jwt_identity()
    data = request.get_json()
    
    if not data or 'title' not in data or 'date' not in data:
        return jsonify({"message": "Title and date are required"}), 400
        
    try:
        event_date = datetime.fromisoformat(data['date'].replace('Z', '+00:00'))
    except ValueError:
        return jsonify({"message": "Invalid date format"}), 400
        
    event = Event(
        user_id=user_id,
        title=data['title'],
        description=data.get('description', ''),
        date=event_date
    )
    
    db.session.add(event)
    db.session.commit()
    
    return jsonify({
        "id": event.id,
        "title": event.title,
        "description": event.description,
        "date": event.date.isoformat()
    }), 201

@event_bp.route('', methods=['GET'])
@jwt_required()
def get_events():
    user_id = get_jwt_identity()
    user = db.session.get(User, user_id)
    user_ids = [user_id]
    if user and user.partner_id:
        user_ids.append(str(user.partner_id))
    events = Event.query.filter(Event.user_id.in_(user_ids)).order_by(Event.date.asc()).all()

    return jsonify([{
        "id": e.id,
        "title": e.title,
        "description": e.description,
        "date": e.date.isoformat()
    } for e in events]), 200

@event_bp.route('/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_event(id):
    user_id = get_jwt_identity()
    event = db.session.get(Event, id)
    
    if not event:
        return jsonify({"message": "Event not found"}), 404
        
    if str(event.user_id) != str(user_id):
        return jsonify({"message": "Not authorized"}), 401
        
    db.session.delete(event)
    db.session.commit()
    
    return jsonify({"message": "Event removed"}), 200
