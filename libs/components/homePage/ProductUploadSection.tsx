'use client';

import React, { useState, useCallback, useRef } from 'react';
import styles from '@/scss/styles/HomePage/ProductUploadSection.module.scss';
import { Upload, Image as ImageIcon, X, Check, Loader2 } from 'lucide-react';

interface ProductUploadSectionProps {
    isDarkMode?: boolean;
    frontImage: File | null;
    backImage: File | null;
    onFrontImageChange: (file: File | null) => void;
    onBackImageChange: (file: File | null) => void;
    onAnalyze: () => void;
    isAnalyzing?: boolean;
    isAnalyzed?: boolean;
}

const ProductUploadSection: React.FC<ProductUploadSectionProps> = ({
    isDarkMode = true,
    frontImage,
    backImage,
    onFrontImageChange,
    onBackImageChange,
    onAnalyze,
    isAnalyzing = false,
    isAnalyzed = false,
}) => {
    const [dragOverFront, setDragOverFront] = useState(false);
    const [dragOverBack, setDragOverBack] = useState(false);
    const frontInputRef = useRef<HTMLInputElement>(null);
    const backInputRef = useRef<HTMLInputElement>(null);

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
    };

    const handleDrop = useCallback((
        e: React.DragEvent,
        type: 'front' | 'back'
    ) => {
        e.preventDefault();
        setDragOverFront(false);
        setDragOverBack(false);

        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('image/')) {
            if (type === 'front') {
                onFrontImageChange(file);
            } else {
                onBackImageChange(file);
            }
        }
    }, [onFrontImageChange, onBackImageChange]);

    const handleFileSelect = useCallback((
        e: React.ChangeEvent<HTMLInputElement>,
        type: 'front' | 'back'
    ) => {
        const file = e.target.files?.[0];
        if (file) {
            if (type === 'front') {
                onFrontImageChange(file);
            } else {
                onBackImageChange(file);
            }
        }
    }, [onFrontImageChange, onBackImageChange]);

    const renderUploadZone = (
        type: 'front' | 'back',
        image: File | null,
        isDragOver: boolean,
        inputRef: React.RefObject<HTMLInputElement | null>
    ) => {
        const preview = image ? URL.createObjectURL(image) : null;

        return (
            <div className={styles.uploadZoneWrapper}>
                <label className={styles.uploadLabel}>
                    {type === 'front' ? 'Front' : 'Back'}
                </label>
                <div
                    className={`${styles.uploadZone} ${isDragOver ? styles.dragOver : ''} ${image ? styles.hasImage : ''}`}
                    onDragOver={handleDragOver}
                    onDragEnter={() => type === 'front' ? setDragOverFront(true) : setDragOverBack(true)}
                    onDragLeave={() => type === 'front' ? setDragOverFront(false) : setDragOverBack(false)}
                    onDrop={(e) => handleDrop(e, type)}
                    onClick={() => inputRef.current?.click()}
                >
                    <input
                        ref={inputRef}
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileSelect(e, type)}
                        style={{ display: 'none' }}
                    />

                    {preview ? (
                        <>
                            <img src={preview} alt={`${type} preview`} className={styles.previewImage} />
                            <button
                                className={styles.removeBtn}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    type === 'front' ? onFrontImageChange(null) : onBackImageChange(null);
                                }}
                            >
                                <X size={14} />
                            </button>
                        </>
                    ) : (
                        <div className={styles.uploadPlaceholder}>
                            <ImageIcon size={24} />
                            <span>{type === 'front' ? 'Front' : 'Back'}</span>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    const canAnalyze = frontImage && backImage && !isAnalyzing;

    return (
        <div className={`${styles.container} ${isDarkMode ? styles.dark : styles.light}`}>
            <div className={styles.header}>
                <Upload size={16} />
                <span>Product Images</span>
                {isAnalyzed && <Check size={14} className={styles.checkIcon} />}
            </div>

            <div className={styles.uploadGrid}>
                {renderUploadZone('front', frontImage, dragOverFront, frontInputRef)}
                {renderUploadZone('back', backImage, dragOverBack, backInputRef)}
            </div>

            <button
                className={`${styles.analyzeBtn} ${canAnalyze ? styles.ready : styles.disabled}`}
                onClick={onAnalyze}
                disabled={!canAnalyze}
            >
                {isAnalyzing ? (
                    <>
                        <Loader2 size={16} className={styles.spin} />
                        Analyzing...
                    </>
                ) : isAnalyzed ? (
                    <>
                        <Check size={16} />
                        Analyzed
                    </>
                ) : (
                    <>
                        <Upload size={16} />
                        Analyze Product
                    </>
                )}
            </button>
        </div>
    );
};

export default ProductUploadSection;
