import React from 'react'
import ReactDOM from 'react-dom/client'
import { Analytics } from '@vercel/analytics/react'
import InterviewPrepApp from './InterviewPrepApp'

class ErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { error: null }; }
  static getDerivedStateFromError(error) { return { error }; }
  render() {
    if (this.state.error) {
      return (
        <div style={{display:'flex',alignItems:'center',justifyContent:'center',height:'100vh',flexDirection:'column',gap:16,padding:32,fontFamily:'system-ui',background:'#F9FAFB'}}>
          <div style={{fontSize:18,fontWeight:600,color:'#DC2626'}}>App crashed</div>
          <div style={{fontSize:13,color:'#374151',background:'#FEF2F2',border:'1px solid #FECACA',borderRadius:8,padding:'12px 16px',maxWidth:600,wordBreak:'break-all'}}>
            {this.state.error.message}
          </div>
          <div style={{fontSize:12,color:'#9CA3AF',maxWidth:600,whiteSpace:'pre-wrap',wordBreak:'break-all'}}>
            {this.state.error.stack?.split('\n').slice(0,5).join('\n')}
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <ErrorBoundary>
    <InterviewPrepApp />
    <Analytics />
  </ErrorBoundary>
)
