import createHttpError from 'http-errors';
import { ENV_VARS } from '../constants/envVars.js';
import { getEnvVar } from './getEnvVar.js';
import { saveFileToCloudinary } from './saveFileToCloudinary.js';
import { saveFileToLocal } from './saveFileToLocal.js';

const saveFileStrategyMapper = {
    cloudinary: saveFileToCloudinary,
    local: saveFileToLocal,
};

export const saveFile = async (file) => {
    if (!file) {
        throw createHttpError(400, 'File is required');
    }

    // получить стратегию и нормализовать
    const rawStrategyName = getEnvVar(ENV_VARS.FILE_STORAGE_STRATEGY);
    const strategyName = String(rawStrategyName || 'local').toLowerCase();

    const saveFileStrategy = saveFileStrategyMapper[strategyName];

    if (!saveFileStrategy) {
        // явная ошибка, если стратегия задана неверно
        throw new createHttpError(500, `No file storage strategy provided with name "${strategyName}"`);
    }

    try {
        const url = await saveFileStrategy(file);
        // ожидаем, что стратегия вернёт строку URL
        if (!url || typeof url !== 'string') {
            throw new Error('Save strategy did not return a file URL');
        }
        return url;
    } catch (err) {
        // логируем для диагностики и пробрасываем безопасную ошибку для клиента
        console.error('saveFile error:', {
            message: err.message,
            stack: err.stack,
            strategy: strategyName,
            file: {
                originalname: file?.originalname,
                mimetype: file?.mimetype,
                size: file?.size,
                path: file?.path,
            },
        });
        throw createHttpError(500, 'Failed to save file');
    }
};