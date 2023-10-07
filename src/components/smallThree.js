import React from 'react'

const SmallThree = (props) => {
  return (
    <div style={{ ...props.style, fontFamily:'Poppins' , fontSize:'12px', fontWeight:'600', color:'#B5B5C3' }}>{props.children}</div>
  )
}

export default SmallThree