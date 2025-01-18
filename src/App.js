import React, { useState } from "react";
import Map from "./Map";
import DataModal from "./DataModal";

function App() {
  const [lineData, setLineData] = useState([]);
  const [polygonData, setPolygonData] = useState([]);

  const handleLineDataUpdate = (data) => setLineData(data);
  const handlePolygonDataUpdate = (data) => setPolygonData(data);

  return (
    <div className="relative h-screen">
      <DataModal lineData={lineData} polygonData={polygonData} />
      <Map
        onLineDataUpdate={handleLineDataUpdate}
        onPolygonDataUpdate={handlePolygonDataUpdate}
      />
    </div>
  );
}

export default App;
