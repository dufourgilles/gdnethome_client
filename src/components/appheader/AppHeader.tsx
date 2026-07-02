// @ts-nocheck
import React, { Component } from 'react';
import FontAwesome from 'react-fontawesome';
import DropDownMenu from "./DropDownMenu";
import logo from "../../media/gdnet_home_logo.png"
import './AppHeader.scss';

class AppHeader extends Component {
    state = {
        visible: false
    };

    menuRef = React.createRef();
    buttonRef = React.createRef();

    componentDidMount() {
        document.addEventListener("mousedown", this.handleDocumentMouseDown);
        document.addEventListener("keydown", this.handleDocumentKeyDown);
    }

    componentWillUnmount() {
        document.removeEventListener("mousedown", this.handleDocumentMouseDown);
        document.removeEventListener("keydown", this.handleDocumentKeyDown);
    }

    toggleDropDownMenu = () => {
        this.setState(({visible}) => ({visible: !visible}));
    };

    closeDropDownMenu = () => {
        this.setState({visible: false});
    };

    handleDocumentMouseDown = event => {
        if (!this.state.visible) {
            return;
        }

        const menu = this.menuRef.current;
        const button = this.buttonRef.current;
        if ((menu && menu.contains(event.target)) || (button && button.contains(event.target))) {
            return;
        }

        this.closeDropDownMenu();
    };

    handleDocumentKeyDown = event => {
        if (event.key === "Escape") {
            this.closeDropDownMenu();
            if (this.buttonRef.current) {
                this.buttonRef.current.focus();
            }
        }
    };

    render() {
        return (
            <div className="app-header">
                <div className="app-header-title"><img src={logo} style={{width: "100px"}} alt="GDNet Home"/></div>
                <button
                    ref={this.buttonRef}
                    type="button"
                    className="header-menu-button"
                    aria-label="Open navigation menu"
                    aria-haspopup="true"
                    aria-expanded={this.state.visible}
                    onClick={this.toggleDropDownMenu}
                >
                    <FontAwesome name="bars fa-4x header-menu-bars"/>
                </button>
                <DropDownMenu ref={this.menuRef} visible={this.state.visible} close={this.closeDropDownMenu}/>
            </div>
        )
    }
}


export default AppHeader;
