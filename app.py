import os
from flask import Flask, jsonify, send_from_directory
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from models import db

def create_app():
    # Tell Flask that 'public' is both the static folder and template folder
    app = Flask(__name__, static_folder='public', static_url_path='')
    # Allow all origins for the API routes
    CORS(app, resources={r"/api/*": {"origins": "*"}})
    
    # Configuration
    basedir = os.path.abspath(os.path.dirname(__file__))
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(basedir, 'app.db')
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['JWT_SECRET_KEY'] = 'miles_and_memories_secret_key_2024'
    app.config['UPLOAD_FOLDER'] = os.path.join(basedir, 'public', 'uploads')
    
    # Ensure upload directory exists inside public so it's served as static
    os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
    
    # Initialize Extensions
    db.init_app(app)
    JWTManager(app)
    
    # Register Blueprints
    from routes.auth import auth_bp
    from routes.user import user_bp
    from routes.diary import diary_bp
    from routes.memory import memory_bp
    from routes.event import event_bp
    from routes.message import message_bp
    
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(user_bp, url_prefix='/api/users')
    app.register_blueprint(diary_bp, url_prefix='/api/diary')
    app.register_blueprint(memory_bp, url_prefix='/api/memories')
    app.register_blueprint(event_bp, url_prefix='/api/events')
    app.register_blueprint(message_bp, url_prefix='/api/messages')
    
    # Serve the frontend: root -> index.html, all other unknown paths -> index.html
    @app.route('/')
    def serve_index():
        return send_from_directory(app.static_folder, 'index.html')

    @app.route('/<path:path>')
    def serve_static(path):
        # If the file exists in public, serve it
        full_path = os.path.join(app.static_folder, path)
        if os.path.exists(full_path) and os.path.isfile(full_path):
            return send_from_directory(app.static_folder, path)
        # Otherwise, redirect to index.html (SPA fallback)
        return send_from_directory(app.static_folder, 'index.html')
        
    return app

app = create_app()

with app.app_context():
    db.create_all()  # Auto-creates SQLite tables

if __name__ == '__main__':
    app.run(debug=True, port=5000)
