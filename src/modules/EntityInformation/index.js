/* eslint no-eval: 0 */

import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { Grid } from '@material-ui/core'
import { Card } from '@dhis2/ui/core'
import { Heading, Padding, Margin, MarginSides } from '../../helpers/helpers'
import {
    getEntityAttributes,
    addPerson,
    deletePerson,
    updatePerson,
} from '../../api/api'
import { EntityButtons } from '../'
import { TextInput, AgeInput, RadioInput, SelectInput } from '../../inputs'

/**
 * Entity information section.
 */
class EntityInformation extends Component {
    state = {
        values: {}, // Current or new values.
        uniques: [], // Unique textfield values are validated.
        goToHome: false, // Redirects to home after deleting entity.
        editing: false, // Will be true after Edit button is clicked.
        unchanged: false, // Submit button is disabled when editing and values are unchanged.
    }

    componentDidMount = async () => {
        let { attributes, values, uniques, rules } = await getEntityAttributes(
            this.props.id ? this.props.id : null
        )
        console.log(attributes)
        const postRules = this.checkRules(values, attributes, rules)

        this.setState({
            attributes: postRules.attributes,
            values: postRules.values,
            uniques: uniques,
            isNewPatient: this.props.id ? false : true,
            half: Math.floor(attributes.length / 2),
            rules: rules,
        })
    }

    /**
     * Called on every input field change.
     */
    onChange = async (name, value) => {
        let values = { ...this.state.values }
        let attributes = [...this.state.attributes]
        const rules = this.state.rules

        values[name] = value
        const postRules = this.checkRules(values, attributes, rules)

        this.setState({
            values: postRules.values,
            attributes: postRules.attributes,
            unchanged: false,
        })
    }

    checkRules = (values, attributes, rules) => {
        rules.forEach(rule => {
            rule.programRuleActions.forEach(r => {
                switch (r.programRuleActionType) {
                    case 'SHOWOPTIONGROUP':
                        if (eval(r.programRule.condition)) {
                            let affectedAttribute = attributes.find(
                                attribute =>
                                    attribute.trackedEntityAttribute.id ===
                                    r.trackedEntityAttribute.id
                            )
                            if (
                                affectedAttribute.trackedEntityAttribute
                                    .optionSet.id !== r.optionGroup.id
                            ) {
                                affectedAttribute.trackedEntityAttribute.optionSet = {
                                    id: r.optionGroup.id,
                                    options: r.optionGroup.options
                                }
                                values[
                                    affectedAttribute.trackedEntityAttribute.id
                                ] = ''
                            }
                        }
                        break
                    case 'HIDEFIELD':
                        const hide = eval(r.programRule.condition)
                        let affectedAttribute = attributes.find(
                            attribute =>
                                attribute.trackedEntityAttribute.id ===
                                r.trackedEntityAttribute.id
                        )
                        if (hide !== affectedAttribute.hide) {
                            affectedAttribute.hide = hide
                            values[
                                affectedAttribute.trackedEntityAttribute.id
                            ] = ''
                        }
                        break
                    default:
                        break
                }
            })
        })
        return { values, attributes }
    }

    /**
     * On submit button click.
     */
    onSubmitClick = async () => {
        if (!this.state.editing) {
            this.props.history.push(
                '/orgUnit/' +
                    this.props.match.params.orgUnit +
                    '/entity/' +
                    (await addPerson(this.state.values, this.props.orgUnit))
            )
            this.setState({ isNewPatient: false })
            this.props.onEntityAdded()
        } else {
            await updatePerson(this.props.id, this.state.values)
            this.setState({
                isNewPatient: false,
                editing: false,
            })
        }
    }

    /**
     * On edit button click.
     */
    onEditClick = () => {
        this.setState({ isNewPatient: true, editing: true, unchanged: true })
    }

    /**
     * On delete button click.
     */
    onDeleteClick = async () => {
        await deletePerson(this.props.id)
        this.props.history.push('/')
    }

    /**
     * Checks that no required field is empty and that uniques are validated.
     */
    validate = () => {
        const { attributes, values, uniques } = this.state
        for (let i = 0; i < attributes.length; i++)
            if (attributes[i].mandatory)
                if (values[attributes[i].trackedEntityAttribute.id] === '')
                    return false
        for (let key in uniques) if (!uniques[key]) return false
        return true
    }

    /**
     * Called when a unique value is validated.
     */
    setUniqueValid = (name, valid) => {
        let uniques = { ...this.state.uniques }
        uniques[name] = valid
        this.setState({ uniques: uniques })
    }

    /**
     * Returns buttons based on adding new person or editing.
     */
    getButtonProps = () => {
        return this.state.isNewPatient
            ? [
                  {
                      label: 'Submit',
                      onClick: this.onSubmitClick,
                      disabled: !this.validate() || this.state.unchanged,
                      icon: 'done',
                      kind: 'primary',
                  },
              ]
            : [
                  {
                      label: 'Edit',
                      onClick: this.onEditClick,
                      disabled: false,
                      icon: 'edit',
                      kind: 'primary',
                  },
                  {
                      label: 'Delete',
                      onClick: this.onDeleteClick,
                      disabled: false,
                      icon: 'delete',
                      kind: 'destructive',
                  },
              ]
    }

    /**
     * Returns appropriate input type.
     */
    getInput = attribute => {
        if (attribute.hide) return null

        const { values, isNewPatient } = this.state

        return (
            <Padding key={attribute.trackedEntityAttribute.id}>
                {attribute.trackedEntityAttribute.valueType === 'AGE' ? (
                    <AgeInput
                        required={attribute.mandatory}
                        unique={attribute.trackedEntityAttribute.unique}
                        name={attribute.trackedEntityAttribute.id}
                        label={attribute.trackedEntityAttribute.displayName}
                        value={values[attribute.trackedEntityAttribute.id]}
                        onChange={this.onChange}
                        disabled={!isNewPatient}
                    />
                ) : attribute.trackedEntityAttribute.optionSetValue ? (
                    attribute.trackedEntityAttribute.optionSet.options.length <
                    4 ? (
                        <RadioInput
                            required={attribute.mandatory}
                            objects={
                                attribute.trackedEntityAttribute.optionSet
                                    .options
                            }
                            name={attribute.trackedEntityAttribute.id}
                            label={attribute.trackedEntityAttribute.displayName}
                            value={values[attribute.trackedEntityAttribute.id]}
                            onChange={this.onChange}
                            disabled={!isNewPatient}
                        />
                    ) : (
                        <SelectInput
                            required={attribute.mandatory}
                            objects={
                                attribute.trackedEntityAttribute.optionSet
                                    .options
                            }
                            name={attribute.trackedEntityAttribute.id}
                            label={attribute.trackedEntityAttribute.displayName}
                            value={values[attribute.trackedEntityAttribute.id]}
                            onChange={this.onChange}
                            disabled={!isNewPatient}
                        />
                    )
                ) : (
                    <TextInput
                        required={attribute.mandatory}
                        unique={attribute.trackedEntityAttribute.unique}
                        onUnique={this.setUniqueValid}
                        name={attribute.trackedEntityAttribute.id}
                        label={attribute.trackedEntityAttribute.displayName}
                        value={values[attribute.trackedEntityAttribute.id]}
                        onChange={this.onChange}
                        disabled={!isNewPatient}
                    />
                )}
            </Padding>
        )
    }

    render() {
        const { attributes, half } = this.state

        if (!attributes) return null

        return (
            <Card>
                <Margin>
                    <MarginSides>
                        <Heading>Information</Heading>
                    </MarginSides>
                    <Grid container spacing={0}>
                        <Grid item xs>
                            {attributes
                                .slice(0, half)
                                .map(attribute => this.getInput(attribute))}
                        </Grid>
                        <Grid item xs>
                            {attributes
                                .slice(half)
                                .map(attribute => this.getInput(attribute))}
                        </Grid>
                    </Grid>
                    <EntityButtons buttons={this.getButtonProps()} />
                </Margin>
            </Card>
        )
    }
}

export default withRouter(EntityInformation)
