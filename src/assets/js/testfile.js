import tokml from "geojson-to-kml";
// kml is a string of KML data, geojsonObject is a JavaScript object of
// GeoJSON data
const kml = tokml(geojsonObject);

function testa() { }
testa.prototype.testMethod = kmlNameDescription = tokml(geojsonObject, {
    name: "name",
    description: "description"
});

var testmodule = new testa();
export { testmodule };