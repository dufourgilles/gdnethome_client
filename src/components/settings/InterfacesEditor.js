import React from 'react';
import { connect } from 'react-redux';
import InterfaceViewer from "./InterfaceViewer";
import PropTypes from "prop-types";

class InterfacesEditor extends React.Component {
    render() {
        const ifaces = [];
        for(let name in this.props.networkConfig){
            const handleValueChange = (n, value) => {
                if (this.props.onChange) {                    
                    this.props.onChange(n, value);
                }
            }
            ifaces.push(
                <InterfaceViewer
                    key={name}
                    interfaceName={name}
                    interfaceConfig={this.props.networkConfig[name]}
                    onChange={handleValueChange}
                />
            );
        }
        return (
            <div>
               {ifaces} 
            </div>
        );
    }
}

InterfacesEditor.propTypes = {
    networkConfig: PropTypes.object.isRequired,
    onChange: PropTypes.func
};


export default connect(undefined, undefined)(InterfacesEditor);


