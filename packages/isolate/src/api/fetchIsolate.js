import { getRecord, getEvent, ACTIVE, postEvent } from '@amr/app'
import { setCorrespondingIsolate } from './setCorrespondingIsolate'
import {
    CORRESPONDING_ISOLATE_ELEMENT,
    CORRESPONDING_EVENT_ELEMENT,
} from '../constants/dhis2'

const findIsolate = dataValues =>
    dataValues.find(dv => dv.dataElement === CORRESPONDING_ISOLATE_ELEMENT)

const isIsolate = dataValues =>
    !!dataValues.find(dv => dv.dataElement === CORRESPONDING_EVENT_ELEMENT)

/**
 * Posts a new event with the same values,
 * with the exception of 'Is Isolate' set to true.
 * @param {object} event
 * @returns {string} - Event ID
 */
const postIsolate = async event =>
    await postEvent({
        dataValues: [
            ...event.dataValues,
            {
                dataElement: CORRESPONDING_EVENT_ELEMENT,
                value: event.event,
            },
        ],
        enrollment: event.enrollment,
        eventDate: event.eventDate,
        orgUnit: event.orgUnit,
        program: event.program,
        programStage: event.programStage,
        status: ACTIVE,
        trackedEntityInstance: event.trackedEntityInstance,
    })

/**
 * If the supplied event has an isolate it gets the isolate record.
 * Otherwise, it creates the an isolate record.
 * @param {objecy} programs
 * @param {string} eventId
 * @returns {object} - Isolate record
 */
export const fetchIsolate = async (programs, eventId) => {
    const event = await getEvent(eventId)

    const correspondingIsolate = findIsolate(event.dataValues)

    // Existing isolate
    if (correspondingIsolate) {
        try {
            const isolate = await getRecord(
                programs,
                correspondingIsolate.value,
                true
            )
            return isolate
        } catch (error) {
            if (error !== 404) throw error
        }
    }

    // Is isolate
    if (isIsolate(event.dataValues))
        return await getRecord(programs, eventId, true)

    // Create isolate
    const isolateId = await postIsolate(event)
    setCorrespondingIsolate(event, isolateId)
    return await getRecord(programs, isolateId, true)
}
