import { api, LightningElement, track } from "lwc";
import parseJSONResponse from "@salesforce/apex/udcs_apex_reversegeo_api_call.parseJSONResponse";
import label from "./udcs_lwc_fleet_status_overview_translation";
import { executeParallelActions } from "c/udcs_lwc_ui_service";
import { loadScript } from "lightning/platformResourceLoader";
import { dateUtil, isDebugMode, setStyle, icons, libraries, getLocalFormatedDateTimeInHH, sendEventToGA4 } from "c/udcs_lwc_utils";

export default class Udcs_lwc_fleet_status_overview extends LightningElement {
  @track
  selectedRows = [];
  label = label;
  icons = icons;
  libraries = libraries;
  iconSrc = icons.common.export.turquoise;
  action_data = [];
  inputTextbox_placeholder = label.lbl_reg_no + " / " + label.lbl_chassisid + " / " + label.lbl_ud_TruckID + " / " + label.lbl_ud_driver;
  @api
  allTrackEvents;
  allTrackEventsData;
  @api
  allTrackEvents_Export = [];
  totalItems = 0;
  pageSize = 10;
  enablePrv = false;
  enableNxt = false;
  labelName = "";
  currentPage = 1;
  startIndex = 0;
  endIndex = 0;
  filteredRows = [];
  ascending1 = true;
  ascending2 = true;
  ascending3 = true;
  ascending4 = true;
  ascending5 = true;
  ascending6 = true;
  ascending7 = true;
  ascending8 = true;
  ascending9 = true;
  ascending10 = true;
  ascending11 = true;
  datamap = {};
  tempData = [];
  reverseGeoAddressObj = {};
  timezone = "";
  @track getLoad = true;
  @track isModalOpen = false;

  calldownload() {
    const exportButton = this.template.querySelector(".export-button");
    const excelButton = this.template.querySelector(".head-right-export");
    const exportText = this.template.querySelector(".export_text");
    if (exportButton && exportText) {
        exportButton.classList.add('gray');
        exportText.classList.add('gray');
        excelButton.classList.add('hide');
        this.iconSrc = icons.common.export.light_gray;
    }
    this.reverseGeoAddressAll().then(() => {
      const childComponent = this.template.querySelector("c-udcs_lwc_fleetstatus_overview_export");
      if (childComponent) {
        childComponent.download();
      }
      if (exportButton && exportText) {
            exportButton.classList.remove('gray');
            exportText.classList.remove('gray');
                    excelButton.classList.remove('hide');
                    excelButton.classList.remove('show');

      this.iconSrc = icons.common.export.turquoise;        }
    });
  }

  showExport() {
    setStyle(this.template.querySelector(".head-right-export"), "toggleClass", "show");
    setStyle(this.template.querySelector(".backdrop"), "addClassList", "block");
  }

  closeDrop() {
    setStyle(this.template.querySelector(".head-right-export"), "toggleClass", "show");
    setStyle(this.template.querySelector(".backdrop"), "removeClassList", "block");
  }

  customSortVehicleID() {
    this.resetSort(1);
    this.ascending1 = !this.ascending1;
    this.sortingWithEmpty(this.selectedRows, this.ascending1, "chassisNumber");
  }

  customSortVehicleGroup() {
    this.resetSort(2);
    this.ascending2 = !this.ascending2;
    this.sortingWithEmpty(this.selectedRows, this.ascending2, "groupName");
  }

  customSortTruckID() {
    this.resetSort(3);
    this.ascending3 = !this.ascending3;
    this.sortingWithEmpty(this.selectedRows, this.ascending3, "truckId");
  }

  customSortDateTime() {
    this.resetSort(4);
    this.ascending4 = !this.ascending4;
    this.sortingWithTime(this.selectedRows, this.ascending4, "formattedTriggerDateTime", "DD/MM/YYYY HH:mm");
  }

  customSortDriver() {
    this.resetSort(5);
    this.ascending5 = !this.ascending5;
    this.sortingWithEmpty(this.selectedRows, this.ascending5, "driverName");
  }

  customSortFuelLevel() {
    this.resetSort(6);
    this.ascending6 = !this.ascending6;
    this.sortingWithEmpty(this.selectedRows, this.ascending6, "diesel");
  }

  customSortAdblueLevel() {
    this.resetSort(7);
    this.ascending7 = !this.ascending7;
    this.sortingWithEmpty(this.selectedRows, this.ascending7, "Adblue");
  }

  customSortSpeed() {
    this.resetSort(8);
    this.ascending8 = !this.ascending8;
    this.sortingWithEmpty(this.selectedRows, this.ascending8, "wheelBasedSpeed");
  }

  customSortOdometer() {
    this.resetSort(9);
    this.ascending9 = !this.ascending9;
    this.sortingWithEmpty(this.selectedRows, this.ascending9, "odometerSort");
  }

  customSortEngineHours() {
    this.resetSort(10);
    this.ascending10 = !this.ascending10;
    this.sortingWithEmpty(this.selectedRows, this.ascending10, "enginehours");
  }
  customSortVehicleStatus() {
    this.resetSort(11);
    this.ascending11 = !this.ascending11;
    this.sortingWithEmpty(this.selectedRows, this.ascending11, "status_cardinal_number");
  }

  prevRecords() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
    this.enableNxt = this.currentPage < this.totalNumberOfPages;
    this.enablePrv = this.currentPage > 1;
    this.displayData();
    try {
      this.template.querySelector(".table-container").scrollTop = 0;
    } catch (error) {
      console.log(error);
    }
  }

  displayData() {
    if (this.totalNumberOfPages !== 0) {
      this.resetSort();
      this.reverseGeoAddress();
      this.selectedRows = this.datamap[this.currentPage].data;
      console.log("this.selectedRows", this.selectedRows);
      this.sortingWithEmpty(this.selectedRows, this.ascending1, "chassisNumber");
      this.labelName = this.totalItems !== 0 ? this.datamap[this.currentPage].labelName : "";
    } else {
      this.selectedRows = [];
    }
  }
  nxtRecords() {
    if (this.currentPage < this.totalNumberOfPages) {
      this.currentPage++;
    }
    this.enableNxt = this.currentPage < this.totalNumberOfPages;
    this.enablePrv = this.currentPage > 1;
    this.displayData();
    try {
      this.template.querySelector(".table-container").scrollTop = 0;
    } catch (error) {
      console.log(error);
    }
  }

  openModal() {
    sendEventToGA4("Fleet Status Overview from MAP screen");
    this.getLoad = false;
    // eslint-disable-next-line @lwc/lwc/no-async-operation
    setTimeout(() => {
      this.isModalOpen = true;
      this.resetSort();
      this.sortingWithEmpty(this.selectedRows, this.ascending1, "chassisNumber");
      this.getLoad = true;

      console.log("this.selectedRows", this.selectedRows);
      console.log("this.selectedRows", JSON.stringify(this.selectedRows));
    }, 500);
    this.noRecordsFound();
  }

  closeModal() {
    this.template.querySelector(`[data-value="trackDataSearch"`).value = "";
    this.trackDataSearch();
    this.isModalOpen = false;
  }

  submitDetails() {
    this.isModalOpen = false;
  }

  async connectedCallback() {
    await Promise.allSettled([loadScript(this, this.libraries.moment.v1_0)]);
    let sampleArray = [];
    for (let temp of JSON.parse(JSON.stringify(this.allTrackEvents))) {
      if (temp.registrationNumber === undefined) {
        temp.registrationNumber = "-";
      }
      if (temp.registrationNumber && temp.registrationNumber.trim() === "") {
        temp.registrationNumber = "-";
      }
      temp.isLoading = true;
      temp.reverseGeoAddress = "";
      temp.showAddress = temp.location.indexOf("undefined") === -1;
      sampleArray.push(temp);
      this.allTrackEvents_Export.push(temp);
    }
    this.allTrackEventsData = sampleArray;
    this.totalItems = this.allTrackEventsData.length;
    this.utility(sampleArray);
    this.reverseGeoAddress();
    this.selectedRows = this.totalItems !== 0 ? this.datamap[1].data : [];
    this.labelName = this.totalItems !== 0 ? this.datamap[1].labelName : "";
    this.filteredRows = this.datamap;
    for (let a of this.allTrackEventsData) {
      a.driverName = a.driverName === "-" ? `${label.lbl_ud_UnknownDriver}` : a.driverName;
      a.groupName = a.groupName ? a.groupName : "-";
      a.enginehours = parseFloat(a.enginehours);
     let hours = Math.floor(a.enginehours / 3600);
let minutes = Math.floor((a.enginehours % 3600) / 60);
let seconds = Math.floor(a.enginehours % 60);

if (isNaN(a.enginehours) || a.enginehours === undefined || a.enginehours === "-") {
  a.enginehours = "-";
} else {
  hours = hours < 10 ? "0" + hours : "" + hours;
  minutes = minutes < 10 ? "0" + minutes : "" + minutes;
  seconds = seconds < 10 ? "0" + seconds : "" + seconds;

  a.enginehours = `${hours}:${minutes}:${seconds}`;
}

    }
    this.timezone = dateUtil.getUtcOffset();
  }
  async reverseGeoAddressSearch() {
    let i = 0;
    while (i < this.selectedRows.length) {
      let temp = this.selectedRows[i];
      if (temp.showAddress) {
        temp.key += "a";
        temp.isLoading = true;
        if (this.reverseGeoAddressObj[temp.location]) {
          temp.reverseGeoAddress = this.reverseGeoAddressObj[temp.location];
          temp.isLoading = false;
          i++;
          continue;
        }
        // API DISABLED FOR DEPLOYMENT
        // await executeParallelActions([parseJSONResponse({ latlng: temp.location })], this);
        // let result = this.action_data[0];
        temp.isLoading = false;
        temp.reverseGeoAddress = "Address Not Found";
        let result = { status: "fulfilled", value: { results: [] } };
        if (result.status === "fulfilled") {
          result = result.value;
          console.log("resuly called here", JSON.stringify(result))
          try {
            temp.isLoading = false;
            let address = result.results[0].formatted_address;
            temp.reverseGeoAddress = address;
            this.reverseGeoAddressObj[temp.location] = address;
          } catch (e) {
            temp.isLoading = false;
            temp.reverseGeoAddress = "Address Not Found";
            this.reverseGeoAddressObj[temp.location] = "Address Not Found";
          }
        } else {
          console.log(result.reason);
        }
      }
      i++;
    }
  }
  async reverseGeoAddress() {
    let start = (this.currentPage - 1) * 10 + 1;
    let i = start;
    while (i < start + this.pageSize) {
      let temp = this.allTrackEventsData[i];
      if (temp.showAddress) {
        temp.key += "a";
        temp.isLoading = true;
        if (this.reverseGeoAddressObj[temp.location]) {
          temp.reverseGeoAddress = this.reverseGeoAddressObj[temp.location];
          temp.isLoading = false;
          i++;
          continue;
        }
        // eslint-disable-next-line no-await-in-loop
        await executeParallelActions([parseJSONResponse({ latlng: temp.location })], this);
        let result = this.action_data[0];
        if (result.status === "fulfilled") {
          result = result.value;

          try {
            temp.isLoading = false;
            let address = result.results[0].formatted_address;
            temp.reverseGeoAddress = address;
            this.reverseGeoAddressObj[temp.location] = address;
          } catch (e) {
            temp.isLoading = false;
            temp.reverseGeoAddress = "Address Not Found";
            this.reverseGeoAddressObj[temp.location] = "Address Not Found";
          }
        } else {
          console.log(result.reason);
        }
      }
      i++;
    }
    let tempSelectedRows = [];
    for (let a of this.selectedRows) {
      tempSelectedRows.push(a);
    }
    this.selectedRows = tempSelectedRows;
  }

  async reverseGeoAddressAll() {
    // API DISABLED FOR DEPLOYMENT
    console.log("API disabled for deployment - reverseGeoAddressAll");
    let i = 0;
    let newArray = [];

    while (i < this.allTrackEventsData.length) {
      let temp = this.allTrackEventsData[i];
      if (temp.showAddress) {
        temp.key += "a";
        temp.isLoading = false;
        if (this.reverseGeoAddressObj[temp.location]) {
          temp.reverseGeoAddress = this.reverseGeoAddressObj[temp.location];
          temp.isLoading = false;
          newArray.push({ ...temp });
          // Only increment i here, as we've processed this item
        } else {
          // await executeParallelActions([parseJSONResponse({ latlng: temp.location })], this);
          // let result = this.action_data[0];
          // if (result.status === "fulfilled") {
          //   result = result.value;
          //   try {
          //     temp.isLoading = false;
          //     let address = result.results[0].formatted_address;
          //     temp.reverseGeoAddress = address;
          //     this.reverseGeoAddressObj[temp.location] = address;
          //     newArray.push({ ...temp });
          //   } catch (e) {
          //     temp.isLoading = false;
          //     temp.reverseGeoAddress = "Address Not Found";
          //     this.reverseGeoAddressObj[temp.location] = "Address Not Found";
          //     newArray.push({ ...temp });
          //   }
          // } else {
          //   console.log(result.reason);
          //   newArray.push({ ...temp, reverseGeoAddress: "Address Not Found" });
          // }
          temp.reverseGeoAddress = "Address Not Found";
          newArray.push({ ...temp });
        }
      }
      i++;
    }
    this.allTrackEvents_Export = newArray;
  }

  @api
  updateAssetsData(allTrackEvents) {
    this.allTrackEvents_Export = [];
    let sampleAssetsObj = {};
    let sampleArray = [];

    for (let temp of JSON.parse(JSON.stringify(allTrackEvents))) {
      if (temp.registrationNumber === undefined) {
        temp.registrationNumber = "-";
      }

      if (temp.registrationNumber && temp.registrationNumber.trim() === "") {
        temp.registrationNumber = "-";
      }
      temp.reverseGeoAddress = "";
      temp.showAddress = temp.location.indexOf("undefined") === -1;
      temp.enginehours = parseFloat(temp.enginehours);
      let hours = Math.floor(temp.enginehours / 3600);
      let minutes = Math.floor((temp.enginehours % 3600) / 60);
      if (hours == "0") {
        hours = "00";
      } else if (hours <= "9" && hours > "0") {
        hours = "0" + hours;
      } else if (hours == "undefined" || hours == "-") {
        hours = "-";
      } else {
        hours = "" + hours;
      }
      temp.enginehours = isNaN(temp.enginehours) ? "-" : hours + ":" + minutes;
      sampleAssetsObj[temp.name] = temp;
      sampleArray.push(temp);
      this.allTrackEvents_Export.push(temp);
    }

    for (let temp of this.allTrackEventsData) {
      if (temp.formattedTriggerDateTime) {
        temp.formattedTriggerDateTime = getLocalFormatedDateTimeInHH(temp.formattedTriggerDateTime);
      }
      if (sampleAssetsObj[temp.name] !== undefined) {
        ({
          showAddress: temp.showAddress,
          truckID: temp.truckID,
          triggerTime: temp.triggerTime,
          wheelBasedSpeed: temp.wheelBasedSpeed,
          diesel: temp.diesel,
          Adblue: temp.Adblue,
          Odometer: temp.Odometer,
          enginehours: temp.enginehours,
          reverseGeoAddress: temp.reverseGeoAddress,
          driverName: temp.driverName,
          formattedTriggerDateTime: temp.formattedTriggerDateTime
        } = sampleAssetsObj[temp.name]);
      }
    }
    for (let a of Object.keys(this.datamap)) {
      for (let d of this.datamap[a].data) {
        if (d.formattedTriggerDateTime) {
          d.formattedTriggerDateTime = getLocalFormatedDateTimeInHH(d.formattedTriggerDateTime);
        }
        if (sampleAssetsObj[d.name] !== undefined) {
          ({
            showAddress: d.showAddress,
            truckID: d.truckID,
            triggerTime: d.triggerTime,
            wheelBasedSpeed: d.wheelBasedSpeed,
            diesel: d.diesel,
            Adblue: d.Adblue,
            Odometer: d.Odometer,
            enginehours: d.enginehours,
            reverseGeoAddress: d.reverseGeoAddress,
            driverName: d.driverName,
            formattedTriggerDateTime: d.formattedTriggerDateTime
          } = sampleAssetsObj[d.name]);
        }
      }
    }
  }

  trackDataSearch() {
    let SearchText = this.template.querySelector(`[data-value="trackDataSearch"`).value.toUpperCase().trim();
    if (SearchText !== "") {
      this.selectedRows = [];
      let search_tds = ["registrationNumber", "chassisNumber", "driverName", "truckId"];
      for (let i = 0; i < this.allTrackEventsData.length; i++) {
        let tempData = [];
        for (let a of search_tds) {
          try {
            tempData.push(this.allTrackEventsData[i][a].toUpperCase());
          } catch (error) {
            console.log(error);
          }
        }
        if (tempData.join(" ").indexOf(SearchText) > -1 || SearchText === "") {
          this.selectedRows.push(this.allTrackEventsData[i]);
        }
      }
      this.reverseGeoAddressSearch(this.selectedRows);
      this.totalItems = this.selectedRows.length;
      this.utility(this.selectedRows);
      this.selectedRows = this.totalItems !== 0 ? this.datamap[1].data : [];
      this.labelName = this.totalItems !== 0 ? this.datamap[1].labelName : "";
      this.filteredRows = this.datamap;
    } else {
      let sampleArray = [];
      for (let temp of this.allTrackEventsData) {
        sampleArray.push(temp);
      }
      this.totalItems = this.allTrackEventsData.length;
      this.utility(sampleArray);
      this.selectedRows = this.totalItems !== 0 ? this.datamap[1].data : [];
      this.labelName = this.totalItems !== 0 ? this.datamap[1].labelName : "";
      this.filteredRows = this.datamap;
    }
    this.noRecordsFound();
  }

  noRecordsFound() {
    if (this.selectedRows.length === 0) {
      this.labelName = " / ";
      this.fuelChangeDataFlag = true;
    } else {
      this.fuelChangeDataFlag = false;
    }
  }

  chunk(items, size) {
    const chunks = [];
    items = [].concat(...items);
    while (items.length) {
      chunks.push(items.splice(0, size));
    }
    return chunks;
  }

  utility(totalItems) {
    let count = 1;
    this.totalNumberOfPages = 0;
    this.currentPage = 1;
    this.resetSort();
    this.sortingWithEmpty(this.selectedRows, this.ascending1, "chassisNumber");
    this.tempData = this.chunk(totalItems, this.pageSize);
    let labelName = "";
    for (let sample of this.tempData) {
      this.totalNumberOfPages++;
      if (this.totalItems <= this.pageSize) {
        labelName = count + " - " + totalItems.length + " / " + totalItems.length;
        this.datamap[count] = {
          labelName,
          data: sample
        };
      } else {
        if (count === 1) {
          labelName = 1 + " - " + sample.length + " / " + totalItems.length;
          this.datamap[count] = {
            labelName,
            data: sample
          };
          count++;
          continue;
        } else {
          if (sample.length === this.pageSize) {
            labelName = (count - 1) * this.pageSize + 1 + " - " + this.pageSize * count + " / " + totalItems.length;
          } else {
            labelName = (count - 1) * this.pageSize + 1 + " - " + totalItems.length + " / " + totalItems.length;
          }
          this.datamap[count] = {
            labelName,
            data: sample
          };
          count++;
        }
      }
    }
    this.enableNxt = this.currentPage < this.totalNumberOfPages;
    this.enablePrv = false;
  }

  sortingWithEmpty(data, isAcc, key) {
    data.sort((a, b) => {
      try {
        if (a[key] === "" || a[key] === "-") {
          return 1;
        }
        if (b[key] === "" || b[key] === "-") {
          return -1;
        }
        if (a[key] === b[key]) {
          return 0;
        }
        if (isAcc) {
          return a[key] < b[key] ? -1 : 1;
        }
        return a[key] < b[key] ? 1 : -1;
      } catch (error) {
        this.logToConsoleError(error);
        return 0;
      }
    });
    return data;
  }

  sortingWithTime(data, isAcc, key, format) {
    data.sort((a, b) => {
      try {
        if (a[key] === "" || a[key] === "-") {
          return 1;
        }
        if (b[key] === "" || b[key] === "-") {
          return -1;
        }

        let aDate = moment(a[key], format).toDate();
        let bDate = moment(b[key], format).toDate();

        if (aDate === bDate) {
          return 0;
        }

        if (isAcc) {
          return aDate < bDate ? -1 : 1;
        }
        return aDate < bDate ? 1 : -1;
      } catch (error) {
        this.logToConsoleError(error);
        return 0;
      }
    });
    return data;
  }

  resetSort(type) {
    if (type !== 1) {
      this.ascending1 = true;
    }

    if (type !== 2) {
      this.ascending2 = true;
    }

    if (type !== 3) {
      this.ascending3 = true;
    }

    if (type !== 4) {
      this.ascending4 = true;
    }

    if (type !== 5) {
      this.ascending5 = true;
    }

    if (type !== 6) {
      this.ascending6 = true;
    }

    if (type !== 7) {
      this.ascending7 = true;
    }

    if (type !== 8) {
      this.ascending8 = true;
    }

    if (type !== 9) {
      this.ascending9 = true;
    }

    if (type !== 10) {
      this.ascending10 = true;
    }
    if (type !== 11) {
      this.ascending11 = true;
    }
  }

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
}