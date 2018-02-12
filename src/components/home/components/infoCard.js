import React from 'react'
import {Icon, Tooltip, Spin} from 'antd'
import '../home.css'
import CountUp from 'react-countup'

class InfoCard extends React.Component {
    transformValue = (val) => {
        let endVal = 0
        let unit = ''
        if (val < 1000) {
            endVal = val
        } else if (val >= 1000 && val < 1000000) {
            endVal = parseInt(val / 1000, 10)
            unit = 'K+'
        } else if (val >= 1000000 && val < 10000000000) {
            endVal = parseInt(val / 1000000, 10)
            unit = 'M+'
        } else {
            endVal = parseInt(val / 1000000000, 10)
            unit = 'B+'
        }
        return {
            val: endVal,
            unit: unit
        }
    }
    render () {
        const {endVal, color, iconType, title} = this.props
        let res = this.transformValue(endVal)
        let val = res.val
        let unit = res.unit
        return (
           <div style={{backgroundColor: 'white', width: '100%', height: 120, marginRight: iconType ===  'heart' ? 0 : '1%'}} className="Card">
               <div style={{display: 'flex', backgroundColor: color, width: '30%', justifyContent: 'center', alignItems: 'center', borderBottomLeftRadius: 3, borderTopLeftRadius: 3}}>
                   <Icon type={iconType} style={{fontSize: 40, color: 'white'}}/>
               </div>
               <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: '70%'}}>
                   <div style={{fontWeight: 700, fontSize: 30, color: color}}>
                       {val >= 0 ? <CountUp start={0} end={val} duration={3}/> : <Spin/>}
                       <Tooltip title={endVal}>
                           {unit}
                       </Tooltip>
                   </div>
                   <div style={{color: '#C8C8C8', fontWeight: 500, fontSize: 12}}>{title}</div>
               </div>
           </div>
        )
    }
}

export default InfoCard