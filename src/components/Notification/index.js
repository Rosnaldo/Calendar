import React, { useState, useEffect } from 'react';

import './style.css';

const handleClick = (setShow) => {
  setShow((currShow) => !currShow);
};

const Notification = (props) => {
  const { intersections } = props;
  const [show, setShow] = useState(false);
  const [hasNotification, setHasNotification] = useState(false);
  
  useEffect(() => {
    if (Object.values(intersections) > 0) {
      setHasNotification(true);
    } else {
      setHasNotification(false);
    }
  }, [intersections]);

  
  return (
    <div className="notifications">
      <span className="material-icons icon" onClick={() => handleClick(setShow)}>
        notifications
      </span>
      {(hasNotification) ? <div className="red"></div> : <div />}
      <div className="dropdown"
        style={
          (show) ? 
          { display: 'block' } :
          { display: 'none' } }
      >
        {Object.entries(intersections).map(([date, values]) => {
          return(
            values.map(({name, index, id}) => (
              <div key={date + id} className="item">{`${name} -> Eq.${index} -> ${date}`}</div>
            ))
          );
        })}
      </div>
    </div>
  );
}

export default Notification;
