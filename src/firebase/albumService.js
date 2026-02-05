import { collection, getDocs } from 'firebase/firestore'
import { db } from './firebaseConfig'

const proxyBaseUrl = 'https://us-central1-instant-photos-9a258.cloudfunctions.net/proxyImage'

export const fetchAlbumImages = async (qrCode) => {
  try {
    const imgRef = collection(db, "favorites", qrCode, "imgs")
    const snapshot = await getDocs(imgRef)
    
    if (snapshot.empty) {
      throw new Error('Album not found')
    }
    
    // Support multiple field names and URL formats from Firestore
    const getImageUrl = (doc) => {
      const data = doc.data()
      
      // Try different field names
      let imagePath = data.path || data.url || data.imagePath || data.src || data.image || ""
      
      if (!imagePath) {
        console.warn('No image path found in document:', doc.id, data)
        return null
      }
      
      // Handle different URL formats
      if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
        return imagePath
      }
      
      // Handle Firebase Storage paths
      if (imagePath.startsWith('gs://')) {
        // Convert gs:// to proxy URL
        const path = imagePath.replace('gs://instant-photos-9a258.appspot.com/', '')
        return `${proxyBaseUrl}?path=${encodeURIComponent(path)}`
      }
      
      // Handle relative paths
      return `${proxyBaseUrl}?path=${encodeURIComponent(imagePath)}`
    }
    
    // Process all documents and filter out invalid URLs
    const imageUrls = snapshot.docs
      .map(doc => ({
        id: doc.id,
        url: getImageUrl(doc),
        data: doc.data()
      }))
      .filter(item => item.url !== null)
      .map(item => item.url)
    
    console.log(`Found ${imageUrls.length} valid images out of ${snapshot.docs.length} documents`)
    
    if (imageUrls.length === 0) {
      throw new Error('No valid images found in album')
    }
    
    // Handle odd count: duplicate second-to-last so last page has a pair
    if (imageUrls.length % 2 !== 0 && imageUrls.length > 1) {
      const secondToLastImg = imageUrls[imageUrls.length - 2]
      const lastImg = imageUrls.pop()
      imageUrls.push(secondToLastImg)
      imageUrls.push(lastImg)
    } else if (imageUrls.length === 1) {
      imageUrls.push(imageUrls[0])
    }
    
    // Convert to image objects for React components
    return imageUrls.map((url, index) => ({
      id: `img-${index}`,
      url: url,
      alt: `Album image ${index + 1}`
    }))
    
  } catch (error) {
    console.error('Error fetching album:', error)
    throw error
  }
}

export const validateAlbum = async (qrCode) => {
  try {
    const imgRef = collection(db, "favorites", qrCode, "imgs")
    const snapshot = await getDocs(imgRef)
    return !snapshot.empty
  } catch (error) {
    console.error('Error validating album:', error)
    return false
  }
}