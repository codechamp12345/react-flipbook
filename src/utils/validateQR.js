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
  
  // Remove any duplicate images based on URL
  const uniqueImages = images.filter((image, index, self) => 
    index === self.findIndex(img => img.url === image.url)
  )
  
  // If we have an odd number of unique images, duplicate the last image to fill the pair
  if (uniqueImages.length % 2 !== 0) {
    const lastImage = uniqueImages[uniqueImages.length - 1]
    uniqueImages.push({
      ...lastImage,
      id: `${lastImage.id}-duplicate`,
      alt: `${lastImage.alt} (duplicate)`
    })
  }
  
  return uniqueImages
}