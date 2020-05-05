import React, { Component } from 'react';
import { connect } from 'react-redux';

import Input from '../Input';
import './style.css';


function modalDateTypeAction(modal) {
  return {
    type: 'modalDateType',
    modal,
  }
}

function modalDeleteAction(modal) {
  return {
    type: 'modalDelete',
    modal,
  }
}

function modalEditAction(modal) {
  return {
    type: 'modalEdit',
    modal,
  }
}

function actionEnderecoExist(enderecoExist) {
  return {
    type: 'enderecoExist',
    enderecoExist,
  }
}

class Serv extends Component {
  constructor(props) {
    super(props);
    this.serv = React.createRef();
    this.up = React.createRef();
    this.down = React.createRef();
    this.original_height = 0;
    this.original_y = 0;
    this.original_mouse_y = 0;
    this.MouseDownHandle = this.MouseDownHandle.bind(this);
    this.resizeUp = this.resizeUp.bind(this);
    this.resizeDown = this.resizeDown.bind(this);
    this.stopResize = this.stopResize.bind(this);
    this.btnDelete = this.btnDelete.bind(this);
    this.btnEdit = this.btnEdit.bind(this);
    this.btnColorize = this.btnColorize.bind(this);
  }

  componentDidMount() {
    this.enderecoExistFunc();
  }

  resizeUp(e) {
    const { top } = this.props.table;
    const height = this.original_height - (e.pageY - this.original_mouse_y);
    this.enderecoExistFunc();
    if (this.convert(e.pageY) >= top + 0.3) {
      if (this.convert(height) > 6) {
        this.serv.current.style.height = this.convert(height) + 'vh';
        const top = this.original_y + (e.pageY - this.original_mouse_y);
        this.serv.current.style.top = this.convert(top) + 'vh';
      }
    }
  };

  resizeDown(e) {
    const { bottom } = this.props.table;
    const height = this.original_height + (e.pageY - this.original_mouse_y);
    this.enderecoExistFunc();
    if (this.convert(e.pageY) <= bottom - 0.4) {
      if (this.convert(height) > 6) {
        const height2 = this.original_height + (e.pageY - this.original_mouse_y);
        this.serv.current.style.height = this.convert(height2) + 'vh';
      }
    }
  };

  enderecoExistFunc() {
    const { dispatch, enderecoExist, id } = this.props;
    const height = parseFloat(getComputedStyle(this.serv.current, null)
      .getPropertyValue('height').replace('vh', ''));
    if (this.convert(height) < 11.5) {
      enderecoExist[id] = false;
      dispatch(actionEnderecoExist(enderecoExist));
    } else {
      enderecoExist[id] = true;
      dispatch(actionEnderecoExist(enderecoExist));
    }
  }

  convert(px) {
    return (parseFloat(px) * 100) / window.innerHeight;
  };

  stopResize(resize) {
    window.removeEventListener('mousemove', resize);
  };

  MouseDownHandle(e) {
    this.original_height = parseFloat(getComputedStyle(this.serv.current, null)
      .getPropertyValue('height').replace('vh', ''));
    this.original_y = this.serv.current.getBoundingClientRect().top;
    this.original_mouse_y = e.pageY;

    if (e.target === this.up.current) {
      window.addEventListener('mousemove', this.resizeUp);
      window.addEventListener('mouseup', () => {
        this.stopResize(this.resizeUp);
      });
    };

    if (e.target === this.down.current) {
      window.addEventListener('mousemove', this.resizeDown);
      window.addEventListener('mouseup', () => {
        this.stopResize(this.resizeDown);
      });
    };
  }

  btnDelete(e) {
    const { dispatch } = this.props;
    const modal = this.modal(e, 17);
    dispatch(modalDeleteAction(modal));
  }

  btnColorize(e) {
    const { dispatch } = this.props;
    const modal = this.modal(e, 11);
    dispatch(modalDateTypeAction(modal));
  }

  btnEdit(e) {
    const { dispatch } = this.props;
    const modal = this.modal(e, 14);
    dispatch(modalEditAction(modal));
  }
  
  modal(e, topDiff) {
    const top = this.convert(e.target.getBoundingClientRect().top) - topDiff;
    const left = this.convert(Number(e.target.getBoundingClientRect().left));
    const color = this.serv.current.style.backgroundColor;
    const name = this.serv.current.querySelector('input[name="name"]').value;
    const display = 'flex';
    const id = e.target.parentNode.parentNode.getAttribute('id');
    const index = e.target.parentNode.parentNode.getAttribute('name');
    return { display, top, left, id, index, color, name };
  }

  render() {
    const { serv: { top, height, color, input }, id, index, enderecoExist } = this.props;
    const { name, horario, endereco } = input;
    return (
      <div
        ref={this.serv}
        className="servico"
        id={id}
        name={index}
        style={{top: `${top}vh`, height: `${height}vh`, backgroundColor: `${color}`}}
      >
        <div className="header">
          <div className="campo">
            <span className="material-icons campo-icon">
              timer
            </span>
            <Input color={color} value={horario} name="horario" />
          </div>
          <i
            className="material-icons colorize"
            onClick={this.btnColorize}
            style={{backgroundColor: `${color}`}}
          >
            colorize
          </i>
          <i
            className="material-icons delete"
            onClick={this.btnDelete}
            style={{backgroundColor: `${color}`}}
          >
            delete_forever
          </i>
          {(color !== 'rgb(63, 113, 252)') && <i
            className="material-icons edit"
            onClick={this.btnEdit}
            style={{backgroundColor: `${color}`}}
          >
            edit
          </i>}
        </div>
        <div className="up" ref={this.up} onMouseDown={this.MouseDownHandle}></div>
        <div className="input-container">
          <div className="campo">
            <span className="material-icons campo-icon">
              person
            </span>
            <Input color={color} value={name} name="name" />
          </div>
          <div className="campo" style={
            (enderecoExist[id]) ? 
            { display: 'block' } :
            { display: 'none' } }
          >
            <span className="material-icons campo-icon">
              place
            </span>
            <Input enderecoExist={(enderecoExist[id])} color={color} value={endereco} name="endereco" />
          </div>
        </div>
        <div className="down" ref={this.down} onMouseDown={this.MouseDownHandle}></div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  table: state.table,
  arquivo: state.arquivo.json,
  related: state.arquivo.related,
  elems: state.elemsRender.elems,
  enderecoExist: state.enderecoExist.enderecoExist,
  items: state.notification.items,
});

export default connect(mapStateToProps)(Serv);
