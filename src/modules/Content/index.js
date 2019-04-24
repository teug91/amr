import React, { useEffect } from 'react'
import { CircularProgress } from '@dhis2/ui/core'
import { Main, Sidebar } from 'modules'
import { Row } from 'styles'
import { initMetadata } from 'api'
import { MetadataContextProvider } from 'contexts'
import { hook } from './hook'

export const Content = () => {
    const [state, dispatch, types] = hook()
    const { metadata, selected } = state

    useEffect(() => {
        const getMetaData = async () => {
            const data = await initMetadata()
            dispatch({
                type: types.INIT,
                metadata: data,
                id: data.orgUnits[0].id,
                path: data.orgUnits[0].path,
            })
        }
        getMetaData()
    }, [])

    if (!metadata) return <CircularProgress size="large" overlay />

    return (
        <Row>
            <MetadataContextProvider metadata={metadata}>
                <Sidebar
                    onSelect={(id, path) =>
                        dispatch({
                            type: types.SELECTED,
                            id: id,
                            path: path,
                        })
                    }
                    selected={selected}
                />
                <Main selected={selected.id} metadata={metadata} />
            </MetadataContextProvider>
        </Row>
    )
}