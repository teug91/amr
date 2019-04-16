import React from 'react'
import PropTypes from 'prop-types'
import { Card } from '@dhis2/ui/core'
import { Heading, Margin, MarginSides, MarginBottom } from 'helpers'
import { SectionContent } from '../SectionContent'

const getProps = (dataElements, childSections) => {
    dataElements = dataElements.filter(
        dataElement => !dataElement.hide && !dataElement.hideWithValues
    )
    childSections = childSections.filter(
        childSection => !childSection.hide && !childSection.hideWithValues
    )
    const childHalf = Math.ceil(childSections.length / 2)
    const half = Math.ceil(dataElements.length / 2 + childHalf)
    return { dataElements, childSections, half, childHalf }
}

export const Section = props => (
    <MarginBottom>
        <Card>
            <Margin>
                <MarginSides>
                    <Heading>{props.heading}</Heading>
                </MarginSides>
                <SectionContent
                    renderType={props.renderType}
                    completed={props.completed}
                    onChange={props.onChange}
                    optionSets={props.optionSets}
                    values={props.values}
                    {...getProps(props.dataElements, props.childSections)}
                />
            </Margin>
        </Card>
    </MarginBottom>
)

Section.propTypes = {
    heading: PropTypes.string.isRequired,
    renderType: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    values: PropTypes.object.isRequired,
    dataElements: PropTypes.array.isRequired,
    childSections: PropTypes.array.isRequired,
    optionSets: PropTypes.object,
    completed: PropTypes.bool,
}
