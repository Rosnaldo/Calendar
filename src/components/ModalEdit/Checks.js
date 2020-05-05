import React, { useState } from 'react';
import './style.css'

const Checks = () => {
  const [check, setCheck] = useState(0);
  return (
    <div className="checks" name={check}>
      <div className="campo">
        <span class="material-icons" onClick={() => setCheck(1)}>
          {(check === 1) ? 'radio_button_checked' : 'radio_button_unchecked'}
        </span>
        <p>Escolher</p>
      </div>
      <div className="campo">
        <span class="material-icons" onClick={() => setCheck(2)}>
          {(check === 2) ? 'radio_button_checked' : 'radio_button_unchecked'}
        </span>
        <p>Indefinidamente</p>
      </div>
    </div>
  );
};

export default Checks;
