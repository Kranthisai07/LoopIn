import React, { useState, useCallback } from 'react'
import Cropper from 'react-easy-crop'
import getCroppedImg from '../utils/cropUtils'
import { X, Check } from 'lucide-react'

export default function ImageCropperModal({ imageSrc, aspect = 1, onCancel, onCropComplete }) {
    const [crop, setCrop] = useState({ x: 0, y: 0 })
    const [zoom, setZoom] = useState(1)
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)

    const onCropChange = (crop) => {
        setCrop(crop)
    }

    const onZoomChange = (zoom) => {
        setZoom(zoom)
    }

    const onCropCompleteHandler = useCallback((croppedArea, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels)
    }, [])

    const handleSave = async () => {
        try {
            const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels)
            onCropComplete(croppedImage)
        } catch (e) {
            console.error(e)
        }
    }

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.85)', zIndex: 1000,
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'
        }}>
            <div style={{
                position: 'relative',
                width: '90%', height: '60%',
                background: '#000', borderRadius: 16, overflow: 'hiddenbox-shadow: 0 20px 50px rgba(0,0,0,0.5)'
            }}>
                <Cropper
                    image={imageSrc}
                    crop={crop}
                    zoom={zoom}
                    aspect={aspect}
                    onCropChange={onCropChange}
                    onCropComplete={onCropCompleteHandler}
                    onZoomChange={onZoomChange}
                />
            </div>

            <div className="flex-col" style={{ width: '80%', marginTop: 20, gap: 10 }}>
                <div className="flex-row flex-center gap-2">
                    <span style={{ color: 'white', fontSize: '0.9rem' }}>Zoom</span>
                    <input
                        type="range"
                        value={zoom}
                        min={1}
                        max={3}
                        step={0.1}
                        aria-labelledby="Zoom"
                        onChange={(e) => setZoom(e.target.value)}
                        className="zoom-range"
                        style={{ width: '100%', accentColor: 'var(--primary)' }}
                    />
                </div>

                <div className="flex-row gap-4" style={{ justifyContent: 'center', marginTop: 10 }}>
                    <button
                        onClick={onCancel}
                        className="btn btn-ghost"
                        style={{ color: 'white', background: 'rgba(255,255,255,0.1)' }}>
                        <X size={20} style={{ marginRight: 8 }} /> Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        className="btn btn-primary"
                        style={{ minWidth: 120 }}>
                        <Check size={20} style={{ marginRight: 8 }} /> Set Image
                    </button>
                </div>
            </div>
        </div>
    )
}
