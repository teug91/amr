import React, { useState, useEffect } from 'react'
import { Checkbox } from '@dhis2/ui/core'
import { RowW, Label, OptionSpacer } from '../../helpers/helpers'

/**
 * Input consisting of a a group of checkboxes.
 */
export const CheckboxInput = props => {
    const [values, setValues] = useState({})

    useEffect(() => {
        if (props.values !== values)setValues(props.values)
    }, [props.values])

    /**
     * Called on checkbox click.
     */
    const onChange = (n, v) => {
        let newValues = { ...values }
        v = v ? 'true' : ''
        newValues[n] = v
        setValues(newValues)
        props.onChange(n, v)
    }

    return (
        <>
        <Label required={props.required}>{props.label}</Label>
        <RowW>
            {Object.keys(props.objects).map(id => (
                <OptionSpacer key={id}>
                    <Checkbox
                        name={id}
                        value={id}
                        label={props.objects[id].label}
                        checked={values[id] === 'true'}
                        onChange={onChange}
                        disabled={props.objects[id].disabled}
                    />
                </OptionSpacer>
            ))}
        </RowW>
        </>
    )
}