import React, { Component } from 'react';
import connect from "react-redux/es/connect/connect";
import PropTypes from 'prop-types';

const pages = [
    {url: "/action", title: "Action"},
    {url: "/condition", title: "Condition"},
    {url: "/dashboard", title: "DashBoard"},
    {url: "/datapointlist", title: "Datapoint"},
    {url: "/datapointctl", title: "DataPointCtl"},
    {url: "/replay", title: "Replay"},
    {url: "/settings", title: "Settings"},
    {url: "/status", title: "Status"}
];

class DropDownMenu extends Component {
    state = {
        moseMovement: false
    }
    componentWillReceiveProps() {
        this.setState({moseMovement: false});
    }
    render() {
        setTimeout(() => {
            if (this.state.moseMovement === false) {                
                this.props.close();
            }
        }, 2000);
        const handleOnMouseOut = (event) => {
            const e = event.toElement || event.relatedTarget;
            if ((e === null) ||
                (e.parentNode.className ===  "app-header-dropdown") ||
                (e.className === "app-header-dropdown")) {
                this.setState({moseMovement: true});
                return;
            }
            this.props.close();
        };

        const links = pages.map(page => {
            const handleClick = () => {
                window.location.href = page.url;
            };
            const isCurrent = window.location.href.indexOf(page.url) >= 0;

            return (
                <div key={page.title} className={`dropdown-link${isCurrent ? "-current": ""}`} onClick={handleClick}>
                    {page.title}
                </div>
            )
        });
        return (
            <div
                className={this.props.visible ? "app-header-dropdown" : "app-header-dropdown-hidden"}
                onMouseOut={handleOnMouseOut}
            >
                {links}
            </div>
        )
    }
}

DropDownMenu.prototypes = {
    visisble: PropTypes.boolean,
    close: PropTypes.function
};

export default connect(undefined, undefined)(DropDownMenu);