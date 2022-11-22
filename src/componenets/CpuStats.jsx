import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import CountUp from "react-countup";
import ProgressBar from "@ramonak/react-progress-bar";

const socket = io("http://localhost:9000/");

const CpuStats = () => {
  const [cpuStats, setCpuStats] = useState();

  useEffect(() => {
    socket.emit("getCpuUsage");
    socket.on("usage", (usage) => {
      if (usage) {
        setCpuStats(usage);
        // console.log(usage, "CPU usage");
      }
    });
  });
  return (
    <div>
      <div style={{ padding: "30px 20px" }}>
        {" "}
        <h4>
          CPU'S : <CountUp end={cpuStats?.cpuCount} />
        </h4>{" "}
      </div>
      <div style={{ padding: "10px 20px" }}>
        {" "}
        <h4>
          CPU USAGE :
          <ProgressBar completed={cpuStats?.useagePercentage} />
        </h4>{" "}
      </div>
      <div style={{ padding: "10px 20px" }}>
        {" "}
        <h4>
          Free Memory :
          <ProgressBar completed={cpuStats?.freeMemory} />
        </h4>{" "}
      </div>
    </div>
  );
};

export default CpuStats;
