import LocationPicker from "./components/LocationPicker";

function MapTest() {
    const handleLocationSelect = (location) => {
        console.log("Selected location:", location);
    };

    return (
        <div style={{ maxWidth: "900px", margin: "30px auto", padding: "16px" }}>
            <h2>Delivery Location Test</h2>
            <LocationPicker onLocationSelect={handleLocationSelect} />
        </div>
    );
}

export default MapTest;