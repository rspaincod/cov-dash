import React, { Component } from 'react';
import DataFetch from '../lib/datafetcher';
import UsStatesStaticViz from './visualization/usStatesStaticViz';
import Loading from './loading';

class Deaths extends Component {
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
        
        var usDeaths = {
            deathIncreaseAvgT1: Math.round(Number(f.change_30_60_US[0].deathIncreaseAvgT1), 1).toLocaleString('en'),
            deathIncreaseAvgT2: Math.round(Number(f.change_30_60_US[0].deathIncreaseAvgT2), 1).toLocaleString('en'),
            deathIncreasePercMonth: Math.round(Number(f.change_30_60_US[0].deathIncreasePercMonth), 1).toLocaleString('en'),
        }

        var current_US = {
            pop: Number(f.current_US[0].Pop),
            death: Number(f.current_US[0].death),
            death100k: Number(f.current_US[0].death100k)
        }

        this.setState({
            stateDat: f.current_states
            , change_30_60: f.change_30_60
            , change_30_60_US: usDeaths
            , current_US: current_US
            , mapDat: f.mapdata
            , width: width
            , height: height
            , repDate: f.change_report_date
            , label3060: f.change_report_date_3060_message
        });

    }

    render() {
        const { mapDat, change_30_60, change_30_60_US, current_US, label3060, stateDat, repDate, height, width } = this.state;
        if (repDate) {
            return (
                <div className="page-content">
                    <UsStatesStaticViz
                        map_dat={mapDat}
                        state_dat={change_30_60}
                        rep_type="deaths_change_30_60"
                        rep_date={repDate}
                        label3060={label3060}
                        col_domain={[-50, 50, 500]}
                        col_range={['#ffc6c4', '#cc607d', '#672044']}
                        width={width}
                        height={height}
                    />
                    <div id="deaths_change_30_60"></div>
                    <div className="map-title">30 Day Change Average Daily Deaths (average last month vs. this month)<br />
                        {label3060}
                    </div>
                    <div className="map-description">The percentage change in average deaths during the last 30 days compared to the 30 days prior.</div>
                    <div className="map-us-summary">
                        <div className="map-us-summary-subtitle">US {change_30_60_US.deathIncreasePercMonth}%</div>
                        <div className="map-us-summary-value">[{change_30_60_US.deathIncreaseAvgT1} / {change_30_60_US.deathIncreaseAvgT2}]</div>
                    </div>
                    <UsStatesStaticViz
                        map_dat={mapDat}
                        state_dat={stateDat}
                        rep_type="cumulative_deaths"
                        rep_date={repDate}
                        col_domain={[0, 2000, 20000]}
                        col_range={['#ffc6c4', '#cc607d', '#672044']}
                        width={width}
                        height={height}
                    />
                    <div id="cumulative_deaths"></div>
                    <div className="map-title">Cumulative Deaths {repDate}</div>
                    <div className="map-description"></div>
                    <UsStatesStaticViz
                        map_dat={mapDat}
                        state_dat={stateDat}
                        rep_type="cumulative_deaths_100k"
                        rep_date={repDate}
                        col_domain={[0, 70, 160]}
                        col_range={['#ffc6c4', '#cc607d', '#672044']}
                        width={width}
                        height={height}
                    />
                    <div id="cumulative_deaths_100k"></div>
                    <div className="map-title">Cumulative Deaths per. 100k population {repDate}</div>
                </div>
            );
        } else {
            return (<Loading />);
        }
    }
}
export default Deaths;