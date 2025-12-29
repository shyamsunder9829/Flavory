import React from 'react'
import { useNavigate } from 'react-router-dom'

const BackButton = () => {
  const navigate = useNavigate();
  return (
    <button onClick={() => navigate(-1)} aria-label="Go back" style={{position:'fixed', left:16, top:16, background:'transparent', border:'none', padding:8, cursor:'pointer'}}>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="15 18 9 12 15 6"></polyline>
      </svg>
    </button>
  )
}

export default BackButton;