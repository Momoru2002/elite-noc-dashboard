from flask import Flask, jsonify, send_from_directory
import psutil, platform, socket, time
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
STATIC_DIR = BASE_DIR / 'public'
app = Flask(__name__)

history = []

def ip():
    try:
        return socket.gethostbyname(socket.gethostname())
    except:
        return '127.0.0.1'

@app.route('/api/stats')
def stats():
    cpu = psutil.cpu_percent(0.2)
    mem = psutil.virtual_memory().percent
    disk = psutil.disk_usage('/').percent
    net = psutil.net_io_counters()

    point = {
        't': int(time.time()),
        'cpu': cpu,
        'mem': mem,
        'disk': disk,
    }

    history.append(point)
    if len(history) > 20:
        history.pop(0)

    return jsonify({
        'hostname': platform.node(),
        'os': platform.system(),
        'ip': ip(),
        'cores': psutil.cpu_count(),
        'cpu': cpu,
        'mem': mem,
        'disk': disk,
        'sent': round(net.bytes_sent/1024/1024,2),
        'recv': round(net.bytes_recv/1024/1024,2),
        'history': history
    })

@app.route('/')
def index():
    return send_from_directory(STATIC_DIR, 'index.html')

@app.route('/<path:path>')
def files(path):
    return send_from_directory(STATIC_DIR, path)

app.run(host='0.0.0.0', port=3000)
