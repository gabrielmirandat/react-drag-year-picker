import React, { Component } from 'react';
import { TweenLite, TimelineMax, Linear } from 'gsap';
import Draggable from "gsap/Draggable";
import './dragpicker.css';

class DragPicker extends Component {
  constructor(props) {
    super(props);

    this.state = {selectedYear: new Date().getFullYear() - 1};
    this.onChangeYear = this.props.onChangeYear;

    let yearStart = this.props.initialYear;
    let yearEnd = new Date().getFullYear();
    
    this.years = [];

    while(yearStart < yearEnd+1){
      this.years.push(yearEnd--);
    }

    this.animate = this.animate.bind(this);
    this.snapY = this.snapY.bind(this);
    this.updateProgress = this.updateProgress.bind(this);
    this.initCell = this.initCell.bind(this);
    this.setYear = this.setYear.bind(this);
  }

  componentDidMount() {
    this.animate();
  }

  animate() {
    TweenLite.defaultEase = Linear.easeNone;

    this.picker = document.querySelector(".picker");
    this.cells = document.querySelectorAll(".cell");
    this.proxy = document.createElement("div");

    this.cellHeight = 50;
    this.rotationX = 15;
    this.cellIndex = 1; // the first cell in the years array begin selected

    this.numCells = this.cells.length;
    this.cellStep = 1 / this.numCells;
    this.wrapHeight = this.cellHeight * this.numCells;

    this.actualIndex = 1;

    this.baseTl = new TimelineMax({ paused: true });

    TweenLite.set(this.picker, {
      perspective: 1100,
      height: 3* this.cellHeight
    });

    for (this.i = 0; this.i < this.cells.length; this.i++) {  
      this.initCell(this.cells[this.i], this.i);
    }

    this.animation = new TimelineMax({ repeat: -1, paused: true })
      .add(this.baseTl.tweenFromTo(1, 2))
    
    this.draggable = new Draggable(this.proxy, {
      // allowContextMenu: true,  
      trigger: this.picker,
      throwProps: true,
      onDrag: this.updateProgress,
      onThrowUpdate: this.updateProgress,
      snap: { 
        y: this.snapY
      }
    });
  }

  snapY(y) {
    return Math.round(y / this.cellHeight) * this.cellHeight;
  }
  
  updateProgress() {  
    this.animation.progress(this.draggable.y / this.wrapHeight);
    this.setYear(this.draggable.y);
  }
  
  initCell(element, index) {
    
    TweenLite.set(element, {
      height: this.cellHeight,
      scale: 0.6,
      rotationX: this.rotationX,
      y: -this.cellHeight
    });
    
    this.tl = new TimelineMax({ repeat: 1 })
      .to(element, 1, { y: "+=" + this.wrapHeight, rotationX: -10 }, 0)
      .to(element, this.cellStep, { color: "#000000", scale: 1, repeat: 1, yoyo: true }, this.cellStep)
    
    this.baseTl.add(this.tl, this.i * -this.cellStep);
  }
  
  setYear(y) {

    let tempIndex = Math.round( (y*(-1) / this.cellHeight)) % (this.numCells) + 1;
    let newCellIndex = tempIndex < 0 ? tempIndex + this.numCells : tempIndex;
    newCellIndex = newCellIndex === this.numCells ? 0 : newCellIndex;

    if(this.cellIndex !== newCellIndex){
      this.cellIndex = newCellIndex;

      this.setState({selectedYear: this.cells[this.cellIndex].textContent});
      this.onChangeYear(this.state.selectedYear);
      // console.log(this.state.selectedYear);
    }
  }
  
  render() {
    const year = this.years.map((year, i) => {
      return (
        <div key={i} className="cell">
          <div className="cell-content">{year}</div>
        </div>   
      )
    });

    return (
      <div id="picker" className="picker">
        {year}
      </div>         
    );
  }

  onInputChange(term) {
    this.setState({term});
    this.props.onSearchTermChange(term);
  }
}

export default DragPicker;