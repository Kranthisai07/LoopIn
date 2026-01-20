import React, { useState } from 'react';
import { LOOPS, INTERESTS } from '../data';
import LoopCard from '../components/LoopCard';
import { Search } from 'lucide-react';

export default function Explore() {
    const [filter, setFilter] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');
    const [loops, setLoops] = useState(LOOPS);

    const handleJoin = (id) => {
        setLoops(loops.map(l => l.id === id ? { ...l, joined: !l.joined } : l));
    };

    const filtered = loops.filter(l => {
        const matchesCategory = filter === 'All' || l.category === filter;
        const matchesSearch = l.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            l.description.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    return (
        <div className="padding flex-col gap-4 animate-fade-in">
            <h1 className="text-xl">Discover Loops</h1>

            {/* Search Input */}
            <div className="flex-row flex-center" style={{
                background: 'var(--bg-card)',
                padding: '12px 16px',
                borderRadius: 'var(--radius-full)',
                border: '1px solid var(--border)',
                gap: '10px',
                transition: 'box-shadow 0.3s',
                boxShadow: searchTerm ? '0 0 15px rgba(177, 159, 145, 0.15)' : 'none' // Subtle glow on active
            }}>
                <Search size={20} className="text-muted" />
                <input
                    type="text"
                    placeholder="Search loops, interests..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{
                        background: 'transparent',
                        border: 'none',
                        color: 'var(--text-main)',
                        outline: 'none',
                        width: '100%',
                        fontSize: '1rem',
                        fontFamily: 'inherit'
                    }}
                />
            </div>

            {/* Filter Chips */}
            <div className="flex-row" style={{ overflowX: 'auto', paddingBottom: '8px', gap: '8px', scrollbarWidth: 'none' }}>
                {['All', ...INTERESTS].map(cat => (
                    <button
                        key={cat}
                        className={`chip ${filter === cat ? 'selected' : ''}`}
                        onClick={() => setFilter(cat)}
                        style={{ whiteSpace: 'nowrap' }}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            <div className="flex-col gap-4">
                {filtered.length > 0 ? (
                    filtered.map(loop => (
                        <LoopCard key={loop.id} loop={loop} onJoin={handleJoin} />
                    ))
                ) : (
                    <div className="flex-center flex-col text-muted" style={{ padding: 40 }}>
                        <Search size={40} style={{ marginBottom: 10, opacity: 0.5 }} />
                        <p>No loops found.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
