import React, { Component } from 'react';
import DragPicker from './dragpicker'

export default class App extends Component {
  onChangeYear = year => { console.log(year)};
  render() {
    return (
      <div id="app">
        <DragPicker 
          initialYear="1981"
          onChangeYear = {this.onChangeYear}
        />
      </div>
    );
  }
}
