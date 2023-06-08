mapboxgl.accessToken =
  "pk.eyJ1Ijoia2luZ2toYW50aGVrayIsImEiOiJjbGluMGgxa3AwcHlrM2twY3JudnA5NjlsIn0.6XnIR2jgo1yw-UeTbaeTWQ";
const map = new mapboxgl.Map({
  container: "map", // container ID
  style: "mapbox://styles/mapbox/streets-v12", // style URL
  center: camp.geometry.coordinates, // starting position [lng, lat]
  zoom: 7, // starting zoom
});

const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(
  `<h4>${camp.title}</h4><p>${camp.location}`
);

const marker = new mapboxgl.Marker()
  .setLngLat(camp.geometry.coordinates)
  .setPopup(popup)
  .addTo(map);
