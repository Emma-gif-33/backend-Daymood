import * as emotionRepository from '../repositories/emotion.repositories'
import admin from '../../config/firebase'

const bucket = admin.storage().bucket()

//ayuda a validar antes de cada una
const getUserId = async (firebaseUid: string): Promise<string> => {
    const user = await emotionRepository.findUserByFirebaseUid(firebaseUid)
    if (!user) throw new Error('Usuario no encontrado en la BD')
    return user.id
}

const uploadImageToFirebase = async (file: Express.Multer.File): Promise<string> => {
    const fileName = `emotions/${Date.now()}_${file.originalname}`
    const fileUpload = bucket.file(fileName)
    await fileUpload.save(file.buffer, {
        metadata: { contentType: file.mimetype }
    })
    await fileUpload.makePublic()
    return `https://storage.googleapis.com/${bucket.name}/${fileName}`
}

export const emotionList = async (firebaseUid: string) => {
    const userId = await getUserId(firebaseUid)
    return emotionRepository.findAllForUser(userId)
}

export const getExploreEmotions = async (firebaseUid: string) => {
    const userId = await getUserId(firebaseUid)
    return emotionRepository.findCustomByOthers(userId)
}

export const createEmotion = async (
    data: { name: string; id_category: number; save_to_favorites?: string },
    firebaseUid: string,
    imageFile: Express.Multer.File | undefined
) => {
    if (!data.name || !data.id_category) throw new Error('El nombre y la categoría son obligatorios')
    if (!imageFile) throw new Error('La imagen es obligatoria')

    const userId = await getUserId(firebaseUid)
    const img_url = await uploadImageToFirebase(imageFile)

    const emotion = await emotionRepository.create({
        name: data.name,
        img_url,
        users: { connect: { id: userId } },
        categories: { connect: { id: Number(data.id_category) } }
    })

    if (data.save_to_favorites === 'true') {
        await emotionRepository.addFavorite(userId, emotion.id)
    }

    return emotion
}

export const deleteEmotion = async (id: string, firebaseUid: string) => {
    const userId = await getUserId(firebaseUid)
    const emotion = await emotionRepository.findById(id)
    if (!emotion) throw new Error('Emoción no encontrada')
    if (emotion.id_user !== userId) throw new Error('No tienes permiso para eliminar esta emoción')
    return emotionRepository.deleteById(id)
}

export const addFavorite = async (firebaseUid: string, idEmotion: string) => {
    const userId = await getUserId(firebaseUid)
    const emotion = await emotionRepository.findById(idEmotion)
    if (!emotion) throw new Error('Emoción no encontrada')
    return emotionRepository.addFavorite(userId, idEmotion)
}

export const removeFavorite = async (firebaseUid: string, idEmotion: string) => {
    const userId = await getUserId(firebaseUid)
    return emotionRepository.removeFavorite(userId, idEmotion)
}

export const getFavorites = async (firebaseUid: string) => {
    const userId = await getUserId(firebaseUid)
    return emotionRepository.findFavoritesByUser(userId)
}