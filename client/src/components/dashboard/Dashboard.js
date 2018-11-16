import React from "react";
import Events from "./Events/Events";
import Friends from "./Friends/Friends";

const Dashboard = props => {
  return (
    <div>
      <Friends />
      <Events />
    </div>
  );
};

export default Dashboard;
