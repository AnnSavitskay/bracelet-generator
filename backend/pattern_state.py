def build_thread_states(threads, rows):
    states = []
    current = list(range(threads))
    states.append(current.copy())

    for row in rows:
        for knot in row:
            left, right = knot[0], knot[1]
            current[left], current[right] = current[right], current[left]
        states.append(current.copy())

    return states
