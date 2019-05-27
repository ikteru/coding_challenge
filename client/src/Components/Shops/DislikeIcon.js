import React from 'react'
import { ReactComponent as DislikeIcon } from '../../assets/dislike.svg'
const TrashIcon = function(){
    return (
        <div style={{height:24, width: 24, viewBox: "0 0 24 24", marginRight: 5 }}>
            <DislikeIcon></DislikeIcon>
        </div>
    )
}

export default TrashIcon