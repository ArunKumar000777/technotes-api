import express from 'express'
import { createNote, deleteNote, getAllNotes, updateNote } from '../controllers/notesController.js'
const router = express.Router()
import { verifyJWT } from '../middleware/verifyToken.js'

router.use(verifyJWT)

router.route('/')
    .get(getAllNotes)
    .post(createNote)
    .patch(updateNote)
    .delete(deleteNote)

export default router