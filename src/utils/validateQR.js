export const isValidQRCode = (qrCode) => {
  if (!qrCode || typeof qrCode !== 'string') return false
  
  // Must be exactly 6 digits
  const qrRegex = /^\d{6}$/
  return qrRegex.test(qrCode.trim())
}

export const formatQRInput = (input) => {
  if (!input) return ''
  return input.replace(/\D/g, '').slice(0, 6)
}

export const processImagesForFlipbook = (images) => {
  if (!images || images.length === 0) return []
  
  // If single image, duplicate it
  if (images.length === 1) {
    return [images[0], { ...images[0], id: `${images[0].id}-duplicate` }]
  }
  
  // If odd number of images, duplicate second-last image
  if (images.length % 2 !== 0) {
    const secondLastIndex = images.length - 2
    const duplicateImage = { 
      ...images[secondLastIndex], 
      id: `${images[secondLastIndex].id}-duplicate` 
    }
    return [...images, duplicateImage]
  }
  
  return images
}