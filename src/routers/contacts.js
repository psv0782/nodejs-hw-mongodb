import {Router} from "express";
import {
    deleteContactController,
    getContactByIdController,
    getContactsController,
    updateContactController,
    createContactController, uploadContactsPhotoController,
    upsertContactController
} from "../controllers/contacts.js";
import {ctrlWrapper} from "../utils/ctrlWrapper.js";
import {validateBody} from "../middlewares/validateBody.js";
import {createContactValidationSchema} from "../validation/createContactValidationSchema.js";
import {updateContactValidationSchema} from "../validation/updateContactValidationSchema.js";
import {validateParams} from "../middlewares/isValidId.js";
import {validateQuery} from "../middlewares/validateQuery.js";
import {getContactsQueryParamsValidationSchema} from "../validation/getContactsQueryParamsValidationSchema.js";
import {authenticate} from "../middlewares/authenticate.js";
import {checkPermissionsToInteractWithContact} from "../middlewares/checkPermissionsToInteractWithContact.js";
import {upload} from "../middlewares/multer.js";

const router = Router();

router.use(authenticate);
router.use('/:contactId', validateParams('contactId'), checkPermissionsToInteractWithContact);

// router.use('/:contactId', validateParams('contactId')); можно использовать такой вариант, что бы не писать validateParams в каждом руте где используется contactId
router.get('/', validateQuery(getContactsQueryParamsValidationSchema), ctrlWrapper(getContactsController));
router.get('/:contactId', validateQuery(getContactsQueryParamsValidationSchema), validateParams('contactId'), ctrlWrapper(getContactByIdController));
router.post('/', upload.single('photo'), validateBody(createContactValidationSchema), ctrlWrapper(createContactController));
router.patch('/:contactId', upload.single('photo'), validateParams('contactId'), validateBody(updateContactValidationSchema), ctrlWrapper(updateContactController));
router.put('/:contactId', validateParams('contactId'), validateBody(createContactValidationSchema), ctrlWrapper(upsertContactController));
router.put('/:contactId/photo', upload.single('photo'),  ctrlWrapper(uploadContactsPhotoController));
router.delete('/:contactId', validateParams('contactId'), ctrlWrapper(deleteContactController));

export default router;

// Имплементация с ролями

// const router = Router();
//
// import {USER_ROLES} from '../constants/roles.js';
//
// router.use(authenticate);
// router.use('/:contactId', validateParams('contactId'));
//
// // чтение по id — WATCHER или OWNER
// router.get(
//     '/:contactId',
//     checkPermissionsToInteractWithContact(USER_ROLES.WATCHER, USER_ROLES.OWNER),
//     ctrlWrapper(getContactByIdController),
// );
//
// // изменения — только OWNER
// router.delete(
//     '/:contactId',
//     checkPermissionsToInteractWithContact(USER_ROLES.OWNER),
//     ctrlWrapper(deleteContactController),
// );
// router.patch(
//     '/:contactId',
//     checkPermissionsToInteractWithContact(USER_ROLES.OWNER),
//     validateBody(updateContactValidationSchema),
//     ctrlWrapper(patchContactController),
// );
// router.put(
//     '/:contactId',
//     checkPermissionsToInteractWithContact(USER_ROLES.OWNER),
//     validateBody(createContactValidationSchema),
//     ctrlWrapper(upsertContactController),
// );
//
// router.get(
//     '/',
//     validateQuery(getContactsQueryParamsValidationSchema),
//     ctrlWrapper(getContactsController),
// );
// router.post('/', validateBody(createContactValidationSchema), ctrlWrapper(postCreateContactController));
//
// export default router;