import {getAllTrips} from "@/src/services/gtfs";
import {Trip} from "@/src/components/Trip";

export default async function Page({params}: { params: { slug: string } }) {

    const data = await getAllTrips()
    const trip = data.find((t) => t.trip_id === decodeURIComponent(params.slug))

    return (
        <main className="px-2">
            {trip && <Trip trip={trip}/>}
        </main>
    )
}
