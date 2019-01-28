import { get, postData, del, put } from './crud'
import * as moment from 'moment'
import { removeTime } from '../helpers/date'

let amrId = ''
let personId = ''
let entityLabel = ''
let programStageId = ''

/**
 * Gets entity label.
 * @returns {string} Entity Label.
 */
export function getEntityLabel() {
    return entityLabel
}

/**
 * Sets the id of the AMR program, AMR program, and person for later use.
 */
export async function setAmrProgram() {
    const program = (await get(
        'programs.json?filter=shortName:eq:AMR&paging=false&fields=id,trackedEntityType[id,displayName],programStages'
    )).programs[0]
    amrId = program.id
    personId = program.trackedEntityType.id
    entityLabel = program.trackedEntityType.displayName
    programStageId = program.programStages[0].id
}

/**
 * Gets the attributes of the AMR program.
 * @returns {Object[]} Attributes
 */
export async function getProgramAttributes() {
    return (await get(
        'programs/' +
            amrId +
            '/programTrackedEntityAttributes.json?fields=mandatory,sortOrder,trackedEntityAttribute[code,displayName,valueType,id,unique,name,optionSetValue,optionSet[options[code,name,id,displayName]]]'
    )).programTrackedEntityAttributes
}

/**
 * Checks if any tracked entity instance has property with value.
 * @param {string} property - Property.
 * @param {string} value - Value.
 * @returns {boolean} - True if unique.
 */
export async function isUnique(property, value) {
    return (
        (await get(
            'trackedEntityInstances.json?ouMode=ALL&fields=attributes[code,displayName,valueType,attribute,value]&filter=' +
                property +
                ':eq:' +
                value
        )).trackedEntityInstances.length === 0
    )
}

/**
 * Gets tracked entity instance of type person by patient registration number.
 * @param {string} patientRegNr - Patient registration number.
 * @returns {Object} Tracked entity instance.
 */
export async function getPatient(patientRegNr) {
    try {
        return (await get(
            'trackedEntityInstances.json?ouMode=ALL&fields=trackedEntityInstance,attributes[code,displayName,valueType,attribute,value]&filter=RkCL8PAxV22:eq:' +
                patientRegNr
        )).trackedEntityInstances[0]
    } catch {
        return null
    }
}

/**
 * Adds a new person tracked entity instance and enrolls to AMR program.
 * @param {Object} values - Values
 */
export async function addPatient(values) {
    const orgUnit = 'ANGhR1pa8I5'
    const now = moment().format('YYYY-MM-DD')
    let data = {
        trackedEntityType: personId,
        orgUnit: orgUnit,
        attributes: [],
        enrollments: [
            {
                orgUnit: orgUnit,
                program: amrId,
                enrollmentDate: now,
                incidentDate: now,
            },
        ],
    }
    for (let key in values)
        data.attributes.push({ attribute: key, value: values[key] })
    await postData('trackedEntityInstances/', data)
}

/**
 * Updates a tracked entity instance.
 * @param {string} id - Tracked entity instance id.
 * @param {*} values - Values.
 */
export async function updatePatient(id, values) {
    let data = await get(
        'trackedEntityInstances/' + id + '.json?ouMode=ALL&fields=*'
    )
    data.attributes = []
    for (let key in values)
        data.attributes.push({ attribute: key, value: values[key] })
    console.log(await put('trackedEntityInstances/' + id, data))
}

/**
 * Deletes a tracked entity instance.
 * @param {string} id - Tracked entity instance.
 */
export async function deletePatient(id) {
    await del('trackedEntityInstances/' + id)
}

/**   ************** REPLACED BY FUNCTION getEntities() ************
 * Gets all person tracked entity instances.
 * @returns {Object[]} All person tracked entity instances.
 */
/*export async function getAllPatients() {
    let data = await get(
        'trackedEntityInstances/query.json?ouMode=ALL&order=created:desc&paging=false&program=' +
            amrId
    )
    for (let i = 0; i < data.headers.length; i++)
        data.headers[i].name = data.headers[i].column
    data.headers[0].options = { display: false }
    data.headers[1].options = { display: false }
    data.headers[2].options = { display: false }
    data.headers[3].options = { display: false }
    data.headers[5].options = { display: false }
    data.headers[6].options = { display: false }
    console.log(data)
    return data
}*/

/**
 * Gets all person tracked entity instances.
 * @returns {Object} Headers with medadata and rows with data.
 */
export async function getEntities(orgUnit) {
    const values = (await get(
        'trackedEntityInstances.json?ou=' +
            orgUnit +
            '&ouMode=DESCENDANTS&order=created:desc&paging=false&fields=created,lastUpdated,attributes[displayName,valueType,attribute,value],enrollments[orgUnitName]&program=' +
            amrId
    )).trackedEntityInstances
    const metaData = (await get(
        'programs/' +
            amrId +
            '.json?fields=programTrackedEntityAttributes[trackedEntityAttribute[displayName,valueType,id]]'
    )).programTrackedEntityAttributes
    let data = {
        headers: [
            {
                name: 'Created',
                options: { display: false },
            },
            {
                name: 'Updated',
                options: { display: false },
            },
            {
                name: 'Organisation Unit',
            },
        ],
        rows: [],
        title: entityLabel + 's',
    }

    let getAttributeValue = (index, id) => {
        for (let i = 0; i < values[index].attributes.length; i++) {
            if (values[index].attributes[i].attribute === id)
                return values[index].attributes[i].value
        }
        return ''
    }

    for (let i = 0; i < metaData.length; i++)
        data.headers.push({
            name: metaData[i].trackedEntityAttribute.displayName,
            id: metaData[i].trackedEntityAttribute.id,
            options: { display: i < 4 },
        })
    for (let i = 0; i < values.length; i++) {
        let entityValues = [
            removeTime(values[i].created),
            removeTime(values[i].lastUpdated),
            values[i].enrollments[0].orgUnitName,
        ]
        for (let j = 3; j < data.headers.length; j++)
            entityValues.push(getAttributeValue(i, data.headers[j].id))
        data.rows.push(entityValues)
    }
    return data
}

/**
 * Gets all events from the AMR program.
 * @returns {Object[]} All AMR events.
 */
export async function getEvents() {
    const events = (await get(
        'events.json?order=created:desc&paging=false&program=' +
            amrId +
            '&fields=orgUnitName,lastUpdated,created,storedBy,dataValues[*]'
    )).events
    let data = {
        headers: [
            {
                name: 'Organisation unit',
                column: 'Organisation unit',
            },
            {
                name: 'Stored by',
                column: 'Stored by',
            },
            {
                name: 'Created',
                column: 'Created',
            },
            {
                name: 'Updated',
                column: 'Updated',
            },
        ],
        rows: [],
    }
    //console.log(events)
    for (let i = 0; i < events.length; i++)
        //console.log(events[i])
        data.rows.push([
            events[i].orgUnitName,
            events[i].storedBy,
            removeTime(events[i].created),
            removeTime(events[i].lastUpdated),
        ])
    return data
}

/**
 * Gets option set by code.
 * @param {string} state - Option set code.
 * @returns {Object[]} Option sets.
 */
export async function getDistricts(state) {
    try {
        return (await get(
            'optionSets.json?paging=false&fields=options[name,displayName,id,code]&filter=code:eq:' +
                state
        )).optionSets[0].options
    } catch {
        return []
    }
}

/**
 * Gets AMR program stage.
 * @returns {Object} AMR program stage.
 */
export async function getProgramStage() {
    let programStage = await get(
        'programStages/' +
            programStageId +
            '.json?fields=displayName,programStageDataElements[id,compulsory],programStageSections[id,displayName,sortOrder,dataElements[id,displayFormName,valueType,optionSetValue,optionSet[name,displayName,id,code,options[name,displayName,id,code]]]]'
    )

    for (let i = 0; i < programStage.programStageDataElements.length; i++)
        if (programStage.programStageDataElements[i].compulsory)
            for (let j = 0; j < programStage.programStageSections.length; j++)
                for (
                    let k = 0;
                    k <
                    programStage.programStageSections[j].dataElements.length;
                    k++
                )
                    programStage.programStageSections[j].dataElements[
                        k
                    ].required = true

    return programStage
}

/**
 * Gets all organisation units.
 * @returns {Object[]} All organisation units.
 */
export async function getOrgUnits() {
    const userOrgUnits = (await get('me.json?fields=organisationUnits'))
        .organisationUnits
    let orgUnitsString = '[' + userOrgUnits[0].id
    for (let i = 1; i < userOrgUnits.length; i++)
        orgUnitsString += ',' + userOrgUnits[i].id
    orgUnitsString += ']'

    let data = (await get(
        'organisationUnits.json?filter=id:in:' +
            orgUnitsString +
            '&paging=false&order=level:asc&fields=id,displayName,children[id,displayName,children[id,displayName,children[id,displayName,children[id,displayName]]]]'
    )).organisationUnits

    const sortChildren = orgUnit => {
        if (orgUnit.children)
            if (orgUnit.children.length) {
                for (let i = 0; i < orgUnit.children.length; i++)
                    sortChildren(orgUnit.children[i])
                orgUnit.children.sort((a, b) =>
                    a.displayName > b.displayName
                        ? 1
                        : b.displayName > a.displayName
                        ? -1
                        : 0
                )
            }
    }

    for (let i = 0; i < data.length; i++) sortChildren(data[i])

    return data
}
