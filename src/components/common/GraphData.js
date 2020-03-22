import React, { Component } from 'react';
import PropTypes from "prop-types";
import './GraphData.scss';

const MODE = [
    "min",
    "avg",
    "max"  
];

const DEFAULT_COLORS = [
    "mediumpurple",
    "mediumaquamarine",
    "mediumspringgreen",
    "lightcoral",
    "lightgray",
    "red",
    "yellow",
    "blue",
    "green"
];


function svgPoint(element, x, y) {
    const pt = element.createSVGPoint();
    pt.x = x;
    pt.y = y;
  
    const res = pt.matrixTransform(element.getScreenCTM().inverse());
    res.x = Math.round(res.x);
    res.y = Math.round(res.y);
    return res;
  }


class GraphData extends Component {
    state = {
        dataStartIndex: 0,
        width: this.props.width == null ? 600 : Math.max(this.props.width, 600),
        height: this.props.height == null ? 100 : this.props.height,
        xView: this.props.xView == null ? 3600 : this.props.xView,
        mode: this.props.mode == null ? 1 : this.props.mode,
        xZoomFactors: this.props.xZoomFactors == null ? [ 0.25, 0.5, 1 , 2, 4, 8, 16, 24, 48, 144 ] : this.props.xZoomFactors,
        xZoomPos: 2,
        xInterval: this.props.xInterval,
        value: null,
        valuePos: {x: -1,y: -1}
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.data !== this.props.data) {
            const xZoomFactors = nextProps.xZoomFactors == null ? [ 0.25, 0.5, 1 , 2, 4, 8, 16, 24, 48, 144 ] : nextProps.xZoomFactors;
            const xZoomPos = this.findZoomOnePos(xZoomFactors);
            const xView = nextProps.xView == null ? 3600 : nextProps.xView;
            this.setState({
                dataStartIndex: 0,
                width: nextProps.width == null ? 600 : Math.max(nextProps.width, 600),
                height: nextProps.height == null ? 100 : nextProps.height,
                xView: xView * xZoomFactors[xZoomPos],
                mode: nextProps.mode == null ? 1 : nextProps.mode,
                xZoomFactors: xZoomFactors,
                xZoomPos: xZoomPos,
                xInterval: this.props.xInterval
            });
        }
    }

    findZoomOnePos = zoomFactor => {
        for(let i = 0; i < zoomFactor.length; i++) {
            if (zoomFactor[i] >= 1) {
                return i;
            }
        }
        return -1;
    }

    computeSampleValue(samples) {
        if (samples.length === 0) {
            return 0;
        }
        const val = [];
        for(let yIndex = 0; yIndex < samples[0].y.length; yIndex++) {
            let max = samples[0].y[yIndex];
            let min = samples[0].y[yIndex];
            let count = samples[0].y[yIndex];
            for(let i = 1; i < samples.length; i++) {
                const y = samples[i].y[yIndex];
                if (y > max) {
                    max = y;
                }
                else if (y < min) {
                    min = y;
                }
                count += y;
            }
            const avg = count / samples.length;
            if (this.state.mode === 1) {
                val.push(avg);
            }
            else if (this.state.mode === 0) {
                val.push(min);
            }
            else {
                val.push(max);
            }
        }
        return val
    }

    getVisibleData = (data, interval) => {
        const dataStartIndex = this.state.dataStartIndex;
        let startX = Math.floor(this.props.getX(data[dataStartIndex]) / interval) * interval;
        let samples = [{x: startX, y: this.props.getY(data[dataStartIndex])}];
        const res = [];
        for(let i = dataStartIndex + 1; i < data.length; i++) {
            const x = this.props.getX(data[i]);
            const y = this.props.getY(data[i]);
            if (x < startX + interval) {
                // add to samples for this interval
                samples.push({x,y});
            }
            else { 
                // save this point
                const computedY = this.computeSampleValue(samples);
                res.push({x: startX, y: computedY, index: i - 1});
                while(x > startX + (2 * interval )) {
                    // the next element is further away
                    startX += interval;
                    res.push({x: startX, y: computedY, index: i});
                    if (res.length >= this.maxData) {
                        return res;
                    }
                }
                //next interval                
                samples = [{x,y}];
                startX += interval;
            }
            if (res.length >= this.maxData) {
                break;
            }
        }
        return res;
    }

    maxData = this.state.width - 30;

    findPrevIndex = (interval, values) => {
        let curIndex = values[0].index;
        let startX = Math.floor(this.props.getX(this.props.data[curIndex]) / interval) * interval;
        let count = 0;
        while(curIndex > 0) {
            curIndex--;
            const x = this.props.getX(this.props.data[curIndex]);
            if (x > startX - interval) {
                count++;
            }
            else {
                while(x < startX - interval) {
                    count++;
                    startX -= interval;
                }
            }
            if (count >= this.maxData) {
                break;
            }            
        }
        return curIndex;
    }

    getPoints = (values, index, height, interval, minY, maxY) => {
        let points = "";
        // reverse min and max so that we can compute real values.
        let max = this.props.maxVal == null ? values[0].y[index] : this.props.maxVal;
        let min = this.props.minVal == null ? values[0].y[index] : this.props.minVal;
        if (this.props.fixedAxis !== true) {
            for (let i = 1; i < values.length; i++) {
                if (values[i].y[index] > max) {
                    max = values[i].y[index];
                }
                else if (values[i].y[index] < min) {
                    min = values[i].y[index];
                }
            }
            max = 1 + Math.round(max * 1.10);
        }

        const yInterval = max - min;
        for(let i = 0; i <  values.length; i++) {
            try {
                const value = values[i].y[index];
                const y =  Math.round(height - (((value - min) * height) / yInterval) - 12);
                
                const x = Math.round((values[i].x - values[0].x) / interval);
                points = `${points}${x},${y} `;
            }
            catch(e) {
                console.log(e,i,index,values[i]);
                throw e;
            }
        }
        minY[index] = min;
        maxY[index] = max;
        return points;
    }

    renderLines = (width, height, interval, values) => {
        if (values == null || values.length === 0) {
            return "Empty File";
        }

        const boxStyle = {
            height: height + 15,
            width: width
        };

        const pointsList = [];
        const minY = [];
        const maxY = [];
        if (values.length > 0 && values[0].y != null) {
            for(let i = 0; i < values[0].y.length; i++) {
                minY.push(0);
                maxY.push(0);
                pointsList.push(this.getPoints(values, i, height, interval, minY, maxY));
            }
        }

        const verticalLines = [];
        let lineCount = 0;
        if (this.state.xInterval) {
            const xInterval = this.state.xInterval / interval;
            for(let x = 0; x < width; x += xInterval) {
                verticalLines.push(<line key={`vert${lineCount}`} x1={x} y1={height - 12} x2={x} y2="0" style={{stroke: "white"}} />);
                lineCount++;
            }
        }

        const minX = this.props.xDisplay == null ? values[0].x : this.props.xDisplay(values[0].x);
        const maxX = this.props.xDisplay == null ? values[values.length - 1].x : this.props.xDisplay(values[values.length - 1].x);
        const goNext = () => {
            if (values[values.length - 1].index >= this.props.data.length - 1) {                
                return;
            }
            this.setState({dataStartIndex: values[values.length - 1].index});
        }
        const goPrev = () => {
            if (this.state.dataStartIndex === 0) {
                return;
            }            
            this.setState({dataStartIndex: this.findPrevIndex(interval, values)});
        }
        const changeMode = () => {
            const mode = (this.state.mode + 1) % MODE.length;
            this.setState({mode});
        }
        const zoom = move => {        
            const xZoomPos = this.state.xZoomPos + move;
            const xView = (this.state.xView * this.state.xZoomFactors[xZoomPos]) / this.state.xZoomFactors[this.state.xZoomPos];
            const xInterval = (this.state.xInterval * this.state.xZoomFactors[xZoomPos]) / this.state.xZoomFactors[this.state.xZoomPos];
            this.setState({xZoomPos, xView, xInterval});
        }
        const zoomIn = () => {
            if (this.state.xZoomPos === 0) {
                return;
            }
            zoom(-1);
        }
        const zoomOut = () => {
            if (this.state.xZoomPos === this.state.xZoomFactors.length - 1) {
                return;
            }
            zoom(1);
        }
        const getValueAtPos = (x, index) => {
            //const x = Math.round((values[i].x - values[0].x) / interval);
            const timestamp = x * interval + values[0].x;
            console.log(values);
            for(let i = 0; i < values.length; i++) {
                if (values[i].x >= timestamp) {
                    return values[i].y[index];
                }                
            }
            return -1;
        }
        const renderedLines = pointsList.map((points,index) => {
            if (this.props.dataInfo && this.props.dataInfo[index].enable) {
                const handleMouseOver = event => {
                    const element = document.getElementById("graphdata-lines");
                    const svgP = svgPoint(element, event.clientX, event.clientY);
                    const value = getValueAtPos(svgP.x, index);
                    this.setState({valuePos: svgP, value});
                };
                return (
                    <polyline 
                    key={`line${index}`} 
                    points={points} 
                    style={{fill: "none", stroke: DEFAULT_COLORS[index], strokeWidth: 1}} 
                    onMouseOver={handleMouseOver}
                    />
                );
            }
            else {
                return "";
            }
        });

        const posValue = () => {
            if (this.state == null || this.state.valuePos.x < 0 || this.state.valuePos.y < 0) {
                return "";
            }
            return (
                <text fill="white" x={this.state.valuePos.x} y={this.state.valuePos.y > 10 ? this.state.valuePos.y - 10: this.state.valuePos.y + 10}>
                    {this.state.value}
                </text>
            );
        }
        const circleValuePos = () => {
            if (this.state == null || this.state.valuePos.x < 0 || this.state.valuePos.y < 0) {
                return "";
            }
            return (
                <circle cx={this.state.valuePos.x} cy={this.state.valuePos.y} r="2" style={{fill: "none", stroke: "white", strokeWidth: 1}} />
            )
        }
        const renderInfo = () => {
            return minY.map((min, index) => {
                const handleClick = e => {
                    if (this.props.onDataInfoChanged) {
                        this.props.onDataInfoChanged(index, "enable", !this.props.dataInfo[index].enable);
                    }
                };
                return (
                    <div key={`info${index}`} className="graphdata-info">
                        <span style={{color: DEFAULT_COLORS[index]}}>
                            <input type="checkbox" 
                            name={`line${index}`} 
                            checked={this.props.dataInfo && this.props.dataInfo[index].enable ? "checked": ""} 
                            onChange={handleClick}/>
                            {this.props.dataInfo ? this.props.dataInfo[index].name : ""} min: {min}, max: {maxY[index]}
                        </span>
                    </div>
                );
            });
        };
        return (
            <div>
                <div className="graphdata" id={this.props.id} style={boxStyle}>
                    <div className="graphdata-ymin">{minY[0]}</div>
                    <div className="graphdata-ymax">{maxY[0]}</div>
                    <div className="graphdata-title">{this.props.title}</div>
                    <div className="graphdata-axis">
                        <svg height={height} width={width}>
                            <line x1="0" y1={height - 12} x2={width - 15} y2={height - 12}
                                    style={{stroke: "white"}} />
                            <line x1="0" y1={height} x2="0" y2="0" style={{stroke: "white"}} />
                            {verticalLines}
                        </svg>
                    </div>
                    <div className="graphdata-plots">
                        <svg id="graphdata-lines" height={height} width={width - 15}>
                            {renderedLines}
                            {circleValuePos()}
                            {posValue()}
                        </svg>
                    </div>
                </div>
                <div className="graphdata-bottom">
                    <div className="graphdata-actions">
                        <div 
                            className={`graphdata-btn${this.state.dataStartIndex === 0 ? "-grey" : ""}`}
                            onMouseUp={goPrev}>
                                Prev
                        </div>
                        <div 
                            className={`graphdata-btn${values[values.length - 1].index === this.props.data.length - 1 ? "-grey" : ""}`}
                            onMouseUp={goNext}>
                                Next
                        </div>
                        <p>Mode:</p>
                        <div className="graphdata-btn" onMouseUp={changeMode}>
                            {MODE[this.state.mode]}
                        </div>
                        <p>Zoom: {this.state.xZoomFactors[this.state.xZoomPos]}</p>
                        <div className="graphdata-btn" onMouseUp={zoomIn}>
                            in x2
                        </div>
                        <div className="graphdata-btn" onMouseUp={zoomOut}>
                            out x2
                        </div>
                    </div>
                    <div>Interval: {this.state.xInterval}</div>
                    <div>ratio: 1/{interval}</div>
                    <div>First X: {minX}</div>
                    <div>Last X: {maxX} </div>
                    <div>{renderInfo()}</div>
                </div>
            </div>
        )
    }

    render() {
        if (this.props.data == null) {
            return "";
        }
        // compute interval = x axis pixel value.
        const interval = Math.max(1, Math.floor(this.state.xView / this.state.width));
        const data = this.getVisibleData(this.props.data, interval);
        return this.renderLines(this.state.width, this.state.height, interval, data);
    }    
}

GraphData.propTypes = {
    height: PropTypes.number,
    width: PropTypes.number,
    data: PropTypes.array.isRequired,
    dataInfo: PropTypes.array,
    mode: PropTypes.string,
    minVal: PropTypes.number,
    maxVal: PropTypes.number,
    xInterval: PropTypes.number,
    xView: PropTypes.number,
    xDisplay: PropTypes.func,
    xZoomFactors: PropTypes.array,
    getY: PropTypes.func.isRequired,
    getX: PropTypes.func.isRequired,
    fixedAxis: PropTypes.bool
};

export default GraphData;