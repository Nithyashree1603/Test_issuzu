import label from "./udcs_lwc_track_trace_dashboard_translation";
let traceeventtypes = [
  "excessiveidlingend",
  "excessiveidlingstart",
  "fuelleveldecrease",
  "fuellevelincrease",
  "harshacceleration",
  "harshbraking",
  "ignitionoff",
  "ignitionon",
  "overrevvingend",
  "overrevvingstart",
  "overspeedingend",
  "overspeedingstart",
  "seatbeltdisengaged",
  "seatbeltengaged",
  "driverlogin",
  "driverlogout"
];
let traceEventTypesMap = {
  excessiveidlingend: "IDLING_ENDED",
  excessiveidlingstart: "IDLING_STARTED",
  fuelleveldecrease: "FUELLEVEL_CHANGED_WHILE_STOPPED",
  fuellevelincrease: "FUELLEVEL_CHANGED_WHILE_STOPPED",
  harshacceleration: "HARSH_ACCELERATION",
  harshbraking: "HARSH_DECELERATION",
  ignitionoff: "IGNITION_OFF",
  ignitionon: "IGNITION_ON",
  overrevvingend: "OVERREVVING_STATUS_ENDED",
  overrevvingstart: "OVERREVVING_STATUS_STARTED",
  overspeedingend: "OVERSPEEDING_ENDED",
  overspeedingstart: "OVERSPEEDING_STARTED",
  seatbeltdisengaged: "SEATBELT_STATUS_WHILE_MOVING_DISENGAGED",
  seatbeltengaged: "SEATBELT_STATUS_WHILE_MOVING_ENGAGED",
  position: "PERIODIC_WITH_ENGINE_ON",
  driverlogin: "DRIVER_LOGIN",
  driverlogout: "DRIVER_LOGOUT"
};
let traceeventtypes_trl = {
  excessiveidlingend: label.lbl_excessiveidlingend,
  excessiveidlingstart: label.lbl_excessiveidlingstart,
  fuelleveldecrease: label.lbl_fuelleveldecrease,
  fuellevelincrease: label.lbl_fuellevelincrease,
  harshacceleration: label.lbl_harshacceleration,
  harshbraking: label.lbl_harshbraking,
  ignitionoff: label.lbl_ignitionoff,
  ignitionon: label.lbl_ignitionon,
  overrevvingend: label.lbl_overrevvingend,
  overrevvingstart: label.lbl_overrevvingstart,
  overspeedingend: label.lbl_overspeedingend,
  overspeedingstart: label.lbl_overspeedingstart,
  seatbeltdisengaged: label.lbl_seatbeltdisengaged,
  seatbeltengaged: label.lbl_seatbeltengaged,
  position: label.lbl_position,
  driverlogin: label.lbl_driverlogin,
  driverlogout: label.lbl_driverlogout
};
let trackEventLabels = {
  IGNITION_ON: "Ignition On",
  IGNITION_OFF: "Ignition Off",
  MOVEMENT: "Movement",
  NO_MOVEMENT: "No Movement",
  DRIVER_LOGIN: "Driver Login",
  DRIVER_LOGOUT: "Driver Logout",
  PERIODIC: "Position",
  PERIODIC_WITH_ENGINE_ON: "Position"
};
let trackEventLabels_translations = {
  IGNITION_ON: label.lbl_ignitionon,
  IGNITION_OFF: label.lbl_ignitionoff,
  MOVEMENT: label.lbl_movement,
  NO_MOVEMENT: label.lbl_nomovement,
  DRIVER_LOGIN: label.ud_driverlogin,
  DRIVER_LOGOUT: label.lbl_driverlogout,
  PERIODIC: label.lbl_position,
  PERIODIC_WITH_ENGINE_ON: label.lbl_position
};
export default { traceeventtypes, traceEventTypesMap, traceeventtypes_trl, trackEventLabels, trackEventLabels_translations };