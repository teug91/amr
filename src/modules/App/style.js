import { createMuiTheme } from '@material-ui/core'
import { createGlobalStyle } from 'styled-components'
import 'typeface-roboto'

export const BodyStyle = createGlobalStyle`
    body {
        background-color: rgb(240, 240, 240);
    }
    .required span::after {
        color: #c62828;
    }
`

export const theme = createMuiTheme({
    palette: {
        primary: {
            main: '#1565c0',
        },
    },
    typography: {
        useNextVariants: true,
    },
    overrides: {
        MUIDataTableToolbar: {
            titleRoot: { marginLeft: 16 },
            titleText: {
                fontSize: '1.25rem',
                color: '#0d0d0e',
                letterSpacing: 'normal',
            },
        },
        MUIDataTableBodyRow: {
            root: {
                userSelect: 'none',
                cursor: 'pointer',
            },
        },
    },
})
