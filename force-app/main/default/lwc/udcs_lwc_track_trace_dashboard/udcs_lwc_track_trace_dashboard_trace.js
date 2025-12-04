import traceSummary from "./udcs_lwc_track_trace_dashboard_traceSummary";
import getTrackingEventsHistory from "@salesforce/apex/udcs_apex_track_trace.getTrackingEventsHistory";
import gettraceSummary from "@salesforce/apex/udcs_apex_track_trace.gettraceSummary";

import label from "./udcs_lwc_track_trace_dashboard_translation";
import { executeParallelActions } from "c/udcs_lwc_ui_service";

import { getLocalNumber, getLocalNumberWithDecimal, setStyle, getLocalFormatedDateTimeInHH, stringUtils } from "c/udcs_lwc_utils";
import configs from "./udcs_lwc_track_trace_dashboard_configs";
async function getTrackingEventsHistorynew(that) {
  that.istrackingEventsHistoryEmpty = true;
  that.istrackdeteSelected = true;
  that.isLoad = false;
  that.isInitialFilter = false;
  let startRange;
  let endRange;
  // let dateFormat = "YYYY-MM-DDTHH:mm:ss.SSS[Z]";
  let rangeType = "";

  // that.calanderpicklistvalue = event.detail.selectOption;
  let fromDate = null;
  let toDate = null;

  if (that.selectedOption !== "odometer") {
    fromDate = moment(`${that.fromDateTime}`);
    toDate = moment(`${that.toDateTime}`);
    that.setSelectedRangeUi(fromDate, toDate, false);
  }

  if (that.selectedOption !== "odometer" && toDate.isSame(new Date(), "day")) {
    // eslint-disable-next-line radix
    if (toDate.format("HH:mm").replaceAll(":", "") > parseInt(moment().format("HH:mm").replaceAll(":", ""))) {
      // eslint-disable-next-line radix
      toDate = toDate.set("hour", parseInt(moment().format("HH")));
      // eslint-disable-next-line radix
      toDate = toDate.set("minute", parseInt(moment().format("mm")));
    }
  }
  if (that.selectedOption !== "odometer") {
    startRange = fromDate.toDate().toISOString();
    endRange = toDate.toDate().toISOString();
    rangeType = "TIME";
  } else {
    startRange = that.startRange;
    endRange = that.endRange;
    rangeType = "ODOMETER";
    that.setSelectedRangeUi(`${getLocalNumber(that.startRange)}km`, `${getLocalNumber(that.endRange)}km`, true);
  }

  that.uniqueEvents = [];
  await executeParallelActions([gettraceSummary({ rangeType: rangeType, startRange: startRange, endRange: endRange, chassisId: that.currentTrackVehicleChassisID, mapScreen: that.selectedOption === "odometer" })], that);
  let result = that.action_data[0];
  if (result.status === "fulfilled") {
    let resultMessage = result?.message;
    result = result.value;
    that.traceSummaryData = result;
    if (that.isMobile) {
      traceSummary.traceSummary(that, result);
    }
    that.postMessage({
      message: true,
      source: "eventTraceSummaryData",
      data: result
    });

    if (that.selectedOption === "odometer" && !stringUtils.isEmptyString(result?.startOdometer)) {
      that.startRange = result?.startOdometer;
      that.endRange = result?.endOdometer;
      that.setSelectedRangeUi(`${getLocalNumber(that.startRange)}km`, `${getLocalNumber(that.endRange)}km`, true);
    }

    if (that.selectedOption === "odometer" && !stringUtils.isEmptyString(resultMessage)) {
      that.isOdoRangeMessage = true;
      that.odoErrorMessage = resultMessage;
    }
  } else {
    that.logToConsoleInfo("Get Trace Summary API - Failed");
  }

  let flag = true;
  let offset = 0;
  let pageLimit = 5000;
  let vehicleEvents = [];
  let flagMobile = false;
  let tempShowToast = false;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    // eslint-disable-next-line no-await-in-loop
    await executeParallelActions(
      [
        getTrackingEventsHistory({
          offset,
          rangeType: rangeType,
          startRange: startRange,
          endRange: endRange,
          chassisId: that.currentTrackVehicleChassisID,
          truckId: that.truckId,
          mapScreen: that.selectedOption === "odometer",
          now: new Date() + ""
        })
      ],
      that
    );
    result = that.action_data[0];
    if (result.status === "fulfilled") {
      flagMobile = true;
      result = result.value;
      tempShowToast = result.endDateInFuture;
      if (result?.pagination?.totalCount !== undefined && result?.pagination?.totalCount !== 0) {
        for (let ve of result.vehicleEvents) {
          if (ve.triggerType.toLowerCase().replaceAll(" ", "") === "seatbelton") {
            ve.triggerType = "seatbeltengaged";
          }
          if (ve.triggerType.toLowerCase().replaceAll(" ", "") === "movingwithseatbeltoff") {
            ve.triggerType = "seatbeltdisengaged";
          }
          vehicleEvents.push(ve);
        }
      }

      offset += pageLimit;
      flag = offset < result?.pagination?.totalCount;
    } else {
      flag = false;
      flagMobile = false;
    }

    let exportFld = that.template.querySelector(".exportFld");

    if (vehicleEvents.length === 0) {
      that.traceExport = that.icons.common.export.light_gray;
      that.isTraceExport = false;
      setStyle(exportFld, "removeClassList", "thb-right-content-green");
      setStyle(exportFld, "addClassList", "thb-right-content-grey");
      that.postEventDetailsMapIcons([]);
      that.isTechnicalIssue = true;
    } else {
      that.isTechnicalIssue = false;
      that.traceExport = that.icons.common.export.turquoise;
      that.isTraceExport = true;
      setStyle(exportFld, "removeClassList", "thb-right-content-grey");
      setStyle(exportFld, "addClassList", "thb-right-content-green");
    }

    if (!flag) {
      that.istrackingEventsHistoryEmpty = true;
      let trackingEventsHistory = vehicleEvents;
      let tempUniqueEvents = new Set();
      let tempDate;
      trackingEventsHistory.map((a) => {
        tempDate = new Date(a.triggerTime);
        a.eventTime = moment(tempDate).format("HH:mm:ss");
        a.eventDateTime = getLocalFormatedDateTimeInHH(tempDate); //moment(tempDate).format("DD/MM/YYYY HH:mm");
        if (a.triggerType) {
          a.traceEventTypeIcon = that.icons.trace.event[a.triggerType.toLowerCase().replaceAll(" ", "")];
        }
        a.hasIcon = configs.traceeventtypes.indexOf(a.triggerType.toLowerCase().replaceAll(" ", "")) !== -1;
        a.triggerTypeMapIcon = a.triggerType;
        return a;
      });

      let temp = new Map();
      let counter = 0;
      that.trackingEvents = [];
      for (let a of trackingEventsHistory) {
        if (a.hasIcon) {
          a.triggerType_trl = configs.traceeventtypes_trl[a.triggerTypeMapIcon.toLowerCase().replaceAll(" ", "")];
          let triggerObj = configs.traceeventtypes.find((v) => v === a.triggerTypeMapIcon.toLowerCase().replaceAll(" ", ""));
          a.trigerType_en = configs.traceEventTypesMap[triggerObj];
          a.show = true;
        } else {
          // console.log('-->', a.triggerType);
          if (a.triggerType === "No Movement") {
            a.triggerType_trl = "No Movement";
          } else if (a.triggerType === "Movement") {
            a.triggerType_trl = "Movement";
          } else {
            a.triggerType_trl = configs.traceeventtypes_trl.position;
          }
          a.trigerType_en = configs.traceEventTypesMap.position;
          a.show = false;
        }
        if (a.triggerType === "Ignition Off" || a.triggerType === "Ignition On") {
          a.hasIcon = false;
          a.triggerTypeMapIcon = "";
        }
        if (a.trigerType_en === "IDLING_STARTED" || a.trigerType_en === "IDLING_ENDED") {
          tempUniqueEvents.add(JSON.stringify({ nameTrl: label.lbl_excessiveidlingstart_end, nameEn: "IDLING_STARTED" }));
        } else if (a.trigerType_en === "OVERSPEEDING_STARTED" || a.trigerType_en === "OVERSPEEDING_ENDED") {
          tempUniqueEvents.add(JSON.stringify({ nameTrl: label.lbl_overspeedingstart_end, nameEn: "OVERSPEEDING_STARTED" }));
        } else if (a.trigerType_en === "OVERREVVING_STATUS_STARTED" || a.trigerType_en === "OVERREVVING_STATUS_ENDED") {
          tempUniqueEvents.add(JSON.stringify({ nameTrl: label.lbl_overrevvingstart_end, nameEn: "OVERREVVING_STATUS_STARTED" }));
        } else if (a.trigerType_en === "SEATBELT_STATUS_WHILE_MOVING_DISENGAGED" || a.trigerType_en === "SEATBELT_STATUS_WHILE_MOVING_ENGAGED") {
          tempUniqueEvents.add(JSON.stringify({ nameTrl: label.lbl_seatbeltengaged_disengaged, nameEn: "SEATBELT_STATUS_WHILE_MOVING_ENGAGED" }));
        } else {
          tempUniqueEvents.add(JSON.stringify({ nameTrl: a.triggerType_trl, nameEn: a.trigerType_en }));
        }

        if (a.position) {
          try {
            a.heading = that
              .getCardinal(parseInt(a.position.heading, 10))
              .split(/(?=[A-Z])/)
              .join(" ");
            a.heading_translated = that.getCardinal_translated(parseInt(a.position.heading, 10));
          } catch (error) {
            a.heading = "-";
            a.heading_translated = "-";
          }
        } else {
          a.heading = "-";
          a.heading_translated = "-";
        }
        let tempDataItems = {};
        tempDataItems = {
          lovVehicleDistanceMeters: a.lovVehicleDistanceMeters,
          lovEngineTimeSeconds: a.lovEngineTimeSeconds,
          speedKilometersPerHour: a.speedKilometersPerHour,
          adBlueLevelPercent: a.adBlueLevelPercent,
          adBlueLevelLowIndicator: a.adBlueLevelLowIndicator,
          totalFuelLevelChangeDieselPercent: a.totalFuelLevelChangeDieselPercent,
          totalFuelLevelDieselPercent: a.totalFuelLevelDieselPercent,
          totalConsumptionDieselLiters: a.totalConsumptionDieselLiters
        };
        if (tempDataItems.speedKilometersPerHour) {
          let evd_temp = Math.round(tempDataItems.speedKilometersPerHour);
          evd_temp = isNaN(evd_temp) ? "-" : parseFloat(evd_temp).toLocaleString() + " " + label.lbl_ud_km_h;
          a.vehicleSpeed = evd_temp;
        } else {
          a.vehicleSpeed = "";
        }
        // try {
        //   a.lovVehicleDistanceMeters = getLocalNumberWithDecimal(tempDataItems.lovVehicleDistanceMeters / 1000) + " " + label.lbl_ud_km;
        // } catch (error) {
        //   a.lovVehicleDistanceMeters = "";
        // }

        tempDate = moment(a.triggerTime);
        if (!temp.get(tempDate.format("DD/MM/YYYY"))) {
          temp.set(tempDate.format("DD/MM/YYYY"), []);
        }
        a.unique_key = tempDate.format("DD/MM/YYYY") + "$" + counter;
        temp.get(tempDate.format("DD/MM/YYYY")).push(a);
        // a.show = true;
        a.triggerDate = tempDate.format("DD/MM/YYYY");
        that.trackingEvents.push(a);
        counter++;
      }
      if (trackingEventsHistory.length !== 0) {
        let isIcon = trackingEventsHistory[0].hasIcon;
        let triggerType = trackingEventsHistory[0].triggerType.toLowerCase().replaceAll(" ", "");
        let icon = that.icons.trace.event["igoff_" + triggerType];
        trackingEventsHistory[0].traceEventTypeIcon = isIcon ? icon : that.icons.trace.event.ignitionoff;
        trackingEventsHistory[0].hasIcon = true;
        trackingEventsHistory[0].triggerTypeMapIcon = isIcon ? "igoff_" + triggerType : "Ignition Off";
        trackingEventsHistory[0].triggerType_trl = configs.traceeventtypes_trl[triggerType];

        isIcon = trackingEventsHistory[trackingEventsHistory.length - 1].hasIcon;
        triggerType = trackingEventsHistory[trackingEventsHistory.length - 1].triggerType.toLowerCase().replaceAll(" ", "");
        icon = that.icons.trace.event["igon_" + triggerType];

        trackingEventsHistory[trackingEventsHistory.length - 1].hasIcon = true;
        trackingEventsHistory[trackingEventsHistory.length - 1].traceEventTypeIcon = isIcon ? icon : that.icons.trace.event.ignitionon;
        trackingEventsHistory[trackingEventsHistory.length - 1].triggerTypeMapIcon = isIcon ? "igon_" + triggerType : "Ignition On";
        trackingEventsHistory[trackingEventsHistory.length - 1].triggerType_trl = configs.traceeventtypes_trl[triggerType];
      }
      tempUniqueEvents = Array.from(tempUniqueEvents);
      tempUniqueEvents.sort();
      for (let a of tempUniqueEvents) {
        let data = JSON.parse(a);
        if (data.nameEn !== "PERIODIC_WITH_ENGINE_ON") that.uniqueEvents.push({ name: data.nameTrl, nameEn: data.nameEn, isSelected: true, isSearched: true });
      }

      trackingEventsHistory = [];

      for (let a of temp.keys()) {
        trackingEventsHistory.push({ key: a, value: temp.get(a), size: temp.get(a).length, eventSize: that.getCount(temp.get(a)), isChurnup: false, show: true });
      }

      if (that.trackingEvents.length) {
        that.prvSelectedTraceEvent = that.trackingEvents[0].unique_key;
      }
      that.trackingEventsHistory = trackingEventsHistory;
      that.istrackingEventsHistoryEmpty = that.trackingEventsHistory.length === 0;
      break;
    }
  }
  that.isShowToast = tempShowToast;
  that.handleTrackMob();
  setTimeout(() => {
    that.isLoad = true;
    if (!flagMobile) {
      that.isEnableShowRouteTraceSummary = false;
    }
    if (that.isMobile) {
      that.postMessage({
        message: true,
        source: "calendarokclicked"
      });
    }
  }, 2000);
}

export default getTrackingEventsHistorynew;