import React from 'react'
import ReactDOM from 'react-dom/client'
import { Analytics } from '@vercel/analytics/react'
import InterviewPrepApp from './InterviewPrepApp'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <InterviewPrepApp />
    <Analytics />
  </React.StrictMode>,
)
