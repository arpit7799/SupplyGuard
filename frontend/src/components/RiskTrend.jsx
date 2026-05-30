import React from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export default function RiskTrend({ data }) {
  return (
    <div>
      <div style={{ fontSize:10, fontFamily:'Space Mono,monospace', color:'var(--muted)', letterSpacing:2, marginBottom:16 }}>📈 RISK TREND — 7 DAY</div>
      <ResponsiveContainer width="100%" height={180}>
        <AreaChart data={data} margin={{ top:4, right:4, left:-24, bottom:0 }}>
          <defs>
            <linearGradient id="gH" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/><stop offset="95%" stopColor="#ef4444" stopOpacity={0}/></linearGradient>
            <linearGradient id="gM" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#f59e0b" stopOpacity={0.25}/><stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/></linearGradient>
            <linearGradient id="gL" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/><stop offset="95%" stopColor="#10b981" stopOpacity={0}/></linearGradient>
          </defs>
          <XAxis dataKey="name" tick={{ fill:'#4a5878', fontSize:10, fontFamily:'Space Mono,monospace' }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill:'#4a5878', fontSize:10 }} axisLine={false} tickLine={false} />
          <Tooltip contentStyle={{ background:'var(--surface2)', border:'1px solid var(--border2)', borderRadius:8, fontSize:11, color:'var(--text)', fontFamily:'Space Mono,monospace' }} />
          <Legend wrapperStyle={{ fontSize:10, color:'var(--muted2)', fontFamily:'Space Mono,monospace' }} />
          <Area type="monotone" dataKey="high"   name="HIGH"   stroke="#ef4444" fill="url(#gH)" strokeWidth={1.5} dot={false} />
          <Area type="monotone" dataKey="medium" name="MEDIUM" stroke="#f59e0b" fill="url(#gM)" strokeWidth={1.5} dot={false} />
          <Area type="monotone" dataKey="low"    name="LOW"    stroke="#10b981" fill="url(#gL)" strokeWidth={1.5} dot={false} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
