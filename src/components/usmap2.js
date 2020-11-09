import React, { Component } from 'react';
import * as d3 from 'd3';
// import MapStatus from '../components/mapStatus';
class UsMap2 extends Component {

    constructor(props) {
        super(props);
        this.onReportTypeChanged = this.onReportTypeChanged.bind(this);
        this.timers = [];
        this.stopTimer = this.stopTimer.bind(this);
        this.resetMap = this.resetMap.bind(this);
        this.createMap = this.createMap.bind(this);
      //  this.myRef = React.createRef();
    }

    state = {
        message: '',
        repType: 'cases'
    };

 //   _setRef(componentNode) {
 //       this._rootNode = componentNode;
 //   }


    //  repType = ['Cases', 'Deaths', 'Tests'];
    componentDidMount() {


        this.loadMap('cases');
        //var legendText = ["Cities Lived", "States Lived", "States Visited", "Nada"];

        /*     
            // Bind the data to the SVG and create one path per GeoJSON feature               
            var paths = svg.selectAll("path")
                .data(this.state.jsonData.features)
                .enter()
                .append("path")
                .attr("id", function(d) { return d.properties.name.replace(/\s/g, '_'); })
                .attr("d", path)            
                .style("stroke", "#fff")
                .style("stroke-width", "1")
              
                
                .style("fill", function (d) {
    
                    // Get data value
                    var value = d.properties.visited;
                    return "rgb(213,222,217)";
                  
                    if (value) {
                        //If value exists…
                        return color(value);                  
                    } else {
                        //If value is undefined…
                        return "rgb(213,222,217)";
                    }
                 
                });
       */

        /* 
                    // State labels
                    svg.selectAll("text")
                        .data(this.state.jsonData.features)
                        .enter()
                        .append("text")
        
                svg.selectAll("circle")
                    .data(this.state.cityData)
                    .enter()
                    .append("circle")
                    .attr("cx", function (d) {
                        return projection([d.lon, d.lat])[0];
                    })
                    .attr("cy", function (d) {
                        return projection([d.lon, d.lat])[1];
                    })
                    .attr("r", function (d) {
                        return Math.sqrt(d.years) * 4;
                    })
                    .style("fill", "rgb(217,91,67)")
                    .style("opacity", 0.85)
        
                    // Modification of custom tooltip code provided by Malcolm Maclean, "D3 Tips and Tricks" 
                    // http://www.d3noob.org/2013/01/adding-tooltips-to-d3js-graph.html
                    .on("mouseover", function (d) {
                        div.transition()
                            .duration(200)
                            .style("opacity", .9);
                        div.text(d.srcElement.__data__.place)
                            .style("left", (window.event.pageX) + "px")
                            .style("top", (window.event.pageY - 28) + "px");
                    })
        
                    // fade out tooltip on mouse out               
                    .on("mouseout", function (d) {
                        div.transition()
                            .duration(500)
                            .style("opacity", 0);
                    })
                    .on("click", function (d) {
                        div.transition()
                            .duration(500)
                            .style("opacity", 0);
                        console.log(d.srcElement.__data__.place);
                    });
                */


        /* 
               
                const cityObj = this.state.cityData;        
        
                for (const d of cityObj) {
                    // d3.timeout(callback, delay);
                    d3.timeout(() => {
                        console.log('howdy ho!');
                        svg.append("circle")
                            .attr("r", Math.sqrt(d.years) * 4)
                            .attr("cx", projection([d.lon, d.lat])[0])
                            .attr("cy", projection([d.lon, d.lat])[1])
                            .attr("stroke", "black")
                            .transition().duration(500)
                            .style("fill", "blue")
                            .style("opacity", 0.85)
                            .attr("fill-opacity", 1)
                            .attr("stroke-opacity", 0)
                            .transition().duration(1000)
                            .attr("fill-opacity", 0)
                            .attr("stroke-opacity", 1);
                    }, delay(d.yearArrived));
                }
          
                var temp_date = '1980';
                svg.transition()
                    .ease(d3.easeLinear)
                    .duration(delay.range()[1])
                    .tween("date", () => {
                        const i = d3.interpolateDate(...delay.domain());
                        return t => temp_date = d3.timeDay(i(t));
                        //return t => $0.value = d3.timeDay(i(t));
                    });
        
                // Modified Legend Code from Mike Bostock: http://bl.ocks.org/mbostock/3888852
             var legend = d3.select("body").append("svg")
                    .attr("class", "legend")
                    .attr("width", 140)
                    .attr("height", 200)
                    .selectAll("g")
                    .data(color.domain().slice().reverse())
                    .enter()
                    .append("g")
                    .attr("transform", function (d, i) { return "translate(0," + i * 20 + ")"; });
        
                legend.append("rect")
                    .attr("width", 18)
                    .attr("height", 18)
                    .style("fill", color);
        
                legend.append("text")
                    .data(legendText)
                    .attr("x", 24)
                    .attr("y", 9)
                    .attr("dy", ".35em")
                    .text(function (d) { return d; });
                */


    }

    componentWillUnmount(){
        this.timers.forEach(this.stopTimer);
        d3.select("svg").remove();
    }

    async loadMapData() {
        const promises =
            [d3.csv('http://localhost:3000/stateslived.csv'),
            d3.csv('http://localhost:3000/citieslived.csv'),
            d3.json('http://localhost:3000/data/us-states.json'),
            d3.csv('http://localhost:3000/statehood.csv'),
            d3.csv('http://localhost:3000/data/state_covid_changes.csv')];

        await Promise.all(promises).then((values) => {
            var citySorted = values[1].sort((a, b) => a.date - b.date);
            var orgMessage = values[4][0].WeekEndDate;
            this.state = { message: orgMessage, stateData: values[0], cityData: citySorted, jsonData: values[2], statehoodData: values[3], stateChanges: values[4] };
        });

        // Loop through each state data value in the .csv file
        for (var i = 0; i < this.state.stateData.length; i++) {
            var dataState = this.state.stateData[i].state;
            var dataValue = this.state.stateData[i].visited;
            for (var j = 0; j < this.state.jsonData.features.length; j++) {
                var jsonState = this.state.jsonData.features[j].properties.name;
                if (dataState === jsonState) {
                    this.state.jsonData.features[j].properties.visited = dataValue;
                    break;
                }
            }
        }
    }

    configMap(width, height) {       

        //Check if svg already exists
        var svg = d3.select('#svg_map');
        if (!svg.empty()) {
           
        } else {
            this.resetMap();
        }
        // Append Div for tooltip to SVG
        d3.select("body")
            .append("div")
            .attr("class", "tooltip")
            .style("opacity", 0);
        return svg;
    }

    resetMap() {

        const stateChangeObj = this.state.stateChanges;
        stateChangeObj.forEach(d => {
            d3.selectAll('#' + d.StateName.replace(/\s/g, '_'))
            .transition().duration(100)
            .style("fill", '#ddd');
            d3.selectAll('#' + d.StateName.replace(/\s/g, '_') + '_label')
                        .transition().duration(100)
                        .style("fill", '#FFF')
                        .text(d.StateName);
        });

       
    }

    createMap(svg, path, width, height) {
        // TODO: Add offsets for State labels
        svg = d3.select("#root")
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("id", "svg_map");

        svg.selectAll("path")
            .data(this.state.jsonData.features)
            .enter()
            .append("path")
            .attr("id", function (d) { return d.properties.name.replace(/\s/g, '_'); })
            .attr("d", path)
            .style("stroke", "#fff")
            .style("stroke-width", "1")
            .style("fill", "rgb(213,222,217)");


        // Begin with state names.
        svg.append("g")
            .attr("class", "states-names")
            .selectAll("text")
            .data(this.state.jsonData.features)
            .enter()
            .append("svg:text")
            .attr("id", function (d) { return d.properties.name.replace(/\s/g, '_') + '_label'; })
            .text(function (d) {
                return d.properties.name;
            })
            .attr("x", function (d) {
                return path.centroid(d)[0];
            })
            .attr("y", function (d) {
                return path.centroid(d)[1];
            })
            .attr("text-anchor", "middle")
            .attr('fill', 'white');
    }

    renderMap(path, color, delay, eventType, width, height) {
      //  this.setState({repType: eventType});
        const stateChangeObj = this.state.stateChanges;
        var svg = d3.select('#svg_map');
        // Bind the data to the SVG and create one path per GeoJSON feature  
        if (svg.empty()) {
            this.createMap(svg, path, width, height);
        /*
            for (var i = 0; i < stateChangeObj.length; i++) {
                var csvState = stateChangeObj[i].StateName;
                var PosAvgPercChange = Number(stateChangeObj[i].PosAvgPercChange);
                var DeathPercChange = Number(stateChangeObj[i].DeathPercChange);
                var csvWeek = Number(stateChangeObj[i].Week);
    
                for (var j = 0; j < this.state.jsonData.features.length; j++) {
                    var jsonStateName = this.state.jsonData.features[j].properties.name;
    
                    if (csvState == jsonStateName) {
                        // Copy the data value into the JSON
                        this.state.jsonData.features[j].properties.PosAvgPercChange = PosAvgPercChange;
                        this.state.jsonData.features[j].properties.DeathPercChange = DeathPercChange;
                        this.state.jsonData.features[j].properties.Week = csvWeek;
                        // Stop looking through the JSON
                        break;
                    }
                }
            }
        */
    
        } else {
            this.resetMap();
        }

        this.setState({ message: 'loading...', repType: eventType });        

        stateChangeObj.forEach(d => {
            var propTyp;
            var propAvgTyp;
            switch (eventType) {
                case 'cases':
                    propTyp = Number(d.PositiveIncrease);
                    propAvgTyp = Number(d.PositivePercChange);
                    break;
                case 'deaths':
                    propTyp = Number(d.DeathIncrease);
                    propAvgTyp = Number(d.DeathPercChange);
                    break;
                case 'tests':
                    propTyp = Number(d.TestIncrease);
                    propAvgTyp = Number(d.TestPercChange);
                    break;
                case 'hosp':
                    propTyp = Number(d.HospIncrease);
                    propAvgTyp = Number(d.HospPercChange);
                    break;
                default:
                    break;
            }
            if (propTyp > 0) {
                this.timers.push(d3.timeout(() => {
                    d3.selectAll('#' + d.StateName.replace(/\s/g, '_'))
                        .transition().duration(750)
                        .style("fill", function (f) {
                            // Get data value
                            var value = propAvgTyp;
                            if (value < 1 && value > 0) {
                                return '#ddd';
                            } else {
                                if (value < -100) {
                                    value = -100;
                                }
                                if (value > 100) {
                                    value = 100;
                                }
                                return color(value);
                            }
                        });
                    d3.selectAll('#' + d.StateName.replace(/\s/g, '_') + '_label')
                        .transition().duration(1000)
                        .style("fill", '#000')
                        .text(function (q) {
                            return propAvgTyp + '% - ' + propTyp + ' new ' + eventType;
                        });
                    this.setState({ message: d.WeekEndDate, repType: eventType });
                }, delay(d.Week)));
            }
        });
    }

    async loadMap(eventType) {
        var width = window.innerWidth, height = window.innerHeight - 80;

        await this.loadMapData();

        // D3 Projection
        var projection = d3.geoAlbersUsa()
            .translate([width / 2, height / 2])     // translate to center of screen
            .scale([2000]);                         // scale things down so see entire US

        // Define path generator
        var path = d3.geoPath()                     // path generator that will convert GeoJSON to SVG paths
            .projection(projection);                // tell path generator to use albersUsa projection

        var color = d3.scaleLinear()
            .domain([-100, 0, 100])
            .range(['green', '#ddd', 'red']);

        var delay = d3.scaleTime()
            .domain([this.state.stateChanges[0].Week, this.state.stateChanges[this.state.stateChanges.length - 1].Week])
            .range([0, 60000]);

        this.timers.forEach(this.stopTimer);
        this.timers = [];

        this.renderMap(path, color, delay, eventType, width, height);
    }

    stopTimer(value, index, array) {
        var obj = array[index];
        obj.stop();
    }

    onReportTypeChanged(event) {
        this.loadMap(event.target.value);
    }

    render() {
        return (
            <div >
                <div className="week-label">{this.state.message}</div>
                <div className="radio-button-group">
                    <div className="radio-button"><input className="check-reptype" name="reportOptions" type="radio" value="cases"
                        checked={this.state.repType === 'cases'} onClick={this.onReportTypeChanged}   /><label>Case Change</label></div>
                    <div className="radio-button"><input className="check-reptype" name="reportOptions" type="radio" value="deaths"
                        checked={this.state.repType === 'deaths'} onClick={this.onReportTypeChanged}  /><label>Death Change</label></div>
                    <div className="radio-button"><input className="check-reptype" name="reportOptions" type="radio" value="tests"
                        checked={this.state.repType === 'tests'} onClick={this.onReportTypeChanged}  /><label>Test Change</label></div>
                    <div className="radio-button"><input className="check-reptype" name="reportOptions" type="radio" value="hosp"
                        checked={this.state.repType === 'hosp'} onClick={this.onReportTypeChanged}  /><label>Hospitalized Change</label></div>
                    

                     <div className="radio-button radio-button-margin"><input className="check-reptype" name="reportOptions" type="radio" value="cum_cases"
                        checked={this.state.repType === 'cum_cases'} onClick={this.onReportTypeChanged}  /><label>Cumu Cases</label></div>
                    <div className="radio-button"><input className="check-reptype" name="reportOptions" type="radio" value="cum_deaths"
                        checked={this.state.repType === 'cum_deaths'} onClick={this.onReportTypeChanged}  /><label>Cumu Deaths</label></div>
                    <div className="radio-button"><input className="check-reptype" name="reportOptions" type="radio" value="cum_tests"
                        checked={this.state.repType === 'cum_tests'} onClick={this.onReportTypeChanged}  /><label>Cumu Tests</label></div>
                    <div className="radio-button"><input className="check-reptype" name="reportOptions" type="radio" value="cum_hosp"
                        checked={this.state.repType === 'cum_hosp'} onClick={this.onReportTypeChanged}  /><label>Cumu Hospitalizations</label></div>

                    <div className="radio-button radio-button-margin"><input className="check-reptype" name="reportOptions" type="radio" value="100k_cases"
                        checked={this.state.repType === '100k_cases'} onClick={this.onReportTypeChanged}  /><label>Cumu-100k Cases</label></div>
                    <div className="radio-button"><input className="check-reptype" name="reportOptions" type="radio" value="100k_deaths"
                        checked={this.state.repType === '100k_deaths'} onClick={this.onReportTypeChanged}  /><label>Cumu-100k Deaths</label></div>
                    <div className="radio-button"><input className="check-reptype" name="reportOptions" type="radio" value="100k_tests"
                        checked={this.state.repType === '100k_tests'} onClick={this.onReportTypeChanged}  /><label>Cumu-100k Tests</label></div>
                    <div className="radio-button"><input className="check-reptype" name="reportOptions" type="radio" value="100k_hosp"
                        checked={this.state.repType === '100k_hosp'} onClick={this.onReportTypeChanged}  /><label>Cumu-100k Hospitalizations</label></div>
                </div>
                <div className="radio-button-group"><button className="control-button">Stop</button></div>
            </div>
        );
    }
}
export default UsMap2;