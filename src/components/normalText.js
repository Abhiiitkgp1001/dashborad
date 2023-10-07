import React from 'react'

const NormalText = (props) => {
  return (
    <div onClick={props.onClick} style={{ ...props.style, fontFamily:'Poppins' , fontSize:'16px', fontWeight:'600' }}>{props.children}</div>
  )
}

export default NormalText