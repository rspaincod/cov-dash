import React, { Component } from 'react';
import DataFetch from '../lib/datafetcher';
import UsStatesStaticViz from './visualization/usStatesStaticViz';
import Loading from './loading';
class Cases extends Component {
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

        var change_30_60_US = {
            positiveIncreaseAvgT1: Math.round(Number(f.change_30_60_US[0].positiveIncreaseAvgT1), 1).toLocaleString('en'),
            positiveIncreaseAvgT2: Math.round(Number(f.change_30_60_US[0].positiveIncreaseAvgT2), 1).toLocaleString('en'),
            positiveIncreasePercMonth: Math.round(Number(f.change_30_60_US[0].positiveIncreasePercMonth), 1).toLocaleString('en'),
        }
        var current_US = {
            pop: Number(f.current_US[0].Pop),
            positive: Number(f.current_US[0].positive),
            positive100k: Number(f.current_US[0].positive100k),
            death100k: Number(f.current_US[0].death100k),
            totalTestResults100k: Number(f.current_US[0].totalTestResults100k),
            hospitalized100k: Number(f.current_US[0].hospitalized100k)
        }
        var colors = ['#009392','#72aaa1','#b1c7b3','#f1eac8','#e5b9ad','#d98994','#d0587e'];
        var col_domain = f.getColDomain(f.change_30_60, colors, 'cases_change_30_60');
        var col_domain_cum100k = f.getColDomain(f.current_states, colors, 'cumulative_cases_100k');
        var col_domain_cum = f.getColDomain(f.current_states, colors, 'cumulative_cases');
       
        this.setState({
            stateDat: f.current_states
            , change_30_60: f.change_30_60
            , change_30_60_US: change_30_60_US
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
        const { mapDat, change_30_60, change_30_60_US, current_US, stateDat, repDate, label3060, height, width, col_domain, col_range, col_domain_cum100k, col_domain_cum } = this.state;
        if (repDate) {
            return (
                <div className="page-content">
                    <UsStatesStaticViz
                        map_dat={mapDat}
                        state_dat={change_30_60}
                        rep_type="cases_change_30_60"
                        rep_date={repDate}
                        label3060={label3060}
                        col_domain={col_domain}
                        col_range={col_range}
                        width={width}
                        height={height}
                    />
                    <div id="cases_change_30_60"></div>
                    <div className="map-title">30 Day Change Average Daily Cases (average last month vs. this month)<br />
                        {label3060}
                    </div>
                    <div className="map-description">The percentage change in average daily cases during the last 30 days compared to the 30 days prior.</div>
                    <div className="map-us-summary">
                        <div className="map-us-summary-subtitle">US {change_30_60_US.positiveIncreasePercMonth}%</div>
                        <div className="map-us-summary-value">[{change_30_60_US.positiveIncreaseAvgT1} / {change_30_60_US.positiveIncreaseAvgT2}]</div>
                    </div>
                    <br /><br />
                    <UsStatesStaticViz
                        map_dat={mapDat}
                        state_dat={stateDat}
                        state_data_field="positive"
                        rep_type="cumulative_cases"
                        rep_date={repDate}
                        col_domain={col_domain_cum}
                        col_range={col_range}
                        width={width}
                        height={height}
                    />
                    <div id="cumulative_cases"></div>
                    <div className="map-title">Cumulative Cases {repDate}</div>
                    <div className="map-description"></div>
                    <div className="map-us-summary">
                        <div className="map-us-summary-subtitle">US Average: {current_US.positive.toLocaleString('en')}</div>
                    </div>
                    <UsStatesStaticViz
                        map_dat={mapDat}
                        state_dat={stateDat}
                        state_data="data/current_states.csv"
                        rep_type="cumulative_cases_100k"
                        rep_date={repDate}
                        col_domain={col_domain_cum100k}
                        col_range={col_range}
                        width={width}
                        height={height}
                    />
                    <div id="cumulative_cases_100k"></div>
                    <div className="map-title">Cumulative cases per. 100k population {repDate}</div>
                    <div className="map-description"></div>
                    <div className="map-us-summary">
                        <div className="map-us-summary-subtitle">US Average: {current_US.positive100k.toLocaleString('en')}</div>
                    </div>
                    <br /><br />

                </div>
            );
        } else {
            return (<Loading />);
        }
    }
}
export default Cases;