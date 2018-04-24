'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _gsap = require('gsap');

var _Draggable = require('gsap/Draggable');

var _Draggable2 = _interopRequireDefault(_Draggable);

require('./dragpicker.css');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var DragPicker = function (_Component) {
  _inherits(DragPicker, _Component);

  function DragPicker(props) {
    _classCallCheck(this, DragPicker);

    var _this = _possibleConstructorReturn(this, (DragPicker.__proto__ || Object.getPrototypeOf(DragPicker)).call(this, props));

    _this.state = { selectedYear: new Date().getFullYear() - 1 };
    _this.onChangeYear = _this.props.onChangeYear;

    var yearStart = _this.props.initialYear;
    var yearEnd = new Date().getFullYear();

    _this.years = [];

    while (yearStart < yearEnd + 1) {
      _this.years.push(yearEnd--);
    }

    _this.animate = _this.animate.bind(_this);
    _this.snapY = _this.snapY.bind(_this);
    _this.updateProgress = _this.updateProgress.bind(_this);
    _this.initCell = _this.initCell.bind(_this);
    _this.setYear = _this.setYear.bind(_this);
    return _this;
  }

  _createClass(DragPicker, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.animate();
    }
  }, {
    key: 'animate',
    value: function animate() {
      _gsap.TweenLite.defaultEase = _gsap.Linear.easeNone;

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

      this.baseTl = new _gsap.TimelineMax({ paused: true });

      _gsap.TweenLite.set(this.picker, {
        perspective: 1100,
        height: 3 * this.cellHeight
      });

      for (this.i = 0; this.i < this.cells.length; this.i++) {
        this.initCell(this.cells[this.i], this.i);
      }

      this.animation = new _gsap.TimelineMax({ repeat: -1, paused: true }).add(this.baseTl.tweenFromTo(1, 2));

      this.draggable = new _Draggable2.default(this.proxy, {
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
  }, {
    key: 'snapY',
    value: function snapY(y) {
      return Math.round(y / this.cellHeight) * this.cellHeight;
    }
  }, {
    key: 'updateProgress',
    value: function updateProgress() {
      this.animation.progress(this.draggable.y / this.wrapHeight);
      this.setYear(this.draggable.y);
    }
  }, {
    key: 'initCell',
    value: function initCell(element, index) {

      _gsap.TweenLite.set(element, {
        height: this.cellHeight,
        scale: 0.6,
        rotationX: this.rotationX,
        y: -this.cellHeight
      });

      this.tl = new _gsap.TimelineMax({ repeat: 1 }).to(element, 1, { y: "+=" + this.wrapHeight, rotationX: -10 }, 0).to(element, this.cellStep, { color: "#000000", scale: 1, repeat: 1, yoyo: true }, this.cellStep);

      this.baseTl.add(this.tl, this.i * -this.cellStep);
    }
  }, {
    key: 'setYear',
    value: function setYear(y) {

      var tempIndex = Math.round(y * -1 / this.cellHeight) % this.numCells + 1;
      var newCellIndex = tempIndex < 0 ? tempIndex + this.numCells : tempIndex;
      newCellIndex = newCellIndex === this.numCells ? 0 : newCellIndex;

      if (this.cellIndex !== newCellIndex) {
        this.cellIndex = newCellIndex;

        this.setState({ selectedYear: this.cells[this.cellIndex].textContent });
        this.onChangeYear(this.state.selectedYear);
        // console.log(this.state.selectedYear);
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var year = this.years.map(function (year, i) {
        return _react2.default.createElement(
          'div',
          { key: i, className: 'cell' },
          _react2.default.createElement(
            'div',
            { className: 'cell-content' },
            year
          )
        );
      });

      return _react2.default.createElement(
        'div',
        { id: 'picker', className: 'picker' },
        year
      );
    }
  }, {
    key: 'onInputChange',
    value: function onInputChange(term) {
      this.setState({ term: term });
      this.props.onSearchTermChange(term);
    }
  }]);

  return DragPicker;
}(_react.Component);

exports.default = DragPicker;