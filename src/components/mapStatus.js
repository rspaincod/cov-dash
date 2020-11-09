import React, { Component } from 'react';
import PropTypes from 'prop-types';
class MapStatus extends Component {
    constructor(props) {
        super(props);
        this.state = {          
           // systemSettingsConnStatusTime: null,
            systemSettingsConnStatusLabel: ''//,
          //  activeRequests: 0,
          //  loading: false
        };
  //      this.intervalHandle;
  //      this.checkConnections = this.checkConnections.bind(this);
  //      this.checkJob = this.checkJob.bind(this);
  //      this.tick = this.tick.bind(this);
    }

    componentDidMount() {
        this.setState({message: this.props.message});
    }


    render() {
        const { message } = this.props;
        return (<div>
            <span>{message}</span>
        </div>
        );
    }
}
MapStatus.propTypes = {
    message: PropTypes.string
  };
  
export default MapStatus;