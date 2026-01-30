'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, Loader2, AlertCircle } from 'lucide-react';
import { Collection } from '@/libs/types/homepage/collection';
import { updateCollection, updateDAJSON } from '@/libs/server/HomePage/collection';
import { AuthApiError } from '@/libs/server/HomePage/signup';
import styles from '@/scss/styles/Modals/CreateCollectionWizard.module.scss';
// Use the same styles as CreateCollectionWizard for consistency

// AnalyzedDAJSON interface
interface AnalyzedDAJSON {
    [key: string]: any; // Allow flexible JSON editing
}

interface EditCollectionModalProps {
    collection: Collection;
    isOpen: boolean;
    onClose: () => void;
    onSave: (updatedCollection: Collection) => void;
    isDarkMode?: boolean;
}

const EditCollectionModal: React.FC<EditCollectionModalProps> = ({
    collection,
    isOpen,
    onClose,
    onSave,
    isDarkMode = true
}) => {
    const [formData, setFormData] = useState({
        name: collection.name,
        code: collection.code || '',
        description: collection.description || ''
    });

    // JSON Editing State
    const [editedJson, setEditedJson] = useState<string>('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Initial load
    useEffect(() => {
        setFormData({
            name: collection.name,
            code: collection.code || '',
            description: collection.description || ''
        });

        // Format JSON for editor
        if (collection.analyzed_da_json) {
            setEditedJson(JSON.stringify(collection.analyzed_da_json, null, 2));
        } else {
            setEditedJson('{}');
        }
    }, [collection]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setError(null);
    };

    const handleJsonChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setEditedJson(e.target.value);
        setError(null);
    };

    const handleSave = async () => {
        if (!formData.name.trim()) {
            setError('Collection name is required');
            return;
        }

        setIsSubmitting(true);
        setError(null);

        try {
            // Validate JSON first
            let parsedJson = {};
            try {
                parsedJson = JSON.parse(editedJson);
            } catch (e) {
                throw new Error('Invalid JSON format');
            }

            // Update basic collection info
            const updatedBasic = await updateCollection(collection.id, {
                name: formData.name.trim(),
                code: formData.code.trim() || undefined, // Allow code update
                description: formData.description?.trim() || undefined
            });

            // Update DA JSON
            const updatedDA = await updateDAJSON(collection.id, {
                analyzed_da_json: parsedJson
            });

            const finalCollection = {
                ...updatedBasic,
                analyzed_da_json: updatedDA.analyzed_da_json,
                fixed_elements: updatedDA.fixed_elements
            };

            onSave(finalCollection);
            onClose();
        } catch (err: any) {
            console.error('Update failed:', err);
            if (err instanceof AuthApiError) {
                setError(err.errors.join(', '));
            } else {
                setError(err.message || 'Failed to update collection. Please try again.');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className={`${styles.overlay} ${isDarkMode ? styles.dark : styles.light}`} onClick={onClose}>
            <motion.div
                className={`${styles.modal} ${isDarkMode ? styles.dark : styles.light}`}
                onClick={e => e.stopPropagation()}
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ duration: 0.2 }}
                style={{ height: '85vh', maxHeight: '800px' }}
            >
                {/* Header */}
                <div className={styles.header}>
                    <div className={styles.headerLeft}>
                        <h2 className={styles.title}>Edit Collection</h2>
                        <span className={styles.brandBadge}>{formData.code || 'NO CODE'}</span>
                    </div>
                    <button className={styles.closeBtn} onClick={onClose}>
                        <X size={20} />
                    </button>
                </div>

                {/* Content - Scrollable */}
                <div className={styles.content} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

                    {/* Basic Information */}
                    <div className={styles.formGrid}>
                        <div className={styles.formGroup}>
                            <label>Collection Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                className={styles.input}
                                placeholder="e.g., Spring Summer 2026"
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label>Collection Code</label>
                            <input
                                type="text"
                                name="code"
                                value={formData.code}
                                onChange={handleInputChange}
                                className={styles.input}
                                placeholder="e.g., SS26"
                            />
                        </div>

                        <div className={styles.formGroup} style={{ gridColumn: '1 / -1' }}>
                            <label>Description</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                className={styles.textarea}
                                rows={2}
                                placeholder="Describe the collection's vision..."
                            />
                        </div>
                    </div>

                    {/* JSON Editor */}
                    <div className={styles.sectionDivider}>
                        <h4 style={{ fontSize: '14px', fontWeight: 600, margin: '0 0 8px 0', color: isDarkMode ? '#ffffff' : '#1a1a1a' }}>
                            Design Aesthetic JSON
                        </h4>
                    </div>

                    <div className={styles.jsonContainer} style={{ flex: 1, minHeight: '300px' }}>
                        <textarea
                            className={styles.jsonEditor}
                            value={editedJson}
                            onChange={handleJsonChange}
                            spellCheck={false}
                            style={{ height: '100%' }}
                        />
                    </div>

                    {error && (
                        <div className={styles.errorMessage}>
                            <AlertCircle size={16} /> {error}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className={styles.footer}>
                    <button className={styles.cancelBtnStyled} onClick={onClose}>
                        <X size={16} />
                        Cancel
                    </button>
                    <button
                        className={styles.primaryBtn}
                        onClick={handleSave}
                        disabled={isSubmitting}
                        style={{ flex: 1, justifyContent: 'center' }}
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 size={16} className={styles.spin} />
                                <span style={{ marginLeft: 8 }}>Saving...</span>
                            </>
                        ) : (
                            <>
                                <Check size={16} />
                                <span style={{ marginLeft: 8 }}>Save Changes</span>
                            </>
                        )}
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

export default EditCollectionModal;
