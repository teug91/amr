import { useReducer } from 'react'

const types = {
    SET_PANEL: 0,
    RESET_PANEL: 1,
    SET_VALUE: 2
}

const reducer = (state, action) => {
    switch (action.type) {
        case types.SET_PANEL: {
            return {
                ...state,
                organisms: action.organisms,
                programId: action.programId,
                programStageId: action.programStageId,
                organism: action.organism
            }
        }
        case types.RESET_PANEL: {
            return {
                ...state,
                programId: '',
                programStageId: '',
                organism: ''
            }
        }
        case types.SET_VALUE: {
            return {
                ...state,
                [action.key]: action.value
            }
        }
        default: {
            return state
        }
    }
}

export const hook = (organisms, programId, programStageId, organism) => {
    const [state, dispatch] = useReducer(reducer, {
        organisms: organisms,
        programId: programId,
        programStageId: programStageId,
        organism: organism
    })

    return [state, dispatch, types]
}