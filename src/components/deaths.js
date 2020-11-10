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

        var colors = ['#009392','#72aaa1','#b1c7b3','#f1eac8','#e5b9ad','#d98994','#d0587e'];
        var col_domain = f.getColDomain(f.change_30_60, colors, 'deaths_change_30_60');
        var col_domain_cum100k = f.getColDomain(f.current_states, colors, 'cumulative_deaths_100k');
        var col_domain_cum = f.getColDomain(f.current_states, colors, 'cumulative_deaths');

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
            , col_domain: col_domain
            , col_range: colors
            , col_domain_cum100k: col_domain_cum100k
            , col_domain_cum: col_domain_cum
        });

    }

    render() {
        const { mapDat, change_30_60, change_30_60_US, current_US, label3060, stateDat, repDate, height, width, col_domain, col_range, col_domain_cum100k, col_domain_cum  } = this.state;
        if (repDate) {
            return (
                <div className="page-content">
                    <UsStatesStaticViz
                        map_dat={mapDat}
                        state_dat={change_30_60}
                        rep_type="deaths_change_30_60"
                        rep_date={repDate}
                        label3060={label3060}
                        col_domain={col_domain}
                        col_range={col_range}
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
                        col_domain={col_domain_cum}
                        col_range={col_range}
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
                        col_domain={col_domain_cum100k}
                        col_range={col_range}
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