import React from 'react'

const SmallTwo = (props) => {
  return (
    <div style={{ ...props.style, fontFamily:'Poppins' , fontSize:'14px', fontWeight:'600' }}>{props.children}</div>
  )
}

export default SmallTwo