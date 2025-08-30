import { MEDIA_BASE_URL } from '../services/apiConfig';

export const getMediaUrl = (path) => {
    return `${MEDIA_BASE_URL}${path}`;
};
