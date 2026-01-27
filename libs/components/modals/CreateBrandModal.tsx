'use client';

import React, { useState } from 'react';
import { useTheme } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import styles from '@/scss/styles/Modals/CreateBrandModal.module.scss';

interface CreateBrandModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBack: () => void;
}

const CreateBrandModal: React.FC<CreateBrandModalProps> = ({
  isOpen,
  onClose,
  onBack
}) => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';

  const [brandName, setBrandName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Brand name:', brandName);
    onBack(); // Go back to collection modal
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div
        className={`${styles.modalContent} ${isDarkMode ? styles.dark : styles.light}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button className={styles.closeButton} onClick={onClose}>
          <CloseIcon fontSize="small" />
        </button>

        {/* Title */}
        <h2 className={styles.title}>Create New Brand</h2>
        <p className={styles.subtitle}>Add a new brand to organize your collections.</p>

        {/* Form */}
        <form onSubmit={handleSubmit} className={styles.form}>
          {/* Brand Name */}
          <div className={styles.formGroup}>
            <label className={styles.label}>Brand Name</label>
            <input
              type="text"
              value={brandName}
              onChange={(e) => setBrandName(e.target.value)}
              placeholder="e.g., New Balance, Nike, Adidas"
              className={styles.input}
              required
            />
          </div>

          {/* Action Buttons */}
          <div className={styles.actions}>
            <button
              type="submit"
              className={styles.createButton}
            >
              Create Brand
            </button>
            <button
              type="button"
              onClick={onBack}
              className={styles.backButton}
            >
              Back
            </button>
            <button
              type="button"
              onClick={onClose}
              className={styles.cancelButton}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateBrandModal;
