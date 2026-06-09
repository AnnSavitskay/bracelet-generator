function PatternPreview({ threads, rows, states, colors }) {
  if (!rows.length || !states.length) return null;

  const spacingX = 36;
  const spacingY = 36;
  const padX = 30;
  const padTop = 30;
  const padBottom = 30;
  const knotSize = 10;
  const threadWidth = 3;

  const width = (threads - 1) * spacingX + padX * 2;
  const height = padTop + rows.length * spacingY + padBottom;

  function posX(pos) {
    return padX + pos * spacingX;
  }

  function knotCenterX(left, right) {
    return (posX(left) + posX(right)) / 2;
  }

  function knotCenterY(rowIndex) {
    return padTop + rowIndex * spacingY;
  }

  const threadLines = [];
  const knotDiamonds = [];

  for (let threadId = 0; threadId < threads; threadId++) {
    const color = colors[threadId];
    const points = [];

    let pos = states[0].indexOf(threadId);
    points.push({ x: posX(pos), y: 0 });

    for (let r = 0; r < rows.length; r++) {
      const knot = rows[r].find(
        (k) => k.left === pos || k.right === pos
      );

      if (knot) {
        const cx = knotCenterX(knot.left, knot.right);
        const cy = knotCenterY(r);
        points.push({ x: cx, y: cy });
      }

      const nextPos = states[r + 1].indexOf(threadId);
      pos = nextPos;
    }

    points.push({ x: posX(pos), y: height });

    for (let i = 0; i < points.length - 1; i++) {
      threadLines.push(
        <line
          key={`thread-${threadId}-${i}`}
          x1={points[i].x}
          y1={points[i].y}
          x2={points[i + 1].x}
          y2={points[i + 1].y}
          stroke={color}
          strokeWidth={threadWidth}
          strokeLinecap="round"
        />
      );
    }
  }

  for (let r = 0; r < rows.length; r++) {
    for (const knot of rows[r]) {
      const cx = knotCenterX(knot.left, knot.right);
      const cy = knotCenterY(r);

      const leadingPos =
        knot.direction === "forward" ? knot.left : knot.right;
      const leadingThreadId = states[r][leadingPos];
      const knotColor = colors[leadingThreadId];

      const d = knotSize;
      const diamondPath = `M ${cx} ${cy - d} L ${cx + d} ${cy} L ${cx} ${cy + d} L ${cx - d} ${cy} Z`;

      knotDiamonds.push(
        <path
          key={`knot-${r}-${knot.left}`}
          d={diamondPath}
          fill={knotColor}
          stroke="#fff"
          strokeWidth="1.5"
        />
      );
    }
  }

  return (
    <svg
      width={width}
      height={height}
      style={{ display: "block", margin: "0 auto", borderRadius: 12 }}
    >
      <rect
        width={width}
        height={height}
        rx="12"
        fill="#faf5ef"
        stroke="#e8d5c4"
        strokeWidth="1"
      />
      {threadLines}
      {knotDiamonds}
    </svg>
  );
}

export default PatternPreview;
