'use client' // if you use app dir, don't forget this line

import dynamic from "next/dynamic";
const ApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });
type dadosProps = {
    categories : string[];
    data1 : number[];
    data2 : number[];
    className : string;
    children: React.ReactNode;
}
const posicao = 'top'

export function ChartLineTime(props: dadosProps){

    const state = {
          
        series: [
          {
            name: "Valor",
            data: props.data1
          },
          {
            name: "Quantidade",
            data: props.data2
          }
        ],
        options: {
          chart: {
            height: 350,
            dropShadow: {
              enabled: true,
              color: '#000',
              blur: 10,
              opacity: 0.2
            },
            zoom: {
              enabled: false
            },
            toolbar: {
              show: false
            }
          },
          colors: ['#77B6EA', '#545454'],
          dataLabels: {
            enabled: true,
          },
          title: {
            text: 'Valores (R$)',
          },
          grid: {
            borderColor: '#e7e7e7',
            row: {
              colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
              opacity: 0.5
            },
          },
          markers: {
            size: 1
          },
          xaxis: {
            categories: props.categories,
            title: {
              text: 'Mes'
            }
          },
          yaxis: {
            title: {
              text: 'Temperature'
            },
            min: 5,
            max: 40
          },
          legend:{
            position: posicao.toString()
          }
        },
      
      
      };

    const option = {
        chart: {
          id: 'apexchart-example',
          zoom: {
            enabled: false
          }
        },
        xaxis: {
          categories: props.categories
        }
      }
    const tilte = {
        text: 'Product Trends by Month',
        align: 'left'
    }

    const grid =  {
    row: {
        colors: ['#ffffff', 'transparent'], // takes an array which will be repeated on columns
        opacity: 0.5
    },
    }

    const series = [{
        name: 'series-1',
        data: props.data
      }]

    const options2 = {
        chart: {
            height: 350,
            type: 'line',
            zoom: {
            enabled: false
            }
        },
        dataLabels: {
            enabled: false
        },
        stroke: {
            curve: 'straight'
        },
        title: {
            text: 'Product Trends by Month',
            align: 'left'
        },
        grid: {
            row: {
            colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
            opacity: 0.5
            },
        },
        xaxis: {
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
        }
    }

    return(
        <>
            <ApexChart type="line" options={state.options}  series={state.series} height={500} width={800} className = {props.className} />
        </>
    )
    
}