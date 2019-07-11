import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {Modal, Button} from 'react-bootstrap';
import './DataPointListEditor.css';
import DatapointList from '../common/DatapointList';
import FontAwesome from 'react-fontawesome';

function _formatDataPoint(dp, action, arrowLeft = false){
    const selectDP = () => {
        action(dp);
    };
    const tooltipID = `tooltip-${dp.id}`;
    const displayTooltip = (event) => {
        const tt = document.getElementById(tooltipID);
        tt.style.display = "block";
        tt.style.top = `${event.pageY + 18}px`;
    };
    const hideTooltip = () => {
        const tt = document.getElementById(tooltipID);
        tt.style.display = "none";
    };
    const lineAndArrow = arrowLeft ?
        (
            <div className="datapointlisteditor-datapoint-line-unselect">
                <FontAwesome name="caret-left" onClick={selectDP}/>
                <div className="datapointlisteditor-datapoint-line-text" onMouseOver={displayTooltip} onMouseOut={hideTooltip}>{dp.name}</div>
            </div>
        )
        :
        (
            <div className="datapointlisteditor-datapoint-line-select">
                <div className="datapointlisteditor-datapoint-line-text" onMouseOver={displayTooltip} onMouseOut={hideTooltip}>{dp.name}</div>
                <FontAwesome name="caret-right" onClick={selectDP}/>
            </div>
        );

    return (
        <div key={dp.id} >
            {lineAndArrow}
            <div id={tooltipID} className="datapointlisteditor-tooltip">
                <p>{dp.name}</p>
                {`${dp.id} ${dp.description}`}
            </div>
        </div>
    );
}

class DataPointListEditor extends Component {
    state = {
        visible: this.props.visible,
        group: this.props.group
    };

    show = () => {
        this.setState({ visible: true });
    };

    hide = () => {
        this.setState({ visible: false });
    };

    handleClose = () => {
        if (this.props.close != null) {
            this.props.close();
        }
    };

    componentDidUpdate(prevProps) {
        if ((this.props.visible === prevProps.visible)&&
            (this.props.group === prevProps.group)) {
            return;
        }

        if (this.props.group !== prevProps.group) {
            this.setState({group: this.props.group});
        }

        if (this.state.visible !== this.props.visible) {
            if (this.props.visible) {
                this.show();
            }
            else {
                this.hide();
            }
        }
    }

    render() {
        const datapoints = this.props.datapoints;
        const groupDatapoints = this.state.group.datapoints || [];
        const selectableDatapoints = datapoints.filter(dp => {
            for(let datapoint of groupDatapoints) {
                if (datapoint.id === dp.id) {
                    return false;
                }
            }
            return true;
        });
        //.map(dp => formatDataPoint(dp, this.props.select));
        const formatDatapoint = datapoint => {
            return _formatDataPoint(datapoint, this.props.select)
        };
        const selectedDatapoints = groupDatapoints.map(dp => _formatDataPoint(dp, this.props.unselect, true));

        return (
            <div className="modal-datapointlist-editor">
                <Modal show={this.state.visible} onHide={this.handleClose}>
                    <Modal.Header>
                        <Modal.Title>DataPoints</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="datapointlisteditor-body">
                            <DatapointList datapoints={selectableDatapoints} format={formatDatapoint}/>
                            <div className="datapointlisteditor-middle-arrow">
                                <div >
                                    <FontAwesome name="arrow-right"/>
                                </div>
                                <div>
                                    <FontAwesome name="arrow-left"/>
                                </div>
                            </div>
                            <div className="selected-datapoint-list">
                                {selectedDatapoints}
                            </div>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={this.handleClose}>Close</Button>
                    </Modal.Footer>
                </Modal>
            </div>
        );
    }
}

DataPointListEditor.propTypes = {
    visible: PropTypes.bool,
    datapoints: PropTypes.array,
    group: PropTypes.object.isRequired,
    select: PropTypes.func.isRequired,
    unselect: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
    datapoints: state.datapoints.items
});


export default connect(mapStateToProps, undefined)(DataPointListEditor);


