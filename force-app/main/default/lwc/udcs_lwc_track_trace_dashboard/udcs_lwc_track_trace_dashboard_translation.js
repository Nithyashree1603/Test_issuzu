import lbl_map from "@salesforce/label/c.ud_map";

import lbl_moving from "@salesforce/label/c.ud_moving";
import lbl_ign_on from "@salesforce/label/c.ud_ign_on";
import lbl_ign_off from "@salesforce/label/c.ud_ign_off";
import lbl_non_comm_non_communicating from "@salesforce/label/c.ud_non_comm_non_communicating";
import lbl_nodata from "@salesforce/label/c.ud_nodata";

import lbl_tracehistory from "@salesforce/label/c.ud_tracehistory";
import lbl_selectrange from "@salesforce/label/c.ud_selectrange";
import lbl_events from "@salesforce/label/c.ud_events";
import lbl_noeventsfound from "@salesforce/label/c.ud_noeventsfound";

import lbl_vehicles from "@salesforce/label/c.ud_vehicles"; //VEHICLES
import lbl_connected_default from "@salesforce/label/c.ud_connected_default"; //Connected (Default)
import lbl_filter from "@salesforce/label/c.ud_filter";
// import lbl_events from '@salesforce/label/c.ud_events';

import lbl_east from "@salesforce/label/c.ud_east";
import lbl_northwest from "@salesforce/label/c.ud_northwest";
import lbl_northeast from "@salesforce/label/c.ud_northeast";
import lbl_north from "@salesforce/label/c.ud_north";
import lbl_southwest from "@salesforce/label/c.ud_southwest";
import lbl_southeast from "@salesforce/label/c.ud_southeast";
import lbl_south from "@salesforce/label/c.ud_south";
import lbl_chassisid from "@salesforce/label/c.ud_chassisid";
import lbl_reg_no from "@salesforce/label/c.ud_reg_no";
import lbl_ud_driver from "@salesforce/label/c.ud_driver";
import lbl_ud_TruckID from "@salesforce/label/c.ud_TruckID";
import lbl_west from "@salesforce/label/c.ud_west";

import lbl_excessiveidlingend from "@salesforce/label/c.ud_excessiveidlingend";
import lbl_excessiveidlingstart from "@salesforce/label/c.ud_excessiveidlingstart";
import lbl_fuelleveldecrease from "@salesforce/label/c.ud_fuelleveldecrease";
import lbl_fuellevelincrease from "@salesforce/label/c.ud_fuellevelincrease";
import lbl_harshacceleration from "@salesforce/label/c.ud_harshacceleration";
import lbl_harshbraking from "@salesforce/label/c.ud_harshbraking";
import lbl_ignitionoff from "@salesforce/label/c.ud_ignitionoff";
import lbl_ignitionon from "@salesforce/label/c.ud_ignitionon";
import lbl_overrevvingend from "@salesforce/label/c.ud_overrevvingend";
import lbl_overrevvingstart from "@salesforce/label/c.ud_overrevvingstart";
import lbl_overspeedingend from "@salesforce/label/c.ud_overspeedingend";
import lbl_overspeedingstart from "@salesforce/label/c.ud_overspeedingstart";
import lbl_position from "@salesforce/label/c.ud_position";
import lbl_seatbeltdisengaged from "@salesforce/label/c.ud_seatbeltdisengaged";
import lbl_seatbeltengaged from "@salesforce/label/c.ud_seatbeltengaged";
import lbl_movement from "@salesforce/label/c.ud_movement";
import lbl_nomovement from "@salesforce/label/c.ud_nomovement";
import lbl_driverlogin from "@salesforce/label/c.ud_driverlogin";
import lbl_driverlogout from "@salesforce/label/c.ud_driverlogout";
// import lbl_position from '@salesforce/label/c.ud_position';
import lbl_custom from "@salesforce/label/c.ud_custom";
import lbl_last2hours from "@salesforce/label/c.ud_last2hours";
import lbl_last12hours from "@salesforce/label/c.ud_last12hours";
import lbl_last24hours from "@salesforce/label/c.ud_last24hours";

import lbl_back from "@salesforce/label/c.ud_back";
import lbl_ud_placeholder from "@salesforce/label/c.ud_placeholder";
import lbl_ud_Add from "@salesforce/label/c.ud_Add";
import lbl_ud_km from "@salesforce/label/c.ud_km";
import lbl_ud_km_h from "@salesforce/label/c.ud_km_h";

import lbl_export from "@salesforce/label/c.ud_export";

import lbl_excessiveidlingstart_end from "@salesforce/label/c.ud_excessiveidlingstart_end";
import lbl_overspeedingstart_end from "@salesforce/label/c.ud_overspeedingstart_end";
import lbl_overrevvingstart_end from "@salesforce/label/c.ud_overrevvingstart_end";
import lbl_seatbeltengaged_disengaged from "@salesforce/label/c.ud_seatbeltengaged_disengaged";
import lbl_ud_close from "@salesforce/label/c.ud_close";
import lbl_ud_backtopage from "@salesforce/label/c.ud_backtopage";
import lbl_ud_nodataforselectedperiod from "@salesforce/label/c.ud_nodataforselectedperiod";
import lbl_ud_rangeexceeds14days from "@salesforce/label/c.ud_rangeexceeds14days";
import lbl_ud_systemdatefuture from "@salesforce/label/c.ud_systemdatefuture";
import lbl_ud_range from "@salesforce/label/c.ud_range";
import lbl_ud_trace from "@salesforce/label/c.ud_trace";
import lbl_ud_history from "@salesforce/label/c.ud_history";

export default {
  lbl_ud_history,
  lbl_ud_trace,
  lbl_ud_range,
  lbl_ud_rangeexceeds14days,
  lbl_ud_nodataforselectedperiod,
  lbl_ud_backtopage,
  lbl_ud_systemdatefuture,
  lbl_ud_close,
  lbl_map,
  lbl_nomovement,
  lbl_ud_Add,
  lbl_driverlogin,
  lbl_driverlogout,
  lbl_moving, // Make  ALL Caps in Custom labels - MOVING
  lbl_ign_on, // IGN-ON
  lbl_ign_off, // IGN-OFF
  lbl_non_comm_non_communicating, // NO-COMM
  lbl_nodata, //NO-DATA

  lbl_tracehistory, //TRACE HISTORY
  lbl_selectrange, //Select Range
  lbl_events, //EVENTS
  lbl_noeventsfound, //No events found

  lbl_vehicles,
  lbl_connected_default,
  lbl_back,
  lbl_filter,
  // lbl_events
  lbl_north,
  lbl_northeast,
  lbl_east,
  lbl_southeast,
  lbl_south,
  lbl_southwest,
  lbl_west,
  lbl_northwest,
  lbl_excessiveidlingend,
  lbl_excessiveidlingstart,
  lbl_fuelleveldecrease,
  lbl_fuellevelincrease,
  lbl_harshacceleration,
  lbl_harshbraking,
  lbl_ignitionoff,
  lbl_ignitionon,
  lbl_overrevvingend,
  lbl_overrevvingstart,
  lbl_overspeedingend,
  lbl_overspeedingstart,
  lbl_position,
  lbl_seatbeltdisengaged,
  lbl_seatbeltengaged,
  lbl_movement,
  lbl_custom,
  lbl_last2hours,
  lbl_last12hours,
  lbl_last24hours,
  lbl_chassisid, // Chassis ID
  lbl_reg_no,
  lbl_ud_TruckID,
  lbl_ud_driver,
  lbl_ud_placeholder,
  lbl_ud_km,
  lbl_ud_km_h,
  lbl_export,
  lbl_excessiveidlingstart_end,
  lbl_overspeedingstart_end,
  lbl_overrevvingstart_end,
  lbl_seatbeltengaged_disengaged
};