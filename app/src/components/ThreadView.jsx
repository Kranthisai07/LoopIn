import React, { useState, useEffect } from 'react';
import { X, Send } from 'lucide-react';
import { db } from '../firebase';
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import PostCard from './PostCard';

export default function ThreadView({ post, onClose }) {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const { currentUser } = useAuth();

    useEffect(() => {
        if (!post?.id) return;

        // Subscribe to comments subcollection
        const q = query(
            collection(db, "posts", post.id, "comments"),
            orderBy("createdAt", "asc")
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const liveComments = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setComments(liveComments);
        });

        return () => unsubscribe();
    }, [post]);

    const handleSend = async () => {
        if (!newComment.trim() || !currentUser) return;

        try {
            await addDoc(collection(db, "posts", post.id, "comments"), {
                text: newComment,
                userId: currentUser.uid,
                userName: currentUser.displayName || 'Anonymous',
                userAvatar: currentUser.photoURL || null,
                createdAt: serverTimestamp()
            });
            setNewComment('');
        } catch (error) {
            console.error("Error sending comment:", error);
        }
    };

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'var(--bg-app)', zIndex: 2000,
            display: 'flex', flexDirection: 'column'
        }} className="animate-fade-in">

            {/* Header */}
            <div className="flex-row flex-center" style={{
                padding: '16px', borderBottom: '1px solid var(--border)',
                background: 'var(--bg-app)', justifyContent: 'space-between'
            }}>
                <button onClick={onClose} className="btn-ghost" style={{ padding: 8 }}>
                    <X size={24} />
                </button>
                <span className="text-lg">Thread</span>
                <div style={{ width: 40 }}></div> {/* Spacer */}
            </div>

            {/* Scrollable Content */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '0 0 80px 0' }}>
                {/* Original Post (Repurposed PostCard without Actions or simplified) */}
                <div style={{ pointerEvents: 'none' }}>
                    <PostCard post={post} />
                </div>

                {/* Divider */}
                <div style={{ height: 1, background: 'var(--border)', margin: '0 20px 20px 20px' }}></div>

                {/* Comments List */}
                <div className="flex-col gap-4 padding" style={{ paddingTop: 0 }}>
                    {comments.length === 0 ? (
                        <div className="text-muted flex-center" style={{ padding: 40, opacity: 0.6 }}>
                            No comments yet. Start the conversation!
                        </div>
                    ) : (
                        comments.map(comment => (
                            <div key={comment.id} className="flex-row gap-2 animate-fade-in">
                                <img
                                    src={comment.userAvatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=Guest"}
                                    style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover' }}
                                />
                                <div className="flex-col" style={{ flex: 1 }}>
                                    <div className="card" style={{
                                        padding: '8px 12px', borderRadius: '4px 16px 16px 16px',
                                        border: 'none', background: 'var(--bg-card-hover)'
                                    }}>
                                        <span className="text-sm" style={{ fontWeight: 600, display: 'block', marginBottom: 2 }}>
                                            {comment.userName}
                                        </span>
                                        <span className="text-sm">{comment.text}</span>
                                    </div>
                                    <span className="text-muted" style={{ fontSize: '0.7rem', marginLeft: 4, marginTop: 2 }}>Just now</span>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Input Area */}
            <div style={{
                position: 'absolute', bottom: 0, left: 0, right: 0,
                padding: '12px 16px', background: 'var(--bg-card)',
                borderTop: '1px solid var(--border)',
                display: 'flex', gap: 10, alignItems: 'center'
            }}>
                <input
                    type="text"
                    placeholder="Reply to this loop..."
                    className="card"
                    style={{
                        flex: 1, borderRadius: 24, padding: '10px 16px',
                        border: '1px solid var(--border)', outline: 'none',
                        color: 'var(--text-main)', background: 'var(--bg-app)'
                    }}
                    value={newComment}
                    onChange={e => setNewComment(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleSend()}
                />
                <button
                    className="btn btn-primary"
                    style={{ padding: 10, borderRadius: '50%', width: 44, height: 44, minWidth: 44 }}
                    onClick={handleSend}
                >
                    <Send size={20} />
                </button>
            </div>
        </div>
    );
}
