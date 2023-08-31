import { Card } from "@/src/components/common/Card";
import { StopData } from "@/src/services/types";

export const Stop = ({ stop }: { stop: StopData }) => {
  return (
    <Card>
      <h2 className="card-title">{stop.stop_name}</h2>
      <div className="badge badge-primary">
        {stop.stop_lat};{stop.stop_lon}
      </div>
      <div className="badge badge-secondary">{stop.stop_id}</div>
    </Card>
  );
};
