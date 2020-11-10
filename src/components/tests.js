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

        var colors = ['#009392','#72aaa1','#b1c7b3','#f1eac8','#e5b9ad','#d98994','#d0587e'];
        var col_domain = f.getColDomain(f.change_30_60, colors, 'tests_change_30_60');
        var col_domain_cum100k = f.getColDomain(f.current_states, colors, 'cumulative_tests_100k');
        var col_domain_cum = f.getColDomain(f.current_states, colors, 'cumulative_tests');
        var col_domain_positivity = f.getColDomain(f.change_30_60, colors, 'positivity_change_30_60');


        this.setState({
            stateDat: f.current_states
            , change_30_60: f.change_30_60
            , label3060: f.change_report_date_3060_message
            , mapDat: f.mapdata
            , width: width
            , height: height
            , repDate: f.change_report_date
            , col_domain: col_domain
            , col_range: colors
            , col_domain_cum100k: col_domain_cum100k
            , col_domain_cum: col_domain_cum
            , col_domain_positivity: col_domain_positivity
        });
        
    }

    render() {
        const { mapDat, stateDat, change_30_60, label3060, repDate, height, width, col_domain, col_range, col_domain_cum100k, col_domain_cum, col_domain_positivity } = this.state;
        if (repDate) {
            return (
                <div className="page-content">                    
                    <UsStatesStaticViz
                        map_dat={mapDat}
                        state_dat={change_30_60}
                        rep_type="tests_change_30_60"
                        rep_date={repDate}
                        label3060={label3060}
                        col_domain={col_domain}
                        col_range={col_range}
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
                        col_domain={col_domain_positivity}
                        col_range={col_range}
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
                        col_domain={col_domain_cum}
                        col_range={col_range}
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
                        col_domain={col_domain_cum100k}
                        col_range={col_range}
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