import haversine from 'haversine'
import 'leaflet/dist/leaflet.css'
import React, { useEffect, useState } from 'react'
import { MapContainer, Polyline, TileLayer } from 'react-leaflet'

// Определяем тип для координат
type LatLng = {
	lat: number
	lng: number
}

const MapComponent: React.FC = () => {
	const [positions, setPositions] = useState<LatLng[]>([])
	const [distance, setDistance] = useState<number>(0)
	const [steps, setSteps] = useState<number>(0)

	useEffect(() => {
		let watchId: number | null = null

		const startTracking = () => {
			if (navigator.geolocation) {
				watchId = navigator.geolocation.watchPosition(
					position => {
						const { latitude, longitude } = position.coords
						const newPoint: LatLng = { lat: latitude, lng: longitude }

						setPositions(prevPositions => {
							if (prevPositions.length > 0) {
								const lastPoint = prevPositions[prevPositions.length - 1]
								const dist = haversine(
									{ latitude: lastPoint.lat, longitude: lastPoint.lng },
									{ latitude: newPoint.lat, longitude: newPoint.lng },
									{ unit: 'km' }
								)
								setDistance(prevDistance => prevDistance + dist)
								setSteps(prevSteps => prevSteps + 1)
							}
							return [...prevPositions, newPoint]
						})
					},
					error => console.error(error),
					{ enableHighAccuracy: true, maximumAge: 1000 }
				)
			} else {
				console.error('Geolocation is not supported by this browser.')
			}
		}

		startTracking()

		return () => {
			if (watchId !== null) {
				navigator.geolocation.clearWatch(watchId)
			}
		}
	}, [])

	return (
		<div>
			<MapContainer
				center={[51.505, -0.09] as [number, number]}
				zoom={13}
				style={{ height: '500px', width: '100%' }}
			>
				<TileLayer
					url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
					attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
				/>
				<Polyline
					positions={positions.map(pos => [pos.lat, pos.lng])}
					color='blue'
				/>
			</MapContainer>
			<div>
				<p>Пройденное расстояние: {distance.toFixed(2)} км</p>
				<p>Количество шагов: {steps}</p>
			</div>
		</div>
	)
}

export default MapComponent
