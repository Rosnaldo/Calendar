import React, { Component } from 'react';
import { connect } from 'react-redux';

import './style.css';
import Table from '../Table';
import Calendar from '../Calendar'; 
import Loader from '../Loader';
import Save from '../Save';
import Notification from '../Notification'

class Main extends Component {
  render() {
    const { intersections } = this.props;
    return (
      <div className="main">
        <div className="container">
          <Table />
        </div>
        <div className="container2">
          <Notification intersections={intersections} />
          <Calendar />
          <Loader />
          <Save />
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  intersections: state.notification.intersections,
});

export default connect(mapStateToProps)(Main);
