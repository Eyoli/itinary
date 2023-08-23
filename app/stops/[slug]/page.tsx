import {getAllStops} from "@/src/services/gtfs";
import {Stop} from "@/src/components/Stop";

export default async function Page({params}: { params: { slug: string } }) {

    const data = await getAllStops()
    const stop = data.find((s) => s.stop_id === decodeURIComponent(params.slug))

    return (
        stop && <Stop stop={stop}/>
    )
}
