import React from "react";

const ChallengeModal = props => {
  return (
    <div className="challenge-modal">
      <p>
        You have been challenged by
        <span className="challenger-name">{props.name}</span>
      </p>
      <button onClick={props.acceptChallenge} className="accept">
        Accept
      </button>
      <button onClick={props.denyChallenge} className="decline">
        Decline
      </button>
    </div>
  );
};

export default ChallengeModal;
