import React, { Component } from 'react';
import * as d3 from 'd3';
class UsStatesStaticViz extends Component {
    state = {
        date: ''
    }

    async componentDidMount() {
        if (this.props.state_dat) {
            this.loadMap();
        }
    }

    loadMap() {
        var repType = this.props.rep_type;
        // D3 Projection
        var projection = d3.geoAlbersUsa()
            .translate([this.props.width / 2, this.props.height / 2])     // translate to center of screen
            .scale([1600]);                         // scale things down so see entire US

        // Define path generator
        var path = d3.geoPath()                     // path generator that will convert GeoJSON to SVG paths
            .projection(projection);                // tell path generator to use albersUsa projection

        var color = d3.scaleLinear()
            .domain(this.props.col_domain)
            .range(this.props.col_range);

        var svg = d3.select("#" + repType)
            .append("svg")
            .attr("width", this.props.width)
            .attr("height", this.props.height)
            .attr("id", "svg_map");

        svg.selectAll("path")
            .data(this.props.map_dat.features)
            .enter()
            .append("path")
            .attr("id", function (d) { return d.properties.name.replace(/\s/g, '_'); })
            .attr("d", path)
            .style("stroke", "#fff")
            .style("stroke-width", "1")
            .style("fill", function (f) {
                switch (repType) {
                    case 'cumulative_cases_100k':
                        return color(f.properties.positive100k);
                    case 'cumulative_cases':
                        return color(f.properties.positive);
                    case 'cumulative_deaths_100k':
                        return color(f.properties.death100k);
                    case 'cumulative_deaths':
                        return color(f.properties.death);
                    case 'cumulative_tests_100k':
                        return color(f.properties.totalTestResults100k);
                    case 'cumulative_tests':
                        return color(f.properties.totalTestResults);
                    case 'cumulative_hosp_100k':
                        return color(f.properties.hospitalized100k);
                    case 'cumulative_hosp':
                        return color(f.properties.hospitalized);
                    case 'cases_change_30_60':
                        return color(f.properties.positiveIncreasePercMonth);
                    case 'deaths_change_30_60':
                        return color(f.properties.deathIncreasePercMonth);
                    case 'tests_change_30_60':
                        return color(f.properties.totalTestResultsIncreasePercMonth);
                    case 'positivity_change_30_60':
                        return color(f.properties.positivePercentageIncreaseMonth);
                    case 'hospitalizations_change_30_60':
                        return color(f.properties.hospitalizedIncreasePercMonth);
                    default:
                }

            });

        // Begin with state names.
        svg.append("g")
            .attr("class", "states-names")
            .selectAll("text")
            .data(this.props.map_dat.features)
            .enter()
            .append("svg:text")
            .attr("id", function (d) { return d.properties.name.replace(/\s/g, '_') + '_label'; })
            .text(function (d) {
                switch (repType) {
                    case 'cumulative_cases_100k':
                        return d.properties.abbr + ' ' + Number(d.properties.positive100k).toLocaleString('en');
                    case 'cumulative_cases':
                        return d.properties.abbr + ' ' + Number(d.properties.positive).toLocaleString('en');
                    case 'cumulative_deaths_100k':
                        return d.properties.abbr + ' ' + Number(d.properties.death100k).toLocaleString('en');
                    case 'cumulative_deaths':
                        return d.properties.abbr + ' ' + Number(d.properties.death).toLocaleString('en');
                    case 'cumulative_tests_100k':
                        return d.properties.abbr + ' ' + Number(d.properties.totalTestResults100k).toLocaleString('en');
                    case 'cumulative_tests':
                        return d.properties.abbr + ' ' + Number(d.properties.totalTestResults).toLocaleString('en');
                    case 'cumulative_hosp_100k':
                        if (Number(d.properties.hospitalized100k) === -999999) {
                            return d.properties.abbr + ' N/A';
                        } else {
                            return d.properties.abbr + ' ' + Number(d.properties.hospitalized100k).toLocaleString('en');
                        }
                    case 'cumulative_hosp':
                        return d.properties.abbr + ' ' + Number(d.properties.hospitalized).toLocaleString('en');
                    case 'cases_change_30_60':
                        return d.properties.abbr + ' ' + d.properties.positiveIncreasePercMonth.toLocaleString('en') + '%';
                    case 'deaths_change_30_60':
                        return d.properties.abbr + ' ' + d.properties.deathIncreasePercMonth.toLocaleString('en') + '%';
                    case 'tests_change_30_60':
                        return d.properties.abbr + ' ' + d.properties.totalTestResultsIncreasePercMonth.toLocaleString('en') + '%';
                    case 'positivity_change_30_60':
                        return d.properties.abbr + ' ' + d.properties.positivePercentageIncreaseMonth.toLocaleString('en') + '%';
                    case 'hospitalizations_change_30_60':
                        return d.properties.abbr + ' ' + d.properties.hospitalizedIncreasePercMonth + '%';
                    default:
                }

            })
            .attr("x", function (d) {
                return path.centroid(d)[0];
            })
            .attr("y", function (d) {
                return path.centroid(d)[1];
            })
            .attr("text-anchor", "middle")
            .style("fill", "rgb(5,5,5)");

        ///////////////////////////////
        // Second line raw values.
        svg.append("g")
            .attr("class", "states-values")
            .selectAll("text")
            .data(this.props.map_dat.features)
            .enter()
            .append("svg:text")
            .attr("id", function (d) { return d.properties.name.replace(/\s/g, '_') + '_label'; })
            .text(function (d) {
                switch (repType) {
                    case 'cases_change_30_60':
                        return '[' + Math.round(d.properties.positiveIncreaseAvgT1).toLocaleString('en') + ' / ' + Math.round(d.properties.positiveIncreaseAvgT2).toLocaleString('en') + ']';
                    case 'deaths_change_30_60':
                        return '[' + d.properties.deathIncreaseAvgT1 + ' / ' + d.properties.deathIncreaseAvgT2 + ']';
                    case 'tests_change_30_60':
                        return '[' + Math.round(d.properties.totalTestResultsIncreaseAvgT1).toLocaleString('en') + ' / ' + Math.round(d.properties.totalTestResultsIncreaseAvgT2).toLocaleString('en') + ']';
                    case 'positivity_change_30_60':
                        return '[' + Math.round(d.properties.positivePercentageT1).toLocaleString('en') + '% / ' + Math.round(d.properties.positivePercentageT2).toLocaleString('en') + '%]';
                    case 'hospitalizations_change_30_60':
                        return '[' + Math.round(d.properties.hospitalizedIncreaseAvgT1).toLocaleString('en') + '% / ' + Math.round(d.properties.hospitalizedIncreaseAvgT2).toLocaleString('en') + '%]';
                    default:
                }
            })
            .attr("x", function (d) {
                return path.centroid(d)[0];
            })
            .attr("y", function (d) {
                return path.centroid(d)[1] + 10;
            })
            .attr("text-anchor", "middle")
            .style("fill", "rgb(5,5,5)");


    }



    render() {

        return (
            <div className="page-content">
            </div>
        );
    }
}
export default UsStatesStaticViz;