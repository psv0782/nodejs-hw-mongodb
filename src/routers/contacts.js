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

const router = Router();

router.get('/', ctrlWrapper(getContactsController));
router.get('/:contactId', ctrlWrapper(getContactByIdController));
router.post('/', ctrlWrapper(postCreateContactController));
router.delete('/:contactId', ctrlWrapper(deleteContactController));
router.put('/:contactId', ctrlWrapper(upsertContactController));
router.patch('/:contactId', ctrlWrapper(patchContactController));

export default router;