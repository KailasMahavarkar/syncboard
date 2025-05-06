from flask import Flask, request
from flask_socketio import SocketIO, join_room, leave_room
import string
import random
import time

app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins="*")


@socketio.on('connect')
def handle_connect():
    sid = request.sid


@socketio.on('disconnect')
def handle_disconnect():
    sid = request.sid


@app.route('/status')
def status():
    return {
        "ping": "pong"
    }


if __name__ == '__main__':
    print("Starting Flask WebSocket Server for Sync Board on port 5000...")
    socketio.run(app, host='0.0.0.0', port=5000)
