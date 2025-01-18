import React, { useEffect, useRef } from "react";
import "ol/ol.css";
import { Map, View } from "ol";
import { Tile as TileLayer } from "ol/layer";
import { OSM } from "ol/source";
import { Draw } from "ol/interaction";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { fromLonLat } from "ol/proj";

const MapComponent = ({ onLineDataUpdate, onPolygonDataUpdate }) => {
  const mapRef = useRef(null);
  const mapObject = useRef(null);
  const vectorSource = useRef(new VectorSource());

  useEffect(() => {
    mapObject.current = new Map({
      target: mapRef.current,
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
        new VectorLayer({
          source: vectorSource.current,
        }),
      ],
      view: new View({
        center: fromLonLat([0, 0]),
        zoom: 2,
      }),
    });

    return () => {
      if (mapObject.current) {
        mapObject.current.setTarget(null);
      }
    };
  }, []);

  const startDrawing = (type) => {
    const drawInteraction = new Draw({
      source: vectorSource.current,
      type,
    });

    drawInteraction.on("drawend", (event) => {
      const feature = event.feature;
      const coords = feature.getGeometry().getCoordinates();
      const formattedCoords =
        type === "Polygon"
          ? coords[0].map((coord) => ({ coordinates: coord }))
          : coords.map((coord) => ({ coordinates: coord }));

      if (type === "LineString") {
        onLineDataUpdate(formattedCoords);
      } else if (type === "Polygon") {
        onPolygonDataUpdate(formattedCoords);
      }

      mapObject.current.removeInteraction(drawInteraction);
    });

    mapObject.current.addInteraction(drawInteraction);
  };

  return (
    <div className="relative w-full h-full">
      <div className="absolute top-4 left-4 flex space-x-2 z-10">
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          onClick={() => startDrawing("LineString")}
        >
          Draw LineString
        </button>
        <button
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          onClick={() => startDrawing("Polygon")}
        >
          Draw Polygon
        </button>
      </div>
      <div ref={mapRef} className="w-full h-full"></div>
    </div>
  );
};

export default MapComponent;
