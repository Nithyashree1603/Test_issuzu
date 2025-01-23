import { LightningElement, api, track } from "lwc";
import label from "./udcs_lwc_track_trace_widget_translations";
import { icons, vehicleDataTransform, mobileDeviceCheck, getFeatureVisibilityData, sendEventToGA4 } from "c/udcs_lwc_utils";
import { executeParallelActions, executeParallelActionsNew } from "c/udcs_lwc_ui_service";
import assetsDataNew from "@salesforce/apex/udcs_apex_connect.assetsDataNew";
import isJapanMarket from "@salesforce/apex/udcs_apex_user_auth.isJapanMarket";
import getGeofenceList from "@salesforce/apex/udcs_apex_geo_fence.getGeofenceList";

export default class Udcs_lwc_track_trace_widget extends LightningElement {
  featureVisibilityData = getFeatureVisibilityData();
  label = label;
  icons = icons;
  @track isLoading = true;
  action_data = [];
  count = 0;
  activeGeoCount = 0;
  assetsLoaded = false;
  geoFencesLoaded = false;
  isMobile = false;

  @api
  userAccess;

  isJapanese = false;

  show_udcs_map_dashbaord() {
    this.dispatchEvent(
      new CustomEvent("show_udcs_map_dashbaord", {
        bubbles: true,
        detail: "Map Dashboard"
      })
    );
    sendEventToGA4("Track & Trace from Dashboard");
  }

  show_udcs_geo_fencing() {
    this.dispatchEvent(
      new CustomEvent("show_udcs_geo_fencing", {
        bubbles: true,
        detail: {
          module: "udcs_geo_fencing"
        }
      })
    );
    sendEventToGA4("Geo Fence from Dashboard");
  }

  async connectedCallback() {
    this.isMobile = mobileDeviceCheck();
    await this.loadAssetData();
    // this.isLoading = false;
  }

  async loadAssetData() {
    await executeParallelActionsNew([isJapanMarket()], this);
    let result = this.action_data[0];
    if (result.status === "fulfilled") {
      let response = result.value;
      this.isJapanese = response;
    }

    this.allTrackEvents = [];
    this.isLoading = false;

    if (this.isJapanese === false) {
      if (this.featureVisibilityData.maps) {
        await executeParallelActions([assetsDataNew()], this);
        result = this.action_data[0];
        if (result.status === "fulfilled") {
          let assetsObj = vehicleDataTransform(result);
          this.count = assetsObj.length;
        } else {
          this.count = 0;
        }
      }
      this.assetsLoaded = true;
      if (this.isMobile === true) {
        return;
      }
      if (this.userAccess.isTrackCountAlone === true) {
        return;
      }
      if (this.count === 0) {
        this.geoFencesLoaded = true;
        return;
      }

      let isFailed = false;
      let loadFlag = true;
      let pageCount = 0;
      let dataList = [];
      if (this.featureVisibilityData.geofence) {
        // eslint-disable-next-line no-constant-condition
        while (true) {
          // eslint-disable-next-line no-await-in-loop
          await executeParallelActions([getGeofenceList({ offset: pageCount + "", now: new Date() + "" })], this);
          result = this.action_data[0];
          if (result.status === "fulfilled") {
            loadFlag = result.value.geofences.length > 0;
            pageCount++;
            if (loadFlag) {
              dataList.push(...result.value.geofences);
            }
          } else {
            isFailed = true;
            loadFlag = false;
          }

          if (!loadFlag) {
            break;
          }
        }
      }
      this.geoFencesLoaded = true;
      if (!isFailed) {
        let activeList = dataList.filter((item) => item.status.toLowerCase() === "active");
        this.activeGeoCount = activeList.length;
      }
    }
  }

  get getContentClass() {
    return this.isJapanese ? "widget-content jp-padding" : "widget-content";
  }
}