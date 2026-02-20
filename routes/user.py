from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, User, generate_couple_code

user_bp = Blueprint('user', __name__)

@user_bp.route('/profile', methods=['GET'])
@jwt_required()
def get_profile():
    user_id = get_jwt_identity()
    user = db.session.get(User, user_id)

    if not user:
        return jsonify({"message": "User not found"}), 404

    partner_name = None
    if user.partner_id:
        partner = db.session.get(User, user.partner_id)
        if partner:
            partner_name = partner.name

    return jsonify({
        "id": user.id,
        "name": user.name,
        "email": user.email,
        "profile_image": user.profile_image,
        "couple_code": user.couple_code,
        "partner_id": user.partner_id,
        "partner_name": partner_name
    }), 200

@user_bp.route('/profile', methods=['PUT'])
@jwt_required()
def update_profile():
    user_id = get_jwt_identity()
    user = db.session.get(User, user_id)

    if not user:
        return jsonify({"message": "User not found"}), 404

    data = request.get_json()
    if 'name' in data:
        user.name = data['name']
    if 'profile_image' in data:
        user.profile_image = data['profile_image']

    db.session.commit()

    return jsonify({
        "id": user.id,
        "name": user.name,
        "email": user.email,
        "profile_image": user.profile_image
    }), 200

# ── Couple Code Endpoints ────────────────────────────────────────────────────

@user_bp.route('/couple/generate', methods=['POST'])
@jwt_required()
def generate_code():
    """Generate (or regenerate) a unique couple code for the logged-in user."""
    user_id = get_jwt_identity()
    user = db.session.get(User, user_id)

    if not user:
        return jsonify({"message": "User not found"}), 404

    # Keep generating until we get a unique code
    code = generate_couple_code()
    while User.query.filter_by(couple_code=code).first():
        code = generate_couple_code()

    user.couple_code = code
    db.session.commit()

    return jsonify({"couple_code": user.couple_code}), 200

@user_bp.route('/couple/join', methods=['POST'])
@jwt_required()
def join_couple():
    """Link the current user with the user who owns the given couple code."""
    user_id = get_jwt_identity()
    user = db.session.get(User, user_id)

    if not user:
        return jsonify({"message": "User not found"}), 404

    data = request.get_json()
    code = data.get('couple_code', '').strip().upper()

    if not code:
        return jsonify({"message": "Couple code is required"}), 400

    if user.couple_code == code:
        return jsonify({"message": "You cannot link to yourself"}), 400

    partner = User.query.filter_by(couple_code=code).first()

    if not partner:
        return jsonify({"message": "Invalid couple code — no user found"}), 404

    if partner.partner_id and str(partner.partner_id) != str(user_id):
        return jsonify({"message": "This code is already linked to another person"}), 400

    # Link both users to each other
    user.partner_id = partner.id
    partner.partner_id = user.id
    db.session.commit()

    return jsonify({
        "message": f"Linked with {partner.name}!",
        "partner_name": partner.name,
        "partner_id": partner.id
    }), 200

@user_bp.route('/couple/unlink', methods=['DELETE'])
@jwt_required()
def unlink_couple():
    """Remove the couple link from both users."""
    user_id = get_jwt_identity()
    user = db.session.get(User, user_id)

    if not user:
        return jsonify({"message": "User not found"}), 404

    if not user.partner_id:
        return jsonify({"message": "You are not linked to anyone"}), 400

    partner = db.session.get(User, user.partner_id)
    if partner:
        partner.partner_id = None

    user.partner_id = None
    db.session.commit()

    return jsonify({"message": "Unlinked successfully"}), 200
