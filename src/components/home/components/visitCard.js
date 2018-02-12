import React from 'react'
import {Card, Icon, Spin} from 'antd'
import ReactEcharts from 'echarts-for-react'
import {CSVLink} from 'react-csv';

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
    transfromData = (val) => {
        let data = []
        for (let v in val) {
            data.push({name: v, value: val[v]})
        }
        return data
    }
    render () {
        const {flow} = this.props
        const headers = [
            {label: '时间', key: 'name'},
            {label: '访问量bit', key: 'value'}
        ]
        const title = <div>
            <Icon type="area-chart" />前30天服务量统计
            <span style={{marginLeft: 15}}><CSVLink data={this.transfromData(flow).length > 0 ? this.transfromData(flow) :  []} headers={headers}
                                                    filename={'前30天访问量统计.csv'}
                                                    className="btn btn-primary"
                                                    target="_blank">报表</CSVLink>
            </span>
        </div>
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