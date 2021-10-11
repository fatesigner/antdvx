<template>
  <ScrollView fill-y scroll-y class="tw-bg-gray-100">
    <div class="tw-p-4 tw-text-lg tw-shadow-md tw-bg-white">Echarts 示例</div>
    <div class="tw-grid lg:tw-grid-cols-2 tw-gap-4 tw-p-4">
      <div class="tw-pt-4 tw-pr-2 tw-pb-4 tw-pl-2 tw-rounded-sm tw-shadow-md tw-bg-white" v-for="chart in charts">
        <div class="tw-flex tw-items-center tw-space-x-2">
          <Chart :options="chart.getOptions" :aspect-ratio="2" :filename="chart.name"></Chart>
        </div>
      </div>
    </div>
  </ScrollView>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { ScrollView, echarts } from '@/antdvx';

import { Chart } from '@/shared/chart';

export default defineComponent({
  components: {
    Chart,
    ScrollView
  },
  setup() {
    const charts = [
      {
        name: 'Income of Germany and France since 1950',
        async getOptions() {
          const _rawData = require('./life-expectancy-table.json.json');
          // var countries = ['Australia', 'Canada', 'China', 'Cuba', 'Finland', 'France', 'Germany', 'Iceland', 'India', 'Japan', 'North Korea', 'South Korea', 'New Zealand', 'Norway', 'Poland', 'Russia', 'Turkey', 'United Kingdom', 'United States'];
          const countries = ['Finland', 'France', 'Germany', 'Iceland', 'Norway', 'Poland', 'Russia', 'United Kingdom'];
          const datasetWithFilters = [];
          const seriesList = [];
          echarts.util.each(countries, function (country) {
            let datasetId = 'dataset_' + country;
            datasetWithFilters.push({
              id: datasetId,
              fromDatasetId: 'dataset_raw',
              transform: {
                type: 'filter',
                config: {
                  and: [
                    { dimension: 'Year', gte: 1950 },
                    { dimension: 'Country', '=': country }
                  ]
                }
              }
            });
            seriesList.push({
              type: 'line',
              datasetId: datasetId,
              showSymbol: false,
              name: country,
              endLabel: {
                show: true,
                formatter: function (params) {
                  return params.value[3] + ': ' + params.value[0];
                }
              },
              labelLayout: {
                moveOverlap: 'shiftY'
              },
              emphasis: {
                focus: 'series'
              },
              encode: {
                x: 'Year',
                y: 'Income',
                label: ['Country', 'Income'],
                itemName: 'Year',
                tooltip: ['Income']
              }
            });
          });
          return {
            title: {
              text: 'Income of Germany and France since 1950',
              textStyle: {
                fontSize: 16,
                fontStyle: 'normal',
                fontWeight: 400
              }
            },
            grid: {
              top: 100,
              left: 20,
              right: 140,
              bottom: 10,
              containLabel: true
            },
            animationDuration: 10000,
            dataset: [
              {
                id: 'dataset_raw',
                source: _rawData
              },
              ...datasetWithFilters
            ],
            tooltip: {
              order: 'valueDesc',
              trigger: 'axis'
            },
            xAxis: {
              type: 'category',
              nameLocation: 'middle'
            },
            yAxis: {
              name: 'Income'
            },
            series: seriesList
          };
        }
      },
      {
        name: 'Stacked Area Chart',
        async getOptions() {
          return {
            title: {
              text: 'Stacked Area Chart',
              textStyle: {
                fontSize: 16,
                fontStyle: 'normal',
                fontWeight: 400
              }
            },
            legend: {
              top: 40,
              data: ['Email', 'Union Ads', 'Video Ads', 'Direct', 'Search Engine']
            },
            grid: {
              top: 100,
              left: 20,
              right: 20,
              bottom: 10,
              containLabel: true
            },
            tooltip: {
              trigger: 'axis',
              axisPointer: {
                type: 'cross',
                label: {
                  backgroundColor: '#6a7985'
                }
              }
            },
            xAxis: [
              {
                type: 'category',
                boundaryGap: false,
                data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
              }
            ],
            yAxis: [
              {
                type: 'value'
              }
            ],
            series: [
              {
                name: 'Email',
                type: 'line',
                stack: 'Total',
                areaStyle: {},
                emphasis: {
                  focus: 'series'
                },
                data: [120, 132, 101, 134, 90, 230, 210]
              },
              {
                name: 'Union Ads',
                type: 'line',
                stack: 'Total',
                areaStyle: {},
                emphasis: {
                  focus: 'series'
                },
                data: [220, 182, 191, 234, 290, 330, 310]
              },
              {
                name: 'Video Ads',
                type: 'line',
                stack: 'Total',
                areaStyle: {},
                emphasis: {
                  focus: 'series'
                },
                data: [150, 232, 201, 154, 190, 330, 410]
              },
              {
                name: 'Direct',
                type: 'line',
                stack: 'Total',
                areaStyle: {},
                emphasis: {
                  focus: 'series'
                },
                data: [320, 332, 301, 334, 390, 330, 320]
              },
              {
                name: 'Search Engine',
                type: 'line',
                stack: 'Total',
                label: {
                  show: true,
                  position: 'top'
                },
                areaStyle: {},
                emphasis: {
                  focus: 'series'
                },
                data: [820, 932, 901, 934, 1290, 1330, 1320]
              }
            ]
          };
        }
      },
      {
        name: 'Large Area Chart',
        async getOptions() {
          let base = +new Date(1968, 9, 3);
          let oneDay = 24 * 3600 * 1000;
          let date = [];
          let data = [Math.random() * 300];
          for (let i = 1; i < 20000; i++) {
            let now = new Date((base += oneDay));
            date.push([now.getFullYear(), now.getMonth() + 1, now.getDate()].join('/'));
            data.push(Math.round((Math.random() - 0.5) * 20 + data[i - 1]));
          }
          return {
            title: {
              text: 'Large Area Chart',
              textStyle: {
                fontSize: 16,
                fontStyle: 'normal',
                fontWeight: 400
              }
            },
            grid: {
              top: 100,
              left: 20,
              right: 20,
              bottom: 10,
              containLabel: true
            },
            tooltip: {
              trigger: 'axis',
              position: function (pt) {
                return [pt[0], '10%'];
              }
            },
            xAxis: {
              type: 'category',
              boundaryGap: false,
              data: date
            },
            yAxis: {
              type: 'value',
              boundaryGap: [0, '100%']
            },
            dataZoom: [
              {
                type: 'inside',
                start: 0,
                end: 10
              },
              {
                start: 0,
                end: 10
              }
            ],
            series: [
              {
                name: 'Fake Data',
                type: 'line',
                symbol: 'none',
                sampling: 'lttb',
                itemStyle: {
                  color: 'rgb(255, 70, 131)'
                },
                areaStyle: {
                  color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    {
                      offset: 0,
                      color: 'rgb(255, 158, 68)'
                    },
                    {
                      offset: 1,
                      color: 'rgb(255, 70, 131)'
                    }
                  ])
                },
                data: data
              }
            ]
          };
        }
      },
      {
        name: 'Referer of a Website',
        async getOptions() {
          return {
            title: {
              text: 'Referer of a Website',
              textStyle: {
                fontSize: 16,
                fontStyle: 'normal',
                fontWeight: 400
              }
            },
            legend: {
              top: 50
            },
            grid: {
              top: 100,
              left: 20,
              right: 20,
              bottom: 10,
              containLabel: true
            },
            tooltip: {
              trigger: 'item'
            },
            series: [
              {
                name: 'Access From',
                type: 'pie',
                radius: '50%',
                center: ['50%', '66%'],
                data: [
                  { value: 1048, name: 'Search Engine' },
                  { value: 735, name: 'Direct' },
                  { value: 580, name: 'Email' },
                  { value: 484, name: 'Union Ads' },
                  { value: 300, name: 'Video Ads' }
                ],
                emphasis: {
                  itemStyle: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                  }
                }
              }
            ]
          };
        }
      },
      {
        name: 'Stacked Area Bar',
        async getOptions() {
          return {
            title: {
              text: 'Stacked Area Bar',
              textStyle: {
                fontSize: 16,
                fontStyle: 'normal',
                fontWeight: 400
              }
            },
            legend: {
              top: 40
            },
            grid: {
              top: 100,
              left: 20,
              right: 20,
              bottom: 10,
              containLabel: true
            },
            tooltip: {
              trigger: 'axis',
              axisPointer: {
                type: 'shadow'
              }
            },
            xAxis: [
              {
                type: 'category',
                data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
              }
            ],
            yAxis: [
              {
                type: 'value'
              }
            ],
            series: [
              {
                name: 'Direct',
                type: 'bar',
                emphasis: {
                  focus: 'series'
                },
                data: [320, 332, 301, 334, 390, 330, 320]
              },
              {
                name: 'Email',
                type: 'bar',
                stack: 'Ad',
                emphasis: {
                  focus: 'series'
                },
                data: [120, 132, 101, 134, 90, 230, 210]
              },
              {
                name: 'Union Ads',
                type: 'bar',
                stack: 'Ad',
                emphasis: {
                  focus: 'series'
                },
                data: [220, 182, 191, 234, 290, 330, 310]
              },
              {
                name: 'Video Ads',
                type: 'bar',
                stack: 'Ad',
                emphasis: {
                  focus: 'series'
                },
                data: [150, 232, 201, 154, 190, 330, 410]
              },
              {
                name: 'Search Engine',
                type: 'bar',
                data: [862, 1018, 964, 1026, 1679, 1600, 1570],
                emphasis: {
                  focus: 'series'
                },
                markLine: {
                  lineStyle: {
                    type: 'dashed'
                  },
                  data: [[{ type: 'min' }, { type: 'max' }]]
                }
              },
              {
                name: 'Baidu',
                type: 'bar',
                barWidth: 5,
                stack: 'Search Engine',
                emphasis: {
                  focus: 'series'
                },
                data: [620, 732, 701, 734, 1090, 1130, 1120]
              },
              {
                name: 'Google',
                type: 'bar',
                stack: 'Search Engine',
                emphasis: {
                  focus: 'series'
                },
                data: [120, 132, 101, 134, 290, 230, 220]
              },
              {
                name: 'Bing',
                type: 'bar',
                stack: 'Search Engine',
                emphasis: {
                  focus: 'series'
                },
                data: [60, 72, 71, 74, 190, 130, 110]
              },
              {
                name: 'Others',
                type: 'bar',
                stack: 'Search Engine',
                emphasis: {
                  focus: 'series'
                },
                data: [62, 82, 91, 84, 109, 110, 120]
              }
            ]
          };
        }
      },
      {
        name: 'Stacked Area Bar',
        async getOptions() {
          return {
            title: {
              text: 'Stacked Area Bar',
              textStyle: {
                fontSize: 16,
                fontStyle: 'normal',
                fontWeight: 400
              }
            },
            legend: {
              top: 40
            },
            grid: {
              top: 100,
              left: 20,
              right: 20,
              bottom: 10,
              containLabel: true
            },
            tooltip: {
              trigger: 'axis',
              axisPointer: {
                // Use axis to trigger tooltip
                type: 'shadow' // 'shadow' as default; can also be 'line' or 'shadow'
              }
            },
            xAxis: {
              type: 'value'
            },
            yAxis: {
              type: 'category',
              data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
            },
            series: [
              {
                name: 'Direct',
                type: 'bar',
                stack: 'total',
                label: {
                  show: true
                },
                emphasis: {
                  focus: 'series'
                },
                data: [320, 302, 301, 334, 390, 330, 320]
              },
              {
                name: 'Mail Ad',
                type: 'bar',
                stack: 'total',
                label: {
                  show: true
                },
                emphasis: {
                  focus: 'series'
                },
                data: [120, 132, 101, 134, 90, 230, 210]
              },
              {
                name: 'Affiliate Ad',
                type: 'bar',
                stack: 'total',
                label: {
                  show: true
                },
                emphasis: {
                  focus: 'series'
                },
                data: [220, 182, 191, 234, 290, 330, 310]
              },
              {
                name: 'Video Ad',
                type: 'bar',
                stack: 'total',
                label: {
                  show: true
                },
                emphasis: {
                  focus: 'series'
                },
                data: [150, 212, 201, 154, 190, 330, 410]
              },
              {
                name: 'Search Engine',
                type: 'bar',
                stack: 'total',
                label: {
                  show: true
                },
                emphasis: {
                  focus: 'series'
                },
                data: [820, 832, 901, 934, 1290, 1330, 1320]
              }
            ]
          };
        }
      }
    ];

    return {
      charts
    };
  }
});
</script>
