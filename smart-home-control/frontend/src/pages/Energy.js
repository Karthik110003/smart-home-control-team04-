import React, { useState, useEffect } from 'react';
import { energyService } from '../services/api';

function Energy() {
  const [energyData, setEnergyData] = useState([]);
  const [weeklyStats, setWeeklyStats] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [hoveredBar, setHoveredBar] = useState(null);
  const [summary, setSummary] = useState({ totalUsage: 0, estimatedCost: 0, dailyAverage: 0, co2Saved: 0 });
  const [categoryBreakdown, setCategoryBreakdown] = useState({});

  useEffect(() => { fetchEnergyData(); }, []);

  const fetchEnergyData = async () => {
    try {
      setLoading(true);
      const res = await energyService.getAllEnergy();
      const data = res.data.data || [];
      setEnergyData(data);

      const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
      const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      const recentData = data.filter(d => new Date(d.date) >= sevenDaysAgo);
      const dayMap = {};
      recentData.forEach(record => {
        const date = new Date(record.date);
        const dayName = days[date.getDay() === 0 ? 6 : date.getDay() - 1];
        const key = date.toISOString().split('T')[0];
        if (!dayMap[key]) dayMap[key] = { day: dayName, usage: 0, count: 0 };
        dayMap[key].usage += record.totalUsage || 0;
        dayMap[key].count += 1;
      });
      const weeklyData = Object.values(dayMap).map(d => ({ day: d.day, usage: parseFloat((d.usage / Math.max(d.count, 1)).toFixed(1)) }));
      setWeeklyStats(weeklyData);

      const catMap = {};
      data.forEach(record => {
        if (record.categoryUsage && typeof record.categoryUsage === 'object') {
          Object.entries(record.categoryUsage).forEach(([cat, val]) => {
            catMap[cat] = (catMap[cat] || 0) + val;
          });
        }
      });
      setCategoryBreakdown(catMap);

      if (data.length > 0) {
        const totalUsage = data.reduce((s, i) => s + (i.totalUsage || 0), 0);
        const totalCost = data.reduce((s, i) => s + (i.cost || 0), 0);
        const totalCO2 = data.reduce((s, i) => s + (i.co2Saved || 0), 0);
        setSummary({
          totalUsage: totalUsage.toFixed(1),
          estimatedCost: totalCost.toFixed(2),
          dailyAverage: (totalUsage / data.length).toFixed(1),
          co2Saved: totalCO2.toFixed(0)
        });
      }
      setError('');
    } catch (err) {
      setError('Failed to load energy data');
    } finally {
      setLoading(false);
    }
  };

  // Chart data
  const chartDays = weeklyStats.length > 0 ? weeklyStats.map(d => d.day) : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const chartUsage = weeklyStats.length > 0 ? weeklyStats.map(d => d.usage) : [24, 20, 22, 25, 23, 28, 26];
  const maxUsage = Math.max(...chartUsage, 1);

  const totalCatUsage = Object.values(categoryBreakdown).reduce((a, b) => a + b, 0) || 100;
  const catColors = ['#2563eb', '#f59e0b', '#8b5cf6', '#10b981'];
  const categoryData = Object.entries(categoryBreakdown).length > 0
    ? Object.entries(categoryBreakdown).map(([name, val], i) => ({ name, pct: Math.round((val / totalCatUsage) * 100), color: catColors[i % 4] }))
    : [{ name: 'HVAC', pct: 45, color: '#2563eb' }, { name: 'Lighting', pct: 20, color: '#f59e0b' }, { name: 'Kitchen', pct: 18, color: '#8b5cf6' }, { name: 'Other', pct: 17, color: '#10b981' }];

  // SVG donut
  const buildDonut = () => {
    let cumulative = 0;
    const r = 80, cx = 100, cy = 100;
    return categoryData.map((cat, i) => {
      const startAngle = (cumulative / 100) * 360 - 90;
      cumulative += cat.pct;
      const endAngle = (cumulative / 100) * 360 - 90;
      const angle = cat.pct / 100 * 360;
      const startRad = startAngle * Math.PI / 180;
      const endRad = endAngle * Math.PI / 180;
      const x1 = cx + r * Math.cos(startRad), y1 = cy + r * Math.sin(startRad);
      const x2 = cx + r * Math.cos(endRad), y2 = cy + r * Math.sin(endRad);
      const largeArc = angle > 180 ? 1 : 0;
      const ri = 48;
      const ix1 = cx + ri * Math.cos(startRad), iy1 = cy + ri * Math.sin(startRad);
      const ix2 = cx + ri * Math.cos(endRad), iy2 = cy + ri * Math.sin(endRad);
      const d = `M ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} L ${ix2} ${iy2} A ${ri} ${ri} 0 ${largeArc} 0 ${ix1} ${iy1} Z`;
      return <path key={i} d={d} fill={cat.color} />;
    });
  };

  const s = {
    page: { background: '#f0f4f8', minHeight: '100vh', fontFamily: 'Arial, sans-serif', padding: '24px 28px' },
    header: { fontSize: 22, fontWeight: 700, color: '#1e293b', marginBottom: 20 },
    summaryRow: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 },
    card: { background: '#fff', borderRadius: 10, padding: '16px 20px', boxShadow: '0 1px 4px rgba(0,0,0,0.07)' },
    cardIcon: { fontSize: 22, marginBottom: 6 },
    cardChange: (positive) => ({ fontSize: 12, color: positive ? '#10b981' : '#6b7280', fontWeight: 600, float: 'right' }),
    cardValue: { fontSize: 26, fontWeight: 700, color: '#1e293b', margin: '4px 0 2px' },
    cardLabel: { fontSize: 13, color: '#64748b' },
    chartsRow: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 },
    chartCard: { background: '#fff', borderRadius: 10, padding: '20px 24px', boxShadow: '0 1px 4px rgba(0,0,0,0.07)' },
    chartTitle: { fontSize: 16, fontWeight: 700, color: '#1e293b', marginBottom: 16 },
    barArea: { display: 'flex', alignItems: 'flex-end', height: 180, gap: 8, position: 'relative', paddingBottom: 24 },
    barWrap: { flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, height: '100%', justifyContent: 'flex-end', cursor: 'pointer' },
    dayLabel: { fontSize: 12, color: '#94a3b8', marginTop: 6 },
    legendItem: { display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, fontSize: 13, color: '#475569' },
    dot: (color) => ({ width: 10, height: 10, borderRadius: '50%', background: color, flexShrink: 0 }),
    tooltip: { position: 'absolute', background: '#fff', border: '1px solid #e2e8f0', borderRadius: 6, padding: '8px 12px', fontSize: 12, pointerEvents: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.12)', zIndex: 10, bottom: 36, transform: 'translateX(-50%)' },
  };

  return (
    <div style={s.page}>
      <h1 style={s.header}>Energy Monitoring</h1>
      {error && <div style={{ color: 'red', marginBottom: 16 }}>{error}</div>}

      {/* Summary Cards */}
      <div style={s.summaryRow}>
        <div style={s.card}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <span style={{ fontSize: 22 }}>⚡</span>
            <span style={s.cardChange(false)}>-12%</span>
          </div>
          <div style={s.cardValue}>{summary.totalUsage} kWh</div>
          <div style={s.cardLabel}>This Week</div>
        </div>
        <div style={s.card}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <span style={{ fontSize: 22 }}>💵</span>
            <span style={s.cardChange(false)}>-$8.40</span>
          </div>
          <div style={s.cardValue}>${summary.estimatedCost}</div>
          <div style={s.cardLabel}>Estimated Cost</div>
        </div>
        <div style={s.card}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <span style={{ fontSize: 22 }}>📉</span>
            <span style={{ fontSize: 12, color: '#10b981', fontWeight: 600 }}>Efficient</span>
          </div>
          <div style={s.cardValue}>{summary.dailyAverage} kWh</div>
          <div style={s.cardLabel}>Daily Average</div>
        </div>
        <div style={s.card}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <span style={{ fontSize: 22 }}>🌱</span>
            <span style={s.cardChange(true)}>+24 lbs</span>
          </div>
          <div style={s.cardValue}>{summary.co2Saved} lbs</div>
          <div style={s.cardLabel}>CO₂ Saved</div>
        </div>
      </div>

      {/* Charts */}
      <div style={s.chartsRow}>
        {/* Bar Chart */}
        <div style={s.chartCard}>
          <div style={s.chartTitle}>Weekly Usage</div>
          <div style={{ ...s.barArea, position: 'relative' }}>
            {chartDays.map((day, idx) => {
              const h = Math.round((chartUsage[idx] / maxUsage) * 160);
              const isHov = hoveredBar === idx;
              return (
                <div key={day + idx} style={s.barWrap}
                  onMouseEnter={() => setHoveredBar(idx)}
                  onMouseLeave={() => setHoveredBar(null)}
                >
                  {isHov && (
                    <div style={{ ...s.tooltip, left: '50%', bottom: h + 30 }}>
                      <div style={{ fontWeight: 700, color: '#2563eb' }}>{day}</div>
                      <div style={{ color: '#475569' }}>usage : {chartUsage[idx]}</div>
                    </div>
                  )}
                  <div style={{ width: '100%', height: h, background: isHov ? '#93c5fd' : '#2563eb', borderRadius: '4px 4px 0 0', transition: 'background 0.2s' }} />
                  <span style={s.dayLabel}>{day}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Donut Chart */}
        <div style={s.chartCard}>
          <div style={s.chartTitle}>Usage by Category</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 24, justifyContent: 'center' }}>
            <svg viewBox="0 0 200 200" width={160} height={160}>
              {buildDonut()}
            </svg>
            <div>
              {categoryData.map(cat => (
                <div key={cat.name} style={s.legendItem}>
                  <div style={s.dot(cat.color)} />
                  <span>{cat.name} ({cat.pct}%)</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Records Table */}
      {energyData.length > 0 && (
        <div style={{ background: '#fff', borderRadius: 10, padding: '20px 24px', marginTop: 20, boxShadow: '0 1px 4px rgba(0,0,0,0.07)' }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: '#1e293b', marginBottom: 14 }}>Recent Records</h2>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #e2e8f0' }}>
                {['Date', 'Total Usage (kWh)', 'Cost ($)', 'CO2 Saved (kg)'].map(h => (
                  <th key={h} style={{ textAlign: 'left', padding: '8px 12px', color: '#64748b', fontWeight: 600 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {energyData.slice(0, 10).map(record => (
                <tr key={record._id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '10px 12px', color: '#1e293b' }}>{new Date(record.date).toLocaleDateString()}</td>
                  <td style={{ padding: '10px 12px', color: '#1e293b' }}>{record.totalUsage}</td>
                  <td style={{ padding: '10px 12px', color: '#1e293b' }}>${record.cost}</td>
                  <td style={{ padding: '10px 12px', color: '#1e293b' }}>{record.co2Saved}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {loading && <div style={{ textAlign: 'center', padding: 40, color: '#64748b' }}>Loading energy data...</div>}
      {!loading && energyData.length === 0 && (
        <div style={{ textAlign: 'center', padding: 40, color: '#94a3b8', background: '#fff', borderRadius: 10, marginTop: 20 }}>
          <p style={{ fontSize: 16 }}>No energy data available yet.</p>
          <p style={{ fontSize: 14 }}>Start tracking your energy consumption to see detailed analytics.</p>
        </div>
      )}
    </div>
  );
}

export default Energy;
