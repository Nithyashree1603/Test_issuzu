/* eslint-disable @lwc/lwc/no-async-operation */
import { LightningElement, track, wire } from "lwc";
import { loadScript } from "lightning/platformResourceLoader";
import getTrackingEventsHistoryExport from "@salesforce/apex/udcs_apex_track_trace.getTrackingEventsHistoryExport";
import isJapanMarket from "@salesforce/apex/udcs_apex_user_auth.isJapanMarket";
import label from "./udcs_lwc_track_trace_dashboard_translation";
import configs from "./udcs_lwc_track_trace_dashboard_configs";
import loadAssetData from "./udcs_lwc_track_trace_dashboard_track";
import getTrackingEventsHistorynew from "./udcs_lwc_track_trace_dashboard_trace";

import getActiveGeofenceForFleet from "@salesforce/apex/udcs_apex_geo_fence.getActiveGeofenceForFleet";
import getActiveGeofenceForVehicle from "@salesforce/apex/udcs_apex_geo_fence.getActiveGeofenceForVehicle";
import { executeParallelActions, executeParallelActionsNew, executeAction } from "c/udcs_lwc_ui_service";
import { getLocalFormatedDate, setStyle, isDebugMode, static_resources, icons, libraries, getCountryName, mobileDeviceCheck, stringUtils } from "c/udcs_lwc_utils";
import udcs_flc_icons from "@salesforce/resourceUrl/udcs_flc_icons";
import user_Info from "@salesforce/apex/udcs_apex_connect.userInfo";
import { NavigationMixin } from "lightning/navigation";

const COMMON_TRIGER = ["MOVEMENT", "NO_MOVEMENT", "PERIODIC_WITH_ENGINE_ON"];

export default class Udcs_lwc_track_trace_dashboard extends NavigationMixin(LightningElement) {
  assetsAPIReloadTime = "03:00";
  assetsAPIReloadTimeInterval = undefined;
  shortID = null;
  longID = null;
  static_resources = static_resources;
  assetDataLoadInterval = 180000;
  icons = icons;
  libraries = libraries;
  action_data = [];
  inputTextbox_placeholder = label.lbl_chassisid + " , " + label.lbl_reg_no + " , " + label.lbl_ud_TruckID + " , " + label.lbl_ud_driver;
  onload = true;
  isClear = false;
  error = "";
  label = label;
  uniqueEvents = [];
  isShowToast = false;

  @track isLoad = false;
  @wire(isJapanMarket) isJapan;
  @track trackingEventsHistory = [];
  trackingEvents = [];
  istrackingEventsHistoryEmpty = true;
  trackingEventsHistoryFromDate_fm = "";
  istrackdeteSelected = false;
  trackingEventsHistoryFromTime = "";
  trackingEventsHistoryToDate = "";
  trackingEventsHistoryToDate_fm = "";
  trackingEventsHistoryToTime = "";
  showtracehistory = false;
  categories = [];
  vfHost = (window.location.origin + "").indexOf("udtrucks.com") === -1 ? "/" + window.location.pathname.split("/")[1] + "/apex/udcs_vsfp_track_trace" : "/apex/udcs_vsfp_track_trace";
  origin = window.location.origin;
  categoryvehicles = {};
  selectedcategoryvehicles = [];
  isShowcategoryvehicles = false;
  selectedcategory = "";
  istogglSidebar = false;
  prvSelectedvehicleFilter = undefined;
  SelectedvehicleFilter = undefined;
  prvSelectedTraceEvent = undefined;
  prvSelectedTrackEvent = undefined;
  initialSelectedcategoryvehicles;
  showTitleMenu = true;
  @track
  trackVehicleCount = {
    Moving: 0,
    IgntionOn: 0,
    IgntionOff: 0,
    NonComm: 0,
    NoData: 0
  };
  allTrackEvents = [];

  _interval;
  currentTrackVehicleChassisID = undefined;
  vehicleSpec = undefined;
  truckId = undefined;
  registrationNumber = undefined;
  filteredEvents;
  isTraceExport = false;
  traceExport = this.icons.common.export.light_gray;
  fromDateTime;
  toDateTime;
  selectedOption;
  SearchText;
  isRenderCal = false;
  close_btn;
  technical_issue;
  isShowMapMenuButtonEvtDetails = false;
  mobileSearchPlaceHolder = label.lbl_ud_chassisplaceholder;

  message = "Swipe Detector";
  showHideList = label.lbl_ud_showlist;
  isSwipeUp = true;

  initialFilter = [];
  isInitialFilter = false;

  isJS = false;

  isMobile = false;

  isTechnicalIssue = false;
  traceSummaryData;
  isOdoRangeMessage = false;
  odoErrorMessage = "";
  summaryDistanceCovered;
  summaryTotalFuelConsumed;
  summaryMaximumSpeed;
  summaryTotalFE;
  summaryTotalEH;

  isEnableShowRouteTraceSummary = false;
  summaryFrom;
  summaryTo;
  startRange = "";
  endRange = "";
  isShowTraceHistoryModal = false;
  isShowEventsHistory = false;
  isMobileLoad = true;
  isShowRouteSummary = false;
  innerHeight = 0;

  setIcons() {
    this.close_btn = udcs_flc_icons + "/close_btn.svg";
    this.technical_issue = udcs_flc_icons + "/technical_issue.svg";
  }

  handleSwipe() {
    if (this.isSwipeUp && this.isMobile) {
      this.template.querySelector(".track_trace_vehiclecontainer").classList.add("swipe_up");
      this.template.querySelector(".track_trace_vehicle_dropdown_body").style.display = "block";
      this.template.querySelector(".track_trace_dropdown_body").style.display = "flex";
      this.template.querySelector(".track_trace_vehicle_category_group").style.display = "block";
      this.template.querySelector(".track_trace_ffs_sidebar_search_container").style.position = "absolute";
      this.template.querySelector(".track_trace_vehicle_dropdown_swiper").style.position = "relative";
      this.showHideList = label.lbl_ud_hidelist;
    } else {
      this.template.querySelector(".track_trace_vehiclecontainer").classList.remove("swipe_up");
      this.template.querySelector(".track_trace_vehicle_dropdown_body").style.display = "none";
      this.template.querySelector(".track_trace_dropdown_body").style.display = "none";
      this.template.querySelector(".track_trace_vehicle_category_group").style.display = "none";
      this.template.querySelector(".track_trace_ffs_sidebar_search_container").style.position = "absolute";
      this.template.querySelector(".track_trace_vehicle_dropdown_swiper").style.position = "absolute";
      this.showHideList = label.lbl_ud_showlist;
    }
    this.isSwipeUp = !this.isSwipeUp;
    this.setAppHeight();
  }

  openSidebar(event) {
    event.stopPropagation();
    this.istogglSidebar = false;
    this.isShowMapMenuButton = false;
    this.postMessage({
      message: true,
      source: "openvehicledetailssidebar"
    });
  }

  openVehicles() {
    this.template.querySelector(".track_trace_vehiclecontainer").classList.add("swipe_up");
    this.template.querySelector(".track_trace_vehicle_dropdown_body").style.display = "block";
    this.template.querySelector(".track_trace_dropdown_body").style.display = "flex";
    this.template.querySelector(".track_trace_vehicle_category_group").style.display = "block";
    this.template.querySelector(".track_trace_vehicle_dropdown_swiper").style.position = "relative";
    if (this.isMobile) {
      this.template.querySelector(".track_trace_ffs_sidebar_search_container").style.position = "absolute";
      this.template.querySelector(".track_trace_ffs_sidebar_search_container").style.zIndex = 1;
      this.template.querySelector(".track_trace_vehicle_dropdown_swiper").style.zIndex = 1;
      this.template.querySelector(".vfFrame").style.position = "relative";
      this.template.querySelector(".vfFrameparent").style.zIndex = "0";
      this.showHideList = label.lbl_ud_hidelist;
      this.isSwipeUp = false;
    } else {
      this.template.querySelector(".track_trace_ffs_sidebar_search_container").style.position = "relative";
    }
  }

  searchVehicles() {
    this.SearchText = this.template.querySelector(`[data-value="searchVehicles"]`).value.toUpperCase().trim();
    let temp = [];
    for (let cat of this.selectedcategoryvehicles) {
      if (!this.SearchText) {
        cat.vechicles.map((vehicle) => {
          vehicle.show = true;
          if (this.SelectedvehicleFilter) {
            vehicle.show = this.SelectedvehicleFilter && this.SelectedvehicleFilter === vehicle.statusIcon;
          }
        });
      } else {
        if (cat.show === true) {
          cat.vechicles.map((vehicle) => {
            vehicle.show =
              this.isJS && vehicle.RegistrationNumber != null
                ? vehicle.RegistrationNumber?.toUpperCase()?.trim()?.indexOf(this.SearchText) > -1
                : vehicle.RegistrationNumber?.toUpperCase()?.trim()?.indexOf(this.SearchText) > -1 ||
                  (vehicle.ChassisSeries + "-" + vehicle.ChassisNumber)?.toUpperCase()?.trim()?.indexOf(this.SearchText) > -1 ||
                  vehicle.truckId?.toUpperCase()?.trim()?.indexOf(this.SearchText) > -1;

            if (vehicle.show && this.SelectedvehicleFilter) {
              vehicle.show = this.SelectedvehicleFilter && this.SelectedvehicleFilter === vehicle.statusIcon;
            }
          });
        }
      }

      temp.push(cat);
    }
    this.selectedcategoryvehicles = temp;
    if (this.SearchText) {
      this.isClear = true;
    } else if (this.template.querySelector(`[data-value="searchVehicles"]`).value === "") {
      this.isClear = false;
    }
  }

  clearSearch() {
    this.template.querySelector("input.ffs_sidebar_search").value = "";
    this.searchVehicles();
    this.isClear = false;
  }

  toggleTraceEventsByDate(event) {
    for (let a of this.trackingEventsHistory) {
      if (a.key === event.currentTarget.dataset.value) {
        a.isChurnup = !a.isChurnup;
      }
    }
    this.trackingEventsHistory = [...this.trackingEventsHistory];
  }

  selectedValueFilter(event) {
    if (this.filteredEvents && event.detail && event.detail.list) {
      let tempEventSet = new Set(JSON.parse(JSON.stringify(event.detail.list)));
      for (let a of event.detail.list) {
        if (a === "IDLING_STARTED") {
          tempEventSet.add("IDLING_STARTED");
          tempEventSet.add("IDLING_ENDED");
        } else if (a === "OVERSPEEDING_STARTED") {
          tempEventSet.add("OVERSPEEDING_STARTED");
          tempEventSet.add("OVERSPEEDING_ENDED");
        } else if (a === "OVERREVVING_STATUS_STARTED") {
          tempEventSet.add("OVERREVVING_STATUS_STARTED");
          tempEventSet.add("OVERREVVING_STATUS_ENDED");
        } else if (a === "SEATBELT_STATUS_WHILE_MOVING_ENGAGED") {
          tempEventSet.add("SEATBELT_STATUS_WHILE_MOVING_ENGAGED");
          tempEventSet.add("SEATBELT_STATUS_WHILE_MOVING_DISENGAGED");
        } else if (this.filteredEvents.indexOf(a) !== -1) {
          tempEventSet.add(a);
        }
      }
      if (Array.from(tempEventSet).sort().join() === this.filteredEvents.sort().join()) {
        return;
      }
    }
    if (this.prvSelectedTraceEvent) {
      setStyle(this.template.querySelector(`[data-value="${this.prvSelectedTraceEvent}"`), "removeClassList", "SelectedTraceEvent");
    }
    this.filteredEvents = JSON.parse(JSON.stringify(event.detail.list));
    let tempUniqueEvents = [...this.filteredEvents];
    for (let a of [...this.filteredEvents]) {
      if (a === "IDLING_STARTED") {
        tempUniqueEvents.push("IDLING_ENDED");
      } else if (a === "OVERSPEEDING_STARTED") {
        tempUniqueEvents.push("OVERSPEEDING_ENDED");
      } else if (a === "OVERREVVING_STATUS_STARTED") {
        tempUniqueEvents.push("OVERREVVING_STATUS_ENDED");
      } else if (a === "SEATBELT_STATUS_WHILE_MOVING_ENGAGED") {
        tempUniqueEvents.push("SEATBELT_STATUS_WHILE_MOVING_DISENGAGED");
      }
    }
    this.filteredEvents = tempUniqueEvents;
    if (!this.isInitialFilter) {
      this.initialFilter = this.filteredEvents;
      this.isInitialFilter = true;
    }
    if (!(this.initialFilter.length === 0)) tempUniqueEvents = tempUniqueEvents.length === 0 ? this.initialFilter : tempUniqueEvents;
    let temptrackingEvents = [];
    let temptrackingEvents_eventDetailsPanel = [];
    let trackingEventsHistory = this.trackingEventsHistory;
    for (let a of trackingEventsHistory) {
      let tempCount = 0;
      for (let b of a.value) {
        if (tempUniqueEvents.indexOf(b.trigerType_en) !== -1) {
          tempCount++;
          temptrackingEvents.push(b);
          temptrackingEvents_eventDetailsPanel.push(b);
          b.show = true;
        } else {
          temptrackingEvents.push(b);
          b.show = false;
        }
      }
      a.size = tempCount;
      a.show = a.size !== 0;
    }

    if (tempUniqueEvents.length === 0) {
      temptrackingEvents = [];
      temptrackingEvents_eventDetailsPanel = [];
      for (let a of trackingEventsHistory) {
        for (let b of a.value) {
          b.show = configs.traceeventtypes.indexOf(b.triggerType.toLowerCase().replaceAll(" ", "")) !== -1;
          temptrackingEvents.push(b);
          temptrackingEvents_eventDetailsPanel.push(b);
        }
        a.size = a.value.length;
        a.show = a.size !== 0;
      }
    }

    this.postEventDetailsMapIcons(temptrackingEvents);
    try {
      if (temptrackingEvents_eventDetailsPanel.length) {
        this.postEventDetailsPanel(temptrackingEvents_eventDetailsPanel[0].unique_key, this.getTrackingEvents(temptrackingEvents_eventDetailsPanel));
        if (this.template.querySelector(`[data-value="${temptrackingEvents_eventDetailsPanel[0].unique_key}"`)) {
          this.template.querySelector(`[data-value="${temptrackingEvents_eventDetailsPanel[0].unique_key}"`).classList.add("SelectedTraceEvent");
        }
        this.prvSelectedTraceEvent = temptrackingEvents_eventDetailsPanel[0].unique_key;
      }
      this.trackingEventsHistory = [...trackingEventsHistory];
      this.uniqueEvents = [...this.uniqueEvents];
      if (this.isMobile) {
        this.postMessage({ message: true, source: "hideeventdetailspanel" });
      }
    } catch (error) {}
  }

  getCardinal(angle) {
    return angle >= 0 && angle <= 360 ? ["North", "NorthEast", "East", "SouthEast", "South", "SouthWest", "West", "NorthWest"][Math.floor((angle % 360) / 45)] : "-";
  }

  getCardinal_translated(angle) {
    return angle >= 0 && angle <= 360
      ? [label.lbl_north, label.lbl_northeast, label.lbl_east, label.lbl_southeast, label.lbl_south, label.lbl_southwest, label.lbl_west, label.lbl_northwest][Math.floor((angle % 360) / 45)]
      : "-";
  }

  disableSidebar() {
    this.template.querySelector('[data-id="vfFrame"]')?.classList.add("iframefullwidth");
    this.template.querySelector('[data-id="vfFrameparent"]')?.classList.add("iframefullwidth");
    this.template.querySelector('[data-id="vfFrame"]')?.classList.remove("iframefullwidthwithsidebar");
    this.template.querySelector('[data-id="vfFrameparent"]')?.classList.remove("iframefullwidthwithsidebar");
  }

  enableSidebar() {
    this.template.querySelector('[data-id="vfFrame"')?.classList.remove("iframefullwidth");
    this.template.querySelector('[data-id="vfFrameparent"')?.classList.remove("iframefullwidth");
  }

  async handleResponse(message) {
    if (message.data.source === "closeTrackSidebar") {
      if (!this.istogglSidebar) {
        this.disableSidebar();
      }
    } else if (message.data.source === "showtrackMapMarkers") {
      await this.loadLocation();
      loadAssetData(this);
    } else if (message.data.source === "showtracehistory") {
      try {
        clearInterval(this._interval);
      } catch (error) {
        this.logToConsoleError(error);
      }
      try {
        clearInterval(this.assetsAPIReloadTimeInterval);
      } catch (error) {}
      this.assetsAPIReloadTime = "";
      this.showtracehistory = true;
      this.istrackdeteSelected = false;
      this.trackingEventsHistoryFromTime = "";
      this.trackingEventsHistoryToDate = "";
      this.trackingEventsHistoryToDate_fm = "";
      this.trackingEventsHistoryToTime = "";
      this.uniqueEvents = [];
    } else if (message.data.source === "SelectedTraceEventhighlight") {
      if (this.prvSelectedTraceEvent) {
        setStyle(this.template.querySelector(`[data-value="${this.prvSelectedTraceEvent}"`), "removeClassList", "SelectedTraceEvent");
      }

      this.template.querySelector(`[data-value="${message.data.data}"`)?.classList.add("SelectedTraceEvent");

      try {
        let element = this.template.querySelector(`[data-value="${message.data.data}"`)?.offsetTop;
        let topPos = element.offsetTop;
        this.template.querySelector(".track_trace_event_item_cotainer").scrollTop = topPos - 500;
      } catch (error) {}
      this.prvSelectedTraceEvent = message.data.data;
      if (message.data.highlightbottompannel) {
        let temptrackingEvents = [];
        for (let a of this.trackingEventsHistory) {
          for (let b of a.value) {
            if (b.show) temptrackingEvents.push(b);
          }
        }
        this.postEventDetailsPanel(message.data.data, temptrackingEvents);
      }
    } else if (message.data.source === "SelectedTrackEventhighlight") {
      try {
        this.istogglSidebar = true;
        this.enableSidebar();
        this.categoryHandleClick({
          currentTarget: {
            dataset: {
              value: label.lbl_vehicles
            }
          }
        });
        this.categoryvehicles[label.lbl_vehicles].Connected.isChurnup = false;
        if (this.SelectedvehicleFilter !== undefined) {
          for (let cat of this.selectedcategoryvehicles) {
            cat.isChurnup = true;
            let tempCount = 0;
            cat.show = false;
            for (let vehicle of cat.vechicles) {
              if (this.SelectedvehicleFilter === vehicle.statusIcon) {
                vehicle.show = true;
                cat.show = true;
                tempCount++;
              } else {
                vehicle.show = false;
              }
            }
            if (cat.name === label.lbl_connected_default) {
              cat.show = true;
            }
            cat.count = tempCount;
          }
        }
        this.categoryvehicles[label.lbl_vehicles].Connected.isChurnup = false;
      } catch (error) {
        this.logToConsoleError(error);
      }
      try {
        if (this.prvSelectedTrackEvent) {
          this.template.querySelector(`[data-value="${this.prvSelectedTrackEvent}"`).classList.remove("SelectedTraceEvent");
        }
      } catch (error) {
        this.logToConsoleError(error);
      }
      try {
        this.template.querySelector(`[data-value="${message.data.data}"`)?.classList?.add("SelectedTraceEvent");
        if (this.template.querySelector(`[data-value="${message.data.data}"`)) {
          let element = this.template.querySelector(`[data-value="${message.data.data}"`);
          let topPos = element.offsetTop;
          if (this.template.querySelector(".track_trace_event_item_cotainer")) {
            this.template.querySelector(".track_trace_event_item_cotainer").scrollTop = topPos - 500;
          }
        }
      } catch (error) {
        this.logToConsoleError(error);
      }
      this.prvSelectedTrackEvent = message.data.data;
      if (message.data.data === "GOOGLE_MARKER") {
        return;
      }
      let currentTrackVehicleData = this.categoryvehicles[label.lbl_vehicles].Connected.vechicles.filter((a) => a.name === message.data.name)[0];
      this.postMessage({
        message: true,
        source: "vehicledashboardsidebar",
        vechicleData: currentTrackVehicleData,
        isJapan: this.isJS,
        cameFrom: "map"
      });
      this.longID = currentTrackVehicleData.longID;
      this.shortID = currentTrackVehicleData.shortID;
      this.currentTrackVehicleChassisID = currentTrackVehicleData.chassisNumber;
      if (this.isMobile) {
        this.showTitleMenu = false;
      } else {
        this.showTitleMenu = true;
      }
      this.setAppHeight();
    } else if (message.data.source === "initiateShowCalender" && message.data.open) {
      this.clearSelectedValue();
      this.showCalandar();
    } else if (message.data.source === "showGeofences") {
      try {
        await executeParallelActionsNew([getActiveGeofenceForFleet()], this);
        let result = this.action_data[0];
        if (result.status === "fulfilled") {
          this.postMessage({
            message: true,
            source: "geofenceshownontrack",
            data: JSON.stringify(result)
          });
        } else console.error(result.reason);
      } catch (err) {
        console.log(err);
      }
    } else if (message.data.source === "showVehicleGeofences") {
      const vehicleId = message.data.data;
      try {
        await executeParallelActionsNew([getActiveGeofenceForVehicle({ id: vehicleId })], this);
        let result = this.action_data[0];
        console.log(JSON.stringify(result));
        if (result.status === "fulfilled") {
          this.postMessage({
            message: true,
            source: "geofenceshownontrace",
            data: JSON.stringify(result)
          });
        } else console.error(result.reason);
      } catch (err) {
        console.log(err);
      }
    }
  }

  traceBackbtn() {
    this.assetsAPIReloadTime = "03:00";
    this.isShowEventsHistory = false;
    this.isEnableShowRouteTraceSummary = false;
    this.isShowRouteSummary = false;
    this.startTimer();
    this.traceExport = this.icons.common.export.light_gray;
    try {
      if (!this.isMobile) {
        // eslint-disable-next-line @lwc/lwc/no-async-operation
        this._interval = setInterval(() => {
          loadAssetData(this);
          this.startTimer();
        }, this.assetDataLoadInterval);
      }
    } catch (error) {
      this.logToConsoleError(error);
    }
    this.showtracehistory = false;
    this.trackingEventsHistory = [];
    this.istrackingEventsHistoryEmpty = true;
    this.postMessage({
      message: true,
      source: "closeCalandar"
    });
    this.showtrackMapMarkers();
    setTimeout(() => {
      this.openVehicles();
    }, 0);
  }

  togglSidebar_fn() {
    if (this.categories.length) {
      this.istogglSidebar = !this.istogglSidebar;
      if (!this.istogglSidebar) {
        this.disableSidebar();
        this.isShowcategoryvehicles = true;
      } else {
        this.enableSidebar();
      }
    }
  }

  vehicleFilter(evt) {
    if (evt.currentTarget.dataset.value === this.prvSelectedvehicleFilter) {
      this.template.querySelector(`[data-value="${evt.currentTarget.dataset.value}"`).classList.remove("SelectedTraceEvent");
      this.prvSelectedvehicleFilter = undefined;
      this.SelectedvehicleFilter = undefined;
    } else {
      if (this.prvSelectedvehicleFilter) {
        this.template.querySelector(`[data-value="${this.prvSelectedvehicleFilter}"`).classList.remove("SelectedTraceEvent");
      }
      this.template.querySelector(`[data-value="${evt.currentTarget.dataset.value}"`).classList.add("SelectedTraceEvent");
      this.SelectedvehicleFilter = evt.currentTarget.dataset.value;
      this.prvSelectedvehicleFilter = evt.currentTarget.dataset.value;
    }
    this.selectedcategoryvehicles = this.categoryvehicles[this.selectedcategory] || [];
    this.selectedcategoryvehicles = Object.values(this.selectedcategoryvehicles);
    if (this.SelectedvehicleFilter !== undefined) {
      for (let cat of this.selectedcategoryvehicles) {
        cat.isChurnup = true;
        let tempCount = 0;
        cat.show = false;
        for (let vehicle of cat.vechicles) {
          if (this.SelectedvehicleFilter === vehicle.statusIcon) {
            vehicle.show = true;
            cat.show = true;
            tempCount++;
          } else {
            vehicle.show = false;
          }
        }
        if (cat.name === label.lbl_connected_default) {
          cat.show = true;
        }
        cat.count = tempCount;
      }
    } else {
      for (let cat of this.selectedcategoryvehicles) {
        cat.isChurnup = true;
        cat.show = true;
        let tempCount = 0;
        for (let vehicle of cat.vechicles) {
          vehicle.show = true;
          tempCount++;
        }
        cat.count = tempCount;
      }
    }
    if (Object.keys(this.categoryvehicles[label.lbl_vehicles]).length === 1) {
      this.categoryvehicles[label.lbl_vehicles].Connected.isChurnup = false;
    }
    this.postMessage({
      data: this.SelectedvehicleFilter,
      source: "SelectedvehicleFilter"
    });
    this.trackVehicleCount = JSON.parse(JSON.stringify(this.trackVehicleCount));
  }

  traceeventdetails(evt) {
    this.isMobileLoad = false;
    if (this.prvSelectedTraceEvent) {
      setStyle(this.template.querySelector(`[data-value="${this.prvSelectedTraceEvent}"`), "removeClassList", "SelectedTraceEvent");
    }
    try {
      this.template.querySelector(`[data-value="${evt.currentTarget.dataset.value}"`).classList.add("SelectedTraceEvent");
    } catch (error) {
      console.log(error);
    }

    let temptrackingEvents = [];
    for (let a of this.trackingEventsHistory) {
      for (let b of a.value) {
        if (b.show) temptrackingEvents.push(b);
      }
    }
    this.postEventDetailsPanel(evt.currentTarget.dataset.value, temptrackingEvents, true);
    this.prvSelectedTraceEvent = evt.currentTarget.dataset.value;
    if (this.isMobile) {
      this.isShowEventsHistory = false;
      this.isEnableShowRouteTraceSummary = false;
      this.template.querySelector(".track_trace_tracehistory").style.display = "none";
      this.template.querySelector(".vfFrameparent").style.position = "fixed";
      this.template.querySelector(".vfFrameparent").style.top = 0;
      this.template.querySelector(".track_trace_container").style.height = "auto";
      setTimeout(() => {
        this.postMessage({
          message: true,
          source: "traceEventsClicked"
        });
        this.isMobileLoad = true;
      }, 2000);
    }
  }

  openVehicleDetailsPanel(evt) {
    if (this.prvSelectedTrackEvent) {
      setStyle(this.template.querySelector(`[data-value="${this.prvSelectedTrackEvent}"`), "removeClassList", "SelectedTraceEvent");
    }
    this.template.querySelector(`[data-value="${evt.currentTarget.dataset.value}"`).classList.add("SelectedTraceEvent");
    this.prvSelectedTrackEvent = evt.currentTarget.dataset.value;
    let currentTrackVehicleData = this.categoryvehicles[label.lbl_vehicles].Connected.vechicles.filter((a) => a.name === evt.currentTarget.dataset.name)[0];
    currentTrackVehicleData.triggerTime = moment(currentTrackVehicleData.TriggerTime).format("DD/MM/YYYY HH:ss");
    this.postMessage({
      message: true,
      source: "vehicledashboardsidebar",
      vechicleData: currentTrackVehicleData,
      isJapan: this.isJapan.data,
      cameFrom: "sidebar"
    });
    this.longID = currentTrackVehicleData.longID;
    this.shortID = currentTrackVehicleData.shortID;
    this.currentTrackVehicleChassisID = currentTrackVehicleData.chassisNumber;
    this.vehicleSpec = currentTrackVehicleData.ModelDescription ? currentTrackVehicleData.ModelDescription : "-";
    this.truckId = currentTrackVehicleData.truckId ? currentTrackVehicleData.truckId : "-";
    this.registrationNumber = currentTrackVehicleData.RegistrationNumber ? currentTrackVehicleData.RegistrationNumber : "-";
    if (this.isMobile) {
      this.togglSidebar_fn();
      this.template.querySelector(".vfFrameparent").style.zIndex = "0";
      this.postMessage({
        message: true,
        source: "zoomvehicle"
      });
      this.showTitleMenu = false;
      this.setAppHeight();
    }
  }

  async connectedCallback() {
    this.isMobile = mobileDeviceCheck();

    this.setIcons();
    this.template.addEventListener("udcs_pagetitle_bar", this.togglSidebar_fn.bind(this));
    this.categoryvehicles[label.lbl_vehicles] = {};
    this.categoryvehicles[label.lbl_vehicles].Connected = { name: label.lbl_connected_default, count: 0, key: "Connected", isChurnup: true, vechicles: [] };
    loadScript(this, this.libraries.moment.v1_0)
      .then(() => {})
      .catch((error) => {
        this.logToConsoleError(error);
        this.isLoadReady = true;
      });

    await isJapanMarket()
      .then((a) => {
        this.isJS = a;
      })
      .catch(() => {});

    if (!this.isMobile) {
      // eslint-disable-next-line @lwc/lwc/no-async-operation
      this._interval = setInterval(() => {
        loadAssetData(this);
        this.startTimer();
        this.isLoadReady = true;
      }, this.assetDataLoadInterval);
      this.startTimer();
    }

    window.addEventListener("message", this.handleResponse.bind(this), false);
    window.addEventListener("message", this.closeAndToggle.bind(this), false);
    window.addEventListener("message", this.mapEventsClicked.bind(this), false);

    this[NavigationMixin.Navigate]({
      type: "comm__namedPage",
      attributes: {
        name: "MUF_Dashboard__c"
      },
      state: {
        page: "udcs_map_dashbaord"
      }
    });
    setTimeout(() => {
      if (this.isMobile) {
        this.innerHeight = window.innerHeight;
       //console.log("this.innerHeight", this.innerHeight);
        //console.log("Hi");
        window.addEventListener("resize", this.appHeight);
        this.appHeight();
      }
    }, 0);

    this.isLoadReady = true;
  }

  appHeight() {
    let doc = this.template.querySelector(".track_trace_container");
    doc.style.setProperty("height", `calc(100dvh - 122px)`);
  }

  setAppHeight() {
    try {
      if (this.isMobile) {
        if (this.showTitleMenu) {
          let doc = this.template.querySelector(".track_trace_container");
          doc.style.setProperty("height", `calc(100dvh - 122px)`);
        } else {
          let doc = this.template.querySelector(".track_trace_container");
          doc.style.setProperty("height", `calc(100dvh - 72px)`);
        }
      }
    } catch (error) {
      console.log(error);
    }
  }
  compareName(a, b) {
    const name1 = a.name.toUpperCase();
    const name2 = b.name.toUpperCase();

    let comparison = 0;

    if (name1 > name2) {
      comparison = 1;
    } else if (name1 < name2) {
      comparison = -1;
    }
    return comparison;
  }

  @track isShowMapMenuButton = false;
  closeAndToggle(message) {
    if (this.isMobile && message.data.source === "closeVehicleDetailsPanel") {
      this.isMobileLoad = false;

      this.istogglSidebar = true;

      setTimeout(() => {
        this.isMobileLoad = true;
        this.template.querySelector(".track_trace_vehicle_dropdown_swiper").style.zIndex = 1;
        this.template.querySelector(".mobile_search").style.zIndex = 1;
        this.isSwipeUp = false;
        this.handleSwipe();
        this.showTitleMenu = true;
        this.setAppHeight();
      }, 500);
    }
    if (this.isMobile) {
      if (message.data.source === "SelectedTrackEventhighlight") {
        this.istogglSidebar = false;
      }

      if (message.data.source === "backToSidebar") {
        this.istogglSidebar = true;
        //console.log("message.data.cameFrom", message.data.cameFrom);
        setTimeout(() => {
          if (message.data.cameFrom === "sidebar") {
            this.openVehicles();
            this.template.querySelector(".track_trace_ffs_sidebar_search_container.mobile_search").style.zIndex = 1;
            this.template.querySelector(".track_trace_vehicle_dropdown_swiper").style.zIndex = 1;
            this.template.querySelector(".vfFrameparent").style.zIndex = 0;
            this.showTitleMenu = true;
          } else {
            this.openVehicles();
            this.showHideList = label.lbl_ud_showlist;
            this.isSwipeUp = false;
            this.handleSwipe();
            this.template.querySelector(".track_trace_ffs_sidebar_search_container.mobile_search").style.zIndex = 1;
            this.template.querySelector(".track_trace_vehicle_dropdown_swiper").style.zIndex = 1;
            this.template.querySelector(".vfFrameparent").style.zIndex = 0;
            this.showTitleMenu = true;
          }
          this.setAppHeight();
          this.postMessage({
            data: this.SelectedvehicleFilter,
            source: "backToSidebar_SelectedvehicleFilter"
          });
        }, 0);
      }

      if (message.data.source === "opensidebar") {
        this.istogglSidebar = true;
      }
      if (message.data.source === "backButtonEventDetailsPanel") {
        this.isMobileLoad = false;
        this.isShowEventsHistory = false;
        this.isEnableShowRouteTraceSummary = true;
        this.template.querySelector(".track_trace_tracehistory").style.display = "block";
        this.template.querySelector(".vfFrameparent").style.position = "unset";
        setTimeout(() => {
          this.postMessage({
            message: true,
            source: "hideeventdetailspanel"
          });
          this.isMobileLoad = true;
        }, 2000);
      }
      if (message.data.source === "locButtonEventDetailsPanel") {
        this.isMobileLoad = false;
        this.isShowEventsHistory = false;
        this.isEnableShowRouteTraceSummary = true;
        this.template.querySelector(".track_trace_tracehistory").style.display = "block";
        this.template.querySelector(".vfFrameparent").style.position = "unset";
        this.postMessage({
          message: true,
          source: "hideeventdetailspanel"
        });
        setTimeout(() => {
          this.isMobileLoad = true;
        }, 1000);
      }
    }
  }
  mapEventsClicked(message) {
    //console.log("mapEventsClicked", message.data.source);
    if (message.data.source === "SelectedTraceEventhighlight_mobile" && this.isMobile) {
      this.traceeventdetails(message.data.data);
    }
  }
  openEvtDetails() {
    this.isShowMapMenuButtonEvtDetails = false;
    this.template.querySelector(".vfFrame").style.position = "fixed";
    this.postMessage({
      message: true,
      source: "openEventDetailsPanel"
    });
  }
  setSelectedRangeUi(fromRange, toRange, isEmpty) {
    this.trackingEventsHistoryFromDate_fm = isEmpty ? fromRange : getLocalFormatedDate(fromRange);
    this.trackingEventsHistoryFromTime = isEmpty ? "" : fromRange.format("HH:mm");
    this.trackingEventsHistoryToDate_fm = isEmpty ? toRange : getLocalFormatedDate(toRange);
    this.trackingEventsHistoryToTime = isEmpty ? "" : toRange.format("HH:mm");
  }

  closeSessionLimitPopup() {
    this.isOdoRangeMessage = false;
  }

  getTrackingEvents(data) {
    if (stringUtils.isEmpty(data) || data.length === 0) {
      return [];
    }
    let filtedData = data.filter((trace) => trace.triggerType !== "Position");

    return filtedData;
  }

  getCount(data) {
    if (stringUtils.isEmpty(data) || data.length === 0) {
      return 0;
    }

    let filtedData = data.filter((trace) => trace.show);

    return filtedData.length;
  }

  // Utility Methods --------------------------------------//
  /**
   * Hide calendar
   */
  handleCalendarClose() {
    this.isRenderCal = false;
  }
  handleOkClick(event) {
    this.filteredEvents = [];
    try {
      if (this.isMobile) {
        this.isMobileLoad = false;
      }
      this.fromDateTime = event.detail.fromDateTime;
      this.toDateTime = event.detail.toDateTime;
      this.selectedOption = event.detail.option;
      this.summaryFrom = moment(this.fromDateTime).format("DD/MM/YYYY HH:ss");
      this.summaryTo = moment(this.toDateTime).format("DD/MM/YYYY HH:ss");
      getTrackingEventsHistorynew(this);
      this.handleCalendarClose();
    } catch (error) {
      this.logToConsoleError(error);
    }
  }

  handleTrackMob() {
    if (this.isMobile) {
      this.isEnableShowRouteTraceSummary = true;
      setTimeout(() => {
        //console.log('HandleTrackMobile')
        this.template.querySelector(".track_trace_tracehistory").style.display = "block";
        this.template.querySelector(".vfFrameparent").style.zIndex = "0";
        this.postMessage({
          message: true,
          source: "mobileokclick"
        });
        this.isMobileLoad = true;
      }, 6000);
    }
  }

  handleOdoClick(event) {
    try {
      this.startRange = event.detail.odoStartRange;
      this.endRange = event.detail.odoEndRange;
      this.selectedOption = event.detail.option;
      getTrackingEventsHistorynew(this);
      this.handleCalendarClose();
      this.handleTrackMob();
    } catch (error) {
      this.logToConsoleInfo(error);
    }
  }

  showCalandar() {
    try {
      this.isRenderCal = !this.isRenderCal;
      if (this.isRenderCal) {
        setTimeout(() => {
          let cal = this.template.querySelector("c-udcs_lwc_calender_v1");
          if (this.selectedOption === "odometer") {
            cal.setOdoStartEndRange(this.startRange, this.endRange, this.selectedOption);
          } else {
            cal.setSelectedDateTime(this.fromDateTime, this.toDateTime, this.selectedOption);
          }
        }, 300);
      }
    } catch (error) {
      this.logToConsoleError(error);
    }
  }

  clearSelectedValue() {
    this.selectedOption = "";
    this.fromDateTime = "";
    this.toDateTime = "";
  }

  renderedCallback() {
    if (this.template.querySelector(`[data-value="${this.prvSelectedTraceEvent}"`)) {
      setStyle(this.template.querySelector(`[data-value="${this.prvSelectedTraceEvent}"`), "addClassList", "SelectedTraceEvent");
    }
    try {
      this.template.querySelector(`[data-value="${this.SelectedvehicleFilter}"`).classList.add("SelectedTraceEvent");
    } catch (e) {}
    this.addRangeBorder();
  }

  addRangeBorder() {
    const range = this.template.querySelector(".track_trace_range-box");
    let iconElm = this.template.querySelector(".track_trace_range_icon");
    if (this.isRenderCal) {
      if (range) {
        setStyle(range, "addClassList", "border");
      }
      if (iconElm) {
        setStyle(iconElm, "addClassList", "rotate");
      }
    } else {
      if (range) {
        setStyle(range, "removeClassList", "border");
      }
      if (iconElm) {
        setStyle(iconElm, "removeClassList", "rotate");
      }
    }
  }

  disconnectedCallback() {
    try {
      clearInterval(this._interval);
    } catch (error) {
      this.logToConsoleError(error);
    }
    try {
      clearInterval(this.assetsAPIReloadTimeInterval);
    } catch (e) {}
    this.unloadIframe();
  }

  showtrackMapMarkers() {
    this.postMessage({
      message: true,
      source: "showtrackMapMarkers",
      data: this.categoryvehicles,
      isJapan: this.isJS
    });
  }

  categoryHandleClick(evt) {
    this.isShowcategoryvehicles = true;
    this.selectedcategoryvehicles = this.categoryvehicles[evt.currentTarget.dataset.value] || [];
    this.selectedcategoryvehicles = Object.values(this.selectedcategoryvehicles);
    for (let cat of this.selectedcategoryvehicles) {
      cat.isChurnup = true;
      cat.show = true;
      for (let vehicle of cat.vechicles) {
        vehicle.show = true;
      }
    }
    this.selectedcategory = evt.currentTarget.dataset.value;
  }

  showcategorypanel() {
    this.isShowcategoryvehicles = false;
    this.postMessage({
      message: true,
      source: "closeVehicleDetails"
    });
    this.traceBackbtn();
  }

  toggleCategoryGroup(event) {
    if (this.categoryvehicles[this.selectedcategory][event.currentTarget.dataset.value].count !== 0) {
      this.categoryvehicles[this.selectedcategory][event.currentTarget.dataset.value].isChurnup = !this.categoryvehicles[this.selectedcategory][event.currentTarget.dataset.value].isChurnup;
      this.selectedcategoryvehicles = this.categoryvehicles[this.selectedcategory] || [];
      this.selectedcategoryvehicles = Object.values(this.selectedcategoryvehicles);
    }
    this.template.querySelectorAll(".track_trace_category_item").forEach((element) => {
      if (element.classList.contains("active")) {
        element.classList.remove("active");
      }
    });
  }

  postMessage(message) {
    try {
      this.template.querySelector("iframe").contentWindow.postMessage(JSON.parse(JSON.stringify(message)), this.origin);
    } catch (error) {
      console.log(error);
    }
  }

  getVehicleStatus(triggerType, ignitionStatus, hours, speed) {
    let icon = "";
    switch (triggerType) {
      case "DRIVER_LOGOUT":
      case "DRIVER_LOGIN":
        icon = this.getIcon(ignitionStatus, hours, null, "IgntionOn");
        break;
      case "IGNITION_ON":
      case "KEY_ON":
      case "NO_MOVEMENT":
        icon = this.getIcon(null, hours, null, "IgntionOn");
        break;
      case "IGNITION_OFF":
      case "KEY_OFF":
        icon = "IgntionOff";
        break;
      case "MOVEMENT":
        icon = this.getIcon(null, hours, null, "Moving");
        break;
      case "PERIODIC_WITH_ENGINE_ON":
        icon = this.getIcon(null, hours, speed, "IgntionOn");
        break;
      case "PERIODIC":
      case "PERIODIC_WITH_DISTANCE":
        icon = this.getIcon(ignitionStatus, hours, speed, "IgntionOn");
        break;
      default:
        icon = "NoData";
        break;
    }

    return icon;
  }

  getIcon(ignitionStatus, hours, speed, icon) {
    if (ignitionStatus !== null && !ignitionStatus) {
      icon = "IgntionOff";
    } else if (hours > 8) {
      icon = "NonComm";
    } else if (speed !== null && speed > 0) {
      icon = "Moving";
    }
    return icon;
  }

  async handleExport() {
    if (!this.isTraceExport) {
      return;
    }
    this.isTraceExport = false;
    let fillterdTriger = this.filteredEvents.length === 0 ? Object.values(configs.traceEventTypesMap) : this.filteredEvents;
    let allFilter = this.initialFilter.filter((item) => !COMMON_TRIGER.includes(item));

    if (allFilter.length === this.filteredEvents.length || this.filteredEvents.length === 0) {
      fillterdTriger = fillterdTriger.concat(COMMON_TRIGER);
    }

    let startRange;
    let endRange;
    let dateFormat = "YYYY-MM-DDTHH:mm:ss.SSS[Z]";
    let rangeType = "";
    if (this.selectedOption !== "odometer") {
      startRange = new moment(`${this.fromDateTime}`).utc().format(dateFormat);
      endRange = moment(`${this.toDateTime}`).utc().format(dateFormat);
      rangeType = "TIME";
    } else {
      startRange = this.startRange;
      endRange = this.endRange;
      rangeType = "ODOMETER";
    }

    let dataItem = ["location", "position", "driverName", "lovEngineTime", "totalConsumption", "lovVehicleDistance", "speed", "totalFuelLevel", "adBlueLevel", "wiperIndicator"];
    await executeAction(
      [
        getTrackingEventsHistoryExport({
          chassisId: this.currentTrackVehicleChassisID,
          truckId: this.truckId,
          vehicleSpec: this.vehicleSpec,
          rangeType,
          startRange,
          endRange,
          triggerTypes: JSON.stringify(fillterdTriger),
          dataItems: JSON.stringify(dataItem),
          userTimeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          registrationNumber: this.registrationNumber
        })
      ],
      this
    );

    let result = this.action_data[0];
    if (result.status === "fulfilled") {
      result = JSON.parse(result.value);
      this.isShowToast = result.endDateInFuture;
      const downloadContainer = this.template.querySelector(".download-container");
      let a = document.createElement("a");
      a.href = "data:application/octet-stream;base64," + result.reportsByteArray;
      a.target = "_parent";
      a.download = label.lbl_ud_trace + "_" + label.lbl_ud_history + "_" + this.currentTrackVehicleChassisID + "_" + moment().format("DD_MM_YYYY_HH_mm") + ".xlsx";
      if (downloadContainer) {
        downloadContainer.appendChild(a);
      }
      if (a.click) {
        a.click();
      }
      downloadContainer.removeChild(a);
      this.isTraceExport = true;
    } else {
      // eslint-disable-next-line no-alert
      alert("No data found.");
    }
  }

  //info: post message to iframe
  postEventDetailsPanel(prmCounter, prmEventHistoryList, prmEventSelected, prmFirstEvent) {
    let msgObj = {
      message: true,
      source: "eventdetailspanel",
      counter: prmCounter,
      eventhistorylist: JSON.stringify(prmEventHistoryList)
    };

    if (prmEventSelected) {
      msgObj.eventselected = prmEventSelected;
    }

    if (prmFirstEvent) {
      msgObj.firstEvent = prmFirstEvent;
    }

    this.template.querySelector("iframe").contentWindow.postMessage(msgObj, this.origin);
  }

  postEventDetailsMapIcons(paramEventHistoryList) {
    let content = {
      message: true,
      source: "eventdetails_mapicons",
      eventhistorylist: JSON.stringify(paramEventHistoryList)
    };
    this.template.querySelector("iframe").contentWindow.postMessage(content, this.origin);
  }

  /*backFn() {
    window.history.back();
  }*/

  //Default Utility function for development
  logToConsoleInfo(message) {
    if (isDebugMode) {
      console.log(message);
    }
  }

  logToConsoleError(message) {
    if (isDebugMode) {
      console.error(message);
    }
  }

  logToConsoleObj(obj) {
    if (isDebugMode) {
      console.table(obj);
    }
  }
  closeTechnicalIssue() {
    this.isTechnicalIssue = false;
  }
  async loadLocation() {
    await executeParallelActions([user_Info()], this);
    let result = this.action_data[0];
    if (result.status === "fulfilled") {
      this.currentMarket = getCountryName(result.value.currentMarketName);
      this.postMessages("defaultLocation", { country: this.currentMarket });
    } else {
      this.logToConsoleError(result.reason);
    }
  }
  postMessages(source, data) {
    this.template.querySelector("iframe")?.contentWindow.postMessage({ message: true, source: source, data: data }, this.origin);
  }
  closeTraceHistory() {
    this.backToVehicleDetails();
  }

  traceModalCancel() {
    this.isShowTraceHistoryModal = false;
  }
  traceModalClose() {
    this.isShowTraceHistoryModal = false;
    this.traceBackbtn();
  }
  startTimer() {
    let totalSeconds = this.assetDataLoadInterval;
    try {
      clearInterval(this.assetsAPIReloadTimeInterval);
    } catch (error) {
      console.log(error);
    }
    this.assetsAPIReloadTimeInterval = setInterval(() => {
      if (totalSeconds <= 0) {
        clearInterval(this.assetsAPIReloadTimeInterval);
      } else {
        totalSeconds = totalSeconds - 1000;
        this.assetsAPIReloadTime = moment().utcOffset(0).set({ hour: 0, minute: 0, second: 0, millisecond: totalSeconds }).utc().format("mm:ss");
      }
    }, 1000);
  }

  //todo  ign icon not there 
  reloadDataOnRefresh() {
    if (this.isMobile) {
      return;
    }

    this.assetsAPIReloadTime = "03:00";
    try {
      clearInterval(this._interval);
    } catch (error) {
      this.logToConsoleError(error);
    }
    try {
      clearInterval(this.assetsAPIReloadTimeInterval);
    } catch (e) {
      console.log(e);
    }
    try {
      this._interval = setInterval(() => {
        loadAssetData(this);
        this.startTimer();
      }, this.assetDataLoadInterval);
    } catch (error) {
      this.logToConsoleError(error);
    }
    loadAssetData(this);
    this.startTimer();
    this.showTitleMenu = true;
    this.setAppHeight();
  }

  backToVehicleDetails() {
    this.isRenderCal = false;
    this.showtracehistory = false;
    this.postMessage({
      message: true,
      source: "calendarback"
    });
    this.traceBackbtn();
  }
  showEventsHistory(e) {
    try {
      e.stopPropagation();
      this.isMobileLoad = false;
      this.isShowEventsHistory = true;
      if (this.template.querySelector(".events_history_mobile")) {
        this.template.querySelector(".events_history_mobile").style.display = "block";
      }
      setTimeout(() => {
        this.postMessage({
          message: true,
          source: "hideeventdetailspanel"
        });
        this.isMobileLoad = true;
      }, 4000);
    } catch (error) {
      this.logToConsoleError(error);
    }
  }
  closeEventsPanel() {
    this.template.querySelector(".events_history_mobile").style.display = "none";
  }
  enableCalFromTrace() {
    try {
      this.isRenderCal = true;
      if (this.isRenderCal) {
        this.template.querySelector(".track_trace_tracehistory").style.display = "none";

        setTimeout(() => {
          this.template.querySelector("c-udcs_lwc_calender_v1").setSelectedDateTime(this.fromDateTime, this.toDateTime, this.selectedOption);
        }, 300);
      }
    } catch (error) {
      this.logToConsoleError(error);
    }
  }
  showRouteSummary() {
    this.isShowRouteSummary = true;
  }
  closeRouteSummary() {
    this.isShowRouteSummary = false;
  }
  get NoDataSelected() {
    return this.SelectedvehicleFilter !== "NoData" ? "track_trace_items" : "track_trace_items SelectedTraceEvent";
  }

  unloadIframe() {
    const iframe = this.template.querySelector("iframe");
    if (iframe) {
      iframe.src = "";
    }
    const iframeElement = this.template.querySelector("iframe");
    iframeElement.remove();
  }

  closeToast() {
    this.isShowToast = false;
  }
}