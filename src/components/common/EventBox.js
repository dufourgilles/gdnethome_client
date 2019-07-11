import React, { Component } from 'react';
import connect from "react-redux/es/connect/connect";
import PropTypes from "prop-types";
import {getEvents} from "../../socket/clientSocket";

import './EventBox.css';

const MAX_EVENTS = 5;

class EventBox extends Component {
    render() {
        const events = this.props.events;
        const selectedEvents = events.slice(events.length >= MAX_EVENTS ? events.length - MAX_EVENTS: 0, events.length);
        let count = 0;
        const displayedEvents = selectedEvents.map(event => {
            return (
                <div key={count++}>
                    {event}
                </div>
            );
        });
        return (
            <div className="event-box">
                {displayedEvents}
            </div>
        );
    }
}

EventBox.propTypes = {
    events: PropTypes.array.isRequired,
};

const mapStateToProps = state => ({
    events: getEvents(state),
});


export default connect(mapStateToProps, undefined)(EventBox);