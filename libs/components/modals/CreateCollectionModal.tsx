"use client";

import React, { useState } from "react";
import { useTheme } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import styles from "@/scss/styles/Modals/CreateCollectionModal.module.scss";

interface CreateCollectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenBrandModal: () => void;
}

const CreateCollectionModal: React.FC<CreateCollectionModalProps> = ({
  isOpen,
  onClose,
  onOpenBrandModal,
}) => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === "dark";

  const [formData, setFormData] = useState({
    name: "",
    code: "",
    brand: "",
    description: "",
    referenceImage: null as File | null,
  });

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({
        ...formData,
        referenceImage: e.target.files[0],
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log("Collection data:", formData);
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
        <h2 className={styles.title}>Create Collection</h2>

        {/* Form */}
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.row}>
            {/* Collection Name */}
            <div className={styles.formGroup}>
              <label className={styles.label}>
                Collection Name <span className={styles.required}>*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="e.g., SS26"
                className={styles.input}
                required
              />
            </div>

            {/* Code */}
            <div className={styles.formGroup}>
              <label className={styles.label}>Code (Optional)</label>
              <input
                type="text"
                name="code"
                value={formData.code}
                onChange={handleInputChange}
                placeholder="e.g., ss26"
                className={styles.input}
              />
            </div>
          </div>

          {/* Brand */}
          <div className={styles.formGroup}>
            <div className={styles.labelRow}>
              <label className={styles.label}>
                Brand <span className={styles.required}>*</span>
              </label>
              <button
                type="button"
                className={styles.newBrandButton}
                onClick={onOpenBrandModal}
              >
                + New Brand
              </button>
            </div>
            <select
              name="brand"
              value={formData.brand}
              onChange={handleInputChange}
              className={styles.select}
              required
            >
              <option value="">Select a brand</option>
              <option value="gayratjon">Gayratjon</option>
              <option value="nike">Nike</option>
              <option value="adidas">Adidas</option>
            </select>
          </div>

          {/* Description */}
          <div className={styles.formGroup}>
            <label className={styles.label}>Description (Optional)</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="e.g., Spring/Summer 2026 collection with vibrant colors"
              className={styles.textarea}
              rows={4}
            />
          </div>

          {/* Reference Image */}
          <div className={styles.formGroup}>
            <label className={styles.label}>DA Reference Image</label>
            <div className={styles.uploadSection}>
              <div className={styles.uploadBox}>
                <input
                  type="file"
                  id="referenceImage"
                  accept="image/*"
                  onChange={handleFileChange}
                  className={styles.fileInput}
                />
                <label htmlFor="referenceImage" className={styles.uploadLabel}>
                  <span className={styles.uploadIcon}>+</span>
                  <span className={styles.uploadText}>Upload</span>
                </label>
              </div>
              <div className={styles.uploadDescription}>
                <p>
                  Upload a reference image to automatically analyze the visual
                  style (Direction Artistique) for this collection.
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className={styles.actions}>
            <button type="submit" className={styles.createButton}>
              Create Collection
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

export default CreateCollectionModal;
