def generate_chevron(threads):
    rows = []
    left = 0
    right = threads - 1
    while left < right:
        row = []
        i = left
        j = right
        while i < j:
            row.append((i, j))
            i += 1
            j -= 1
        rows.append(row)
        left += 1
        right -= 1
    return rows
