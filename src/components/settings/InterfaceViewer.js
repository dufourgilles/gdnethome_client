import React from 'react';
import { connect } from 'react-redux';
import DatapointParameter from "../datapoint/DatapointParameter";
import PropTypes from "prop-types";


class InterfaceViewer extends React.Component {
    state = {
        addresses: this.props.interfaceConfig.addresses,
        routes: this.props.interfaceConfig.routes,
        changed: false
    }
    handleFocusOut = () => {
        if (this.state.changed === true && this.props.onChange) {
            const config = this.props.interfaceConfig;
            config.routes = this.state.routes;
            config.addresses = this.state.addresses;
            this.props.onChange(this.props.interfaceName, config);
        }
        this.setState({changed: false});
    }
    renderAddresses = () => {
        const len = this.state.addresses == null ? 0 : this.state.addresses.length;
        const renderedAddresses = [];
        const handleAddressValueChange = (name, value, index) => {
            const addresses = this.state.addresses;
            if (index < addresses.length) {
                addresses[index] = value;
                this.setState({addresses, changed: true});
            }            
        }
        for(let i = 0; i < len; i++) {            
            renderedAddresses.push(
                <DatapointParameter
                    key={`address${i}`}
                    onChange={handleAddressValueChange}
                    onFocusOut={this.handleFocusOut}
                    label={`Address ${i}`}
                    name="addresses"
                    data={this.state}
                    index={i} 
                    editable={true}                   
                />
            );
        }
        return renderedAddresses;
    }

    renderRoutes = () => {
        const len = this.state.routes == null ? 0 : this.state.routes.length;
        const renderedRoutes = [];
        const handleRouteChange = (index, name, value) => {
            const routes = this.state.routes;
            if (index < routes.length) {
                routes[index][name] = value;
                this.setState({routes, changed: true});
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
                <DatapointParameter
                    key={`route${i}to`}
                    onChange={handleRouteToValueChange}
                    label={`Route ${i} To`}
                    name="to"
                    onFocusOut={this.handleFocusOut}
                    data={this.state.routes[i]}
                    editable={true}               
                />
            );
            renderedRoutes.push(
                <DatapointParameter
                    key={`route${i}via`}
                    onChange={handleRouteViaValueChange}
                    onFocusOut={this.handleFocusOut}
                    label={`Route ${i} Via`}
                    name="via"
                    data={this.state.routes[i]}
                    editable={true}                   
                />
            );
        }
        return renderedRoutes;
    }

    handleDHCPChange = (name, value) => {
        if (this.props.onChange) {
            const config = this.props.interfaceConfig;
            config.dhcp4 = value;
            if (config.dhcp4 === true || config.dhcp4 === "yes") {
                delete config.routes;
                delete config.addresses;
            }
            else {
                if (config.addresses == null) {
                    config.addresses = ["0.0.0.0/0"];
                }
                if (config.routes == null) {
                    config.routes = [{to: "", via: ""}];
                }
            }
            this.props.onChange(this.props.interfaceName, config);
        }
    }
    render() {
        const iface = this.props.interfaceConfig;
        const dhcp = <DatapointParameter 
            key="dhcp4"
            onChange={this.handleDHCPChange}
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


