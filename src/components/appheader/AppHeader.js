import React, { Component } from 'react';
import connect from "react-redux/es/connect/connect";
import FontAwesome from 'react-fontawesome';
import DropDownMenu from "./DropDownMenu";
import logo from "../../media/gdnet_home_logo_white.png"
import './AppHeader.css';

class AppHeader extends Component {
    state = {
        visible: false
    };

    openDropDownMenu = () => {
        this.setState({visible: true});
    };

    closeDropDownMenu = () => {
        this.setState({visible: false});
    };

    render() {
        return (
            <div className="app-header">
                <div className="app-header-title"><img alt="logo" src={logo} style={{width: "100px"}}/></div>
                <FontAwesome name="bars fa-4x header-menu-bars" onMouseEnter={this.openDropDownMenu}/>
                <DropDownMenu visible={this.state.visible} close={this.closeDropDownMenu}/>
            </div>
        )
    }
}


export default connect(undefined, undefined)(AppHeader);