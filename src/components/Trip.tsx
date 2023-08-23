import {getAllStopTimes, TripData} from "@/src/services/gtfs";
import {StopTimes} from "@/src/components/StopTimes";
import {Card} from "@/src/components/common/Card";

export const Trip = async ({trip}: { trip: TripData }) => {

    const data = await getAllStopTimes()
    const stopTimes = data.filter((s) => s.trip_id === trip.trip_id)

    return (
        <div className="flex -mx-2">
            <div className="w-1/2 px-2">
                <Card>
                    <table className="table-zebra">
                        <tbody>
                        <tr>
                            <th>Id</th>
                            <td className="text-right">{trip.trip_id}</td>
                        </tr>
                        <tr>
                            <th>Service</th>
                            <td className="text-right">{trip.service_id}</td>
                        </tr>
                        </tbody>
                    </table>
                </Card>
            </div>
            <div className="w-1/2">
                <StopTimes stopTimes={stopTimes}/>
            </div>
        </div>
    )
}