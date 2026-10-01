import { useState } from "react";
import {
    MapContainer,
    TileLayer,
    CircleMarker,
    Popup,
    useMapEvents,
} from "react-leaflet";

function MapClickHandler({ onSelectLocation }) {
    useMapEvents({
        click(event) {
            onSelectLocation({
                lat: event.latlng.lat,
                lng: event.latlng.lng,
            });
        },
    });

    return null;
}

function LocationPicker({ onLocationSelect }) {
    const [selectedLocation, setSelectedLocation] = useState(null);

    const handleLocationSelect = (location) => {
        setSelectedLocation(location);

        if (onLocationSelect) {
            onLocationSelect(location);
        }
    };

    return (
        <div>
            <p>Map par click karke apni delivery location select karo.</p>

            <MapContainer
                center={[20.5937, 78.9629]}
                zoom={5}
                scrollWheelZoom={true}
                style={{ height: "350px", width: "100%" }}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                <MapClickHandler onSelectLocation={handleLocationSelect} />

                {selectedLocation && (
                    <CircleMarker
                        center={[selectedLocation.lat, selectedLocation.lng]}
                        radius={8}
                    >
                        <Popup>Selected delivery location</Popup>
                    </CircleMarker>
                )}
            </MapContainer>

            {selectedLocation && (
                <p>
                    Selected coordinates: {selectedLocation.lat.toFixed(5)},{" "}
                    {selectedLocation.lng.toFixed(5)}
                </p>
            )}
        </div>
    );
}

export default LocationPicker;