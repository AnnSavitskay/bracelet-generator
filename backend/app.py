from flask import Flask, request, jsonify
from flask_cors import CORS
from pattern_state import build_thread_states
from pattern_generator import generate_chevron

app = Flask(__name__)
CORS(app)

@app.route("/generate", methods=["POST"])
def generate():
    data = request.json
    threads = data["threads"]
    pattern_type = data["pattern"]
    colors = data["colors"]
    if pattern_type == "chevron":
        rows = generate_chevron(threads)
        states = build_thread_states(threads, rows)
        return jsonify({"rows": rows, "states": states, "colors": colors})
    return jsonify({"error": "Unknown pattern"})

if __name__ == "__main__": app.run(debug=True)
