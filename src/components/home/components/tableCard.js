import React from  'react'
import {Card, Table, Icon, Spin} from 'antd'

class TableCard extends React.Component {
    render () {
        const {cityData} = this.props
        let column = [
            {title: '城市', dataIndex: 'name', width: 160},
            {title: '人数', dataIndex: 'value',  width: 160, sorter: (a, b) => a.value - b.value}
        ]
        const title = <div><Icon type="environment" />所有用户地理分布</div>
        return (
            <Card title={title} style={{marginBottom: 12, height: 412}}>
                {cityData.length > 0 ? <Table columns={column} dataSource={cityData} pagination={true} rowKey={record => record.name} scroll={{y: 200 }} bordered={true} size="small"/>
                    : <Spin size="large" style={{marginLeft: '48%', marginTop: 120}}/>
                }
            </Card>
        )
    }
}

export default TableCard