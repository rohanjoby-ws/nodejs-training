import { findOneSubject, findAllSubjects } from 'daos/subjectsDao'
module.exports = [
    {
        path: '/',
        method: 'GET',
        handler: async (req, h) => { 
            const { name, limit, page } = req.query
            const where = {};
            if (name) { 
                where.name = name
            }
            const { totalCount, results } = await findAllSubjects(where, limit, page)
            return h.response({
                            results,
                            totalCount
                        });
        },
        options: {
            auth: false,
            plugins: {
                pagination: {
                    enabled: true
                },
                query: {
                    pagination: true
                }
            }
        }
    },
    {
        path: '/{subjectId}',
        method: 'GET',
        handler: (req, res) => { 
            const subjectId = req.params.subjectId
            return findOneSubject(subjectId)
        },
        options: {
            auth: false,
        }
    }
]