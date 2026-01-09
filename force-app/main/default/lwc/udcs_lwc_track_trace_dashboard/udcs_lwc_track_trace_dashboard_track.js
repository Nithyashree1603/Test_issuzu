import label from "./udcs_lwc_track_trace_dashboard_translation";
import assetsDataNew from "@salesforce/apex/udcs_apex_connect.assetsDataNew";
import udcs_connectx from "@salesforce/resourceUrl/udcs_connectx";
import { executeParallelActions } from "c/udcs_lwc_ui_service";
import configs from "./udcs_lwc_track_trace_dashboard_configs";

import { vehicleDataTransform, getLocalNumber, getLocalFormatedDateTimeInHH } from "c/udcs_lwc_utils";

async function loadAssetData(that) {
  let triggerType = "";
  let triggerTime = "";
  let currentTimeInUTC = moment.utc();
  let speed = "";
  let ignitionStatus = "";
  let hours = "";
  let icon = "";
  let heading = "";
  let heading_translated = "";
  that.allTrackEvents = [];

  await executeParallelActions([assetsDataNew({ now: new Date() + "" })], that);
  that.trackVehicleCount = {
    Moving: 0,
    IgntionOn: 0,
    IgntionOff: 0,
    NonComm: 0
  };

  let result = that.action_data[0];
  if (result.status === "fulfilled") {
    let assetsObj = vehicleDataTransform(result);
    console.log("assetsObj", JSON.stringify(assetsObj));
    that.categories = [{ name: label.lbl_vehicles, count: assetsObj.length }];
    let count = 1;
    let flatVehicleList = [];

    if (assetsObj.length !== 0) {
      that.istogglSidebar = true;
      that.enableSidebar();
    }

    for (let vehicle of assetsObj) {
      try {
        vehicle.name = vehicle.ChassisSeries + "-" + vehicle.ChassisNumber;
        vehicle.marketbasedname = "-";
        if (that.isJS) {
          vehicle.marketbasedname = vehicle.RegistrationNumber || vehicle.ChassisSeries + "-" + vehicle.ChassisNumber;
        } else {
          vehicle.marketbasedname = vehicle.ChassisSeries + "-" + vehicle.ChassisNumber;
        }
        vehicle.key = "vehicle$" + count + vehicle.name;
        count++;
        flatVehicleList.push(vehicle);
        triggerType = vehicle.TriggerType ? vehicle.TriggerType : "-";
        vehicle.triggerType_trl = configs.trackEventLabels_translations[triggerType] || "";
        vehicle.triggerType = configs.trackEventLabels[triggerType] || "";
        triggerTime = vehicle.TriggerTime ? vehicle.TriggerTime : "-";
        vehicle.formattedTriggerDateTime = triggerTime !== "-" ? getLocalFormatedDateTimeInHH(vehicle.TriggerTime) : "-";
        speed = vehicle.WheelBasedSpeedValue !== undefined ? vehicle.WheelBasedSpeedValue : "-";
        ignitionStatus = vehicle.EngineStatus ? vehicle.EngineStatus : "-";
        heading = vehicle.PositionHeading !== undefined ? that.getCardinal(parseInt(vehicle.PositionHeading, 10)) : "-";
        heading_translated = vehicle.PositionHeading !== undefined ? that.getCardinal_translated(parseInt(vehicle.PositionHeading, 10)) : "-";
        try {
          hours = moment.duration(currentTimeInUTC.diff(moment.utc(triggerTime))).asHours();
        } catch (error) {
          hours = 0;
        }
        try {
          icon = that.getVehicleStatus(triggerType, ignitionStatus, hours, speed);
        } catch (error) {
          icon = "NoData";
        }

        if (that.isJS && (["05", "16"].includes(vehicle.ProductClass))) {
          icon = "NoData";
        }
        vehicle.heading_translated = heading_translated;
        vehicle.sidebarIcon = udcs_connectx + "/icons/track_directions/" + icon + ".svg";
        that.trackVehicleCount[icon] = that.trackVehicleCount[icon] + 1;
        vehicle.statusIcon = icon;
        vehicle.fleetStatusLabel = "";
        vehicle.backgroundColor = "";
        if (icon === "Moving") {
          vehicle.fleetStatusLabel = label.lbl_moving;
          vehicle.backgroundColor = "#3D8BF8";
          vehicle.status_cardinal_number = 1;
        } else if (icon === "IgntionOn") {
          vehicle.fleetStatusLabel = label.lbl_ign_on;
          vehicle.backgroundColor = "#11A38B";
          vehicle.status_cardinal_number = 2;
        } else if (icon === "IgntionOff") {
          vehicle.fleetStatusLabel = label.lbl_ign_off;
          vehicle.backgroundColor = "#686766";
          vehicle.status_cardinal_number = 3;
        } else if (icon === "NonComm") {
          vehicle.fleetStatusLabel = label.lbl_non_comm_non_communicating;
          vehicle.backgroundColor = "#EE8C22";
          vehicle.status_cardinal_number = 4;
        } else if (icon === "NoData") {
          vehicle.fleetStatusLabel = label.lbl_nodata;
          vehicle.backgroundColor = "";
          vehicle.status_cardinal_number = 5;
        }

        vehicle.direction_icon = false;
        if (icon === "Moving") {
          icon = icon + heading;
          vehicle.direction_icon = true;
        }
        vehicle.icon = icon;
        vehicle.svgicon = udcs_connectx + "/icons/track_directions/" + icon + ".svg";
        vehicle.heading = heading.split(/(?=[A-Z])/).join(" ");
        vehicle.vin = vehicle?.details?.vin ? vehicle.details.vin : "-";
        vehicle.chassisNumber = vehicle?.ChassisSeries && vehicle?.ChassisNumber ? vehicle.ChassisSeries + "-" + vehicle.ChassisNumber : "-"; //vehicle.name;
        vehicle.registrationNumber = vehicle.RegistrationNumber || "";
        vehicle.triggerTime = vehicle.TriggerTime ? getLocalFormatedDateTimeInHH(vehicle.TriggerTime) : "-"; //getLocalFormatedDateTimeInHH(vehicle.status.triggerTime);
        vehicle.driverName = vehicle.currentDriverFirstName ? vehicle.currentDriverFirstName + " " + vehicle.currentDriverLastName : "-";
        vehicle.diesel = vehicle.FuelLevelValue && vehicle.FuelLevelValue >= 0 && vehicle.FuelLevelValue <= 100 ? getLocalNumber(Math.round(vehicle.FuelLevelValue)) : "-";
        vehicle.FuelLevelValue = vehicle.FuelLevelValue && vehicle.FuelLevelValue >= 0 && vehicle.FuelLevelValue <= 100 ? vehicle.FuelLevelValue : "-";
        vehicle.wheelBasedSpeed =
          vehicle.WheelBasedSpeedValue !== undefined && vehicle.WheelBasedSpeedValue >= 0 && vehicle.WheelBasedSpeedValue <= 110 ? getLocalNumber(Math.round(vehicle.WheelBasedSpeedValue)) : "-";
        vehicle.altitude =
          vehicle.PositionAltitude >= 0 && vehicle.PositionAltitude <= 6700 && vehicle.PositionAltitude !== undefined ? getLocalNumber(parseFloat(vehicle.PositionAltitude).toFixed(2)) : "-";
        vehicle.Odometer =
          vehicle.TotalVehicleDistanceValue >= 0 && vehicle.TotalVehicleDistanceValue / 1000 <= 42614128.63 && vehicle.TotalVehicleDistanceValue !== undefined
            ? getLocalNumber((vehicle.TotalVehicleDistanceValue / 1000).toFixed(2))
            : "-";
        vehicle.odometerSort =
          vehicle.TotalVehicleDistanceValue >= 0 && vehicle.TotalVehicleDistanceValue <= 42614128.63 && vehicle.TotalVehicleDistanceValue !== undefined ? vehicle.TotalVehicleDistanceValue : "-";
        vehicle.location =
          vehicle.PositionLatitude >= -90 && vehicle.PositionLatitude <= 90 && vehicle.PositionLongitude >= -180 && vehicle.PositionLongitude <= 180
            ? vehicle.PositionLatitude + "," + vehicle.PositionLongitude
            : "-";
        if (vehicle.AdBlueLevelValue !== undefined && vehicle.AdBlueLevelValue != null && vehicle.AdBlueLevelValue >= 0 && vehicle.AdBlueLevelValue <= 100) {
          vehicle.Adblue = getLocalNumber(Math.round(vehicle.AdBlueLevelValue));
        } else if (vehicle.EmissionClass === "EURO 3") {
          vehicle.Adblue = "N/A";
        } else {
          vehicle.Adblue = "-";
        }

        vehicle.enginehours = vehicle.TotalEngineHoursValue !== undefined && vehicle.TotalEngineHoursValue >= 0 && vehicle.TotalEngineHoursValue <= 4261412863 ? vehicle.TotalEngineHoursValue : "-";

        vehicle.spanKey = vehicle.key + "temp";
        vehicle.address = "Show Address";
        vehicle.vehicleSpec = vehicle.ModelDescription ? vehicle.ModelDescription : "-";
        vehicle.truckId = vehicle.truckId ? vehicle.truckId : "-";
        vehicle.show = true;
        that.allTrackEvents.push(vehicle);
      } catch (e) {
        that.logToConsoleError(e);
      }
    }

    flatVehicleList.sort(that.compareName);

    that.trackVehicleCount = JSON.parse(JSON.stringify(that.trackVehicleCount));
    that.showtrackMapMarkers();

    that.selectedcategoryvehicles = flatVehicleList;
    if (that.SelectedvehicleFilter !== undefined) {
      let tempCount = 0;
      for (let vehicle of that.selectedcategoryvehicles) {
        if (that.SelectedvehicleFilter === vehicle.statusIcon) {
          vehicle.show = true;
          tempCount++;
        } else {
          vehicle.show = false;
        }
      }
    } else {
      for (let vehicle of that.selectedcategoryvehicles) {
        vehicle.show = true;
      }
    }

    if (that.onload === false) {
      try {
        that.template.querySelector("c-udcs_ffs_fleetstatusoverview").updateAssetsData(that.allTrackEvents);
      } catch (error) {}
    }

    if (that.onload) {
      that.istogglSidebar = true;
      that.enableSidebar();
    }

    that.initialSelectedcategoryvehicles = that.selectedcategoryvehicles;
  }

  that.onload = false;

  that.isLoad = true;
}
export default loadAssetData;