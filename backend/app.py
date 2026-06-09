from flask import Flask, request, jsonify
from flask_cors import CORS
from pattern_state import build_thread_states
from pattern_generator import (
    generate_chevron,
    generate_stripe,
    generate_diamond,
    generate_x_pattern,
)
from database import init_db, save_pattern, get_patterns, get_pattern, delete_pattern

app = Flask(__name__)
CORS(app)

GENERATORS = {
    "chevron": generate_chevron,
    "stripe": generate_stripe,
    "diamond": generate_diamond,
    "x_pattern": generate_x_pattern,
}

init_db()


@app.route("/generate", methods=["POST"])
def generate():
    data = request.json
    threads = data["threads"]
    pattern_type = data["pattern"]
    colors = data["colors"]

    generator = GENERATORS.get(pattern_type)
    if not generator:
        return jsonify({"error": "Unknown pattern"})

    rows = generator(threads)
    states = build_thread_states(threads, rows)
    serialized_rows = [
        [{"left": k[0], "right": k[1], "direction": k[2]} for k in row]
        for row in rows
    ]

    pattern_id = save_pattern(pattern_type, threads, colors)

    return jsonify({
        "id": pattern_id,
        "rows": serialized_rows,
        "states": states,
        "colors": colors,
    })


@app.route("/patterns", methods=["GET"])
def list_patterns():
    return jsonify(get_patterns())


@app.route("/patterns/<int:pattern_id>", methods=["GET"])
def get_single_pattern(pattern_id):
    pattern = get_pattern(pattern_id)
    if not pattern:
        return jsonify({"error": "Not found"}), 404
    return jsonify(pattern)


@app.route("/patterns/<int:pattern_id>", methods=["DELETE"])
def remove_pattern(pattern_id):
    delete_pattern(pattern_id)
    return jsonify({"ok": True})


if __name__ == "__main__": app.run(debug=True)
