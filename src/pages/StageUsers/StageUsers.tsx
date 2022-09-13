import React from "react";
// React router dom
import { Link } from "react-router-dom";

const StageUsers = () => {
  return (
    <>
      <p>
        <Link
          to={{
            pathname: "/stage-users/settings",
            hash: "#john-doe",
          }}
        >
          User 1
        </Link>
      </p>
      <p>
        <Link
          to={{
            pathname: "/active-users/settings",
            hash: "#jenny-doe",
          }}
        >
          User 2
        </Link>
      </p>
    </>
  );
};

export default StageUsers;
