import React, { useState, useEffect } from 'react';
import { Heart, MessageCircle, Share2, MoreHorizontal, Bookmark, Trash2 } from 'lucide-react';
import { LOOPS } from '../data';
import { db } from '../firebase';
import { doc, setDoc, deleteDoc, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';

export default function PostCard({ post, onOpen }) {
    const { currentUser } = useAuth();
    const loopName = LOOPS.find(l => l.id === post.loopId)?.name || 'Unknown Loop';
    const [liked, setLiked] = useState(false);
    const [saved, setSaved] = useState(false);
    const [showMenu, setShowMenu] = useState(false);

    useEffect(() => {
        if (!currentUser) return;
        const docRef = doc(db, 'saved_items', `${currentUser.uid}_${post.id}`);
        // Use onSnapshot for real-time updates across components (Feed <-> Profile)
        const unsubscribe = onSnapshot(docRef, (docSnap) => {
            setSaved(docSnap.exists());
        });
        return () => unsubscribe();
    }, [currentUser, post.id]);

    const handleSave = async () => {
        if (!currentUser) return;
        const docId = `${currentUser.uid}_${post.id}`;
        const docRef = doc(db, 'saved_items', docId);

        try {
            if (saved) {
                await deleteDoc(docRef);
                setSaved(false);
            } else {
                await setDoc(docRef, {
                    userId: currentUser.uid,
                    itemId: post.id,
                    type: 'post',
                    savedAt: serverTimestamp()
                });
                setSaved(true);
            }
        } catch (error) {
            console.error("Error toggling save:", error);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm("Are you sure you want to delete this post?")) return;
        try {
            await deleteDoc(doc(db, "posts", post.id));
        } catch (error) {
            console.error("Error deleting post:", error);
        }
    };

    const isOwner = currentUser && (
        post.userId === currentUser.uid ||
        (post.type === 'news-repost' && post.user?.handle === currentUser.email)
    );

    return (
        <div className="card flex-col gap-4" style={{ marginBottom: 16, cursor: 'pointer' }} onClick={() => onOpen && onOpen(post)}>
            <div className="flex-row gap-2" style={{ alignItems: 'center' }}>
                <div className="avatar-ring" style={{ padding: 2 }}>
                    <img src={post.user.avatar} alt="avatar" className="avatar-img" style={{ width: 42, height: 42 }} />
                </div>
                <div className="flex-col">
                    <div className="flex-row gap-2" style={{ alignItems: 'baseline' }}>
                        <span className="text-sm" style={{ fontWeight: 700 }}>{post.user.name}</span>
                        <span className="text-sm text-muted" style={{ fontSize: '0.75rem' }}>{post.user.handle}</span>
                    </div>
                    <div className="flex-row gap-2" style={{ alignItems: 'center' }}>
                        <span className="text-sm" style={{ color: 'var(--primary)', fontSize: '0.75rem', fontWeight: 500 }}>in {loopName}</span>
                        {post.type === 'collab' && (
                            <span className="chip" style={{ padding: '2px 8px', fontSize: '0.65rem', background: 'var(--secondary)', color: 'white', border: 'none' }}>COLLAB</span>
                        )}
                        {post.type === 'showcase' && (
                            <span className="chip" style={{ padding: '2px 8px', fontSize: '0.65rem', background: 'var(--primary)', color: 'white', border: 'none' }}>SHOWCASE</span>
                        )}
                        {post.type === 'question' && (
                            <span className="chip" style={{ padding: '2px 8px', fontSize: '0.65rem', background: 'rgba(255,165,0,0.2)', color: 'orange', border: '1px solid orange' }}>HELP</span>
                        )}
                        {post.type === 'news-repost' && (
                            <span className="chip" style={{ padding: '2px 8px', fontSize: '0.65rem', background: 'var(--primary)', color: 'white', border: 'none' }}>NEWS</span>
                        )}
                    </div>
                </div>
                <div style={{ marginLeft: 'auto', position: 'relative' }}>
                    <button
                        className="btn-ghost"
                        style={{ padding: 8 }}
                        onClick={(e) => {
                            e.stopPropagation();
                            setShowMenu(!showMenu);
                        }}
                    >
                        <MoreHorizontal size={20} />
                    </button>
                    {showMenu && (
                        <div style={{
                            position: 'absolute',
                            top: '100%',
                            right: 0,
                            background: 'var(--bg-card)',
                            border: '1px solid var(--border)',
                            borderRadius: '12px',
                            padding: '8px',
                            zIndex: 10,
                            boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                            minWidth: '120px',
                            backdropFilter: 'blur(10px)'
                        }}>
                            {isOwner && (
                                <button
                                    className="flex-row gap-2 btn-ghost"
                                    style={{
                                        padding: '8px 12px',
                                        width: '100%',
                                        color: '#ef4444',
                                        justifyContent: 'flex-start',
                                        fontSize: '0.9rem'
                                    }}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setShowMenu(false);
                                        handleDelete();
                                    }}
                                >
                                    <Trash2 size={16} />
                                    <span>Delete</span>
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>

            <p className="text-sm" style={{ lineHeight: '1.7', fontSize: '1rem' }}>
                {post.content}
            </p>

            {/* Post Image */}
            {post.image && (
                <div style={{ marginTop: 12, borderRadius: '16px', overflow: 'hidden' }}>
                    <img
                        src={post.image}
                        alt="Post attachment"
                        style={{ width: '100%', maxHeight: '400px', objectFit: 'cover', display: 'block' }}
                    />
                </div>
            )}

            {/* Action Bar */}
            <div className="flex-row" style={{
                justifyContent: 'space-between',
                color: 'var(--text-muted)',
                marginTop: '8px',
                borderTop: '1px solid var(--border)',
                paddingTop: '12px'
            }}>
                <button
                    className={`flex-row flex-center gap-2 btn-ghost ${liked ? 'like-bounce' : ''}`}
                    style={{ padding: '6px 12px', color: liked ? 'var(--primary)' : 'inherit', transition: 'color 0.3s' }}
                    onClick={(e) => { e.stopPropagation(); setLiked(!liked); }}
                >
                    <Heart size={18} fill={liked ? 'currentColor' : 'none'} style={{ transition: 'fill 0.3s' }} />
                    <span className="text-sm">{post.likes + (liked ? 1 : 0)}</span>
                </button>

                <button
                    className="flex-row flex-center gap-2 btn-ghost"
                    style={{ padding: '6px 12px' }}
                >
                    <MessageCircle size={18} />
                    <span className="text-sm">Reply</span>
                </button>

                <button className="flex-row flex-center gap-2 btn-ghost" style={{ padding: '6px 12px' }} onClick={(e) => e.stopPropagation()}>
                    <Share2 size={18} />
                </button>

                <button
                    className="flex-row flex-center gap-2 btn-ghost"
                    style={{ padding: '6px 12px', color: saved ? 'var(--primary)' : 'inherit' }}
                    onClick={(e) => { e.stopPropagation(); handleSave(); }}
                >
                    <Bookmark size={18} fill={saved ? "currentColor" : "none"} />
                </button>
            </div>
        </div>
    );
}
