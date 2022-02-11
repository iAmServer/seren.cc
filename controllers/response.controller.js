import responseModel from '../models/response.model.js';

export default  {
    getAll: (req, res) => {
        const params = req.query;
        const options = {
            sort: {
                createdAt: -1
            }
        };
        const query = {};

        if (params.usersOnly && params.responsesOnly) {
            return res.status(400).json({
                success: false,
                message: 'You can only retrieve responses or users'
            });
        } else if (params.user && (params.usersOnly || params.responsesOnly)) {
            return res.status(400).json({
                success: false,
                message: 'You can only use one of the following params parameters: usersOnly, responsesOnly, user'
            });
        }

        if (params.user) query.user = params.user;

        responseModel.getAll(query, options)
            .then(response => {
                const resp = {
                    success: true,
                    data: params.usersOnly ? getUniqueUsers(response) : ( params.responsesOnly ? getQuestionAndResponseOnly(response): response)
                }

                if (params.user) {
                    resp.user = params.user;
                }
                    
                res.status(200).json(resp);
            })
            .catch(err => {
                res.status(500).json({
                    success: false,
                    error: err
                });
            });
    },
    insert: (data) => {
        const { user, question, response } = data;
        
        if (!user || !question || !response) {
            throw new Error('Missing required fields');
        }

        responseModel.insert({ user, question, response }).then(res => {
            return res;
        }).catch(err => {
            throw new Error(err);
        });
    }
};

const getUniqueUsers = (responses) => {
    const users = responses.map(r => r.user);
    const uniqueUsers = [...new Set(users)];
    const uniqueUsersResponses = uniqueUsers.map(u => {
        return u
    });

    return uniqueUsersResponses;
}

const getQuestionAndResponseOnly = (responses) => {
    return responses.map(r => {
        return {
            question: r.question,
            response: r.response
        }
    });
}