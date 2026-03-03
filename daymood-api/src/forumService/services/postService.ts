import * as postRepository from '../repositories/postRepository';

export const createPost = async (postData: any) => {
    return await postRepository.create(postData);
};

export const getPostById = async (id: string) => {
    const post = await postRepository.findById(id);
    if (!post) {
        throw new Error("Post no encontrado");
    }
    return post;
};

export const updatePost = async (postId: string, userId: string, updateData: any) => {
    const post = await postRepository.findById(postId);
    if (!post) throw new Error("Post no encontrado");
    if (post.id_user !== userId) {
        throw new Error("No tienes permiso para modificar este post");
    }

    return await postRepository.update(postId, updateData);
};

export const deletePost = async (postId: string, userId: string) => {
    const post = await postRepository.findById(postId);
    if (!post) throw new Error("Post no encontrado");
    if (post.id_user !== userId) {
        throw new Error("No tienes permiso para eliminar este post");
    }

    return await postRepository.remove(postId);
};