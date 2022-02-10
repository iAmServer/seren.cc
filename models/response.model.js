import mongoose from 'mongoose';

const Schema = mongoose.Schema;
const responseSchema = new Schema({
    response: {
        type: String,
        required: true
    },
    user: {
        type: String,
        required: true
    },
    question: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

responseSchema.set('toJSON', {
    transform: (doc, ret, options) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
    }
});

const Response = mongoose.model('Response', responseSchema);

export default {
    getAll: async (query, option) => {
        return await Response.find(query, null, option);
    },
    insert: async (response) => {
        const resp = await Response.create({ ...response });

        return resp;
    }
}