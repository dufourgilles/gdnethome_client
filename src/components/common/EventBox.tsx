// @ts-nocheck
import React, { Component } from 'react';
import PropTypes from "prop-types";
import {getEvents, subscribeToEventBuffer} from "../../socket/clientSocket";

import './EventBox.scss';

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

export default function EventBoxQuery() {
    const [events, setEvents] = React.useState(getEvents());
    React.useEffect(() => subscribeToEventBuffer(setEvents), []);
    return <EventBox events={events} />;
}
