'use client';

import React, { useState, useCallback } from 'react';
import styles from '@/scss/styles/HomePage/JSONPreviewPanel.module.scss';
import {
    ChevronDown,
    ChevronRight,
    Edit3,
    Check,
    X,
    Code,
    Package,
    Palette,
    FileText,
} from 'lucide-react';

export interface ProductJSON {
    type: string;
    color: string;
    color_hex: string;
    texture: string;
    material: string;
    details: string;
    logo_front: string;
    logo_back: string;
}

export interface DAJSON {
    background: {
        color_hex: string;
        color_name: string;
        description: string;
        texture?: string;
    };
    props: {
        items: string[];
        placement: string;
        style: string;
    };
    mood: string;
    lighting: {
        type: string;
        temperature: string;
        direction: string;
        intensity: string;
    };
    composition: {
        layout: string;
        poses: string;
        framing: string;
    };
    styling?: {
        bottom?: string;
        feet?: string;
    };
    camera: {
        focal_length_mm: number;
        aperture: number;
        focus: string;
    };
    quality: string;
}

interface JSONPreviewPanelProps {
    isDarkMode?: boolean;
    productJSON: ProductJSON | null;
    daJSON: DAJSON | null;
    mergedPrompts: Record<string, string>;
    onProductJSONChange?: (json: ProductJSON) => void;
    onDAJSONChange?: (json: DAJSON) => void;
    onPromptsChange?: (key: string, value: string) => void;
    isAnalyzing?: boolean;
}

type PanelType = 'product' | 'da' | 'prompts';

const JSONPreviewPanel: React.FC<JSONPreviewPanelProps> = ({
    isDarkMode = true,
    productJSON,
    daJSON,
    mergedPrompts,
    onProductJSONChange,
    onDAJSONChange,
    onPromptsChange,
    isAnalyzing = false,
}) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [activePanel, setActivePanel] = useState<PanelType>('product');
    const [editingField, setEditingField] = useState<string | null>(null);
    const [editValue, setEditValue] = useState('');

    const handleToggle = useCallback(() => {
        setIsExpanded(!isExpanded);
    }, [isExpanded]);

    const handlePanelClick = useCallback((panel: PanelType) => {
        setActivePanel(panel);
        if (!isExpanded) {
            setIsExpanded(true);
        }
    }, [isExpanded]);

    const handleEditStart = useCallback((field: string, value: string) => {
        setEditingField(field);
        setEditValue(value);
    }, []);

    const handleEditSave = useCallback(() => {
        if (!editingField) return;

        // Parse field path (e.g., "product.type" or "prompts.duo")
        const [section, ...fieldParts] = editingField.split('.');
        const field = fieldParts.join('.');

        if (section === 'product' && productJSON && onProductJSONChange) {
            onProductJSONChange({ ...productJSON, [field]: editValue });
        } else if (section === 'prompts' && onPromptsChange) {
            onPromptsChange(field, editValue);
        }
        // DA JSON editing could be added similarly

        setEditingField(null);
        setEditValue('');
    }, [editingField, editValue, productJSON, onProductJSONChange, onPromptsChange]);

    const handleEditCancel = useCallback(() => {
        setEditingField(null);
        setEditValue('');
    }, []);

    const renderEditableField = (
        label: string,
        value: string,
        fieldPath: string,
        editable: boolean = true
    ) => {
        const isEditing = editingField === fieldPath;

        return (
            <div className={styles.field}>
                <span className={styles.fieldLabel}>{label}</span>
                {isEditing ? (
                    <div className={styles.editContainer}>
                        <textarea
                            className={styles.editInput}
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            autoFocus
                            rows={fieldPath.includes('prompts') ? 4 : 1}
                        />
                        <div className={styles.editActions}>
                            <button className={styles.saveBtn} onClick={handleEditSave}>
                                <Check size={14} />
                            </button>
                            <button className={styles.cancelBtn} onClick={handleEditCancel}>
                                <X size={14} />
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className={styles.fieldValue}>
                        <span>{value || '—'}</span>
                        {editable && (
                            <button
                                className={styles.editBtn}
                                onClick={() => handleEditStart(fieldPath, value)}
                            >
                                <Edit3 size={12} />
                            </button>
                        )}
                    </div>
                )}
            </div>
        );
    };

    const renderProductPanel = () => {
        if (!productJSON) {
            return (
                <div className={styles.emptyState}>
                    {isAnalyzing ? (
                        <>
                            <div className={styles.spinner} />
                            <span>Analyzing product...</span>
                        </>
                    ) : (
                        <>
                            <Package size={24} />
                            <span>Upload product to see analysis</span>
                        </>
                    )}
                </div>
            );
        }

        return (
            <div className={styles.panelContent}>
                {renderEditableField('Type', productJSON.type, 'product.type')}
                {renderEditableField('Color', productJSON.color, 'product.color')}
                {renderEditableField('Color Hex', productJSON.color_hex, 'product.color_hex')}
                {renderEditableField('Material', productJSON.material, 'product.material')}
                {renderEditableField('Texture', productJSON.texture, 'product.texture')}
                {renderEditableField('Details', productJSON.details, 'product.details')}
                {renderEditableField('Logo Front', productJSON.logo_front, 'product.logo_front')}
                {renderEditableField('Logo Back', productJSON.logo_back, 'product.logo_back')}
            </div>
        );
    };

    const renderDAPanel = () => {
        if (!daJSON) {
            return (
                <div className={styles.emptyState}>
                    <Palette size={24} />
                    <span>Select DA preset or upload reference</span>
                </div>
            );
        }

        return (
            <div className={styles.panelContent}>
                <div className={styles.section}>
                    <h4>Background</h4>
                    {renderEditableField('Description', daJSON.background.description, 'da.background.description', false)}
                    {renderEditableField('Color', `${daJSON.background.color_name} (${daJSON.background.color_hex})`, 'da.background.color', false)}
                </div>
                <div className={styles.section}>
                    <h4>Mood & Quality</h4>
                    {renderEditableField('Mood', daJSON.mood, 'da.mood', false)}
                    {renderEditableField('Quality', daJSON.quality, 'da.quality', false)}
                </div>
                <div className={styles.section}>
                    <h4>Lighting</h4>
                    {renderEditableField('Type', daJSON.lighting.type, 'da.lighting.type', false)}
                    {renderEditableField('Temperature', daJSON.lighting.temperature, 'da.lighting.temperature', false)}
                </div>
            </div>
        );
    };

    const renderPromptsPanel = () => {
        const promptEntries = Object.entries(mergedPrompts);

        if (promptEntries.length === 0 || promptEntries.every(([_, v]) => !v)) {
            return (
                <div className={styles.emptyState}>
                    <FileText size={24} />
                    <span>Prompts will appear after analysis</span>
                </div>
            );
        }

        return (
            <div className={styles.panelContent}>
                {promptEntries.map(([key, value]) => (
                    <div key={key} className={styles.promptItem}>
                        <div className={styles.promptHeader}>
                            <span className={styles.promptLabel}>
                                {key.replace(/_/g, ' ').toUpperCase()}
                            </span>
                            <button
                                className={styles.editBtn}
                                onClick={() => handleEditStart(`prompts.${key}`, value)}
                            >
                                <Edit3 size={12} />
                            </button>
                        </div>
                        {editingField === `prompts.${key}` ? (
                            <div className={styles.editContainer}>
                                <textarea
                                    className={styles.editInput}
                                    value={editValue}
                                    onChange={(e) => setEditValue(e.target.value)}
                                    autoFocus
                                    rows={4}
                                />
                                <div className={styles.editActions}>
                                    <button className={styles.saveBtn} onClick={handleEditSave}>
                                        <Check size={14} />
                                    </button>
                                    <button className={styles.cancelBtn} onClick={handleEditCancel}>
                                        <X size={14} />
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <p className={styles.promptText}>{value || '—'}</p>
                        )}
                    </div>
                ))}
            </div>
        );
    };

    const tabs = [
        { id: 'product' as PanelType, label: 'Product', icon: <Package size={14} />, hasData: !!productJSON },
        { id: 'da' as PanelType, label: 'DA', icon: <Palette size={14} />, hasData: !!daJSON },
        { id: 'prompts' as PanelType, label: 'Prompts', icon: <FileText size={14} />, hasData: Object.values(mergedPrompts).some(v => v) },
    ];

    return (
        <div className={`${styles.container} ${isDarkMode ? styles.dark : styles.light} ${isExpanded ? styles.expanded : ''}`}>
            {/* Header */}
            <button className={styles.header} onClick={handleToggle}>
                <div className={styles.headerLeft}>
                    {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                    <Code size={16} />
                    <span>Show JSONs</span>
                </div>
                <div className={styles.headerRight}>
                    {tabs.map(tab => (
                        <div
                            key={tab.id}
                            className={`${styles.tabIndicator} ${tab.hasData ? styles.hasData : ''}`}
                            title={tab.label}
                        />
                    ))}
                </div>
            </button>

            {/* Expanded Content */}
            {isExpanded && (
                <div className={styles.content}>
                    {/* Tabs */}
                    <div className={styles.tabs}>
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                className={`${styles.tab} ${activePanel === tab.id ? styles.active : ''}`}
                                onClick={() => handlePanelClick(tab.id)}
                            >
                                {tab.icon}
                                <span>{tab.label}</span>
                                {tab.hasData && <span className={styles.dataDot} />}
                            </button>
                        ))}
                    </div>

                    {/* Panel Content */}
                    <div className={styles.panelWrapper}>
                        {activePanel === 'product' && renderProductPanel()}
                        {activePanel === 'da' && renderDAPanel()}
                        {activePanel === 'prompts' && renderPromptsPanel()}
                    </div>
                </div>
            )}
        </div>
    );
};

export default JSONPreviewPanel;
