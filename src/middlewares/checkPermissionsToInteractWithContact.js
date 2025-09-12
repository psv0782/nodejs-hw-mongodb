import createHttpError from 'http-errors';
import {Contacts} from '../db/models/contacts.js';
import {USER_ROLES} from '../constants/roles.js';

export const checkPermissionsToInteractWithContact = async (req, res, next) => {
    try {
        if (!req.user?._id) return next(createHttpError(401, 'Unauthorized'));

        const {contactId} = req.params;
        const contact = await Contacts.findById(contactId).select('userId').lean();

        if (!contact) return next(createHttpError(404, 'Contact not found'));

        const isOwner = String(contact.userId) === String(req.user._id);
        if (!isOwner) return next(createHttpError(403, "It's not your user's contact!"));

        return next();
    } catch (e) {
        return next(e);
    }
};


// Имплементация с ролями

// export const checkPermissionsToInteractWithContact =
//     (...allowed) =>
//         async (req, res, next) => {
//             try {
//                 if (!req.user?._id) return next(createHttpError(401, 'Unauthorized'));
//
//                 // если роли не передали — считаем, что разрешены обе
//                 const roles = allowed.length ? allowed : [USER_ROLES.OWNER, USER_ROLES.WATCHER];
//
//                 // проверка роли пользователя
//                 if (!roles.includes(req.user.role)) {
//                     return next(createHttpError(403, 'Forbidden'));
//                 }
//
//                 const {contactId} = req.params;
//                 if (!contactId) return next(); // на список не навешивай этот миддлвар
//
//                 const contact = await Contacts.findById(contactId).select('userId').lean();
//                 if (!contact) return next(createHttpError(404, 'Contact not found'));
//
//                 const isOwner = String(contact.userId) === String(req.user._id);
//                 if (!isOwner) return next(createHttpError(403, "It's not your user's contact!"));
//
//                 return next();
//             } catch (e) {
//                 return next(e);
//             }
//         };