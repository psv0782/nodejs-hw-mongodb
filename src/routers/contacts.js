import {Router} from "express";
import {
    deleteContactController,
    getContactByIdController,
    getContactsController,
    patchContactController,
    postCreateContactController,
    upsertContactController
} from "../controllers/contacts.js";
import {ctrlWrapper} from "../utils/ctrlWrapper.js";
import {validateBody} from "../middlewares/validateBody.js";
import {createContactValidationSchema} from "../validation/createContactValidationSchema.js";
import {updateContactValidationSchema} from "../validation/updateContactValidationSchema.js";
import {validateParams} from "../middlewares/isValidId.js";
import {validateQuery} from "../middlewares/validateQuery.js";
import {getContactsQueryParamsValidationSchema} from "../validation/getContactsQueryParamsValidationSchema.js";

const router = Router();

// router.use('/:contactId', validateParams('contactId')); можно использовать такой вариант, что бы не писать validateParams в каждом руте где используется contactId
router.get('/',validateQuery(getContactsQueryParamsValidationSchema), ctrlWrapper(getContactsController));
router.get('/:contactId', validateQuery(getContactsQueryParamsValidationSchema), validateParams('contactId'), ctrlWrapper(getContactByIdController));
router.post('/', validateBody(createContactValidationSchema), ctrlWrapper(postCreateContactController));
router.delete('/:contactId', validateParams('contactId'), ctrlWrapper(deleteContactController));
router.put('/:contactId', validateParams('contactId'), validateBody(createContactValidationSchema), ctrlWrapper(upsertContactController));
router.patch('/:contactId', validateParams('contactId'), validateBody(updateContactValidationSchema), ctrlWrapper(patchContactController));

export default router;