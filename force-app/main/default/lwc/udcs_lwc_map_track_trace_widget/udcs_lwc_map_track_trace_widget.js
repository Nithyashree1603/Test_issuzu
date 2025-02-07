import { LightningElement, api, track } from "lwc";
import label from "./udcs_lwc_map_track_trace_widget_translations";
import { icons, vehicleDataTransform, mobileDeviceCheck, getFeatureVisibilityData, sendEventToGA4 } from "c/udcs_lwc_utils";
import { executeParallelActions } from "c/udcs_lwc_ui_service";
import assetsDataNew from "@salesforce/apex/udcs_apex_connect.assetsDataNew";

export default class Udcs_lwc_map_track_trace_widget extends LightningElement {
  featureVisibilityData = getFeatureVisibilityData();
  label = label;
  icons = icons;
  @track isLoading = true;
  action_data = [];
  count = 0;
  assetsLoaded = false;
  isMobile = false;

  @api
  userAccess;

  @api
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

  async connectedCallback() {
    this.isMobile = mobileDeviceCheck();
    await this.loadAssetData();
  }

  async loadAssetData() {
    this.allTrackEvents = [];
    this.isLoading = false;

    if (this.isJapanese === false) {
      if (this.featureVisibilityData.maps) {
        await executeParallelActions([assetsDataNew()], this);
        let result = this.action_data[0];
        if (result.status === "fulfilled") {
          let assetsObj = vehicleDataTransform(result);
          this.count = assetsObj.length;
        } else {
          this.count = 0;
        }
      }
      this.assetsLoaded = true;
    }
  }

  get getContentClass() {
    return this.isJapanese ? "widget-content jp-padding" : "widget-content";
  }
}