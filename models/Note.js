import mongoose from "mongoose";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
// import AutoIncrement from "mongoose-sequence";
const AutoIncrement = require('mongoose-sequence')(mongoose);

const noteSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "User",
        },
        title: {
            type: String,
            required: true,
        },
        text: {
            type: String,
            required: true,
        },

        completed: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

noteSchema.plugin(AutoIncrement, {
    inc_field: "ticket",
    id: "ticketNums",
    start_seq: 500,
});

 const Note = mongoose.model("Note", noteSchema);

 export default Note
