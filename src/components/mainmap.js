import React, { Component } from "react";
import { select } from "d3-selection";
import d3 from 'd3'
import _ from "lodash";
import { scaleLinear, scaleTime } from "d3-scale";
import { axisBottom, axisLeft } from "d3-axis";
import { format } from "d3-format";
import { timeFormat } from "d3-time-format";
import { timeWeek, timeDay } from "d3-time";
import {mapdata} from "../components/img/geojson/10m.json";

export class MainMap  extends Component {
    constructor(props){
      super(props);
      this.props = props;
      this._el = this.props.el;
   
      this.containerRef = React.createRef();
    }
    componentDidMount() {
        this._svg = select("body")
          .append("svg")
          .attr("width" , 100)
          .attr("height" , 200);
          this._svg.append("line")
          .attr("x1", 100)
          .attr("x2", 500)
          .attr("y1", 50)
          .attr("y2", 250)
          .attr("stroke", "black");

        let projection = d3.geoEquirectangular();
        let geoGenerator = d3.geoPath()
          .projection(projection);
        let u = select("body")
          .selectAll('path')
          .data(mapdata.states.geometries);
        u.enter()
          .append('path')
          .attr('d', geoGenerator);

        
    }

   // componentDidUpdate(prevProps, prevState) {

   // }

    render() {
        return (    
          <svg
            width={this.props.width}
            height={this.props.height}
            className="svg-container"
            style={{ overflow: "hidden" }}
            ref={this.containerRef}
          ></svg>
          
        );
      }
}
export default MainMap;