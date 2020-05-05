import React, { Component } from 'react';
import { connect } from 'react-redux';

import { saveAs } from 'file-saver';
import './style.css';

class Save extends Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    const { arquivo, related } = this.props;
    const blob = new Blob([JSON.stringify({ arquivo, related })],
      {type: "text/plain;charset=utf-8"});
    saveAs(blob);
  }

  render() {
    return (
      <button className='btn-save' onClick={this.handleClick}>
        <i className="material-icons">
          save_alt
        </i>
        <span>Save</span>
      </button>
    );
  }
}

const mapStateToProps = (state) => ({
  arquivo: state.arquivo.json,
  related: state.arquivo.related,
});


export default connect(mapStateToProps)(Save);
