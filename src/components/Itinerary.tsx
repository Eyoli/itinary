import { RouteData } from "@/src/services/types";
import { Card } from "@/src/components/common/Card";

export const Route = async ({ route }: { route: RouteData }) => {
  return (
    <Card title={route.route_long_name}>
      <div className="badge badge-primary">{route.route_short_name}</div>
      <div className="badge badge-secondary">{route.route_id}</div>
    </Card>
  );
};
