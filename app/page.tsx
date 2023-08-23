import {getAllRoutes, getAllStops} from "@/src/services/gtfs";
import RouteSearch from "@/src/components/forms/RouteSearch";
import StopSearch from "@/src/components/forms/StopSearch";
import {Card} from "@/src/components/common/Card";
import ItinerarySearch from "@/src/components/forms/ItinerarySearch";

export default async function Page() {

    const routes = await getAllRoutes()
    const stops = await getAllStops()

    return (
        <div className="flex">
            <div className="md:w-1/3">
                <Card title={"Route search"}>
                    <RouteSearch routes={routes}/>
                </Card>
                <Card title={"Stop search"}>
                    <StopSearch stops={stops}/>
                </Card>
            </div>

            <div className="md:w-1/3">
                <Card title={"Itinerary search"}>
                    <ItinerarySearch stops={stops}/>
                </Card>
            </div>
        </div>
    )
}