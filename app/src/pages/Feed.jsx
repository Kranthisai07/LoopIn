import React, { useState, useEffect } from 'react';
import { POSTS, CURRENT_USER } from '../data';
import PostCard from '../components/PostCard';
import CreatePostModal from '../components/CreatePostModal';
import ThreadView from '../components/ThreadView';
import { Edit3 } from 'lucide-react';
import { db } from '../firebase';
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';

import { useAuth } from '../contexts/AuthContext';

export default function Feed() {
    const { currentUser } = useAuth();
    const [posts, setPosts] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [activePost, setActivePost] = useState(null); // Track open thread
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const livePosts = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                time: 'Just now' // Simplified for demo
            }));
            setPosts(livePosts.length > 0 ? livePosts : POSTS); // Fallback to mock if empty
            setLoading(false);
        }, (error) => {
            console.error("Error fetching posts:", error);
            setPosts(POSTS); // Fallback on error (e.g. offline)
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const handleCreatePost = async ({ content, type, image }) => {
        try {
            await addDoc(collection(db, "posts"), {
                loopId: 1,
                user: CURRENT_USER,
                userId: currentUser.uid,
                content,
                image: image || null,
                likes: 0,
                createdAt: serverTimestamp(),
                type
            });
        } catch (error) {
            console.error("Error adding post: ", error);
        }
    };

    return (
        <div className="padding flex-col gap-4 animate-fade-in">
            {activePost && (
                <ThreadView post={activePost} onClose={() => setActivePost(null)} />
            )}

            <div className="flex-row" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
                <h1 className="text-xl">Your Loops</h1>
                <button
                    className="btn-ghost"
                    style={{ color: 'var(--primary)', background: 'rgba(99, 102, 241, 0.1)', borderRadius: '50%', padding: 12 }}
                    onClick={() => setShowModal(true)}
                >
                    <Edit3 size={24} />
                </button>
            </div>

            {loading ? (
                <div className="flex-center" style={{ padding: 40, color: 'var(--text-muted)' }}>Loading...</div>
            ) : (
                <div className="flex-col">
                    {posts.map(post => (
                        <PostCard
                            key={post.id}
                            post={post}
                            onOpen={setActivePost} // Pass handler
                        />
                    ))}
                </div>
            )}

            {showModal && (
                <CreatePostModal
                    onClose={() => setShowModal(false)}
                    onPost={handleCreatePost}
                />
            )}
        </div>
    );
}
