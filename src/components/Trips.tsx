"use client";

import { TripData } from "@/src/services/gtfs";

export const Trips = ({ trips }: { trips: TripData[] }) => {
  return (
    <div className="stat">
      <div className="stat-title">Total trips</div>
      <div className="stat-value">{trips.length}</div>
    </div>
  );
};
