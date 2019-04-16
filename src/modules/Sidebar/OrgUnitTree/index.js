import React from 'react'
import PropTypes from 'prop-types'
import { Card } from '@dhis2/ui/core'
import styled from 'styled-components'
import { MarginTopSmall, MarginSmall } from 'helpers'
import { OrgUnitNode } from './OrgUnitNode'

const OrgUnitTreeStyle = styled.ul`
    list-style-type: none;
    margin: 0;
    padding: 0;
`

/**
 * Organisation unit tree.
 */
export const OrgUnitTree = props => (
    <MarginTopSmall>
        <Card>
            <MarginSmall>
                <OrgUnitTreeStyle>
                    {props.orgUnits.map(orgUnit => (
                        <OrgUnitNode
                            orgUnit={orgUnit}
                            key={orgUnit.id}
                            show={true}
                            onSelect={props.onSelect}
                            selected={props.selected}
                        />
                    ))}
                </OrgUnitTreeStyle>
            </MarginSmall>
        </Card>
    </MarginTopSmall>
)

OrgUnitTree.propTypes = {
    selected: PropTypes.string.isRequired,
    onSelect: PropTypes.func.isRequired,
    orgUnits: PropTypes.arrayOf(PropTypes.object).isRequired,
}
