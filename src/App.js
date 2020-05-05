import React from 'react';
import ModalDelete from './components/ModalDelete';
import ModalEdit from './components/ModalEdit';
import ModalDateType from './components/ModalDateType';
import Main from './components/Main';
import './App.css';

function App() {
  return (
    <div className="App">
      <ModalDelete />
      <ModalEdit />
      <ModalDateType />
      <Main />
    </div>
  );
}

export default App;
