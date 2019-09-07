import React, { Component } from 'react';
import PropTypes from "prop-types";
import './GraphData.css';

const MODE = [
    "min",
    "avg",
    "max"  
];

class GraphData extends Component {
    state = {
        dataStartIndex: 0,
        width: this.props.width == null ? 600 : Math.max(this.props.width, 600),
        height: this.props.height == null ? 100 : this.props.height,
        xView: this.props.xView == null ? 3600 : this.props.xView,
        mode: this.props.mode == null ? 1 : this.props.mode,
        xZoomFactors: this.props.xZoomFactors == null ? [ 0.25, 0.5, 1 , 2, 4, 8, 16, 24, 48, 144 ] : this.props.xZoomFactors,
        xZoomPos: 2,
        xInterval: this.props.xInterval
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
        let max = samples[0].y;
        let min = samples[0].y;
        let count = samples[0].y;
        for(let i = 1; i < samples.length; i++) {
            const y = samples[i].y;
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
            return avg;
        }
        else if (this.state.mode === 0) {
            return min;
        }
        return max;
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

    renderLines = (width, height, interval, values) => {
        const boxStyle = {
            height: height + 15,
            width: width
        };

        let points = "";

        // reverse min and max so that we can compute real values.
        let max = this.props.maxVal == null ? values[0].y : this.props.maxVal;
        let min = this.props.minVal == null ? values[0].y : this.props.minVal;
        if (this.props.fixedAxis !== true) {
            for (let i = 1; i < values.length; i++) {
                if (values[i].y > max) {
                    max = values[i].y;
                }
                else if (values[i].y < min) {
                    min = values[i].y;
                }
            }
            max = 1 + Math.round(max * 1.10);
        }

        const yInterval = max - min;
        for(let i = 0; i <  values.length; i++) {
            try {
                const value = values[i].y;
                const y =  height - (((value - min) * height) / yInterval) - 12;
                
                const x = (values[i].x - values[0].x) / interval;
                points = `${points}${x},${y} `;
            }
            catch(e) {
                console.log(e,i, values[i]);
                throw e;
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
        return (
            <div>
                <div className="graphdata" id={this.props.id} style={boxStyle}>
                    <div className="graphdata-ymin">{min}</div>
                    <div className="graphdata-ymax">{max}</div>
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
                        <svg height={height} width={width - 15}>
                            <polyline points={points} style={{fill: "none", stroke: "mediumpurple", strokeWidth: 1}} />
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