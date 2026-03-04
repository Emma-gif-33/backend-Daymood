import * as userRepository from '../repositories/user.repositories'

export const registerUser = async (data: {
    firebase_uid: string
    username: string
    email: string
    birth_day: string
}) => {
    if (!data.firebase_uid || !data.username || !data.email || !data.birth_day) {
        throw new Error('Todos los campos son obligatorios')
    }

    // Verificar que no exista ya
    const existing = await userRepository.findByFirebaseUid(data.firebase_uid)
    if (existing) throw new Error('El usuario ya existe')

    return userRepository.createUser(data)
}

export const loginUser = async (firebase_uid: string) => {
    const user = await userRepository.findByFirebaseUid(firebase_uid)
    if (!user) throw new Error('Usuario no encontrado en la BD')
    return user
}