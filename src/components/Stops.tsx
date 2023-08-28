"use client";

import { StopData } from "@/src/services/gtfs";

export const Stops = ({ stops }: { stops: StopData[] }) => {
  return (
    <div className="overflow-x-auto">
      <table className="table-zebra">
        <thead>
          <tr>
            <th>Id</th>
            <th>Name</th>
            <th>Lat</th>
            <th>Lon</th>
          </tr>
        </thead>
        <tbody>
          {stops.map((stop) => (
            <tr key={stop.stop_id}>
              <td>{stop.stop_id}</td>
              <td>{stop.stop_name}</td>
              <td>{stop.stop_lat}</td>
              <td>{stop.stop_lon}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
