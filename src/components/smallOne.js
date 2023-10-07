import React from 'react'

const SmallOne = (props) => {
  return (
    <div style={{ ...props.style, fontFamily:'Poppins' , fontSize:'18px', fontWeight:'500' }}>{props.children}</div>
  )
}

export default SmallOne