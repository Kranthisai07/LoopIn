import React, { useState, useRef } from 'react';
import { X, Mic, Image, Zap } from 'lucide-react';

export default function CreatePostModal({ onClose, onPost }) {
    const [content, setContent] = useState('');
    const [type, setType] = useState('discussion');
    const [imageUrl, setImageUrl] = useState(null);
    const fileInputRef = useRef(null);

    const handleSubmit = () => {
        if (!content.trim() && !imageUrl) return;
        onPost({ content, type, image: imageUrl });
        onClose();
    };

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Check size (2MB limit for base64 safety)
            if (file.size > 2 * 1024 * 1024) {
                alert("Image is too large. visual previews are limited to 2MB for now.");
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                setImageUrl(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)',
            zIndex: 1000, display: 'flex', alignItems: 'end', justifyContent: 'center'
        }} className="animate-fade-in">

            {/* Modal Sheet */}
            <div style={{
                width: '100%', maxWidth: '600px', background: 'var(--bg-card)',
                borderTopLeftRadius: '24px', borderTopRightRadius: '24px',
                border: '1px solid var(--border)', padding: '24px',
                display: 'flex', flexDirection: 'column',
                boxShadow: '0 -10px 40px rgba(0,0,0,0.7)',
                maxHeight: '85vh',
                marginBottom: 0
            }}>
                <div className="flex-row" style={{ justifyContent: 'space-between', marginBottom: 20 }}>
                    <span className="text-lg">Create Post</span>
                    <button onClick={onClose}><X size={24} className="text-muted" /></button>
                </div>

                <div style={{ flex: 1, overflowY: 'auto' }}>
                    <textarea
                        placeholder="What's on your mind? Share a thought, a project, or ask for help..."
                        style={{
                            width: '100%', minHeight: '120px', background: 'transparent',
                            border: 'none', color: 'var(--text-main)', fontSize: '1.1rem',
                            resize: 'none', outline: 'none', fontFamily: 'inherit'
                        }}
                        value={content}
                        onChange={e => setContent(e.target.value)}
                        autoFocus
                    />

                    {/* Image Preview */}
                    {imageUrl && (
                        <div style={{ position: 'relative', margin: '10px 0', borderRadius: '16px', overflow: 'hidden' }}>
                            <img src={imageUrl} alt="preview" style={{ width: '100%', maxHeight: '300px', objectFit: 'cover' }} />
                            <button
                                onClick={() => setImageUrl(null)}
                                style={{
                                    position: 'absolute', top: 8, right: 8,
                                    background: 'rgba(0,0,0,0.6)', borderRadius: '50%',
                                    padding: 4, color: 'white'
                                }}
                            >
                                <X size={16} />
                            </button>
                        </div>
                    )}
                </div>

                {/* Type Selector */}
                <div className="flex-row" style={{ gap: 10, overflowX: 'auto', paddingBottom: 10, margin: '10px 0' }}>
                    {['discussion', 'collab', 'showcase', 'question'].map(t => (
                        <button
                            key={t}
                            onClick={() => setType(t)}
                            className={`chip ${type === t ? 'selected' : ''}`}
                            style={{ textTransform: 'capitalize', padding: '6px 12px', fontSize: '0.85rem' }}
                        >
                            {t}
                        </button>
                    ))}
                </div>

                {/* Actions */}
                <div className="flex-row" style={{ justifyContent: 'space-between', alignItems: 'center', marginTop: 10, paddingTop: 10, borderTop: '1px solid var(--border)' }}>
                    <div className="flex-row gap-4 text-muted">
                        <button
                            className={`btn-ghost ${imageUrl ? 'text-primary' : ''}`}
                            onClick={() => fileInputRef.current?.click()}
                            style={{ padding: 8 }}
                        >
                            <Image size={24} color={imageUrl ? 'var(--primary)' : 'currentColor'} />
                        </button>
                        <input
                            type="file"
                            ref={fileInputRef}
                            style={{ display: 'none' }}
                            accept="image/*"
                            onChange={handleFileSelect}
                        />

                        <button className="btn-ghost" style={{ padding: 8 }}><Mic size={24} /></button>
                        <button className="btn-ghost" style={{ padding: 8 }}><Zap size={24} /></button>
                    </div>
                    <button className="btn btn-primary" onClick={handleSubmit} style={{ padding: '10px 24px' }}>
                        Post
                    </button>
                </div>
            </div>
        </div>
    );
}
