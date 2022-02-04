import isEmpty from 'lodash/isEmpty';
import { subjects } from 'models';
import { badRequest } from 'utils/responseInterceptors';

const attributes = ['id', 'name'];

export const findOneSubject = async id =>
    subjects.findOne({ where: { id }, attributes });

export const findAllSubjects = async (where = {}, limit, page) => {
    const totalCount = await subjects.count(where);
    const allSubjects = await subjects.findAll({
        attributes,
        where,
        offset: limit * (page - 1),
        limit
    });
    return {
        totalCount,
        allSubjects
    };
};
export const createSubject = async resource =>
    subjects.create({
        name: resource.name
    });

export const updateSubject = async (resource, id) => {
    try {
        const foundSubject = await findOneSubject(id);
        if (!isEmpty(foundSubject)) {
            return subjects
                .update(
                    {
                        name: resource.name
                    },
                    {
                        where: {
                            id
                        }
                    }
                )
                .then(() => findOneSubject(id));
        }
    } catch (e) {
        console.error({
            e
        });
    }
    throw badRequest(`Unable to update subject with subjectId: ${id}`);
};

export const deleteSubject = async id =>
    await subjects.destroy({ where: { id } });
