import * as commentRepository from '../repositories/commentRepository';

export const createComment = async (commentData: any) => {
    // Podrías validar aquí que el post al que comentan exista
    return await commentRepository.create(commentData);
};

export const deleteComment = async (commentId: string, userId: string) => {
    const comment = await commentRepository.findById(commentId);

    if (!comment) throw new Error("Comentario no encontrado");

    // Validación de autoría
    if (comment.id_user !== userId) {
        throw new Error("No tienes permiso para eliminar este comentario");
    }

    return await commentRepository.remove(commentId);
};