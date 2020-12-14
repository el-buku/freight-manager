import React from 'react';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import DashboardIcon from '@material-ui/icons/Dashboard';
import ListAlt from '@material-ui/icons/ListAlt';
import PeopleIcon from '@material-ui/icons/People';
import BusinessCenter from '@material-ui/icons/BusinessCenter';
import AccountBox from '@material-ui/icons/AccountBox';
import AddCircle from '@material-ui/icons/AddCircle'
import ExitToApp from '@material-ui/icons/ExitToApp';
import ArchiveIcon from '@material-ui/icons/Archive';
import {auth} from '../../config/firebase'

import {useRouter} from 'next/router'

import Main from './Main'

const signOut=(
    <div>
        <ListItem button onClick={()=>auth.signOut()}>
            <ListItemIcon>
                <ExitToApp />
            </ListItemIcon>
            <ListItemText primary="Sign Out" />
        </ListItem>
    </div>
)

export function DriverMain(props) {
    const router=useRouter()
    const Markup = (
        <React.Fragment>
            <List>
                <ListItem button onClick={()=>router.push('/')}>
                    <ListItemIcon>
                        <DashboardIcon />
                    </ListItemIcon>
                    <ListItemText primary="Dashboard" />
                </ListItem>
                <ListItem button onClick={()=>router.push('/orders')}>
                    <ListItemIcon>
                        <ListAlt />
                    </ListItemIcon>
                    <ListItemText primary="Orders" />
                </ListItem>
            </List>
            <Divider/>
            <List>{signOut}</List>
        </React.Fragment>
    )
    return <Main DrawerMarkup={Markup} name={props.user.displayName.split(' ')}{...props}/>
}

export function AdminMain(props){
    const router=useRouter()
    const Markup = (
        <React.Fragment>
            <List>
                <div>
                    <ListItem button onClick={()=>router.push('/')}>
                        <ListItemIcon>
                            <DashboardIcon />
                        </ListItemIcon>
                        <ListItemText primary="Dashboard" />
                    </ListItem>
                    <ListItem button onClick={()=>router.push('/customers')}>
                        <ListItemIcon>
                            <PeopleIcon />
                        </ListItemIcon>
                        <ListItemText primary="Customers" />
                    </ListItem>
                    <ListItem button onClick={()=>router.push('/brokers')}>
                        <ListItemIcon>
                            <BusinessCenter />
                        </ListItemIcon>
                        <ListItemText primary="Brokers" />
                    </ListItem>
                    <ListItem button onClick={()=>router.push('/drivers')}>
                        <ListItemIcon>
                            <AccountBox />
                        </ListItemIcon>
                        <ListItemText primary="Drivers" />
                    </ListItem>
                </div>
            </List>
            <Divider/>
            <List>
                <div>
                    <ListItem button onClick={()=>router.push('/orders')}>
                        <ListItemIcon>
                            <ListAlt />
                        </ListItemIcon>
                        <ListItemText primary="Orders" />
                    </ListItem>
                    <ListItem button onClick={()=>router.push('/orders/archive')}>
                        <ListItemIcon>
                            <ArchiveIcon />
                        </ListItemIcon>
                        <ListItemText primary="Orders Archive" />
                    </ListItem>
                    <ListItem button onClick={()=>router.push('/orders/new_order')}>
                        <ListItemIcon>
                            <AddCircle />
                        </ListItemIcon>
                        <ListItemText primary="New Order" />
                    </ListItem>
                </div>
            </List>
            <Divider/>
            <List>
                {signOut}
            </List>
        </React.Fragment>
    )
    return <Main name={"Admin"}DrawerMarkup={Markup} {...props}/>
}
