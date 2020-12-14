import {useState, useEffect} from 'react'
import clsx from 'clsx'
import {IconButton, TextField,Button, Toolbar, Tooltip, Typography, useMediaQuery} from '@material-ui/core'
import {lighten, makeStyles} from '@material-ui/core/styles'
import SearchIcon from '@material-ui/icons/Search'
import CancelIcon from '@material-ui/icons/Cancel';
import FilterListIcon from '@material-ui/icons/FilterList';
import Box from '@material-ui/core/Box';
import Popover from '@material-ui/core/Popover';
import PopupState, {bindPopover, bindTrigger, usePopupState} from 'material-ui-popup-state';
import Divider from '@material-ui/core/Divider';

import {List, ListItem, ListItemText} from '@material-ui/core'

const useToolbarStyles = makeStyles((theme) => ({
    root: {
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(1),
        display:'flex',
        flexWrap:'wrap'
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
    },btn:{marginRight:4, flexGrow:1, marginTop:4}
}));

const EnhancedTableToolbar = ({numSelected, handleSearch, handleStatus, handleSort}) => {
    const classes = useToolbarStyles();
    const query = useMediaQuery('(max-width:480px)')
    const setOpen = () => {
    }
    const [searchVal, setSearchVal] = useState('')
    const [searchType, setSearchType] = useState('Order ID')
    const [status, setStatus] = useState('All')
    useEffect(()=>{
        handleStatus(status)
    }, [status])
    useEffect(()=> {
        handleSearch(searchVal, searchType)
    },[searchVal])
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
                    fullWidth={query ? true : false}
                    id="outlined-name"
                    label={searchType}
                    value={searchVal}
                    onChange={(event) => setSearchVal(event.target.value)}
                    variant="outlined"
                    InputProps={searchVal != '' ? {
                        endAdornment:
                            <IconButton
                                style={{marginRight: '-0.5em'}}
                                aria-label="delete" onClick={() => {
                                setSearchVal('');
                                handleSearch('')
                            }}>
                                <CancelIcon/>
                            </IconButton>
                    } : null}
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
                    {/*<Tooltip title="Search" style={{marginLeft: '0.35em'}}>*/}
                    {/*    <IconButton aria-label="search" onClick={() => handleSearch(searchVal, searchType)}>*/}
                    {/*        <SearchIcon/>*/}
                    {/*    </IconButton>*/}
                    {/*</Tooltip>*/}
                    <PopupState variant="popover" popupId="popup">
                        {(popupState) => {
                            return (
                                <>
                                    <Tooltip title="Options" style={{marginLeft: '0.35em'}}>
                                        <IconButton aria-label="filter list" {...bindTrigger(popupState)}>
                                            <FilterListIcon/>
                                        </IconButton>
                                    </Tooltip>
                                    <Popover
                                        PaperProps={
                                            {
                                                style:{
                                                    minWidth:'300px!important'
                                                }
                                            }
                                        }
                                        {...bindPopover(popupState)}
                                        anchorOrigin={{
                                            vertical: 'bottom',
                                            horizontal: 'center',
                                        }}
                                        transformOrigin={{
                                            vertical: 'top',
                                            horizontal: 'center',
                                        }}
                                    >

                                        <Box p={2}>
                                            <Typography variant={'button'} display={"block"} gutterBottom>Search by</Typography>
                                            <List disablePadding>
                                                <ListItem button onClick={()=>{setSearchType('Order ID');popupState.close()}}>
                                                    <ListItemText>Order ID</ListItemText>
                                                </ListItem>
                                                <ListItem button onClick={()=>{setSearchType('Driver name');popupState.close()}}>
                                                    <ListItemText>Driver name</ListItemText>
                                                </ListItem>
                                                <ListItem button onClick={()=>{setSearchType("Broker name");popupState.close()}}>
                                                    <ListItemText>Broker name</ListItemText>
                                                </ListItem>
                                                <ListItem button onClick={()=>{setSearchType('Pickup name');popupState.close()}}>
                                                    <ListItemText>Pickup name</ListItemText>
                                                </ListItem>
                                                <ListItem button onClick={()=>{setSearchType('Pickup address');popupState.close()}}>
                                                    <ListItemText>Pickup address</ListItemText>
                                                </ListItem>
                                                <ListItem button onClick={()=>{setSearchType('Delivery name');popupState.close()}}>
                                                    <ListItemText>Delivery name</ListItemText>
                                                </ListItem>
                                                <ListItem button onClick={()=>{setSearchType('Delivery address');popupState.close()}}>
                                                    <ListItemText>Delivery address</ListItemText>
                                                </ListItem>
                                            </List>
                                        </Box>
                                        <Divider/>
                                        <Box p={2} style={{display:'flex',flexDirection:'column'}}>
                                            <Typography variant={'button'} display={"block"} gutterBottom>Sort by</Typography>
                                            <List disablePadding>
                                                <ListItem button onClick={()=>{handleSort('DESC');popupState.close()}}>
                                                    <ListItemText>Newest</ListItemText>
                                                </ListItem>
                                                <ListItem button onClick={()=> {
                                                    handleSort('ASC');
                                                    popupState.close()
                                                }}>
                                                    <ListItemText>Oldest</ListItemText>
                                                </ListItem>
                                            </List>
                                        </Box>
                                    </Popover>
                                </>
                            )
                        }}
                    </PopupState>
                </>
            )}
            <Button className={classes.btn}onClick={()=>setStatus('All')}>{status=='All'?'Status:':'Reset'}</Button>
            <Button className={classes.btn}color="primary" variant={status=='New'?'contained':'outlined'}onClick={()=>{setStatus('New')}}>New</Button>
            <Button className={classes.btn}color="primary"variant={status=='In Transit'?'contained':'outlined'}onClick={()=>{setStatus('In Transit')}}>In Transit</Button>
            <Button className={classes.btn}color="primary"variant={status=='Delivered'?'contained':'outlined'}onClick={()=>{setStatus('Delivered')}}>Delivered</Button>
            <Button className={classes.btn}color="primary"variant={status=='Paid'?'contained':'outlined'}onClick={()=>{setStatus('Paid')}}>Paid</Button>
            <Button className={classes.btn}color="primary"variant={status=='Invoiced'?'contained':'outlined'}onClick={()=>{setStatus('Invoiced')}}>Invoiced</Button>


        </Toolbar>
    );
};

export default EnhancedTableToolbar