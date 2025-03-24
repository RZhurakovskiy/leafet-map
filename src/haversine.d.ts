declare module 'haversine' {
	type Coordinate = {
		latitude: number
		longitude: number
	}

	interface HaversineOptions {
		unit?: 'km' | 'meter' | 'mile' | 'nmi'
	}

	function haversine(
		start: Coordinate,
		end: Coordinate,
		options?: HaversineOptions
	): number

	export default haversine
}
