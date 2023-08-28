"use client";

import { StopTimeData } from "@/src/services/gtfs";

export const StopTimes = ({ stopTimes }: { stopTimes: StopTimeData[] }) => {
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
          {stopTimes.map((stopTime) => (
            <tr key={stopTime.stop_id}>
              <td>{stopTime.stop_id}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
