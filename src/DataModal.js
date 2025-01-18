import React, { useState, useEffect } from "react";
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import Draw from "ol/interaction/Draw";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { fromLonLat } from "ol/proj";
import { Feature } from "ol";
import { Style, Stroke, Fill } from "ol/style";

export default function App() {
  const [map, setMap] = useState(null);
  const [lineData, setLineData] = useState([]);
  const [polygonData, setPolygonData] = useState([]);
  const [activeInteraction, setActiveInteraction] = useState(null);
  const [showLineData, setShowLineData] = useState(true);
  const [showPolygonData, setShowPolygonData] = useState(true);

  useEffect(() => {
    const vectorSource = new VectorSource();
    const vectorLayer = new VectorLayer({
      source: vectorSource,
      style: new Style({
        stroke: new Stroke({ color: "blue", width: 2 }),
        fill: new Fill({ color: "rgba(0, 255, 0, 0.3)" }),
      }),
    });

    const initialMap = new Map({
      target: "map",
      layers: [
        new TileLayer({ source: new OSM() }),
        vectorLayer,
      ],
      view: new View({
        center: fromLonLat([0, 0]),
        zoom: 2,
      }),
    });

    setMap(initialMap);

    return () => {
      initialMap.setTarget(null);
    };
  }, []);

  const addInteraction = (type) => {
    if (!map) return;

    const vectorLayer = map.getLayers().array_.find(
      (layer) => layer instanceof VectorLayer
    );
    const vectorSource = vectorLayer.getSource();

    if (activeInteraction) {
      map.removeInteraction(activeInteraction);
    }

    const draw = new Draw({
      source: vectorSource,
      type: type,
    });

    draw.on("drawend", (event) => {
      const feature = event.feature;
      const geometry = feature.getGeometry();
      const coordinates = geometry.getCoordinates();

      if (type === "LineString") {
        setLineData((prev) => [
          ...prev,
          ...coordinates.map((coord, index) => ({
            id: `WP-${index + 1}`,
            coordinates: coord.map((c) => c.toFixed(6)),
          })),
        ]);
      } else if (type === "Polygon") {
        setPolygonData((prev) => [
          ...prev,
          ...coordinates[0].map((coord, index) => ({
            id: `WP-${index + 1}`,
            coordinates: coord.map((c) => c.toFixed(6)),
          })),
        ]);
      }
    });

    map.addInteraction(draw);
    setActiveInteraction(draw);
  };

  return (
    <div>
      <div
        className="absolute top-2 left-2 bg-white p-4 shadow rounded"
        style={{ zIndex: 10, width: "300px" }}
      >
        <h2 className="text-lg font-bold mb-2">Generated Data</h2>
        <button
          className="bg-blue-500 text-white px-3 py-1 rounded mb-2"
          onClick={() => addInteraction("LineString")}
        >
          Draw LineString
        </button>
        <button
          className="bg-purple-500 text-white px-3 py-1 rounded mb-2"
          onClick={() => addInteraction("Polygon")}
        >
          Draw Polygon
        </button>
        <div>
          <button
            className="bg-blue-500 text-white px-2 py-1 rounded w-full mb-2"
            onClick={() => setShowLineData(!showLineData)}
          >
            {showLineData ? "Hide Line Data" : "Show Line Data"}
          </button>
          {showLineData && (
            <div className="bg-gray-100 p-2 rounded max-h-40 overflow-y-scroll">
              {lineData.map((item) => (
                <p key={item.id}>
                  {item.id}: [{item.coordinates.join(", ")}]
                </p>
              ))}
            </div>
          )}
        </div>
        <div>
          <button
            className="bg-green-500 text-white px-2 py-1 rounded w-full mb-2"
            onClick={() => setShowPolygonData(!showPolygonData)}
          >
            {showPolygonData ? "Hide Polygon Data" : "Show Polygon Data"}
          </button>
          {showPolygonData && (
            <div className="bg-gray-100 p-2 rounded max-h-40 overflow-y-scroll">
              {polygonData.map((item) => (
                <p key={item.id}>
                  {item.id}: [{item.coordinates.join(", ")}]
                </p>
              ))}
            </div>
          )}
        </div>
      </div>
      <div id="map" className="w-full h-screen"></div>
    </div>
  );
}
