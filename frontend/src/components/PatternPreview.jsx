function PatternPreview({
  threads,
  rows,
  colors
}) {

  const spacingX = 50;
  const spacingY = 60;

  const width =
    threads * spacingX + 100;

  const height =
    rows.length * spacingY + 100;

  return (

    <svg
      width={width}
      height={height}
      style={{
        border: "1px solid #ccc",
        background: "#fafafa"
      }}
    >

      {
        Array.from(
          { length: threads }
        ).map((_, threadIndex) => (

          <line
            key={threadIndex}

            x1={
              50 +
              threadIndex *
              spacingX
            }

            y1={20}

            x2={
              50 +
              threadIndex *
              spacingX
            }

            y2={height - 20}

            stroke={
              colors[
                threadIndex
              ]
            }

            strokeWidth="6"
          />

        ))
      }

      {
        rows.map(
          (
            row,
            rowIndex
          ) =>

            row.map(
              (
                knot,
                knotIndex
              ) => {

                const left =
                  knot[0];

                const right =
                  knot[1];

                return (

                  <g
			  key={
			    `${rowIndex}-${knotIndex}`
			  }
			>

			  <line
			    x1={
			      50 +
			      left * spacingX
			    }

			    y1={
			      40 +
			      rowIndex *
			      spacingY
			    }

			    x2={
			      50 +
			      right * spacingX
			    }

			    y2={
			      60 +
			      rowIndex *
			      spacingY
			    }

			    stroke="black"
			    strokeWidth="3"
			  />

			  <line
			    x1={
			      50 +
			      right * spacingX
			    }

			    y1={
			      40 +
			      rowIndex *
			      spacingY
			    }

			    x2={
			      50 +
			      left * spacingX
			    }

			    y2={
			      60 +
			      rowIndex *
			      spacingY
			    }

			    stroke="black"
			    strokeWidth="3"
			  />

			</g>

                );
              }
            )
        )
      }

    </svg>

  );
}

export default PatternPreview;
