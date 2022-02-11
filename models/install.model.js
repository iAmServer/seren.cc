import mongoose from 'mongoose';

const Schema = mongoose.Schema;
const installSchema = new Schema({
    teamId: {
        type: String
    },
    enterpriseId: {
        type: String
    },
    installation: {
        type: Object
    }
}, {
    timestamps: true
});

installSchema.set('toJSON', {
    transform: (doc, ret, options) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
    }
});

const Install = mongoose.model('Installs', installSchema);

export default {
    getAll: async (query) => {
        return await Install.find(query);
    },
    getOne: async (query) => {
        return await Install.findOne(query);
    },
    insert: async (install) => {
        const resp = await Install.create({ ...install });

        return resp;
    },
    remove: async (query) => {
        return await Install.deleteOne(query)
    }
}