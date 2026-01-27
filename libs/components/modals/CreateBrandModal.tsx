'use client';

import React, { useState } from 'react';
import { useTheme } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import styles from '@/scss/styles/Modals/CreateBrandModal.module.scss';

interface CreateBrandModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateBrandModal: React.FC<CreateBrandModalProps> = ({
  isOpen,
  onClose
}) => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';

  const [formData, setFormData] = useState({
    name: '',
    brief: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Brand data:', formData);
    onClose();
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
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="e.g., New Balance, Nike, Adidas"
              className={styles.input}
              required
            />
          </div>

          {/* Brand Brief */}
          <div className={styles.formGroup}>
            <label className={styles.label}>Brand Brief (Optional)</label>
            <textarea
              name="brief"
              value={formData.brief}
              onChange={handleInputChange}
              placeholder="e.g., A lifestyle brand focused on urban fashion and streetwear"
              className={styles.textarea}
              rows={4}
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
