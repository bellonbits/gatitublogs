import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, LineChart, Line } from 'recharts';

interface GraphProps {
    data: { name: string; value: number }[];
    type: 'line' | 'bar';
}

const Graph: React.FC<GraphProps> = ({ data, type }) => {
    return (
        <div className="w-full h-64 zyricon-glass p-4 rounded-xl border border-white/5 mt-4">
            <ResponsiveContainer width="100%" height="100%">
                {type === 'bar' ? (
                    <BarChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                        <XAxis dataKey="name" stroke="#6b7280" fontSize={12} />
                        <YAxis stroke="#6b7280" fontSize={12} />
                        <Tooltip
                            contentStyle={{ background: '#1a0b2e', border: '1px solid rgba(168,85,247,0.2)', borderRadius: '8px' }}
                            itemStyle={{ color: '#d1d5db' }}
                        />
                        <Bar dataKey="value" fill="#a855f7" radius={[4, 4, 0, 0]} />
                    </BarChart>
                ) : (
                    <LineChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                        <XAxis dataKey="name" stroke="#6b7280" fontSize={12} />
                        <YAxis stroke="#6b7280" fontSize={12} />
                        <Tooltip
                            contentStyle={{ background: '#1a0b2e', border: '1px solid rgba(168,85,247,0.2)', borderRadius: '8px' }}
                            itemStyle={{ color: '#d1d5db' }}
                        />
                        <Line type="monotone" dataKey="value" stroke="#a855f7" strokeWidth={2} dot={{ fill: '#a855f7' }} />
                    </LineChart>
                )}
            </ResponsiveContainer>
        </div>
    );
};

export default Graph;
