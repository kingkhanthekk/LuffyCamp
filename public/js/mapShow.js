mapboxgl.accessToken =
  "pk.eyJ1Ijoia2luZ2toYW50aGVrayIsImEiOiJjbGluMGgxa3AwcHlrM2twY3JudnA5NjlsIn0.6XnIR2jgo1yw-UeTbaeTWQ";
const map = new mapboxgl.Map({
  container: "map", // container ID
  style: "mapbox://styles/mapbox/streets-v12", // style URL
  center: coordinates, // starting position [lng, lat]
  zoom: 7, // starting zoom
});

const marker = new mapboxgl.Marker().setLngLat(coordinates).addTo(map);
