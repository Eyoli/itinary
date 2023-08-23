import Papa from "papaparse";
import fs from "fs";
import {cache} from 'react'


export type RouteData = {
    route_id: string
    route_long_name: string
    route_short_name: string
}

export type StopData = {
    stop_lon: string
    stop_lat: string
    stop_name: string
    stop_id: string
}

export type TripData = {
    route_id: string
    trip_id: string
    service_id: string
}

export type StopTimeData = {
    stop_id: string
    trip_id: string
}

export type WayData = {
    from_stop_id: string
    to_stop_id: string
    route_id: string
}

async function parseCsv<T>(fileLocation: string) {
    return new Promise<T[]>((resolve, reject) =>
        fs.readFile(fileLocation, (err, data) => {
            if (err) {
                reject(err);
            }
            const csv = data.toString()
            resolve(Papa.parse<T>(csv, {header: true}).data)
        }))
}

export const getAllRoutes = cache(async () => parseCsv<RouteData>("public/routes.txt"))

export const getAllStops = cache(async () => parseCsv<StopData>("public/stops.txt"))

export const getAllTrips = cache(async () => parseCsv<TripData>("public/trips.txt"))

export const getAllStopTimes = cache(async () => parseCsv<StopTimeData>("public/stop_times.txt"))

export const getAllEdges = cache(async () => {
    const edges = await parseCsv<WayData>("public/edges.txt")
    return edges.reduce((acc, current) => {
        const route = acc.get(current.route_id) ?? []
        if (!acc.has(current.route_id)) {
            acc.set(current.route_id, route)
        }
        route.push(current)
        return acc
    }, new Map<string, WayData[]>())
})

export const getEdges = (routeId: string) => getAllEdges()
    .then((edges) => edges.get(routeId))

export const getStops = async (routeId: string) => {
    const edges = await getEdges(routeId)
    if (!edges) return undefined

    const stopsFrom = edges.map((e) => e.from_stop_id)
    const stopsTo = edges.map((e) => e.to_stop_id)

    const stops = await getAllStops()
    return Array.from(new Set([...stopsFrom, ...stopsTo]).values())
        .map((id) => stops.find((s) => s.stop_id === id)!!)
}