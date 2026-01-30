/**
 * Shot Options Interface - Frontend
 * 
 * Mirrors backend shot-options.interface.ts
 * Used for per-shot control in generation flow
 */

/**
 * Base shot option - just enabled/disabled
 */
export interface ShotOption {
    enabled: boolean;
}

/**
 * SOLO shot option - includes subject selection
 * Subject determines which model anatomy to use
 */
export interface SoloShotOption extends ShotOption {
    subject: 'adult' | 'kid';
}

/**
 * FLAT LAY shot option - includes size selection
 * Size determines garment proportions
 */
export interface FlatlayOption extends ShotOption {
    size: 'adult' | 'kid';
}

/**
 * Complete shot options for all 6 shot types
 */
export interface ShotOptions {
    /** DUO: Always Father + Son - no subject selection */
    duo?: ShotOption;

    /** SOLO: Select Adult OR Kid model */
    solo?: SoloShotOption;

    /** FLAT LAY FRONT: Select Adult Size OR Kid Size */
    flatlay_front?: FlatlayOption;

    /** FLAT LAY BACK: Select Adult Size OR Kid Size */
    flatlay_back?: FlatlayOption;

    /** CLOSE UP FRONT: Neutral - no size/model selection */
    closeup_front?: ShotOption;

    /** CLOSE UP BACK: Neutral - no size/model selection */
    closeup_back?: ShotOption;
}

/**
 * Shot type metadata for UI rendering
 */
export interface ShotTypeInfo {
    key: keyof ShotOptions;
    label: string;
    description: string;
    hasToggle: boolean;
    toggleType?: 'subject' | 'size';
    toggleOptions?: { value: string; label: string }[];
}

/**
 * Available shot types with UI metadata
 */
export const SHOT_TYPES: ShotTypeInfo[] = [
    {
        key: 'duo',
        label: 'DUO',
        description: 'Father + Son (Fixed)',
        hasToggle: false,
    },
    {
        key: 'solo',
        label: 'SOLO',
        description: 'Single model shot',
        hasToggle: true,
        toggleType: 'subject',
        toggleOptions: [
            { value: 'adult', label: 'Adult' },
            { value: 'kid', label: 'Kid' },
        ],
    },
    {
        key: 'flatlay_front',
        label: 'Flat Lay Front',
        description: 'Product front view',
        hasToggle: true,
        toggleType: 'size',
        toggleOptions: [
            { value: 'adult', label: 'Adult Size' },
            { value: 'kid', label: 'Kid Size' },
        ],
    },
    {
        key: 'flatlay_back',
        label: 'Flat Lay Back',
        description: 'Product back view',
        hasToggle: true,
        toggleType: 'size',
        toggleOptions: [
            { value: 'adult', label: 'Adult Size' },
            { value: 'kid', label: 'Kid Size' },
        ],
    },
    {
        key: 'closeup_front',
        label: 'Close Up Front',
        description: 'Detail front shot',
        hasToggle: false,
    },
    {
        key: 'closeup_back',
        label: 'Close Up Back',
        description: 'Detail back shot',
        hasToggle: false,
    },
];

/**
 * Create default shot options (all enabled, adult defaults)
 */
export function createDefaultShotOptions(): ShotOptions {
    return {
        duo: { enabled: true },
        solo: { enabled: true, subject: 'adult' },
        flatlay_front: { enabled: true, size: 'adult' },
        flatlay_back: { enabled: true, size: 'adult' },
        closeup_front: { enabled: true },
        closeup_back: { enabled: true },
    };
}

/**
 * Get enabled shot types from options
 */
export function getEnabledShots(options: ShotOptions): string[] {
    return Object.entries(options)
        .filter(([_, shot]) => shot?.enabled !== false)
        .map(([key]) => key);
}
