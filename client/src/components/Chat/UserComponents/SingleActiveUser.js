import React from "react";

const SingleActiveUser = props => {
  const handleClick = () => {
    props.action(props.userId);
  };

  return (
    <li>
      <p>{props.username}</p>
      {props.userId && props.isAuth && (
        <button className={props.actionClass} onClick={handleClick}>
          {props.actionText}
        </button>
      )}
    </li>
  );
};

export default SingleActiveUser;
