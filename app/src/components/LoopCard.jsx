import React from 'react';
import { Users, Plus, Check } from 'lucide-react';

export default function LoopCard({ loop, onJoin }) {
    return (
        <div className="card flex-col gap-4" style={{ marginBottom: 12 }}>
            <div className="flex-row" style={{ justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div className="flex-col gap-2">
                    <span className="text-sm" style={{
                        color: 'var(--secondary)',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        fontSize: '0.7rem',
                        letterSpacing: '1px'
                    }}>{loop.category}</span>
                    <h3 className="text-lg">{loop.name}</h3>
                </div>
                <button
                    className={loop.joined ? "btn-ghost" : "btn btn-primary"}
                    style={{
                        padding: loop.joined ? '8px' : '8px 16px',
                        borderRadius: '99px',
                        fontSize: '0.85rem',
                        minWidth: loop.joined ? 'auto' : '80px',
                        height: '36px'
                    }}
                    onClick={() => onJoin(loop.id)}
                >
                    {loop.joined ? <Check size={20} color="var(--primary)" /> : 'Join'}
                </button>
            </div>

            <p className="text-sm text-muted">{loop.description}</p>

            <div className="flex-row flex-center" style={{
                justifyContent: 'flex-start',
                gap: '8px',
                color: 'var(--text-muted)',
                fontSize: '0.85rem',
                background: 'rgba(255,255,255,0.03)',
                padding: '4px 10px',
                alignSelf: 'flex-start',
                borderRadius: 8
            }}>
                <Users size={14} />
                <span>{loop.members.toLocaleString()} members</span>
            </div>
        </div>
    );
}
