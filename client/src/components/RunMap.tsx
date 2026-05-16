import { MapContainer, TileLayer, Polyline } from 'react-leaflet'

interface Props {
    stream: [number, number][]
}

export default function RunMap({ stream }: Props) {
    if (!stream?.length) return null

    const centre = stream[Math.floor(stream.length / 2)]

    return (
        <MapContainer
            center={centre}
            zoom={14}
            className="w-full h-64 rounded-xl"
            scrollWheelZoom={false}
        >
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="© OpenStreetMap contributors"
            />
            <Polyline
                positions={stream}
                pathOptions={{ color: '#f97316', weight: 3 }}
            />
        </MapContainer>
    )
}
