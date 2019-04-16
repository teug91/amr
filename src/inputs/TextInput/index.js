import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import InputField from '@dhis2/ui/core/InputField'
import styled, { css } from 'styled-components'
import { Input } from 'styles'
import { debounced } from './debounced'

/**
 * Colored field background.
 */
const CustomInputField = styled.div`
    ${props => {
        switch (props.color) {
            case 'red':
                return css`
                    .ui_inputfield_flatline_kvrmz {
                        background-color: rgba(255, 0, 0, 0.082) !important;
                    }
                `
            case 'yellow':
                return css`
                    .ui_inputfield_flatline_kvrmz {
                        background-color: rgba(255, 255, 0, 0.082) !important;
                    }
                `
            case 'green':
                return css`
                    .ui_inputfield_flatline_kvrmz {
                        background-color: rgba(0, 255, 0, 0.082) !important;
                    }
                `
            default:
                return null
        }
    }}
`

const texts = {
    required: 'This field is required',
    unique: 'This field requires a unique value',
    validate: 'Validating',
}

const statuses = {
    default: 'default',
    warning: 'warning',
    error: 'error',
}

/**
 * Textfield input.
 */
export const TextInput = props => {
    const [value, setValue] = useState('')
    //const [warning, setWarning] = useState(null)
    const [error, setError] = useState(null)
    const [validating, setValidating] = useState(false)

    const debouncedValue = debounced(value, 2000)

    useEffect(() => {
        if (props.value !== value) setValue(props.value)
    }, [props.valid])

    useEffect(() => {
        if (
            debouncedValue !== null &&
            debouncedValue === value &&
            debouncedValue !== props.value
        )
            passValue(debouncedValue)
    }, [debouncedValue])

    useEffect(() => {
        if (props.uniqueValid && error === texts.unique) setError(props.error)
    }, [props.uniqueValid])

    /**
     * Passes the value to parent component after 1 sec.
     */
    const passValue = async value => {
        const didValidate = await validate(value)
        setError(didValidate)
        props.onChange(props.name, value)
    }

    /**
     * @param {String} value input value
     * @returns Appropriate error text. Empty if valid.
     */
    const validate = async value => {
        const { name, label, required, unique } = props
        let error
        if (required && !value) error = texts.required
        if (unique && value) {
            setValidating(true)
            if (!(await props.validateUnique(name, value, label)))
                error = texts.unique
            setValidating(false)
        }
        return error
    }

    return (
        <Input>
            <CustomInputField color={props.color}>
                <InputField
                    required={props.required}
                    name={props.name}
                    label={props.label}
                    value={value}
                    onChange={(n, v) => setValue(v)}
                    kind={'outlined'}
                    status={
                        validating
                            ? statuses.warning
                            : error || props.error
                            ? statuses.error
                            : props.warning
                            ? statuses.warning
                            : statuses.default
                    }
                    help={
                        validating
                            ? texts.validate
                            : error
                            ? error
                            : props.error
                            ? props.error
                            : props.warning
                            ? props.warning
                            : ''
                    }
                    disabled={props.disabled}
                    type={props.type}
                    size="dense"
                />
            </CustomInputField>
        </Input>
    )
}

TextInput.propTypes = {
    onChange: PropTypes.func.isRequired,
    name: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    required: PropTypes.bool,
    unique: PropTypes.bool,
    disabled: PropTypes.bool,
    value: PropTypes.string,
    valid: PropTypes.bool,
    warning: PropTypes.string,
    error: PropTypes.string,
    uniqueValid: PropTypes.bool,
    validateUnique: PropTypes.func,
}
