import {getAllRoutes, getAllTrips, getEdges, getStops} from "@/src/services/gtfs";
import {Route} from "@/src/components/Route";
import {RouteFlow} from "@/src/components/RouteFlow";
import {Trips} from "@/src/components/Trips";

export default async function Page({params}: { params: { slug: string } }) {

    const routes = await getAllRoutes()
    const route = routes.find((r) => r.route_id === decodeURIComponent(params.slug))

    if (!route) return

    const trips = await getAllTrips()
    const filteredTrips = trips.filter((t) => t.route_id === route.route_id)

    const edges = await getEdges(route.route_id)
    const stops = await getStops(route.route_id)

    return (
        <div className="flex flex-wrap">
            <div className="w-1/2 px-2 h-50">
                <Route route={route}/>
                <Trips trips={filteredTrips}/>
            </div>

            {stops && edges && <div className="w-1/2">
                <div style={{width: '45vw', height: '90vh'}}>
                    <RouteFlow stops={stops} ways={edges}/>
                </div>
            </div>}
        </div>

    )
}