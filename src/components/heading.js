import React from 'react'

const Heading = (props) => {
  return (
    <div style={{ ...props.style, fontFamily:'Poppins' , fontSize:'24px', fontWeight:'600' }}>{props.children}</div>
  )
}

export default Heading