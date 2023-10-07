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
var root2 = undefined;
var series2 = am5radar.RadarLineSeries;
var xAxis2;
var data2 =[];
const TempRadialChart = ({index2, graphData2}) => {
    const deviceConnected = useSelector((state) => state.deviceConnected);

   
    
    useEffect(() => {
            data2 =[];
            if(deviceConnected==true && graphData2['bms 0']){
                data2 = [];
                var bms_val2 = graphData2[`bms ${index2}`][graphData2[`bms ${index2}`].length-1];
            
            for(let i=0;i<bms_val2.length;i++){
                if(bms_val2[i]!==undefined)
                    data2.push({
                    name:`T ${i+1}`,
                    value: bms_val2[i]
                    })
                }
            }
            if(root2==undefined){

                root2 = am5.Root.new('tempDiv');
                console.log(root2)
                root2.setThemes([
                    am5themes_Animated.new(root2)
                  ]);
                  
                  var chart2 = root2.container.children.push(
                    am5radar.RadarChart.new(root2, {
                      panX: false,
                      panY: false,
                      wheelX: "panX",
                      innerRadius: am5.percent(40),
                      radius: am5.percent(70),
                      arrangeTooltips: false
                    })
                  );
                  
                  let cursor2 = chart2.set("cursor", am5radar.RadarCursor.new(root2, {
                    behavior: "zoomX"
                  }));
                  
                  cursor2.lineY.set("visible", false);
                  let xRenderer2 = am5radar.AxisRendererCircular.new(root2, {
                    minGridDistance: 30
                  });
                  xRenderer2.labels.template.setAll({
                    textType: "radial",
                    radius: 10,
                    paddingTop: 0,
                    paddingBottom: 0,
                    centerY: am5.p50,
                    fontSize: "0.8em"
                  });
                  
                  xRenderer2.grid.template.setAll({
                    location: 0.5,
                    strokeDasharray: [2, 2]
                  });
                  
                    xAxis2 = chart2.xAxes.push(
                    am5xy.CategoryAxis.new(root2, {
                      maxDeviation: 0,
                      categoryField: "name",
                      renderer: xRenderer2,
                      tooltip: am5.Tooltip.new(root2, {})
                    })
                  );
                  
                  let yRenderer2 = am5radar.AxisRendererRadial.new(root2, {
                    minGridDistance: 30
                  });
                  
                  let yAxis2 = chart2.yAxes.push(
                    am5xy.ValueAxis.new(root2, {
                      renderer: yRenderer2
                    })
                  );
                  
                  yRenderer2.grid.template.setAll({
                    strokeDasharray: [2, 2]
                  });
                  
                  series2 = chart2.series.push(
                    am5radar.RadarLineSeries.new(root2, {
                      name: "Temperature",
                      xAxis: xAxis2,
                      yAxis: yAxis2,
                      valueYField: "value",
                      categoryXField: "name",
                      tooltip: am5.Tooltip.new(root2, {
                        labelText: "{value}"
                      })
                    })
                  );
                  
                  series2.strokes.template.setAll({
                    strokeOpacity: 0
                  });
                  
                  series2.fills.template.setAll({
                    visible: true,
                    fillOpacity: 0.5
                  });
                  
                 
                  
                  let legend2 = chart2.radarContainer.children.push(
                    am5.Legend.new(root2, {
                      width: 150,
                      centerX: am5.p50,
                      centerY: am5.p50
                    })
                  );
                  legend2.data.setAll([series2]);
                  console.log(data2);
                  series2.data.setAll(data2);
                  xAxis2.data.setAll(data2);
                  
                  series2.appear(1000);
                  chart2.appear(1000, 100); 
            }else{
                series2.data.setAll(data2);
                  xAxis2.data.setAll(data2);
            }
        
        // return () => root.dispose();
    }, [deviceConnected,index2, graphData2])
    

    

 

  return (
    <Chart id="tempDiv"></Chart>
  )
}

export default TempRadialChart