import * as emotionRepository from '../repositories/emotion.repositories'
import admin from '../../config/firebase'

const bucket = admin.storage().bucket()


const uploadImageToFirebase = async (file: Express.Multer.File): Promise<string> => {
    const fileName = `emotions/${Date.now()}_${file.originalname}`
    const fileUpload = bucket.file(fileName)

    await fileUpload.save(file.buffer, {
        metadata: { contentType: file.mimetype }
    })

    //devuelve el url público de la imagen
    await fileUpload.makePublic()
    return `https://storage.googleapis.com/${bucket.name}/${fileName}`
}

// ── Emociones ────────────────────────────────────────────────

export const emotionList = async (idUser: string) => {
    return emotionRepository.findAllForUser(idUser)
}

export const getExploreEmotions = async (idUser: string) => {
    return emotionRepository.findCustomByOthers(idUser)
}

export const createEmotion = async (
    data: { name: string; id_category: number },
    idUser: string,
    imageFile: Express.Multer.File | undefined
) => {
    // Validaciones
    if (!data.name || !data.id_category) {
        throw new Error('El nombre y la categoría son obligatorios')
    }
    if (!imageFile) {
        throw new Error('La imagen es obligatoria')
    }

    // Subir imagen y obtener URL
    const img_url = await uploadImageToFirebase(imageFile)

    return emotionRepository.create({
        name: data.name,
        img_url,
        id_user: idUser,          // conecta con el usuario dueño
        categories: {
            connect: { id: data.id_category }   // conecta con la categoría existente
        }
    } as any)
}

export const deleteEmotion = async (id: string, idUser: string) => {
    const emotion = await emotionRepository.findById(id)

    if (!emotion) {
        throw new Error('Emoción no encontrada')
    }
    
    if (emotion.id_user !== idUser) {
        throw new Error('No tienes permiso para eliminar esta emoción')
    }

    return emotionRepository.deleteById(id)
}


export const addFavorite = async (idUser: string, idEmotion: string) => {
    // Verificar que la emoción existe antes de agregarla
    const emotion = await emotionRepository.findById(idEmotion)
    if (!emotion) {
        throw new Error('Emoción no encontrada')
    }
    return emotionRepository.addFavorite(idUser, idEmotion)
}

export const removeFavorite = async (idUser: string, idEmotion: string) => {
    return emotionRepository.removeFavorite(idUser, idEmotion)
}

export const getFavorites = async (idUser: string) => {
    return emotionRepository.findFavoritesByUser(idUser)
}