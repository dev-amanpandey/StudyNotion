import React from 'react'
const HighlightText = ({text}) => {
  return (
    <span className='font-bold bg-gradient-to-r from-[#22D3EE] to-[#0787D9] bg-clip-text text-transparent'>
      {" "}{text}
    </span>
  )
}
export default HighlightText
