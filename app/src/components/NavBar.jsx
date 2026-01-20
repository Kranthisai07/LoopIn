import React from 'react';
import { Compass, Home, User, Bell, Newspaper } from 'lucide-react';

export default function NavBar({ currentView, setView }) {
    if (currentView === 'welcome') return null; // No nav on welcome screen

    return (
        <nav className="nav-bar">
            <NavItem
                icon={<Home size={26} strokeWidth={currentView === 'feed' ? 2.5 : 2} />}
                label="Feed"
                active={currentView === 'feed'}
                onClick={() => setView('feed')}
            />
            <NavItem
                icon={<Newspaper size={26} strokeWidth={currentView === 'news' ? 2.5 : 2} />}
                label="News"
                active={currentView === 'news'}
                onClick={() => setView('news')}
            />
            <NavItem
                icon={<Compass size={26} strokeWidth={currentView === 'explore' ? 2.5 : 2} />}
                label="Explore"
                active={currentView === 'explore'}
                onClick={() => setView('explore')}
            />
            <NavItem
                icon={<User size={26} strokeWidth={currentView === 'profile' ? 2.5 : 2} />}
                label="Profile"
                active={currentView === 'profile'}
                onClick={() => setView('profile')}
            />
        </nav>
    );
}

function NavItem({ icon, label, active, onClick }) {
    return (
        <div className={`nav-item ${active ? 'active' : ''}`} onClick={onClick}>
            {icon}
            <span>{label}</span>
        </div>
    );
}
