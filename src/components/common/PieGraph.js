import React, { Component } from "react";
import PropTypes from "prop-types";

const COLORS = [
    "red", "blue", "yellow", "green", "grey", "pink", "brown"
];

const RAD360 = 6.28319;

class PieGraph extends Component {
    state = {
        colors: this.props.colors || COLORS,
        cx: Math.round(this.props.width / 2),
        cy: Math.round(this.props.height / 2),
    }

    fromPercentToPoint(percent, r) {
        // Assume we start from y = 0 and turning anti clock wise
        const res = {x:0, y: 0};
        
        res.x = this.state.cx + Math.round(r * Math.cos(RAD360 * percent / 100));
        res.y = this.state.cy - Math.round(r * Math.sin(RAD360 * percent / 100));
        return res;
    }

    getSVGPath(startPoint, destPoint, r, color, bigPie = false) {
        return (
            <path key={`pie-${color}-${startPoint.x}`} d ={`M${startPoint.x},${startPoint.y} A ${r} ${r} 0 ${bigPie ? 1 : 0} 0 ${destPoint.x} ${destPoint.y} L ${this.state.cx},${this.state.cy} Z`} 
                    fill ={color} stroke ="black" />
        );
    }

    getAllSVGPaths(percentValues) {
        const res = [];
        const r = this.state.cx - this.props.xpadding;
        let startPoint = {x: this.state.cx+r, y: this.state.cy};
        let totalPercent = 0;
        let colorIndex = 0;
        for(let value of percentValues) {
            totalPercent += value;
            const destPoint = this.fromPercentToPoint(totalPercent, r);
            res.push(this.getSVGPath(startPoint, destPoint, r, this.state.colors[colorIndex++], value > 50));
            if (colorIndex > this.state.colors.length) {
                colorIndex = 0;
            }
            startPoint = destPoint;
        }
        return res;
    }

    render() {
        const boxStyle = {
            height: this.props.height,
            width: this.props.width
        };
        const r = this.state.cx - this.props.xpadding;

        return (
            <div className="piegraph" id={this.props.id} style={boxStyle}>
                <svg height={this.props.height} width={this.props.width}>
                    {this.getAllSVGPaths(this.props.values)}
                </svg>
            </div>
        );
    }
}

PieGraph.propTypes = {
    height: PropTypes.number.isRequired,
    width: PropTypes.number.isRequired,
    xpadding: PropTypes.number.isRequired,
    colors:  PropTypes.array,
    values: PropTypes.array.isRequired
};

export default PieGraph;