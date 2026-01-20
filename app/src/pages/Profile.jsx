import React, { useState, useEffect, useRef } from 'react';
import { Github, Globe, Grid, Bookmark, LogOut, Edit2, Repeat } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { CURRENT_USER as MOCK_USER, NEWS_ITEMS } from '../data';
import CreatePostModal from '../components/CreatePostModal';
import ImageCropperModal from '../components/ImageCropperModal';
import PostCard from '../components/PostCard';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp, query, where, orderBy, onSnapshot, doc, getDoc, setDoc } from 'firebase/firestore';

export default function Profile({ theme, toggleTheme }) {
    const { currentUser, logout } = useAuth();
    const [showModal, setShowModal] = useState(false);
    const [userPosts, setUserPosts] = useState([]);
    const [savedItems, setSavedItems] = useState([]);
    const [activeTab, setActiveTab] = useState('posts'); // 'posts', 'reposts', 'saved'

    // Image Editing States
    // In a real app, we'd upload these to storage. Here we just preview locally.
    const [customAvatar, setCustomAvatar] = useState(null);
    const [customHeader, setCustomHeader] = useState(null);

    // File Inputs
    const avatarInputRef = useRef(null);
    const headerInputRef = useRef(null);

    // Cropping State
    const [croppingImage, setCroppingImage] = useState(null);
    const [croppingType, setCroppingType] = useState(null); // 'avatar' | 'header'

    // Prefer Auth Data, fall back gracefully
    const avatar = customAvatar || currentUser?.photoURL || MOCK_USER.avatar;
    const name = currentUser?.displayName || MOCK_USER.name;
    const handle = currentUser?.email || MOCK_USER.handle;
    const bio = "Full Stack Dev building in public. [Bio from DB pending]";

    useEffect(() => {
        if (!currentUser?.email) return;

        // Fetch posts where user.handle == currentUser.email
        // We do client-side sorting to avoid composite index requirements for now
        const q = query(
            collection(db, "posts"),
            where("user.handle", "==", currentUser.email)
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const posts = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            // Sort by createdAt descending (newest first)
            posts.sort((a, b) => {
                const timeA = a.createdAt?.seconds || 0;
                const timeB = b.createdAt?.seconds || 0;
                return timeB - timeA;
            });
            setUserPosts(posts);
        }, (error) => {
            console.error("Error fetching user posts:", error);
        });

        return () => unsubscribe();

    }, [currentUser]);

    // Fetch User Profile Data (Avatar/Header) from Firestore
    useEffect(() => {
        if (!currentUser?.uid) return;

        const fetchUserProfile = async () => {
            try {
                const userDocRef = doc(db, "users", currentUser.uid);
                const userDoc = await getDoc(userDocRef);
                if (userDoc.exists()) {
                    const data = userDoc.data();
                    if (data.avatar) setCustomAvatar(data.avatar);
                    if (data.header) setCustomHeader(data.header);
                }
            } catch (error) {
                console.error("Error fetching user profile:", error);
            }
        };

        fetchUserProfile();
        fetchUserProfile();
    }, [currentUser]);

    // Fetch Saved Items
    useEffect(() => {
        if (!currentUser || activeTab !== 'saved') return;

        const q = query(
            collection(db, 'saved_items'),
            where('userId', '==', currentUser.uid)
        );

        const unsubscribe = onSnapshot(q, async (snapshot) => {
            const items = [];
            const postIds = [];

            snapshot.docs.forEach(doc => {
                const data = doc.data();
                if (data.type === 'news') {
                    const newsItem = NEWS_ITEMS.find(n => n.id === data.itemId);
                    if (newsItem) items.push({ ...newsItem, type: 'news_item', savedAt: data.savedAt });
                } else if (data.type === 'post') {
                    postIds.push(data.itemId);
                    items.push({ id: data.itemId, type: 'post_placeholder', savedAt: data.savedAt });
                }
            });

            if (postIds.length > 0) {
                const postDocs = await Promise.all(postIds.map(id => getDoc(doc(db, 'posts', id))));
                const postsMap = {};
                postDocs.forEach(d => {
                    if (d.exists()) postsMap[d.id] = { id: d.id, ...d.data(), type: d.data().type || 'post' };
                });

                const finalItems = items.map(item => {
                    if (item.type === 'post_placeholder') {
                        return postsMap[item.id] ? { ...postsMap[item.id] } : null;
                    }
                    return item;
                }).filter(Boolean);

                // Client-side sort by savedAt if available (or maintain order)
                setSavedItems(finalItems);
            } else {
                setSavedItems(items);
            }
        });

        return () => unsubscribe();
    }, [currentUser, activeTab]);

    const handleCreatePost = async ({ content, type }) => {
        if (!currentUser) return;
        try {
            await addDoc(collection(db, "posts"), {
                loopId: 1,
                user: {
                    name: currentUser.displayName || "Anonymous",
                    handle: currentUser.email || "@anon",
                    avatar: currentUser.photoURL || "https://api.dicebear.com/7.x/avataaars/svg?seed=Guest"
                },
                content,
                likes: 0,
                createdAt: serverTimestamp(),
                type
            });
        } catch (error) {
            console.error("Error adding post: ", error);
        }
    };

    // Generic Image Handler - Starts Cropping Flow
    const handleImageSelect = (e, type) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                alert("Image is too large. 5MB max.");
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                setCroppingImage(reader.result);
                setCroppingType(type);
            };
            reader.readAsDataURL(file);
        }
        // Reset input value so same file can be selected again
        e.target.value = '';
    };

    const handleCropComplete = async (croppedImage) => {
        if (!currentUser?.uid) return;

        try {
            const userDocRef = doc(db, "users", currentUser.uid);
            const updateData = {};

            if (croppingType === 'avatar') {
                setCustomAvatar(croppedImage);
                updateData.avatar = croppedImage;
            } else {
                setCustomHeader(croppedImage);
                updateData.header = croppedImage;
            }

            // Save to Firestore
            await setDoc(userDocRef, updateData, { merge: true });
        } catch (error) {
            console.error("Error saving profile image:", error);
            alert("Failed to save image. It might be too large.");
        }

        setCroppingImage(null);
        setCroppingType(null);
    };

    const handleCropCancel = () => {
        setCroppingImage(null);
        setCroppingType(null);
    };

    return (
        <div className="padding flex-col gap-4 animate-fade-in" style={{ paddingTop: 0 }}>
            {/* New Dynamic Header */}
            <div style={{
                height: 160,
                background: customHeader ? `url(${customHeader}) center/cover` : 'var(--primary-gradient)',
                margin: '0 -24px',
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                {/* File input for Header */}
                <input
                    type="file" ref={headerInputRef} hidden accept="image/*"
                    onChange={(e) => handleImageSelect(e, 'header')}
                />
                <button
                    onClick={() => headerInputRef.current.click()}
                    style={{
                        position: 'absolute', bottom: 10, right: 10,
                        background: 'rgba(0,0,0,0.5)', borderRadius: '50%', padding: 8,
                        color: 'white', backdropFilter: 'blur(4px)', zIndex: 20,
                        border: '1px solid rgba(255,255,255,0.1)'
                    }}>
                    <Edit2 size={16} />
                </button>

                {/* Decorative shapes (Only show if default gradient) */}
                {!customHeader && (
                    <div style={{
                        position: 'absolute', top: -50, right: -50, width: 200, height: 200,
                        background: 'rgba(255,255,255,0.1)', borderRadius: '50%', filter: 'blur(40px)'
                    }} />
                )}

                <div style={{ position: 'absolute', top: 20, right: 20, zIndex: 10, display: 'flex', gap: 10 }}>
                    <button className="btn-ghost"
                        style={{ color: 'white', background: 'rgba(255,255,255,0.2)', borderRadius: '50%', padding: 10, backdropFilter: 'blur(10px)' }}
                        onClick={toggleTheme}>
                        {theme === 'dark' ? '🌙' : '☀️'}
                    </button>
                    <button className="btn-ghost"
                        style={{ color: 'white', background: 'rgba(255,255,255,0.2)', borderRadius: '50%', padding: 10, backdropFilter: 'blur(10px)' }}
                        onClick={logout}>
                        <LogOut size={20} />
                    </button>
                </div>
            </div>

            <div style={{ marginTop: -70, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, position: 'relative', zIndex: 20 }}>
                <div className="avatar-ring" style={{ position: 'relative' }}>
                    <img src={avatar} alt="Me" className="avatar-img" style={{ width: 110, height: 110 }} />

                    {/* File input for Avatar */}
                    <input
                        type="file" ref={avatarInputRef} hidden accept="image/*"
                        onChange={(e) => handleImageSelect(e, 'avatar')}
                    />
                    <button
                        onClick={() => avatarInputRef.current.click()}
                        style={{
                            position: 'absolute', bottom: 5, right: 5,
                            background: 'var(--primary)', borderRadius: '50%', padding: 6,
                            color: 'white', border: '2px solid var(--bg-app)',
                            boxShadow: '0 4px 10px rgba(0,0,0,0.3)'
                        }}>
                        <Edit2 size={12} />
                    </button>
                </div>

                <div className="flex-col flex-center gap-2" style={{ textAlign: 'center' }}>
                    <h1 className="text-xl">{name}</h1>
                    <span className="chip" style={{ padding: '4px 12px', fontSize: '0.8rem' }}>{handle}</span>
                </div>

                <p className="text-muted" style={{ textAlign: 'center', maxWidth: '80%', lineHeight: 1.5 }}>
                    {bio}
                </p>

                <div className="flex-row gap-4" style={{ marginTop: 8 }}>
                    <a href="#" className="btn btn-ghost flex-row flex-center gap-2" style={{ fontSize: '0.9rem' }}>
                        <Github size={18} /> GitHub
                    </a>
                    <a href="#" className="btn btn-ghost flex-row flex-center gap-2" style={{ fontSize: '0.9rem' }}>
                        <Globe size={18} /> Portfolio
                    </a>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="flex-row gap-4" style={{ marginTop: 10 }}>
                <div className="card flex-col flex-center" style={{ flex: 1, padding: 16 }}>
                    <span className="text-xl" style={{ color: 'var(--primary)' }}>{12}</span>
                    <span className="text-sm text-muted">Loops</span>
                </div>
                <div className="card flex-col flex-center" style={{ flex: 1, padding: 16 }}>
                    <span className="text-xl" style={{ color: 'var(--secondary)' }}>{userPosts.length}</span>
                    <span className="text-sm text-muted">Posts</span>
                </div>
            </div>

            {/* Tabs */}

            {/* Tabs */}
            <div className="flex-row" style={{ borderBottom: '1px solid var(--border)', marginTop: 20 }}>
                <div
                    onClick={() => setActiveTab('posts')}
                    className="flex-row flex-center gap-2"
                    style={{
                        padding: '12px 20px',
                        borderBottom: activeTab === 'posts' ? '2px solid var(--primary)' : '2px solid transparent',
                        color: activeTab === 'posts' ? 'var(--primary)' : 'var(--text-muted)',
                        cursor: 'pointer'
                    }}>
                    <Grid size={18} />
                    <span style={{ fontWeight: 600 }}>Posts</span>
                </div>
                <div
                    onClick={() => setActiveTab('reposts')}
                    className="flex-row flex-center gap-2"
                    style={{
                        padding: '12px 20px',
                        borderBottom: activeTab === 'reposts' ? '2px solid var(--primary)' : '2px solid transparent',
                        color: activeTab === 'reposts' ? 'var(--primary)' : 'var(--text-muted)',
                        cursor: 'pointer'
                    }}>
                    <Repeat size={18} />
                    <span style={{ fontWeight: 600 }}>Reposts</span>
                </div>
                <div
                    onClick={() => setActiveTab('saved')}
                    className="flex-row flex-center gap-2"
                    style={{
                        padding: '12px 20px',
                        borderBottom: activeTab === 'saved' ? '2px solid var(--primary)' : '2px solid transparent',
                        color: activeTab === 'saved' ? 'var(--primary)' : 'var(--text-muted)',
                        cursor: 'pointer'
                    }}>
                    <Bookmark size={18} />
                    <span>Saved</span>
                </div>
            </div>


            {/* Content List */}
            <div className="flex-col gap-4" style={{ paddingBottom: 40, marginTop: 20 }}>
                {(() => {
                    const displayItems = activeTab === 'saved' ? savedItems : userPosts.filter(p => {
                        if (activeTab === 'posts') return p.type !== 'news-repost';
                        if (activeTab === 'reposts') return p.type === 'news-repost';
                        return false;
                    });

                    if (displayItems.length === 0) {
                        return (
                            <div style={{ padding: '40px 0', textAlign: 'center' }} className="flex-col flex-center gap-4">
                                <div style={{ padding: 20, background: 'var(--bg-card)', borderRadius: '50%', color: 'var(--text-muted)' }}>
                                    <Grid size={32} />
                                </div>
                                <p className="text-muted">No items to show</p>
                                {activeTab === 'posts' && (
                                    <button
                                        className="btn btn-primary"
                                        style={{ padding: '8px 20px', fontSize: '0.9rem' }}
                                        onClick={() => setShowModal(true)}
                                    >
                                        Create Post
                                    </button>
                                )}
                            </div>
                        );
                    }

                    return displayItems.map(item => {
                        if (item.type === 'news_item') {
                            return (
                                <div key={`news-${item.id}`} className="card flex-col gap-2" style={{ cursor: 'pointer', marginBottom: 16 }}>
                                    <div className="flex-row gap-2" style={{ alignItems: 'center' }}>
                                        <span className="chip" style={{ background: 'var(--primary)', color: 'white', fontSize: '0.7rem' }}>NEWS</span>
                                        <span className="text-sm text-muted">{item.source}</span>
                                    </div>
                                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>{item.title}</h3>
                                    {item.image && (
                                        <img src={item.image} alt="" style={{ width: '100%', height: 180, objectFit: 'cover', borderRadius: 8, marginTop: 8 }} />
                                    )}
                                </div>
                            );
                        }
                        return <PostCard key={item.id} post={item} />;
                    });
                })()}
            </div>

            {
                showModal && (
                    <CreatePostModal
                        onClose={() => setShowModal(false)}
                        onPost={handleCreatePost}
                    />
                )
            }

            {
                croppingImage && (
                    <ImageCropperModal
                        imageSrc={croppingImage}
                        aspect={croppingType === 'avatar' ? 1 : 2.5}
                        onCancel={handleCropCancel}
                        onCropComplete={handleCropComplete}
                    />
                )
            }
        </div >
    );
}
