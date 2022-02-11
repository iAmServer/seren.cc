import installModel from '../models/install.model.js';

export default  {
    getAll: (params) => {
        installModel.getAll(params)
            .then(response => {
                res.status(200).json({
                    success: true,
                    data: response
                });
            })
            .catch(err => {
                res.status(500).json({
                    success: false,
                    error: err
                });
            });
    },
    getOne: (params) => {
        installModel.getOne(params)
            .then(response => {
                res.status(200).json({
                    success: true,
                    data: response
                });
            })
            .catch(err => {
                res.status(500).json({
                    success: false,
                    error: err
                });
            });
    },
    insert: (data) => {
        installModel.insert(data).then(res => {
            return res;
        }).catch(err => {
            throw new Error(err);
        });
    },
    remove: (params) => {
        installModel.remove(params)
            .then(response => {
                res.status(200).json({
                    success: true,
                    data: response
                });
            })
            .catch(err => {
                res.status(500).json({
                    success: false,
                    error: err
                });
            });
    }
};
