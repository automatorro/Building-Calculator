/**
 * Optimize an image file by resizing and compressing it using the Canvas API.
 */
export async function optimizeImage(
  file: File,
  options: {
    maxWidth?: number;
    maxHeight?: number;
    quality?: number;
    mimeType?: string;
  } = {}
): Promise<File> {
  const {
    maxWidth = 1920,
    maxHeight = 1080,
    quality = 0.82,
    mimeType = 'image/jpeg'
  } = options

  // 1. Create a bitmap from the file
  const imageBitmap = await createImageBitmap(file)
  
  let { width, height } = imageBitmap
  
  // 2. Calculate new dimensions keeping aspect ratio
  if (width > maxWidth || height > maxHeight) {
    const ratio = Math.min(maxWidth / width, maxHeight / height)
    width = Math.floor(width * ratio)
    height = Math.floor(height * ratio)
  }

  // 3. Draw to canvas
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Could not get canvas context')
  
  // High quality scaling
  ctx.imageSmoothingEnabled = true
  ctx.imageSmoothingQuality = 'high'
  
  ctx.drawImage(imageBitmap, 0, 0, width, height)

  // 4. Convert canvas to Blob then to File
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error('Canvas to Blob conversion failed'))
          return
        }
        
        // Create new File object from blob
        const optimizedFile = new File([blob], file.name.replace(/\.[^/.]+$/, "") + ".jpg", {
          type: mimeType,
          lastModified: Date.now(),
        })
        
        resolve(optimizedFile)
      },
      mimeType,
      quality
    )
  })
}
