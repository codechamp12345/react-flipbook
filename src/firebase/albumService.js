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
    
    // Support path, url, imagePath, or src field names from Firestore
    const getPath = (doc) => {
      const d = doc.data()
      return d.path || d.url || d.imagePath || d.src || ""
    }
    
    let urls = snapshot.docs
      .map(doc => getPath(doc))
      .filter(p => p !== "")
      .map(p => p.startsWith("http") ? p : `${proxyBaseUrl}?path=${encodeURIComponent(p)}`)
    
    // Handle odd count: duplicate second-to-last so last page has a pair
    if (urls.length % 2 !== 0 && urls.length > 1) {
      const secondToLastImg = urls[urls.length - 2]
      const lastImg = urls.pop()
      urls.push(secondToLastImg)
      urls.push(lastImg)
    } else if (urls.length === 1) {
      urls.push(urls[0])
    }
    
    // Convert to image objects for React components
    return urls.map((url, index) => ({
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