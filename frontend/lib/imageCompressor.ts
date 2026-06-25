/**
 * Compresses an image client-side using HTML5 Canvas.
 * Converts to WebP and resizes to max dimensions to save Cloudinary credits, storage, and bandwidth.
 */
export async function compressImage(
  file: File,
  options: {
    maxWidth?: number;
    maxHeight?: number;
    quality?: number;
    mimeType?: string;
  } = {}
): Promise<File> {
  const {
    maxWidth = 1200,
    maxHeight = 1200,
    quality = 0.75,
    mimeType = "image/webp",
  } = options;

  // If the file is not an image, return as-is
  if (!file.type.startsWith("image/")) {
    return file;
  }

  // If file is already tiny (under 150KB), don't compress
  if (file.size < 150 * 1024) {
    return file;
  }

  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new window.Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Calculate aspect-ratio preserving dimensions
        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve(file); // fallback
          return;
        }

        // Draw image
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to blob
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              resolve(file);
              return;
            }
            
            // If the compressed size is actually larger than the original, return original
            if (blob.size >= file.size) {
              resolve(file);
              return;
            }

            // Create a new File object
            const extension = mimeType === "image/webp" ? ".webp" : ".jpg";
            const lastDotIndex = file.name.lastIndexOf('.');
            const originalName = lastDotIndex !== -1 ? file.name.substring(0, lastDotIndex) : file.name;
            const newName = originalName + extension;

            const compressedFile = new File([blob], newName, {
              type: mimeType,
              lastModified: Date.now(),
            });

            console.log(
              `[ImageCompressor] Compressed "${file.name}" (${(file.size / 1024).toFixed(1)} KB) -> "${compressedFile.name}" (${(compressedFile.size / 1024).toFixed(1)} KB)`
            );
            resolve(compressedFile);
          },
          mimeType,
          quality
        );
      };
      img.onerror = () => {
        resolve(file); // fallback
      };
      img.src = event.target?.result as string;
    };
    reader.onerror = () => {
      resolve(file); // fallback
    };
    reader.readAsDataURL(file);
  });
}
