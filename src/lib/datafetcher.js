import * as d3 from 'd3';
import constants from '../lib/constants';

export default class DataFetcher {
    constructor(areaConfig) {
        this._config = areaConfig;
        this.current_states = null;
        this.mapdata = null;
        this.change_30_60 = null;
        this.change_30_60_US = null;
        this.change_report_date = null;
        this.change_report_date_30 = null;
        this.change_report_date_60 = null;
        this.change_report_date_3060_message = '';
        this.current_US = null
    }

    async fetchUsWeeklyChanges() {
        const timeConv = d3.timeParse("%d-%b-%Y");
        const dataset = d3.csv("http://localhost:3000/data/change_weekly_states.csv");
        const states = constants.States;
        
        dataset.then(function (data) {
            const slices = data.columns.slice(1).map(function (id) {
                return {
                    id: id,
                    values: data.map(function (d) {
                        return {
                            date: timeConv(d.date),
                            measurement: +d[id]
                        };
                    })
                };
            });
        });


    }


    async fetchUsMap() {

        const promises =
            [d3.csv('http://localhost:3000/data/current_states.csv'),
            d3.json('http://localhost:3000/data/us-states.json'),
            d3.csv('http://localhost:3000/data/change_30_60.csv'),
            d3.csv('http://localhost:3000/data/change_30_60_US.csv'),
            d3.csv('http://localhost:3000/data/current_US.csv')];

        const values = await Promise.all(promises);
        this.current_states = values[0];
        this.mapdata = values[1];
        this.change_30_60 = values[2]
        this.change_30_60_US = values[3];
        this.current_US = values[4];
        //Set report date vars
        this.change_report_date = this.change_30_60[0].repDate;
        this.change_report_date_30 = this.change_30_60[0].repDateMinus30;
        this.change_report_date_60 = this.change_30_60[0].repDateMinus60;
        this.change_report_date_3060_message = 'Period 1: ' + this.change_report_date_60 + ' through ' + this.change_report_date_30 + ',   Period 2: ' + this.change_report_date_30 + ' through ' + this.change_report_date;
        for (let i = 0; i < this.current_states.length; i++) {
            //TODO: Figure out how to pass the field name and use it below
            for (let j = 0; j < this.mapdata.features.length; j++) {
                if (this.current_states[i].StateName === this.mapdata.features[j].properties.name) {
                    this.mapdata.features[j].properties.positive100k = Number(this.current_states[i].positive100k);
                    this.mapdata.features[j].properties.positive = Number(this.current_states[i].positive);

                    this.mapdata.features[j].properties.death100k = Number(this.current_states[i].death100k);
                    this.mapdata.features[j].properties.death = Number(this.current_states[i].death);

                    this.mapdata.features[j].properties.hospitalized100k = Number(this.current_states[i].hospitalized100k);
                    this.mapdata.features[j].properties.hospitalized = Number(this.current_states[i].hospitalized);

                    this.mapdata.features[j].properties.totalTestResults100k = Number(this.current_states[i].totalTestResults100k);
                    this.mapdata.features[j].properties.totalTestResults = Number(this.current_states[i].totalTestResults);

                    this.mapdata.features[j].properties.abbr = this.current_states[i].state;
                }
            }
            //reportDate = current_states[i].date;
        }
        for (let i = 0; i < this.change_30_60.length; i++) {
            for (let j = 0; j < this.mapdata.features.length; j++) {
                if (this.change_30_60[i].StateName === this.mapdata.features[j].properties.name) {
                    this.mapdata.features[j].properties.positiveIncreaseAvg = Number(this.change_30_60[i].positiveIncreaseAvg);
                    this.mapdata.features[j].properties.positiveIncreasePercMonth = Number(this.change_30_60[i].positiveIncreasePercMonth);
                    this.mapdata.features[j].properties.positivePercentageIncreaseMonth = Number(this.change_30_60[i].positivePercentageIncreaseMonth);

                    this.mapdata.features[j].properties.deathIncreaseAvg = Number(this.change_30_60[i].deathIncreaseAvg);
                    this.mapdata.features[j].properties.deathIncreasePercMonth = Number(this.change_30_60[i].deathIncreasePercMonth);
                    this.mapdata.features[j].properties.totalTestResultsIncreaseAvg = Number(this.change_30_60[i].totalTestResultsIncreaseAvg);
                    this.mapdata.features[j].properties.totalTestResultsIncreasePercMonth = Number(this.change_30_60[i].totalTestResultsIncreasePercMonth);
                    this.mapdata.features[j].properties.hospitalizedIncreaseAvg = Number(this.change_30_60[i].hospitalizedIncreaseAvg);
                    this.mapdata.features[j].properties.hospitalizedIncreasePercMonth = Number(this.change_30_60[i].hospitalizedIncreasePercMonth);

                    this.mapdata.features[j].properties.positiveIncreaseAvgT1 = Number(this.change_30_60[i].positiveIncreaseAvgT1);
                    this.mapdata.features[j].properties.positiveIncreaseAvgT2 = Number(this.change_30_60[i].positiveIncreaseAvgT2);

                    //positivePercentageT1
                    this.mapdata.features[j].properties.positivePercentageT1 = Number(this.change_30_60[i].positivePercentageT1);
                    this.mapdata.features[j].properties.positivePercentageT2 = Number(this.change_30_60[i].positiveIncreaseAvgT2);

                    this.mapdata.features[j].properties.deathIncreaseAvgT1 = Number(this.change_30_60[i].deathIncreaseAvgT1);
                    this.mapdata.features[j].properties.deathIncreaseAvgT2 = Number(this.change_30_60[i].deathIncreaseAvgT2);

                    this.mapdata.features[j].properties.totalTestResultsIncreaseAvgT1 = Number(this.change_30_60[i].totalTestResultsIncreaseAvgT1);
                    this.mapdata.features[j].properties.totalTestResultsIncreaseAvgT2 = Number(this.change_30_60[i].totalTestResultsIncreaseAvgT2);

                    this.mapdata.features[j].properties.hospitalizedIncreaseAvgT1 = Number(this.change_30_60[i].hospitalizedIncreaseAvgT1);
                    this.mapdata.features[j].properties.hospitalizedIncreaseAvgT2 = Number(this.change_30_60[i].hospitalizedIncreaseAvgT2);


                }
            }
        }
    }



    async fetchCurrentStates(stateOverride) {
        const promise = d3.csv('http://localhost:3000/data/current_states.csv');
        await Promise.all(promise).then((values) => {
            var dat = values[0];


        });

    }
}
