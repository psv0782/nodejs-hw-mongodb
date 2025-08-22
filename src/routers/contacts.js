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

router.get('/contacts', ctrlWrapper(getContactsController));
router.get('/contacts/:contactId', ctrlWrapper(getContactByIdController));
router.post('/contacts', ctrlWrapper(postCreateContactController));
router.post('/contacts/:contactId', ctrlWrapper(deleteContactController));
router.put('/contacts/:contactId', ctrlWrapper(upsertContactController));
router.patch('/contacts/:contactId', ctrlWrapper(patchContactController));

export default router;