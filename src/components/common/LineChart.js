import React, { Component } from "react";
import PropTypes from "prop-types";

class LineChart extends Component {
  render() {
    const reservedHeight = 40;
    const boxStyle = {
      height: this.props.height + 15,
      width: this.props.width
    };

    let points = "";

    const maxXValues = Math.round(this.props.width / this.props.interval) + 2;
    let startIndex = 0;
    let lastX = 0;
    if (this.props.values.length > maxXValues) {
      lastX = -1 * this.props.interval;
      startIndex = this.props.values.length - maxXValues;
    } else {
      lastX = this.props.width - this.props.interval * this.props.values.length;
      startIndex = 0;
    }

    // reverse min and max so that we can compute real values.
    let max = this.props.maxVal;
    let min = this.props.minVal;
    if (this.props.fixedInterval !== true) {
      //Adjust min and max
      min = this.props.maxVal;
      max = this.props.minVal;
      for (let i = startIndex; i < this.props.values.length; i++) {
        const val = Number(this.props.values[i]);
        if (val > max) {
          max = val;
        }
        if (val < min) {
          min = val;
        }
      }
      max = 1 + Math.round(max * 1.1);
      min = Math.floor(min * 0.9);
    }

    const yInterval = max - min;
    const firstX = lastX;
    for (let i = startIndex; i < this.props.values.length; i++) {
      const value = this.props.values[i];
      const y =
        this.props.height - reservedHeight - ((value - min) * this.props.height) / yInterval;
      const x = lastX + this.props.interval;
      lastX = x;
      points = `${points}${x},${y} `;
    }
    
    const verticalLines = [];
    const xValues = [];
    let lineCount = 0;
    let t = new Date();
    const markerInterval = 60;

    const lastXMarker = this.props.width - (this.props.width % markerInterval);
    for (let x = 0; x < this.props.width; x += this.props.interval) {
      if ( x % markerInterval == 0) {
        verticalLines.push(
          <line
            key={`vert${lineCount}`}
            x1={x}
            y1={this.props.height - reservedHeight}
            x2={x}
            y2="0"            
          />
        );
        const textTime = `${(
            "0" + t.getHours()
          ).slice(-2)}:${("0" + t.getMinutes()).slice(-2)}:${(
            "0" + t.getSeconds()
          ).slice(-2)}`;
        
        xValues.push(
          <text x={markerInterval} y={this.props.height - reservedHeight} fill="red" font-size="8" transform={`translate(${lastXMarker - x}, 0) rotate(30) `}>{textTime}</text>
        );
      }
      t = new Date(t.getTime() - this.props.interval * 1000);
      lineCount++;
    }

    return (
      <div className="linechart" id={this.props.id} style={boxStyle}>
        <div className="linechart-ymax">{max}</div>
        <div className="linechar-title">{this.props.title}</div>
        <div className="linechart-axis">
          <svg height={this.props.height} width={this.props.width}>
            <line
              x1="0"
              y1={this.props.height - reservedHeight}
              x2={this.props.width}
              y2={this.props.height - reservedHeight}
              
            />
            <line
              x1="0"
              y1={this.props.height - reservedHeight}
              x2="0"
              y2="0"
            />
            {verticalLines}
            {xValues}
          </svg>
        </div>
        <div className="linechart-plots">
          <svg height={this.props.height} width={this.props.width}>
            <defs>
              <linearGradient id="line1" x1="0" x2="0" y1="0" y2="1">
                <stop
                  className="line1_start"
                  offset="0%"
                  stopColor="rgb(93,253,203)"
                  stopOpacity="0.3"
                />
                <stop
                  className="line1_stop"
                  offset="100%"
                  stopColor="rgb(93,253,203)"
                  stopOpacity="0"
                />
              </linearGradient>
            </defs>
            <polyline
              points={`0,${this.props.height - reservedHeight} ${points} ${this.props.width},${this.props.height - reservedHeight}`}
              style={{
                fill: "url(#line1)",
                stroke: "rgba(93, 253, 203, 1)",
                strokeWidth: 2
              }}
            />
          </svg>
        </div>
        <div className="linechar-rightend"></div>
      </div>
    );
  }
}

LineChart.propTypes = {
  height: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired,
  minVal: PropTypes.number.isRequired,
  maxVal: PropTypes.number.isRequired,
  interval: PropTypes.number.isRequired,
  values: PropTypes.array.isRequired
};

export default LineChart;
