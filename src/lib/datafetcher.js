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
        const dataset = d3.csv("../data/change_weekly_states.csv");
        const states = constants.States;
        for (let i = 0; i < states.length; i++) {
            // let state = 
            // const result = words.filter(word => word.length > 6);

            // For max element
            // console.log(Math.max(...array1));
        }

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
            [d3.csv('../data/current_states.csv'),
            d3.json('../data/us-states.json'),
            d3.csv('../data/change_30_60.csv'),
            d3.csv('../data/change_30_60_US.csv'),
            d3.csv('../data/current_US.csv')];

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

                    // Add offsets for labels
                    // DE, NH, RI, DE, DC
                    if (this.current_states[i].state === 'CT' || this.current_states[i].state === 'DE' || this.current_states[i].state === 'NH' || this.current_states[i].state === 'RI' || this.current_states[i].state === 'DE' || this.current_states[i].state === 'DC') {
                        switch (this.current_states[i].state) {
                            case 'DC':
                                this.mapdata.features[j].properties.offsetX = 80;
                                break;
                            case 'NH':
                                this.mapdata.features[j].properties.offsetX = 60;
                                break;
                            case 'RI':
                                this.mapdata.features[j].properties.offsetX = 60;
                                break;
                            case 'DE':
                                this.mapdata.features[j].properties.offsetX = 80;
                                this.mapdata.features[j].properties.offsetY = -20;
                                break;
                            case 'CT':
                                this.mapdata.features[j].properties.offsetX = 60;
                                this.mapdata.features[j].properties.offsetY = 20;
                                break;
                            default:
                                this.mapdata.features[j].properties.offset = 80;
                        }
                    }
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
        const promise = d3.csv('../data/current_states.csv');
        await Promise.all(promise).then((values) => {
           // var dat = values[0];


        });

    }


    //TODO: move to library.
    getColDomain(d, c, typ){
        let tot = 0;
        let numbs = [];
        let rng = [c.length];
       // var min = 0, max=0;
        if (typ === 'cases_change_30_60'){
            for (let i=0; i < d.length;i++){
                numbs.push(Number(d[i].positiveIncreasePercMonth));
                tot+= numbs[i];            
            }
        }
        if (typ === 'cumulative_cases_100k'){
            //positive100k
            for (let i=0; i < d.length;i++){
                numbs.push(Number(d[i].positive100k));
                tot+= numbs[i];            
            }
        }
        if (typ === 'cumulative_cases'){
            //positive100k
            for (let i=0; i < d.length;i++){
                numbs.push(Number(d[i].positive));
                tot+= numbs[i];            
            }
        }
        if (typ === 'deaths_change_30_60'){
            for (let i=0; i < d.length;i++){
                numbs.push(Number(d[i].deathIncreasePercMonth));
                tot+= numbs[i];            
            }
        }
        if (typ === 'cumulative_deaths'){
            for (let i=0; i < d.length;i++){
                numbs.push(Number(d[i].death));
                tot+= numbs[i];            
            }
        }
        if (typ === 'cumulative_deaths_100k'){
            for (let i=0; i < d.length;i++){
                numbs.push(Number(d[i].death100k));
                tot+= numbs[i];            
            }
        }       
        if (typ === 'tests_change_30_60'){
            for (let i=0; i < d.length;i++){
                numbs.push(Number(d[i].totalTestResultsIncreasePercMonth));
                tot+= numbs[i];            
            }
        }        
        if (typ === 'positivity_change_30_60'){
            for (let i=0; i < d.length;i++){
                numbs.push(Number(d[i].positivePercentageIncreaseMonth));
                tot+= numbs[i];            
            }
        }        
        if (typ === 'cumulative_tests'){
            for (let i=0; i < d.length;i++){
                numbs.push(Number(d[i].totalTestResults));
                tot+= numbs[i];            
            }
        }        
        if (typ === 'cumulative_tests_100k'){
            for (let i=0; i < d.length;i++){
                numbs.push(Number(d[i].totalTestResults100k));
                tot+= numbs[i];            
            }
        }   

        if (typ === 'cumulative_hospitalizations'){
            for (let i=0; i < d.length;i++){
                numbs.push(Number(d[i].hospitalized));
                tot+= numbs[i];            
            }
        }   
        if (typ === 'cumulative_hospitalizations_100k'){
            for (let i=0; i < d.length;i++){
                numbs.push(Number(d[i].hospitalized100k));
                tot+= numbs[i];            
            }
        }   
        if (typ === 'hospitalizations_change_30_60'){
            for (let i=0; i < d.length;i++){
                numbs.push(Number(d[i].hospitalizedIncreasePercMonth));
                tot+= numbs[i];            
            }
        }   
        let avg = tot / d.length;
        rng[Math.floor(c.length / 2)] = avg;
        rng[0] = Math.min(...numbs);
        rng[c.length-1] = Math.max(...numbs);
        let m = Math.abs(rng[Math.floor(c.length / 2)] - rng[0]);
        //cheat until fix. Dependency on 7 colors.
        rng[2] = avg - Math.floor(m/3) * 1;
        rng[1] = avg - Math.floor(m/3) * 2;
        m = rng[c.length-1] - Math.abs(rng[Math.floor(c.length / 2)]) ;
        rng[4] = avg +  Math.floor(m/3) * 1;
        rng[5] = avg +  Math.floor(m/3) * 2;
        return rng;
    }
}
