import { useEffect, useRef, useState } from 'react'

const RISK_COLOR = { high:'#ef4444', medium:'#f59e0b', low:'#10b981' }
const COUNTRY_COORDS = { China:{lat:35.86,lng:104.19},Germany:{lat:51.16,lng:10.45},Netherlands:{lat:52.13,lng:5.29},Taiwan:{lat:23.69,lng:120.96},India:{lat:20.59,lng:78.96},Ukraine:{lat:48.37,lng:31.16},USA:{lat:37.09,lng:-95.71},US:{lat:37.09,lng:-95.71},Suez:{lat:30.0,lng:32.5},Egypt:{lat:26.82,lng:30.80},Singapore:{lat:1.35,lng:103.82},Brazil:{lat:-14.23,lng:-51.92},Japan:{lat:36.20,lng:138.25} }
const ROUTES = [
  {from:{lat:35.86,lng:104.19},to:{lat:51.16,lng:10.45},risk:'high'},
  {from:{lat:23.69,lng:120.96},to:{lat:37.09,lng:-95.71},risk:'high'},
  {from:{lat:20.59,lng:78.96},to:{lat:51.16,lng:10.45},risk:'medium'},
  {from:{lat:1.35,lng:103.82},to:{lat:35.86,lng:104.19},risk:'low'},
  {from:{lat:-14.23,lng:-51.92},to:{lat:37.09,lng:-95.71},risk:'medium'},
]

export default function RiskMap({ risks }) {
  return (
    <div style={{ position:'relative', borderRadius:'0 0 16px 16px', overflow:'hidden', height:340 }}>
      <video
        src='/globe-bg.mp4'
        autoPlay
        loop
        muted
        playsInline
        style={{ width:'100%', height:'100%', objectFit:'cover', display:'block' }}
      />
      <div style={{
        position:'absolute', inset:0,
        background:'rgba(0,0,0,0.35)',
        display:'flex', alignItems:'center', justifyContent:'center',
        flexDirection:'column', gap:8
      }}>
        <div style={{ fontSize:13, color:'white', fontFamily:"Space Mono,monospace", letterSpacing:2, opacity:0.85 }}>

        </div>
      </div>
    </div>
  )
}