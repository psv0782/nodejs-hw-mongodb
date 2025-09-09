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
import {isValidId} from "../middlewares/isValidId.js";
import {validateQuery} from "../middlewares/validateQuery.js";
import {getContactsQueryParamsValidationSchema} from "../validation/getContactsQueryParamsValidationSchema.js";

const router = Router();

// router.use('/:contactId', isValidId); ожно использовать такой вариант, что бы не писать isValidId в каждом руте где используется contactId
router.get('/',validateQuery(getContactsQueryParamsValidationSchema), ctrlWrapper(getContactsController));
router.get('/:contactId', validateQuery(getContactsQueryParamsValidationSchema), isValidId, ctrlWrapper(getContactByIdController));
router.post('/', validateBody(createContactValidationSchema), ctrlWrapper(postCreateContactController));
router.delete('/:contactId', isValidId, ctrlWrapper(deleteContactController));
router.put('/:contactId', isValidId, validateBody(createContactValidationSchema), ctrlWrapper(upsertContactController));
router.patch('/:contactId', isValidId, validateBody(updateContactValidationSchema), ctrlWrapper(patchContactController));

export default router;