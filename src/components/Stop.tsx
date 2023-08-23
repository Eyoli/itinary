import {StopData} from "@/src/services/gtfs";
import {Card} from "@/src/components/common/Card";

export const Stop = async ({stop}: { stop: StopData }) => {
    return (
        <Card>
            <h2 className="card-title">{stop.stop_name}</h2>
            <div className="badge badge-primary">{stop.stop_lat};{stop.stop_lon}</div>
            <div className="badge badge-secondary">{stop.stop_id}</div>
        </Card>
    )
}