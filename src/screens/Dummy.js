import React from 'react'
const sizes = ["318px","252px","252px","318px","318px","252px","252px","318px","318px","252px","252px","318px","318px","252px","252px","318px","318px","252px","252px","318px","318px","252px","252px","318px","318px","252px","252px","318px","318px","252px","252px","318px","318px","252px","252px","318px","318px","252px","252px","318px","318px","252px","252px","318px","318px","252px","252px","318px","318px","252px","252px","318px","318px","252px","252px","318px","318px","252px","252px","318px","318px","252px","252px","318px","318px","252px","252px","318px","318px","252px","252px","318px","318px","252px","252px","318px","318px","252px","252px","318px","318px","252px","252px","318px","318px","252px","252px","318px","318px","252px","252px","318px","318px","252px","252px","318px","318px","252px","252px","318px","318px","252px","252px","318px","318px","252px","252px","318px","318px","252px","252px","318px","318px","252px","252px","318px","318px","252px","252px","318px","318px","252px","252px","318px","318px","252px","252px","318px","318px","252px","252px","318px","318px","252px","252px","318px","318px","252px","252px","318px","318px","252px","252px","318px","318px","252px","252px","318px","318px","252px","252px","318px","318px","252px","252px","318px","318px","252px","252px","318px","318px","252px","252px","318px","318px","252px","252px","318px","318px","252px","252px","318px","318px","252px","252px","318px","318px","252px","252px","318px","318px","252px","252px","318px","318px","252px","252px"];
const colors = ['red','blue','green'];
const Dummy = () => {
  return (
    <div style={{
        // display: 'grid',
        // gridGap: '10px',
        // gridTemplateColumns: 'repeat(auto-fill, minmax(250px,1fr))',
        // gridAutoRows: 'auto'
        columnCount: '2',
        columnGap: '2px 2px',
        
        
    }}>
        {
            sizes.map((item,index)=>(
                <div style={{
                    height:item,
                    // width:'200px',
                    backgroundColor:colors[index%3],
                    marginBottom:'10px'
                }} ></div>
            ))
        }
    </div>
  )
}

export default Dummy