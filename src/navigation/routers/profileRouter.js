import React from "react";
import Affiliate from "../../screens/lic/affiliate";
import MineralCirculationEvents from "../../screens/profile/mineralCirculationEvents";
import MineralCirculationEventsTypes from "../../screens/profile/mineralCirculationEventsTypes";
import MineralCirculationActions from "../../screens/profile/mineralCitulationActions";
import MineralTypes from "../../screens/profile/mineralTypes";
import SystemUsers from "../../screens/profile/systemUsers";
import UserAccount from "../../screens/lic/affiliate/userAccount/userAcount";
import Taxes from "../../screens/profile/taxes";
import TransactionTypes from "../../screens/profile/trajsactionTypes";
import Positions from "../../screens/profile/positions";
import Parish from "../../screens/profile/parish";
import Activitytypes from "../../screens/profile/activitytypes";
import Sector from "../../screens/profile/sector";
import Subtypes from "../../screens/profile/subtypes";
import Reports from "../../screens/lic/reports";
import Employe from "../../screens/lic/employe";
import ControlPoint from "../../screens/profile/controlPoint";
import Fuel from  "../../screens/profile/fuel"
import FuelAssignment from "../../screens/profile/fuelAssignment"
import Transaction from "../../screens/sector/transaction"
import Customers from "../../screens/fuel/customers"
import MovSector from "../../screens/profile/movSector"
import Plant from "../../screens/profile/plant"
import Miner from "../../screens/sector/miner"

/*import store from '../../store'
export default function test(){
    console.log(store.getState().authStorage.modules)
}*/  


export const router = [
    {key:31,component:<Affiliate key={1}/>, path:"affiliate"},
    {key:32,component:<MineralCirculationEvents key={2}/>, path:"mineralCirculationActions"},
    {key:33,component:<MineralCirculationEventsTypes key={3}/>, path:"MineralCirculationEventTypes"},
    {key:34,component:<MineralCirculationActions key={4}/>, path:"mineralCirculationEvents"},
    {key:35,component:<MineralTypes key={5}/>, path:"mineralTypes"},
    {key:36,component:<SystemUsers key={6}/>, path:"systemUsers"},
    {key:37,component:<UserAccount key={7}/>, path:"userAcount"},
    {key:38,component:<Taxes key={8}/>, path:"taxes"},
    {key:39,component:<TransactionTypes key={9}/>, path:"transactionTypes"},
    {key:39,component:<Positions key={9}/>, path:"positions"},
    {key:39,component:<Activitytypes key={9}/>, path:"activitytypes"},
    {key:39,component:<Parish key={9}/>, path:"parish"},
    {key:39,component:<Sector key={9}/>, path:"sector"},
    {key:39,component:<Subtypes key={9}/>, path:"subtypes"},
    {key:39,component:<Employe key={9}/>, path:"internalusage/employe"},
    {key:39,component:<ControlPoint key={9}/>, path:"controlPoint"},
    {key:39,component:<Fuel key={9}/>, path:"fuel"},
    {key:39,component:<FuelAssignment key={9}/>, path:"fuelAssignment"},
    {key:39,component:<Plant key={9}/>, path:"plant"},
    {key:39,component:<MovSector key={9}/>, path:"movsectores"},
];
export const routerFuel = [


    
   
    
    {key:39,component:<Customers key={9}/>, path:"customers"},
   
];
export const routerLic  = [

    {key:31,component:<Affiliate key={1}/>, path:"affiliate"},
    {key:39,component:<Employe key={9}/>, path:"employe"},
    {key:39,component:<Reports key={9}/>, path:"reports"},

];

export const routerSec=[
    
    {key:39,component:<Transaction key={9}/>, path:"transac"},
    {key:39,component:<Miner key={9}/>, path:"miner"},
]
