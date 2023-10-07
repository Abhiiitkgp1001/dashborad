import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import * as am5radar from "@amcharts/amcharts5/radar";
import React, {useEffect, useState} from 'react';
import styled from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';

const Chart = styled.div`
    height : 600px;
    flex: 1;
    font-family: Poppins;
    font-weight : 700;
`;
var root = undefined;
var series = am5radar.RadarLineSeries;
var xAxis;
var data =[];
const VoltageRadialChart = ({index, graphData}) => {
    const deviceConnected = useSelector((state) => state.deviceConnected);

   
    
    useEffect(() => {
            data =[];
            if(deviceConnected==true && graphData['bms 0']){
                data = [];
                var bms_val = graphData[`bms ${index}`][graphData[`bms ${index}`].length-1];
            
            for(let i=0;i<bms_val.length;i++){
                if(bms_val[i]!==undefined)
                    data.push({
                    name:`V ${i+1}`,
                    value: bms_val[i]
                    })
                }
            }
            if(root==undefined){

                root = am5.Root.new('voltagediv');
                console.log(root)
                root.setThemes([
                    am5themes_Animated.new(root)
                  ]);
                  
                  var chart = root.container.children.push(
                    am5radar.RadarChart.new(root, {
                      panX: false,
                      panY: false,
                      wheelX: "panX",
                      innerRadius: am5.percent(40),
                      radius: am5.percent(70),
                      arrangeTooltips: false
                    })
                  );
                  let cursor = chart.set("cursor", am5radar.RadarCursor.new(root, {
                    behavior: "zoomX"
                  }));
                  
                  cursor.lineY.set("visible", false);
                  
                  let xRenderer = am5radar.AxisRendererCircular.new(root, {
                    minGridDistance: 30
                  });
                  xRenderer.labels.template.setAll({
                    textType: "radial",
                    radius: 10,
                    paddingTop: 0,
                    paddingBottom: 0,
                    centerY: am5.p50,
                    fontSize: "0.8em"
                  });
                  
                  xRenderer.grid.template.setAll({
                    location: 0.5,
                    strokeDasharray: [2, 2]
                  });
                  
                    xAxis = chart.xAxes.push(
                    am5xy.CategoryAxis.new(root, {
                      maxDeviation: 0,
                      categoryField: "name",
                      renderer: xRenderer,
                      tooltip: am5.Tooltip.new(root, {})
                    })
                  );
                  
                  let yRenderer = am5radar.AxisRendererRadial.new(root, {
                    minGridDistance: 30
                  });
                  
                  let yAxis = chart.yAxes.push(
                    am5xy.ValueAxis.new(root, {
                      renderer: yRenderer
                    })
                  );
                  
                  yRenderer.grid.template.setAll({
                    strokeDasharray: [2, 2]
                  });
                  
                  series = chart.series.push(
                    am5radar.RadarLineSeries.new(root, {
                      name: "Voltage",
                      xAxis: xAxis,
                      yAxis: yAxis,
                      valueYField: "value",
                      categoryXField: "name",
                      tooltip: am5.Tooltip.new(root, {
                        labelText: "{value}"
                      })
                    })
                  );
                  
                  series.strokes.template.setAll({
                    strokeOpacity: 0
                  });
                  
                  series.fills.template.setAll({
                    visible: true,
                    fillOpacity: 0.5
                  });
                  
                 
                  
                  let legend = chart.radarContainer.children.push(
                    am5.Legend.new(root, {
                      width: 150,
                      centerX: am5.p50,
                      centerY: am5.p50
                    })
                  );
                  legend.data.setAll([series]);
                  console.log(data);
                  series.data.setAll(data);
                  xAxis.data.setAll(data);
                  series.appear(1000);
                  chart.appear(1000, 100); 
            }else{
                series.data.setAll(data);
                xAxis.data.setAll(data);
            }
  
        // return () => root.dispose();
    }, [deviceConnected,index, graphData])
    

    

 

  return (
    <Chart id="voltagediv"></Chart>
  )
}

export default VoltageRadialChart