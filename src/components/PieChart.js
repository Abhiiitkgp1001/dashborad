import React, { useState, useEffect } from 'react';
import Chart from "react-apexcharts";
import styled from 'styled-components'

let chartOptions = {
    series: [44, 55],
    options: {
      chart: {
        width: 120,
        type: 'pie',
      },
      
      responsive: [{
        breakpoint: 480,
        options: {
          chart: {
            width: 200
          },
          legend: {
            position: 'bottom'
          }
        }
      }]
    }
};
const PieChart = () => {


    // useEffect(() => {
    //   first
    
    //   return () => {
    //     second
    //   }
    // }, [third])
    
  return (
    <div>
        <Chart
            id='1'
            options={chartOptions.options}
            series={chartOptions.series}
            type='pie'
            height={120}
          />
    </div>
  )
}

export default PieChart