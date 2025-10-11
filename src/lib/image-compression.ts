
export function compressImage(file: File, options: { maxWidth: number; maxHeight: number; quality?: number }): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let { width, height } = img;

        if (width > height) {
          if (width > options.maxWidth) {
            height *= options.maxWidth / width;
            width = options.maxWidth;
          }
        } else {
          if (height > options.maxHeight) {
            width *= options.maxHeight / height;
            height = options.maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          return reject(new Error('Failed to get canvas context'));
        }

        ctx.drawImage(img, 0, 0, width, height);

        // Get the data-URL formatted image
        // JPEG format is generally smaller for photos
        const dataUrl = canvas.toDataURL(file.type, options.quality || 0.85);

        resolve(dataUrl);
      };
      img.onerror = (error) => {
        reject(error);
      };
    };
    reader.onerror = (error) => {
      reject(error);
    };
  });
}
