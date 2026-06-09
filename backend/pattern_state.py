def build_thread_states(
    threads,
    rows
):

    states = []

    current = list(
        range(threads)
    )

    states.append(
        current.copy()
    )

    for row in rows:

        for left, right in row:

            current[left], current[right] = (
                current[right],
                current[left]
            )

        states.append(
            current.copy()
        )

    return states
