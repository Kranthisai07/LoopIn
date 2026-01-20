import React, { useState, useEffect } from 'react';
import { NEWS_ITEMS } from '../data';
import { Repeat, Bookmark, Share2, ExternalLink } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase';
import { collection, addDoc, doc, setDoc, deleteDoc, getDoc, onSnapshot, query, where, serverTimestamp } from 'firebase/firestore';

export default function News() {
    const [activeTab, setActiveTab] = useState('News'); // 'News' or 'Articles'
    const { currentUser } = useAuth();

    // For feedback state (simple mock for now)
    // For feedback state (simple mock for now)
    const [reposted, setReposted] = useState({});
    const [bookmarked, setBookmarked] = useState({});

    useEffect(() => {
        if (!currentUser) return;

        const q = query(
            collection(db, 'saved_items'),
            where('userId', '==', currentUser.uid),
            where('type', '==', 'news')
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const savedMap = {};
            snapshot.forEach(doc => {
                savedMap[doc.data().itemId] = true;
            });
            setBookmarked(savedMap);
        });

        return () => unsubscribe();
    }, [currentUser]);

    const handleRepost = async (item) => {
        if (!currentUser) return alert('Please login to repost');
        try {
            await addDoc(collection(db, "posts"), {
                loopId: 1, // Default loop for now
                user: {
                    name: currentUser.displayName || "User",
                    handle: currentUser.email, // specific format to match Profile query
                    avatar: currentUser.photoURL || "https://api.dicebear.com/7.x/avataaars/svg?seed=User"
                },
                content: `Check out this article from ${item.source}: ${item.title}`,
                image: item.image,
                likes: 0,
                createdAt: serverTimestamp(),
                type: 'news-repost',
                newsId: item.id,
                userId: currentUser.uid
            });
            setReposted(prev => ({ ...prev, [item.id]: true }));
            alert('Reposted to your feed!');
        } catch (error) {
            console.error("Error reposting:", error);
        }
    };

    const handleBookmark = async (item) => {
        if (!currentUser) return alert('Please login to bookmark');
        const docId = `${currentUser.uid}_${item.id}`;
        const docRef = doc(db, "saved_items", docId);

        try {
            if (bookmarked[item.id]) {
                await deleteDoc(docRef);
                setBookmarked(prev => ({ ...prev, [item.id]: false }));
            } else {
                await setDoc(docRef, {
                    userId: currentUser.uid,
                    itemId: item.id,
                    type: 'news',
                    savedAt: serverTimestamp()
                });
                setBookmarked(prev => ({ ...prev, [item.id]: true }));
            }
        } catch (error) {
            console.error("Error bookmarking:", error);
        }
    };

    const handleShare = async (item) => {
        const shareData = {
            title: item.title,
            text: item.summary,
            url: window.location.href // Ideally item's actual URL
        };

        if (navigator.share) {
            try {
                await navigator.share(shareData);
            } catch (err) {
                console.log('Error sharing:', err);
            }
        } else {
            // Fallback
            navigator.clipboard.writeText(`Check this out: ${item.title} - ${item.source}`);
            alert('Link copied to clipboard!');
        }
    };

    const filteredItems = NEWS_ITEMS.filter(item => item.category === activeTab);

    return (
        <div className="padding flex-col gap-4 animate-fade-in" style={{ paddingBottom: 80 }}>
            {/* Header / Tabs */}
            <div className="flex-row gap-4" style={{
                borderBottom: '1px solid var(--border)',
                paddingBottom: 0,
                marginBottom: 10
            }}>
                {['News', 'Articles'].map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        style={{
                            padding: '12px 20px',
                            background: 'transparent',
                            border: 'none',
                            borderBottom: activeTab === tab ? '2px solid var(--primary)' : '2px solid transparent',
                            color: activeTab === tab ? 'var(--text-main)' : 'var(--text-muted)',
                            fontWeight: activeTab === tab ? 600 : 400,
                            fontSize: '1rem',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease'
                        }}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Content List */}
            <div className="flex-col" style={{ gap: 40 }}>
                {filteredItems.map(item => (
                    <div key={item.id} className="card-hover-effect" style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 12,
                        cursor: 'pointer'
                    }}>
                        {/* Source Header */}
                        <div className="flex-row flex-center gap-2" style={{ fontSize: '0.9rem' }}>
                            <div style={{
                                width: 24, height: 24,
                                background: 'white',
                                borderRadius: 4,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontWeight: 'bold', color: 'black', fontSize: '0.7rem'
                            }}>
                                {item.source[0]}
                            </div>
                            <span style={{ fontWeight: 600 }}>{item.source}</span>
                            <span style={{ color: 'var(--text-muted)' }}>• {item.time}</span>
                        </div>

                        {/* Image */}
                        <div style={{
                            width: '100%',
                            height: 200,
                            borderRadius: 'var(--radius-md)',
                            overflow: 'hidden',
                            background: 'var(--bg-card)'
                        }}>
                            <img
                                src={item.image}
                                alt={item.title}
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover'
                                }}
                            />
                        </div>

                        {/* Text Content */}
                        <div className="flex-col gap-2">
                            <h3 style={{
                                fontSize: '1.2rem',
                                fontWeight: 700,
                                lineHeight: 1.3
                            }}>
                                {item.title}
                            </h3>
                            <p style={{
                                color: 'var(--text-muted)',
                                fontSize: '0.95rem',
                                lineHeight: 1.5,
                                display: '-webkit-box',
                                WebkitLineClamp: 3,
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden'
                            }}>
                                {item.summary}
                            </p>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex-row" style={{ marginTop: 12, justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{
                                background: 'rgba(0,0,0,0.3)',
                                color: 'var(--text-muted)',
                                padding: '4px 10px',
                                borderRadius: 4,
                                fontSize: '0.75rem',
                                fontWeight: 600,
                                letterSpacing: '0.02em'
                            }}>
                                {item.source}
                            </div>

                            <button
                                onClick={(e) => { e.stopPropagation(); handleRepost(item); }}
                                style={{ background: 'none', border: 'none', color: reposted[item.id] ? 'var(--primary)' : 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                            >
                                <Repeat size={20} />
                            </button>
                            <button
                                onClick={(e) => { e.stopPropagation(); handleBookmark(item); }}
                                style={{ background: 'none', border: 'none', color: bookmarked[item.id] ? 'var(--primary)' : 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                            >
                                <Bookmark size={20} fill={bookmarked[item.id] ? "currentColor" : "none"} />
                            </button>
                            <button
                                onClick={(e) => { e.stopPropagation(); handleShare(item); }}
                                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                            >
                                <Share2 size={20} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
