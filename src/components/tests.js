import React, { Component } from 'react';
import DataFetch from '../lib/datafetcher';
import UsStatesStaticViz from './visualization/usStatesStaticViz';
import Loading from './loading';
class Tests extends Component {
    state = {
    };

    componentDidMount() {
        this.loadData();
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    }

    async loadData() {
        var width = window.innerWidth, height = window.innerHeight * .75;
        
        const f = new DataFetch();
        await f.fetchUsMap();

        this.setState({
            stateDat: f.current_states
            , change_30_60: f.change_30_60
            , label3060: f.change_report_date_3060_message
            , mapDat: f.mapdata
            , width: width
            , height: height
            , repDate: f.change_report_date
        });
        
    }

    render() {
        const { mapDat, stateDat, change_30_60, label3060, repDate, height, width } = this.state;
        if (repDate) {
            return (
                <div className="page-content">                    
                    <UsStatesStaticViz
                        map_dat={mapDat}
                        state_dat={change_30_60}
                        rep_type="tests_change_30_60"
                        rep_date={repDate}
                        label3060={label3060}
                        col_domain={[-10, 40, 100]}
                        col_range={['#ffc6c4', '#cc607d', '#672044']}
                        width={width}
                        height={height}
                    />
                    <div id="tests_change_30_60"></div>
                    <div className="map-title">30 Day Change Average Daily Tests (average last month vs. this month)<br />
                        {label3060}
                    </div>
                    <div className="map-description">The percentage change in average daily tests during the last 30 days compared to the 30 days prior.</div>
                    <br /><br />
                    <UsStatesStaticViz
                        map_dat={mapDat}
                        state_dat={change_30_60}
                        rep_type="positivity_change_30_60"
                        rep_date={repDate}
                        label3060={label3060}
                        col_domain={[-20, 75, 200]}
                        col_range={['#ffc6c4', '#cc607d', '#672044']}
                        width={width}
                        height={height}
                    />
                    <div id="positivity_change_30_60"></div>
                    <div className="map-title">30 Day Change Average Daily Positivity (average last month vs. this month)<br />
                        {label3060}
                    </div>
                    <div className="map-description">The percentage change in Cases/Tests (Positivity) during the last 30 days compared to the 30 days prior.</div>
                    
                    <UsStatesStaticViz
                        map_dat={mapDat}
                        state_dat={stateDat}
                        rep_type="cumulative_tests"
                        rep_date={repDate}
                        col_domain={[0, 3000000, 20000000]}
                        col_range={['#ffc6c4', '#cc607d', '#672044']}
                        width={width}
                        height={height}
                    />
                    <div id="cumulative_tests"></div>
                    <div className="map-title">Cumulative Tests {repDate}</div>
                    <div className="map-description"></div>
                    <UsStatesStaticViz
                        map_dat={mapDat}
                        state_dat={stateDat}
                        rep_type="cumulative_tests_100k"
                        rep_date={repDate}
                        col_domain={[0, 40000, 100000]}
                        col_range={['#ffc6c4', '#cc607d', '#672044']}
                        width={width}
                        height={height}
                    />
                    <div id="cumulative_tests_100k"></div>
                    <div className="map-title">Cumulative Tests per. 100k population {repDate}</div>
                </div>
            );
        } else {
            return (<Loading />);
        }
    }
}
export default Tests;