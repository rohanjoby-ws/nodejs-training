import { resetAndMockDB } from 'utils/testUtils';
import { mockData } from 'utils/mockData';

describe('subject daos', () => {
    const ALL_ATTRIBUTES = ['id', 'name'];

    let spy;
    const id = 1;
    const subject = mockData.MOCK_SUBJECT;

    describe('findOneSubject', () => {
        it('should call findOne finder of subjects with the correct parameters', async () => {
            await resetAndMockDB(db => {
                spy = jest.spyOn(db.subjects, 'findOne');
            });
            const { findOneSubject } = require('daos/subjectsDao');
            await findOneSubject(id);
            expect(spy).toBeCalledWith(
                expect.objectContaining({
                    attributes: ALL_ATTRIBUTES,
                    where: { id }
                })
            );
        });
    });

    describe('findAllSubjects ', () => {
        const where = {};
        let page = 1;
        let limit = 10;
        let offset = limit * (page - 1);

        it('should call findOne finder of subjects with the correct parameters', async () => {
            await resetAndMockDB(db => {
                spy = jest.spyOn(db.subjects, 'findAll');
            });
            const { findAllSubjects } = require('daos/subjectsDao');
            await findAllSubjects(where, limit, page);
            expect(spy).toBeCalledWith(
                expect.objectContaining({
                    attributes: ALL_ATTRIBUTES,
                    where: {},
                    offset,
                    limit
                })
            );
            page = 2;
            limit = 20;
            offset = (page - 1) * limit;
            jest.clearAllMocks();
            await findAllSubjects(where, limit, page);
            expect(spy).toBeCalledWith(
                expect.objectContaining({
                    attributes: ALL_ATTRIBUTES,
                    where,
                    offset,
                    limit
                })
            );
        });
    });

    describe('createSubject', () => {
        let spy;
        const resource = { name: subject.name };
        it('should create a new subject with given data', async () => {
            await resetAndMockDB(db => {
                spy = jest.spyOn(db.subjects, 'create');
            });
            const { createSubject } = require('daos/subjectsDao');
            await createSubject(resource);
            expect(spy).toBeCalledWith(resource);
        });
    });

    describe('updateSubject', () => {
        let spy;
        const resource = { subject: subject.name };
        it('should update the subject based on given data', async () => {
            await resetAndMockDB(db => {
                spy = jest.spyOn(db.subjects, 'findOne');
            });
            const { updateSubject } = require('daos/subjectsDao');

            await updateSubject(resource, id);

            expect(spy).toBeCalled();

            // setting findOne finder to return null to test the case where resource is not found
            await resetAndMockDB(db => {
                db.subjects.findOne = () => null;
            });
            await expect(updateSubject(resource, id)).rejects.toThrow();
        });

        it('should catch an error if findOneSubject fails', async () => {
            await resetAndMockDB(db => {
                db.subjects.findOne = async () => {
                    throw new Error('resource not found');
                };
            });
            const { updateSubject } = require('daos/subjectsDao');
            expect(updateSubject(resource, id)).rejects.toThrow();
        });
    });
    describe('delete one subject', () => {
        let spy;
        it('should delete subject on calling deleteOneSubject', async () => {
            await resetAndMockDB(db => {
                spy = jest.spyOn(db.subjects, 'destroy');
            });
            const { deleteSubject } = require('daos/subjectsDao');
            await deleteSubject(id);
            expect(spy).toBeCalledWith({ where: { id } });
        });
    });
});
