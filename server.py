from flask import Flask, request
from flask_socketio import SocketIO, join_room, leave_room
import string
import random
import time

app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins="*")

@app.route('/status')
def status():
    return {
        "MI vs RCB Final":"MI WINS"
    }


if __name__ == '__main__':
    print("Starting Flask WebSocket Server for Sync Board on port 5000...")
    socketio.run(app, host='0.0.0.0', port=5000)
