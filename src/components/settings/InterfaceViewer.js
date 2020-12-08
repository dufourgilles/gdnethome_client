import React from 'react';
import { connect } from 'react-redux';
import DatapointParameter from "../datapoint/DatapointParameter";
import PropTypes from "prop-types";


class InterfaceViewer extends React.Component {
    state = {
        changed: false
    }

    handleFocusOut = () => {
        // if (this.state.changed === true && this.props.onChange) {
        //     const config = this.props.interfaceConfig;
        //     config.routes = this.state.routes;
        //     config.addresses = this.state.addresses;
        //     this.props.onChange(this.props.interfaceName, config);
        // }
        // this.setState({changed: false});
    }

    renderAddresses = () => {
        const len = this.props.interfaceConfig.addresses == null ? 0 : this.props.interfaceConfig.addresses.length;
        const renderedAddresses = [];
        if (this.props.interfaceConfig.dhcp4 === true || this.props.interfaceConfig.dhcp4 === "yes") {
            return renderedAddresses;
        }
        const handleAddressValueChange = (name, value, index) => {
            const addresses = this.props.interfaceConfig.addresses;
            if (index < addresses.length && this.props.onChange) {
                addresses[index] = value;
                this.props.onChange(this.props.interfaceName, this.props.interfaceConfig);
            }            
        }
        for(let i = 0; i < len; i++) {            
            renderedAddresses.push(
                <DatapointParameter
                    key={`address${i}`}
                    onChange={handleAddressValueChange.bind(this)}
                    onFocusOut={this.handleFocusOut.bind(this)}
                    label={`Address ${i}`}
                    name="addresses"
                    data={this.props.interfaceConfig}
                    index={i} 
                    editable={true}                   
                />
            );
        }
        return renderedAddresses;
    }

    renderRoutes = () => {
        const len = this.props.interfaceConfig.routes == null ? 0 : this.props.interfaceConfig.routes.length;
        const renderedRoutes = [];
        if (this.props.interfaceConfig.dhcp4 === true || this.props.interfaceConfig.dhcp4 === "yes") {
            return renderedRoutes;
        }
        const handleRouteChange = (index, name, value) => {
            const routes = this.props.interfaceConfig.routes;
            if (index < routes.length && this.props.onChange) {
                routes[index][name] = value;
                this.props.onChange(this.props.interfaceName, this.props.interfaceConfig);
            }
        }
        for(let i = 0; i < len; i++) {
            const handleRouteToValueChange = (name, value) => {
                handleRouteChange(i, "to", value);
            }
            const handleRouteViaValueChange = (name, value) => {
                handleRouteChange(i, "via", value);
            }     
            renderedRoutes.push(
                <div className="gdnet-interface-route" key={`route${i}`}>
                    <DatapointParameter
                        onChange={handleRouteToValueChange}
                        label={`Route ${i} to`}
                        name="to"
                        onFocusOut={this.handleFocusOut.bind(this)}
                        data={this.props.interfaceConfig.routes[i]}
                        editable={true}               
                    />
                    <DatapointParameter
                        onChange={handleRouteViaValueChange.bind(this)}
                        onFocusOut={this.handleFocusOut.bind(this)}
                        label="via"
                        name="via"
                        data={this.props.interfaceConfig.routes[i]}
                        editable={true}                   
                    />
                </div>
            );
        }
        return renderedRoutes;
    }

    handleDHCPChange = (name, value) => {
        if (this.props.onChange) {
            this.props.interfaceConfig.dhcp4 = value;
            if (this.props.interfaceConfig.dhcp4 !== true && this.props.interfaceConfig.dhcp4 !== "yes") {
                if (this.props.interfaceConfig.routes == null || this.props.interfaceConfig.routes.length === 0) {
                    this.props.interfaceConfig.routes = [{to: "", via: ""}];
                }
                if (this.props.interfaceConfig.addresses == null || this.props.interfaceConfig.addresses.length === 0) {
                    this.props.interfaceConfig.addresses = ["0.0.0.0/0"];
                }
            } 
            this.props.onChange(this.props.interfaceName, this.props.interfaceConfig);
        }
    }
    render() {
        const iface = this.props.interfaceConfig;
        const dhcp = <DatapointParameter 
            key="dhcp4"
            onChange={this.handleDHCPChange.bind(this)}
            label="DHCP4"
            name="dhcp4"
            data={iface}
            list={[
                {id: "yes", value: "yes"},
                {id: "no", value: "no"}
            ]}
            match="id"
            display="id"
        />
        const addresses = this.renderAddresses();
        const routes = this.renderRoutes();
        return (
            <div className="gdnet-interface-config">
                Interface {this.props.interfaceName}
                {dhcp}
                {addresses}
                {routes}
            </div>
        );
    }

}

InterfaceViewer.propTypes = {
    interfaceName: PropTypes.string.isRequired,
    interfaceConfig: PropTypes.object.isRequired,
    onChange: PropTypes.func
};

export default connect(undefined, undefined)(InterfaceViewer);


