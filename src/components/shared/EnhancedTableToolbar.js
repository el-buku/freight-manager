import {useState} from 'react'
import clsx from 'clsx'
import {
    Toolbar,
    Tooltip,
    IconButton,
    Table,
    TableBody,
    TableContainer,
    TextField,
    useMediaQuery,
    Typography
} from '@material-ui/core'
import {makeStyles,lighten} from '@material-ui/core/styles'
import SearchIcon from '@material-ui/icons/Search'
import CancelIcon from '@material-ui/icons/Cancel';

const useToolbarStyles = makeStyles((theme) => ({
    root: {
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(1),
    },
    highlight:
        theme.palette.type === 'light'
            ? {
                color: theme.palette.secondary.main,
                backgroundColor: lighten(theme.palette.secondary.light, 0.85),
            }
            : {
                color: theme.palette.text.primary,
                backgroundColor: theme.palette.secondary.dark,
            },
    title: {
        flex: '1 1 100%',
    },
}));

const EnhancedTableToolbar = ({numSelected, handleSearch}) => {
    const classes = useToolbarStyles();
    const query = useMediaQuery('(max-width:480px)')

    const [searchVal, setSearchVal] = useState('')
    return (
        <Toolbar
            className={clsx(classes.root, {
                [classes.highlight]: numSelected > 0,
            })}
        >
            {numSelected > 0 ? (
                <Typography className={classes.title} color="inherit" variant="subtitle1" component="div">
                    {numSelected} selected
                </Typography>
            ) : (
                <TextField
                    fullWidth={query?true:false}
                    id="outlined-name"
                    label="Name"
                    value={searchVal}
                    onChange={(event) => setSearchVal(event.target.value)}
                    variant="outlined"
                    InputProps={searchVal!=''?{
                        endAdornment:
                            <IconButton
                                style={{marginRight:'-0.5em'}}
                                aria-label="delete" onClick={() => {
                                setSearchVal('');
                                handleSearch('')
                            }}>
                                <CancelIcon/>
                            </IconButton>
                    }:null}
                >
                </TextField>
            )}

            {numSelected > 0 ? (
                <Tooltip title="Delete">
                    <IconButton aria-label="delete">
                        <DeleteIcon/>
                    </IconButton>
                </Tooltip>
            ) : (
                <>
                    <Tooltip title="Search" style={{marginLeft: '0.35em'}}>
                        <IconButton aria-label="search" onClick={() => handleSearch(searchVal)}>
                            <SearchIcon/>
                        </IconButton>
                    </Tooltip>
                </>
            )}
        </Toolbar>
    );
};

export default EnhancedTableToolbar