/**
 * 客户端图片等比例压缩工具
 * 使用 HTML5 Canvas 将选中的海报/剧照等比例压缩至适度尺寸（默认最长边不超过 1200px/1600px）
 * 输出优化后的 Data URL，体积在 80KB~150KB 间，适合直接持久化存储与云同步。
 */
export async function compressImage(file, options = {}) {
  const {
    maxWidth = 1200,
    maxHeight = 1600,
    quality = 0.82,
    maxInputSizeBytes = 15 * 1024 * 1024,
  } = options;

  if (!file) {
    throw new Error('请选择图片文件');
  }

  if (!file.type || !file.type.startsWith('image/')) {
    throw new Error('仅支持图片格式文件（JPG、PNG、WebP、AVIF 等）');
  }

  if (file.size > maxInputSizeBytes) {
    throw new Error('图片文件不能超过 15MB');
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('读取图片文件失败，请重试'));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error('图片格式不受支持或文件已损坏'));
      img.onload = () => {
        try {
          let { naturalWidth: width, naturalHeight: height } = img;
          if (!width || !height) {
            width = img.width;
            height = img.height;
          }

          if (width > maxWidth || height > maxHeight) {
            const ratio = Math.min(maxWidth / width, maxHeight / height);
            width = Math.round(width * ratio);
            height = Math.round(height * ratio);
          }

          const canvas = document.createElement('canvas');
          canvas.width = Math.max(1, width);
          canvas.height = Math.max(1, height);
          const ctx = canvas.getContext('2d');

          if (!ctx) {
            resolve({
              dataUrl: String(reader.result),
              width,
              height,
            });
            return;
          }

          ctx.drawImage(img, 0, 0, width, height);

          let dataUrl = canvas.toDataURL('image/webp', quality);
          if (!dataUrl.startsWith('data:image/webp')) {
            dataUrl = canvas.toDataURL('image/jpeg', quality);
          }

          resolve({
            dataUrl,
            width,
            height,
            sizeApprox: Math.round((dataUrl.length * 3) / 4),
          });
        } catch (err) {
          reject(err);
        }
      };
      img.src = String(reader.result);
    };
    reader.readAsDataURL(file);
  });
}
