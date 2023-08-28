"use client";

import { Card } from "@/src/components/common/Card";
import { RouteData } from "@/src/services/gtfs";

const Route = ({ route }: { route: RouteData }) => {
  return (
    <Card>
      <h2 className="card-title">{route.route_long_name}</h2>
      <div className="badge badge-primary">{route.route_id}</div>
      <div className="badge badge-secondary">{route.route_short_name}</div>
    </Card>
  );
};

export default Route;