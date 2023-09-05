import React, { useEffect, useState } from "react";
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import { useSelector } from "react-redux";

var seriesContainer = [];
var xAxis;
var root;
function TemperatureLineChart({ selectedBmsIndex }) {
  const voltage = useSelector((state) => state.voltage);
  const temp = useSelector((state) => state.temp);
  const current = useSelector((state) => state.current);

  const [chartDefined, setChartDefined] = useState(false);

  useEffect(() => {
    if (seriesContainer.length <= 0) setChartDefined(false);
    if (
      voltage[`bms ${selectedBmsIndex}`] &&
      temp[`bms ${selectedBmsIndex}`] !== undefined
    ) {
      if (!chartDefined) {
        root = am5.Root.new("chartdiv");

        root.setThemes([am5themes_Animated.new(root)]);

        // Generate random data
        var value = 10;

        function generateChartData() {
          let chartData = [];
          let firstDate = new Date();
          firstDate.setDate(firstDate.getDate() - 1000);
          firstDate.setHours(0, 0, 0, 0);

          for (var i = 0; i < 50; i++) {
            let newDate = new Date(firstDate);
            newDate.setSeconds(newDate.getSeconds());

            value += (Math.random() < 0.5 ? 1 : -1) * Math.random() * 10;

            chartData.push({
              date: newDate.getTime(),
              value: 0,
            });
          }
          return chartData;
        }

        let data = generateChartData();
        // console.log("data : ");
        // console.log(data);

        // Create chart
        // https://www.amcharts.com/docs/v5/charts/xy-chart/
        var chart = root.container.children.push(
          am5xy.XYChart.new(root, {
            focusable: true,
            panX: true,
            panY: true,
            wheelX: "panX",
            wheelY: "zoomX",
            pinchZoomX: true,
          })
        );

        var easing = am5.ease.linear;

        // Create axes
        // https://www.amcharts.com/docs/v5/charts/xy-chart/axes/
        xAxis = chart.xAxes.push(
          am5xy.DateAxis.new(root, {
            maxDeviation: 0.5,
            groupData: false,
            extraMax: 0.1, // this adds some space in front
            extraMin: -0.1, // this removes some space form th beginning so that the line would not be cut off
            baseInterval: {
              timeUnit: "second",
              count: 1,
            },
            renderer: am5xy.AxisRendererX.new(root, {
              minGridDistance: 50,
            }),
            tooltip: am5.Tooltip.new(root, {}),
          })
        );

        var yAxis = chart.yAxes.push(
          am5xy.ValueAxis.new(root, {
            renderer: am5xy.AxisRendererY.new(root, {}),
          })
        );

        // Add series
        // https://www.amcharts.com/docs/v5/charts/xy-chart/series/
        // if(seriesContainer === 5){
        //   console.log("chartDefined : " , chartDefined)
        // } 
          for (let i = 0; i < 5; i++) {
            let series = chart.series.push(
              am5xy.LineSeries.new(root, {
                name: `Series ${i}`,
                xAxis: xAxis,
                yAxis: yAxis,
                valueYField: "value",
                valueXField: "date",
                tooltip: am5.Tooltip.new(root, {
                  pointerOrientation: "horizontal",
                  labelText: "{valueY}",
                }),
              })
            );
            seriesContainer.push(series);
          }
        
          
        // console.log("seriesContainer", seriesContainer);
        // tell that the last data item must create bullet
        data[data.length - 1].bullet = true;
        seriesContainer.map((series) => series.data.setAll(data));

        // Create animating bullet by adding two circles in a bullet container and
        // animating radius and opacity of one of them.
        const colors = [
          0xff5733, // Red
          0x33ff77, // Green
          0x33b5ff, // Blue
          0xff66b2, // Pink
          0xa64d79, // Purple
          0xffcb77, // Peach
          0x66e0ff, // Sky Blue
          0xa6ccff, // Light Blue
          0xff99e6, // Light Pink
          0x99ff66, // Lime Green
          0xffd700, // Gold
          0xffa07a, // Light Salmon
          0x87cefa, // Light Sky Blue
          0xff6347, // Tomato
          0x7b68ee, // Medium Slate Blue
          0x20b2aa, // Light Sea Green
        ];

        for (let i = 0; i < 5; i++) {
          seriesContainer[i].bullets.push(function (root, series, dataItem) {
            // only create sprite if bullet == true in data context
            if (dataItem.dataContext.bullet) {
              let container = am5.Container.new(root, {});
              let circle0 = container.children.push(
                am5.Circle.new(root, {
                  radius: 5,
                  fill: am5.color(colors[i]),
                })
              );
              let circle1 = container.children.push(
                am5.Circle.new(root, {
                  radius: 5,
                  fill: am5.color(colors[i]),
                })
              );

              circle1.animate({
                key: "radius",
                to: 20,
                duration: 1000,
                easing: am5.ease.out(am5.ease.cubic),
                loops: Infinity,
              });
              circle1.animate({
                key: "opacity",
                to: 0,
                from: 1,
                duration: 1000,
                easing: am5.ease.out(am5.ease.cubic),
                loops: Infinity,
              });

              return am5.Bullet.new(root, {
                locationX: undefined,
                sprite: container,
              });
            }
          });
        }

        // Add cursor
        // https://www.amcharts.com/docs/v5/charts/xy-chart/cursor/
        var cursor = chart.set(
          "cursor",
          am5xy.XYCursor.new(root, {
            xAxis: xAxis,
          })
        );
        cursor.lineY.set("visible", false);

        // Update data every second
        // setInterval(function () {
        addData();
        // }, 1000);

        function addData() {
          for (let i = 0; i < 5; i++) {
            let lastDataItem =
              seriesContainer[i].dataItems[
                seriesContainer[i].dataItems.length - 1
              ];
            let lastValue = lastDataItem.get("valueY");
            let newValue =
              value + (Math.random() < 0.5 ? 1 : -1) * Math.random() * 5;
            let lastDate = new Date(lastDataItem.get("valueX"));
            let time = am5.time.add(new Date(lastDate), "second", 1).getTime();
            seriesContainer[i].data.removeIndex(0);
            seriesContainer[i].data.push({
              date: time,
              value: newValue,
            });

            let newDataItem =
              seriesContainer[i].dataItems[
                seriesContainer[i].dataItems.length - 1
              ];
            newDataItem.animate({
              key: "valueYWorking",
              to: newValue,
              from: lastValue,
              duration: 600,
              easing: easing,
            });

            // use the bullet of last data item so that a new sprite is not created
            if (
              lastDataItem.bullets !== undefined &&
              lastDataItem.bullets[0] !== undefined
            ) {
              newDataItem.bullets = [];
              newDataItem.bullets[0] = lastDataItem.bullets[0];
              // console.log(`new Data Item[0] :`);
              // console.log(newDataItem.bullets[0]);
              newDataItem.bullets[0].get("sprite").dataItem = newDataItem;
              // reset bullets
              lastDataItem.dataContext.bullet = false;
              lastDataItem.bullets = [];
            }
            let animation = newDataItem.animate({
              key: "locationX",
              to: 0.5,
              from: -0.5,
              duration: 600,
            });
            if (animation) {
              let tooltip = xAxis.get("tooltip");
              if (tooltip && !tooltip.isHidden()) {
                animation.events.on("stopped", function () {
                  xAxis.updateTooltip();
                });
              }
            }
          }
        }

        // Make stuff animate on load
        // https://www.amcharts.com/docs/v5/concepts/animations/
        chart.appear(1000, 100);
        setChartDefined(true);
        // console.log(seriesContainer);
      } else {
        // console.log("chardefined is running");
        // console.log("seriesContainer", seriesContainer);
        for (let i = 0; i < 5; i++) {
          let lastDataItem =
            seriesContainer[i]?.dataItems[
              seriesContainer[i]?.dataItems?.length - 1
            ];
          let lastValue = lastDataItem?.get("valueY");
          let newValue = temp[`bms ${selectedBmsIndex}`] === undefined
              ? "p"
              : temp[`bms ${selectedBmsIndex}`][temp[`bms ${ selectedBmsIndex }`].length - 1][i] === undefined
              ? "-"
              : temp[`bms ${selectedBmsIndex }`][temp[`bms ${ selectedBmsIndex }`].length - 1][i];
          let lastDate = new Date(lastDataItem?.get("valueX"));
          let time = am5.time.add(new Date(lastDate), "second", 1).getTime();
          seriesContainer[i]?.data.removeIndex(0);
          seriesContainer[i]?.data.push({
            date: time,
            value: newValue,
          });

          let newDataItem =
            seriesContainer[i]?.dataItems[
              seriesContainer[i]?.dataItems.length - 1
            ];
          if(newDataItem !== undefined) {
            newDataItem.animate({
            key: "valueYWorking",
            to: newValue,
            from: lastValue,
            duration: 600,
            easing: easing,
          });
        }

          // use the bullet of last data item so that a new sprite is not created
          if (
            lastDataItem !== undefined &&
            lastDataItem.bullets !== undefined &&
            lastDataItem.bullets[0] !== undefined
          ) {
            newDataItem.bullets = [];
            newDataItem.bullets[0] = lastDataItem.bullets[0];
            // console.log(`new Data Item[0] :`);
            // console.log(newDataItem.bullets[0]);
            newDataItem.bullets[0].get("sprite").dataItem = newDataItem;
            // reset bullets
            lastDataItem.dataContext.bullet = false;
            lastDataItem.bullets = [];
          }
          let animation = newDataItem?.animate({
            key: "locationX",
            to: 0.5,
            from: -0.5,
            duration: 600,
          });
          if (animation) {
            let tooltip = xAxis.get("tooltip");
            if (tooltip && !tooltip.isHidden()) {
              animation.events.on("stopped", function () {
                xAxis.updateTooltip();
              });
            }
          }
        }

        if (seriesContainer.length > 5) {
          setChartDefined(false);
          seriesContainer = [];
          root.dispose();
        }
        // }
      }
      // return () => {
      //   // Clean up and dispose of the chart when the component unmounts
      //   root.dispose();
      // };
    }
  }, [voltage, temp, chartDefined, selectedBmsIndex]);

  return (
    <div>
      <div>
        <h2>Temperature v/s Time</h2>
      </div>
      <div id="chartdiv" style={{ width: "100%", height: "500px" }}></div>
    </div>
  );
}

export default TemperatureLineChart;
