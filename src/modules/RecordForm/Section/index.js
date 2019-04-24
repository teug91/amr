import React from 'react'
import { arrayOf, func, object, objectOf, string } from 'prop-types'
import { Card } from '@dhis2/ui/core'
import { Heading, Margin, MarginBottom } from 'styles'
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
                <Heading>{props.heading}</Heading>
                <SectionContent
                    renderType={props.renderType}
                    onChange={props.onChange}
                    values={props.values}
                    errors={props.errors}
                    {...getProps(props.dataElements, props.childSections)}
                />
            </Margin>
        </Card>
    </MarginBottom>
)

Section.propTypes = {
    heading: string.isRequired,
    renderType: string.isRequired,
    onChange: func.isRequired,
    values: objectOf(string).isRequired,
    dataElements: arrayOf(object).isRequired,
    childSections: arrayOf(object).isRequired,
    error: objectOf(string),
}