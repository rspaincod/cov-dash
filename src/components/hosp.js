import React, { Component } from 'react';
import DataFetch from '../lib/datafetcher';
import UsStatesStaticViz from './visualization/usStatesStaticViz';
import Loading from './loading';

class Hosp extends Component {
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
            , change_30_60_US: f.change_30_60_US
            , mapDat: f.mapdata
            , width: width
            , height: height
            , repDate: f.change_report_date
            , label3060: f.change_report_date_3060_message
        });
    }
  

    render() {
        const { mapDat, stateDat, repDate,change_30_60, change_30_60_US, label3060, height, width } = this.state;
        if (repDate) {
            return (
                <div className="page-content">
                     <UsStatesStaticViz
                        map_dat={mapDat}
                        state_dat={change_30_60}
                        rep_type="hospitalizations_change_30_60"
                        rep_date={repDate}
                        label3060={label3060}
                        col_domain={[0, 120, 340]}
                        col_range={['#ffc6c4', '#cc607d', '#672044']}
                        width={width}
                        height={height}
                    />
                    <div id="hospitalizations_change_30_60"></div>
                    <div className="map-title">30 Day Change Average Daily Hospitalizations (average last month vs. this month)<br />
                        {label3060}
                    </div>
                    <div className="map-description">The percentage change in average daily hospitalizations during the last 30 days compared to the 30 days prior.</div>
                    <div className="map-us-summary">
                        <div className="map-us-summary-subtitle">US {change_30_60_US.hospitalizedIncreasePercMonth}%</div>
                        <div className="map-us-summary-value">[{change_30_60_US.hospitalizedIncreaseAvgT1} / {change_30_60_US.hospitalizedIncreaseAvgT2}]</div>
                    </div>
                    <br /><br />
                    <UsStatesStaticViz
                        map_dat={mapDat}
                        state_dat={stateDat}
                        state_data_field="positive"
                        rep_type="cumulative_hosp"
                        rep_date={repDate}
                        col_domain={[0, 5000,  200000, 1000000]}
                        col_range={['#eee', '#ffc6c4', '#cc607d', '#672044']}
                        width={width}
                        height={height}
                    />
                    <div id="cumulative_hosp"></div>
                    <div className="map-title">Cumulative Hospitalizations {repDate}</div>
                    <div className="map-description"></div>
                    <UsStatesStaticViz
                        map_dat={mapDat}
                        state_dat={stateDat}
                        state_data="data/current_states.csv"
                        rep_type="cumulative_hosp_100k"
                        rep_date={repDate}
                        col_domain={[-999999, 0, 200, 500]}
                        col_range={['#eee', '#ffc6c4', '#cc607d', '#672044']}
                        width={width}
                        height={height}
                    />
                    <div id="cumulative_hosp_100k"></div>
                    <div className="map-title">Cumulative Hospitalizations per. 100k population {repDate}</div>
                </div>
            );
        } else {
            return (<Loading />);
        }
    }
}
export default Hosp;