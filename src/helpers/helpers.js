import React from 'react'
import { Divider as CoreDivider } from '@dhis2/ui/core/helpers'

export const Title = ({ children }) => <h1 className="title">{children}</h1>
export const Heading = ({ children }) => <h2 className="heading">{children}</h2>
export const Label = ({ style, children }) => (
    <div style={style} className="text label">
        {children}
    </div>
)
export const Text = ({ style, children }) => (
    <div style={style} className="text">
        {children}
    </div>
)
export const Row = ({ style, children }) => (
    <div style={style} className="row">
        {children}
    </div>
)
export const Col = ({ style, children }) => (
    <div style={style} className="col">
        {children}
    </div>
)
export const RowW = ({ style, children }) => (
    <div style={style} className="row wrapped">
        {children}
    </div>
)
export const RowR = ({ style, children }) => (
    <div style={style} className="row_reverse">
        {children}
    </div>
)
export const ColW = ({ style, children }) => (
    <div style={style} className="col wrapped">
        {children}
    </div>
)
export const Divider = () => <CoreDivider margin="43px 0 60px 0" />
export const Spacer = ({ height }) => <div style={{ height, width: '100%' }} />
