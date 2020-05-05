import React, { useState } from 'react';
import './style.css'

const handleChange = (e, setInput) => {
  setInput(e.target.value);
}

const Input = (props) => {
  const { color, value, name } = props;
  const [input, setInput] = useState(value);
  return (
    <input
      className="comp_input"
      type="text"
      style={ { backgroundColor: `${color}` } }
      name={name}
      value={input}
      onChange={(e) => handleChange(e, setInput)}
    />
  );
};

export default Input;
