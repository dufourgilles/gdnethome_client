// @ts-nocheck
import React from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';

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

const DropDownMenu = React.forwardRef(({visible, close}, ref) => {
    if (!visible) {
        return null;
    }

    const links = pages.map(page => (
        <NavLink
            key={page.title}
            to={page.url}
            className="dropdown-link"
            activeClassName="dropdown-link-current"
            onClick={close}
        >
            {page.title}
        </NavLink>
    ));

    return (
        <nav
            ref={ref}
            className="app-header-dropdown"
            aria-label="Main navigation"
        >
            {links}
        </nav>
    );
});

DropDownMenu.displayName = "DropDownMenu";

DropDownMenu.propTypes = {
    visible: PropTypes.bool,
    close: PropTypes.func.isRequired
};

export default DropDownMenu;
