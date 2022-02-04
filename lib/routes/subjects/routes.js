import Joi from '@hapi/joi';
import {
    findOneSubject,
    findAllSubjects,
    createSubject,
    updateSubject,
    deleteSubject
} from 'daos/subjectsDao';
import { badRequest } from 'utils/responseInterceptors';
import {
    stringAllowedSchema,
    idOrUUIDAllowedSchema
} from 'utils/validationUtils';

module.exports = [
    {
        path: '/',
        method: 'GET',
        handler: async (req, h) => {
            const { name, limit, page } = req.query;
            const where = {};
            if (name) {
                where.name = name;
            }
            const { totalCount, allSubjects } = await findAllSubjects(
                where,
                limit,
                page
            );
            return h.response({
                results: allSubjects,
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
        handler: async request => {
            const { subjectId } = request.params;
            return await findOneSubject(subjectId);
        },
        options: {
            auth: false
        }
    },
    {
        method: 'POST',
        path: '/',
        handler: async request => {
            const resource = request.payload;
            try {
                return await createSubject(resource);
            } catch (e) {
                return badRequest(e.message);
            }
        },
        options: {
            description: 'create subject',
            notes: 'API to create subject',
            tags: ['api', 'subject-resources'],
            auth: false,
            validate: {
                payload: Joi.object({
                    name: stringAllowedSchema
                })
            }
        }
    },
    {
        method: 'PATCH',
        path: '/{subjectId}',
        handler: async request => {
            const { subjectId: id } = request.params;
            const payload = request.payload;

            try {
                return await updateSubject(id, payload);
            } catch (e) {
                return badRequest(e.message);
            }
        },
        options: {
            description: 'update subject by id',
            notes: 'API to update subject by id',
            tags: ['api', 'subject-resources'],
            auth: false,
            validate: {
                payload: Joi.object({
                    id: idOrUUIDAllowedSchema,
                    name: stringAllowedSchema
                })
            }
        }
    },
    {
        method: 'DELETE',
        path: '/{subjectId}',
        handler: (req, h) => {
            const { subjectId } = req.params;
            deleteSubject(subjectId);
            return h.response({ message: `Successfully deleted` });
        },
        options: {
            description: 'delete subject by id',
            notes: 'API to delete subject by id',
            tags: ['api', 'subject-resources'],
            auth: false
        }
    }
];
