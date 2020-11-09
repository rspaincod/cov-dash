import React from 'react';

const Home = () => {
    return (
        <div className="page-content">
            <div className="para-content">
                <br /><br />
                <h1>COVID-19 United States visualizations</h1>
                <h2>No-frills views of COVID-19 data for the United States.</h2>
                <p className="sub-head"><b>The data</b> is compiled and provided by the wonderful people at the <a href="https://covidtracking.com/">The COVID Tracking Project</a>.
           These datasets are the same used by Johns Hopkins, The White House, The New York Times, CNN and many others. Additional averaging, smoothing and aggregation has been applied to the base data in an attempt to provide better visual meaning.</p>
                <p className="sub-head">Currently the data will be <b>updated at least weekly</b>, with the intent to automate the updates daily.</p>
                <p className="sub-head">The bare bones website was hastily built using the <a href="https://reactjs.org/">React UI library</a>. Some future attempts may be made to apply some UI designer touches, so please queue criticisms for at least a few weeks :) </p>
                <p className="sub-head">The <b>data visualizations</b> were created using the <a href="https://d3js.org/"><b>D3</b></a> JavaScript library which is truly brilliant!</p>
                <p className="sub-head">Additional state detail drill-down features will be added soon. Please report any bugs, data issues or suggestions to <a href="mailto:rod.spainhower.design@gmail.com">rod.spainhower.design@gmail.com</a></p>
               
            </div>
        </div>
    );
}
export default Home;