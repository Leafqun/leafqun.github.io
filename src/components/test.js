import React from 'react'
import echarts from 'echarts'
import {Card} from 'antd'

class Test extends React.Component {
    constructor (props) {
        super(props)
        this.state = {
            myChart: {},
            data: []
        }
    }
    changeData = () => {
        this.setState({data: [10, 25, 36, 10, 10, 25]})
    }
    componentDidMount () {
        // 基于准备好的dom，初始化echarts实例
        let myChart = echarts.init(this.refs.main)
        this.setState({myChart})
        let option = {
            title: {
                text: 'ECharts 入门示例\n'
            },
            tooltip: {},
            legend: {
                data:['销量'],
                right: 0,
                top: '20px'
            },
            xAxis: {
                data: ["衬衫","羊毛衫","雪纺衫","裤子","高跟鞋","袜子"]
            },
            yAxis: {},
            series: [{
                name: '销量',
                type: 'bar',
                data: [5, 20, 36, 10, 10, 20]
            }]
        }
        myChart.setOption(option)
    }
    render () {
        const {data, myChart} = this.state
        let config = {
            title: {
                text: 'ECharts 入门示例\n'
            },
            tooltip: {},
            legend: {
                data:['销量', '件数', '价格'],
                right: 0,
                top: '20px'
            },
            xAxis: {
                data: ["衬衫","羊毛衫","雪纺衫","裤子","高跟鞋","袜子"]
            },
            yAxis: {},
            series: [{
                name: '销量',
                type: 'bar',
                data: data
            },{
                name: '件数',
                type: 'bar',
                data: data
            },{
                name: '价格',
                type: 'bar',
                data: data
            }]
        }
        if (myChart.id && data.length > 0) {
            myChart.setOption(config)
        }
        return (
            <div>
                <Card style={{width: 800}}>
                    <div ref="main" style={{height: 400}}></div>
                </Card>
                <button onClick={this.changeData}>submit</button>
            </div>
        )
    }
}
export default Test