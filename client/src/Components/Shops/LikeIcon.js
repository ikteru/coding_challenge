import React from 'react'
import { ReactComponent as LikeIcon} from "../../assets/like.svg"
const FavoriteIcon = function(){
    return (
        <div style={{height:24, width: 24, viewBox: "0 0 24 24", marginRight: 5}}>
            <LikeIcon></LikeIcon>
        </div>
    )
}

export default FavoriteIcon 