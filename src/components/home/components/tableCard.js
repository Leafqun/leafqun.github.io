import React from  'react'
import {Card, Table, Icon, Spin} from 'antd'
import {CSVLink} from 'react-csv';

class TableCard extends React.Component {
    render () {
        const {cityData} = this.props
        let column = [
            {title: '城市', dataIndex: 'name', width: 160},
            {title: '人数', dataIndex: 'value',  width: 160, sorter: (a, b) => a.value - b.value}
        ]
        const headers = [
            {label: '城市', key: 'name'},
            {label: '人数', key: 'value'}
        ]
        const title = <div>
            <Icon type="environment" />所有用户地理分布
            <span style={{marginLeft: 15}}><CSVLink data={cityData.length > 0 ? cityData :  []} headers={headers}
                                                    filename={'用户所在城市统计.csv'}
                                                    className="btn btn-primary"
                                                    target="_blank">报表</CSVLink>
            </span>
        </div>
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