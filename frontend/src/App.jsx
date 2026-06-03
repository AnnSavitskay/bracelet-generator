import { useState } from "react";

function App() {
  const [colors, setColors] = useState(["red", "blue", "white", "green", "yellow", "black"]);
  const [threads, setThreads] = useState(8);
  const [pattern, setPattern] = useState("chevron");
  const [rows, setRows] = useState([]);

  async function generate() {
    const response = await fetch( "http://127.0.0.1:5000/generate", {
          method: "POST",
          headers: {"Content-Type": "application/json"},
          body: JSON.stringify({threads, pattern, colors})
        }
      );
    const data = await response.json();
    setRows(data.rows);
  }
  
  function updateColor(index, value) {
  	const updated = [...colors];
  	updated[index] = value;
  	setColors(updated);
  }
  
  return (
    <div style={{padding: "30px", fontFamily: "Arial"}}>

      <h1>
        Bracelet Generator
      </h1>
      <div>
        <label>
          Threads:
        </label>
        <select
          value={threads}
          onChange={(e) => setThreads(Number(e.target.value))}
        >
          <option value={4}>
            4
          </option>
          <option value={6}>
            6
          </option>
          <option value={8}>
            8
          </option>
          <option value={10}>
            10
          </option>
          <option value={12}>
            12
          </option>
        </select>
      <h2>
	  Thread Colors
	</h2>
	{Array.from({ length: threads }).map((_, index) => (<div key={index}>
	      Thread {index + 1}
	      <select
		value={colors[index] || "red"}
		onChange={(e) => updateColor(index, e.target.value)}
	      >
		<option value="red">
		  Red
		</option>
		<option value="blue">
		  Blue
		</option>
		<option value="white">
		  White
		</option>
		<option value="green">
		  Green
		</option>
		<option value="yellow">
		  Yellow
		</option>
		<option value="black">
		  Black
		</option>
	      </select>
	    </div>
	  ))}
      </div>
      <br />
      <div>
        <label>
          Pattern:
        </label>
        <select
          value={pattern}
          onChange={(e) => setPattern(e.target.value)}
        >
          <option value="chevron">
            Chevron
          </option>
        </select>
      </div>
      <br />
      <button
        onClick={generate}
      >
        Generate
      </button>
      <hr />
      <h2>
        Pattern Rows
      </h2>
      {
        rows.map(
          (row, rowIndex) => (
            <div
              key={rowIndex}
              style={{marginBottom: "15px"}}
            >
              <b>
                Row {" "} {rowIndex + 1}
              </b>
              {
                row.map((knot, knotIndex) => (
                    <div
                      key={knotIndex}
                    >
                      Thread {" "} {knot[0]} {" ↔ "} {knot[1]}
                    </div>
                  ))}
            </div>
          ))}
      <h2>
	  Preview
	</h2>
	<div
	  style={{display: "flex", gap: "10px"}}
	>
	{colors.slice(0, threads).map((color, index) => (
	      <div
		key={index}
		style={{width: "30px", height: "120px", backgroundColor: color}}
	      />
	    ))}
	</div>
    </div>
  );
}

export default App;
