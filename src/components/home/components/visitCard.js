import React from 'react'
import {Card, Icon, Spin} from 'antd'
import ReactEcharts from 'echarts-for-react'

class VisitCard extends React.Component {
    getData = (val) => {
        let keys = []
        let values = []
        for (let v in val) {
            keys.push(v)
            values.push(val[v])
        }
        return {keys, values}
    }
    render () {
        const {flow} = this.props
        const title = <div><Icon type="environment" />前30天服务量统计</div>
        let data = this.getData(flow)
        const option = {
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'cross',
                    label: {
                        backgroundColor: '#6a7985'
                    }
                }
            },
            grid: {
                top: '3%',
                left: '1.2%',
                right: '1%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: [
                {
                    type: 'category',
                    boundaryGap: false,
                    data: data['keys']
                }
            ],
            yAxis: [
                {
                    type: 'value'
                }
            ],
            series: [
                {
                    name: '网站流量',
                    type: 'line',
                    stack: '每天',
                    areaStyle: {
                        normal: {
                            color: '#2d8cf0'
                        }
                    },
                    data: data['values']
                }
            ]
        }
        return (
            <Card title={title}>
                <Spin spinning={flow === {}} size="large">
                    <ReactEcharts
                        option={option || {}}
                        notMerge={true}
                        lazyUpdate={true} style={{height: 250}}/>
                </Spin>
            </Card>
        )
    }
}

export default VisitCard