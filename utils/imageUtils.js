import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';

/**
 * Convert image file to base64 string
 * @param {string} imagePath - Path to the image file
 * @returns {string|null} - Base64 string or null if failed
 */
export const convertImageToBase64 = (imagePath) => {
  try {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    
    // Handle different path formats
    let fullPath;
    if (imagePath.startsWith('/')) {
      // Absolute path
      fullPath = imagePath;
    } else if (imagePath.startsWith('images/')) {
      // Relative path from public
      fullPath = path.join(__dirname, '..', 'client', 'public', imagePath);
    } else {
      // Default to public/images
      fullPath = path.join(__dirname, '..', 'client', 'public', 'images', imagePath);
    }

    console.log('Attempting to load image from:', fullPath);
    
    if (fs.existsSync(fullPath)) {
      const imageBuffer = fs.readFileSync(fullPath);
      const base64String = imageBuffer.toString('base64');
      
      // Determine MIME type based on file extension
      const ext = path.extname(fullPath).toLowerCase();
      let mimeType = 'image/jpeg'; // default
      
      if (ext === '.png') mimeType = 'image/png';
      else if (ext === '.gif') mimeType = 'image/gif';
      else if (ext === '.webp') mimeType = 'image/webp';
      else if (ext === '.svg') mimeType = 'image/svg+xml';
      
      const dataUrl = `data:${mimeType};base64,${base64String}`;
      console.log('Image converted to base64 successfully, size:', base64String.length);
      return dataUrl;
    } else {
      console.warn(`Image file not found at: ${fullPath}`);
      return null;
    }
  } catch (error) {
    console.error('Error converting image to base64:', error);
    return null;
  }
};

/**
 * Get logo base64 with fallback
 * @param {string} logoPath - Path to logo file
 * @returns {string|null} - Base64 logo or null
 */
export const getLogoBase64 = (logoPath = 'jmd_logo.jpeg') => {
  return convertImageToBase64(logoPath);
};

/**
 * Safe string conversion for PDF fields
 * @param {any} value - Value to convert
 * @param {string} defaultValue - Default value if conversion fails
 * @returns {string} - Safe string value
 */
export const safeString = (value, defaultValue = '') => {
  if (value === null || value === undefined) return defaultValue;
  if (typeof value === 'string') return value.trim();
  return String(value).trim() || defaultValue;
};

/**
 * Safe number conversion for PDF fields
 * @param {any} value - Value to convert
 * @param {number} defaultValue - Default value if conversion fails
 * @returns {number} - Safe number value
 */
export const safeNumber = (value, defaultValue = 0) => {
  if (value === null || value === undefined) return defaultValue;
  const num = Number(value);
  return isNaN(num) ? defaultValue : num;
};

/**
 * Safe date conversion for PDF fields
 * @param {any} value - Value to convert
 * @param {string} defaultValue - Default value if conversion fails
 * @returns {string} - Safe date string
 */
export const safeDate = (value, defaultValue = '') => {
  if (!value) return defaultValue;
  try {
    const date = new Date(value);
    if (isNaN(date.getTime())) return defaultValue;
    return date.toLocaleDateString('en-IN');
  } catch (error) {
    return defaultValue;
  }
};

/**
 * Safe array handling for PDF fields
 * @param {any} value - Value to convert
 * @param {Array} defaultValue - Default value if conversion fails
 * @returns {Array} - Safe array value
 */
export const safeArray = (value, defaultValue = []) => {
  if (Array.isArray(value)) return value;
  if (value === null || value === undefined) return defaultValue;
  return defaultValue;
};
