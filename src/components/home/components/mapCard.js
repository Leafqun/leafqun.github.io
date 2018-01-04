import React from 'react'
import {Card, Icon} from 'antd'
import ReactEcharts from 'echarts-for-react'
import geoData from './get-geography-value1.js'
require('echarts/map/js/china.js');

class MapCard extends React.Component {
    convertData = (data) => {
        let res = []
        let len = data.length
        for (let i = 0; i < len; i++) {
            let geoCoord = geoData[data[i].name]
            if (geoCoord) {
                res.push({
                    name: data[i].name,
                    value: geoCoord.concat(data[i].value)
                })
            }
        }
        return res
    }
    render () {
        let {cityData} = this.props
        const option = {
            backgroundColor: '#FFF',
            geo: {
                map: 'china',
                label: {
                    emphasis: {
                        show: false
                    }
                },
                itemStyle: {
                    normal: {
                        areaColor: '#EFEFEF',
                        borderColor: '#CCC'
                    },
                    emphasis: {
                        areaColor: '#E5E5E5'
                    }
                }
            },
            tooltip: {
                formatter: (params) => {
                    return params.name + ': ' + params.value[2]
                }
            },
            grid: {
                top: 0,
                left: '2%',
                right: '2%',
                bottom: '0',
                containLabel: true
            },
            series: [{
                type: 'scatter',
                coordinateSystem: 'geo',
                data: this.convertData(cityData),
                symbolSize: (cityData) => {
                    const data = cityData[2]
                    if (data < 10) return data
                    if (data < 100) return data / 10 + 10
                    else return 20 + Math.log(data) / Math.log(10)
                },
                label: {
                    normal: {
                        formatter: '{b}',
                        position: 'right',
                        show: false
                    },
                    emphasis: {
                        show: true
                    }
                },
                itemStyle: {
                    normal: {
                        color: '#0099CC'
                    }
                }
            }]
        }
        const title = <div><Icon type="environment" />所有用户地理分布</div>
        return (
            <Card title={title} style={{height: '100%'}}>
                <ReactEcharts
                    option={option || {}}
                    notMerge={true}
                    lazyUpdate={true} style={{height: 300}}/>
            </Card>
        )
    }
}

export default MapCard