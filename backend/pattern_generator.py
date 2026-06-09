def _make_row(threads, r, direction_fn):
    row = []
    if r % 2 == 0:
        pairs = range(0, threads - 1, 2)
    else:
        pairs = range(1, threads - 1, 2)
    for i in pairs:
        row.append((i, i + 1, direction_fn(i, threads)))
    return row


def generate_chevron(threads, num_repeats=2):
    half = threads / 2
    total_rows = (threads - 1) * num_repeats
    rows = []
    for r in range(total_rows):
        def direction_fn(i, t, _half=half):
            return "forward" if i + 0.5 < _half else "backward"
        rows.append(_make_row(threads, r, direction_fn))
    return rows


def generate_stripe(threads, num_repeats=2):
    total_rows = (threads - 1) * num_repeats
    rows = []
    for r in range(total_rows):
        rows.append(_make_row(threads, r, lambda i, t: "forward"))
    return rows


def generate_diamond(threads, num_repeats=2):
    half = threads / 2
    cycle = threads - 1
    total_rows = cycle * num_repeats
    rows = []
    for r in range(total_rows):
        phase = r % cycle
        if phase < cycle // 2:
            def direction_fn(i, t, _half=half):
                return "forward" if i + 0.5 < _half else "backward"
        else:
            def direction_fn(i, t, _half=half):
                return "backward" if i + 0.5 < _half else "forward"
        rows.append(_make_row(threads, r, direction_fn))
    return rows


def generate_x_pattern(threads, num_repeats=2):
    half = threads / 2
    block_size = 4
    total_rows = (threads - 1) * num_repeats
    rows = []
    for r in range(total_rows):
        block = (r // block_size) % 2
        if block == 0:
            def direction_fn(i, t, _half=half):
                return "forward" if i + 0.5 < _half else "backward"
        else:
            def direction_fn(i, t, _half=half):
                return "backward" if i + 0.5 < _half else "forward"
        rows.append(_make_row(threads, r, direction_fn))
    return rows
