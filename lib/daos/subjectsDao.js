import { subjects } from 'models'


const ATTRIBUTES = ['id', 'name']
export const findAllSubjects = async (where = {}, limit, page) => { 
    const totalCount = await subjects.count(where)
    const subjectResponse = await subjects.findAll({ attributes: ATTRIBUTES, where ,
        offset: limit * (page - 1),
        limit: limit
    })
    return {
        totalCount,
        results: subjectResponse
    }
}

export const findOneSubject = (id) => { 
    return subjects.findOne({where: {id}, attributes: ATTRIBUTES})
}