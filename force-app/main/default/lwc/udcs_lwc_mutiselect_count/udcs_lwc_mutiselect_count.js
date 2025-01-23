/* eslint-disable radix */
/* eslint-disable no-unused-vars */
import { LightningElement, track, api } from "lwc";
import { isDebugMode, icons, mobileDeviceCheck } from "c/udcs_lwc_utils";
import label from "./udcs_lwc_mutiselect_count_translation";

export default class Udcs_lwc_mutiselect_count extends LightningElement {
  @api
  optionData;
  label = label;
  icons = icons;
  @track showPicklist = false;
  selectOptionValueParameter = label.lbl_ud_events;
  @track parameters = [];
  showEventPicklist = false;
  selectedParameterIds = new Set();
  @track selectedParaIds_size = 0;
  isMobile = false;
  /**
   * Default lifecycle event function
   */
  connectedCallback() {
    this.isMobile = mobileDeviceCheck();
    if (this.isMobile) {
      this.selectOptionValueParameter = "Filter";
    }
    let result = this.optionData;
    let events = result;
    let temp_events = {};
    temp_events[label.lbl_ud_all] = { isChurnUp: true, checked: true, eventscount: 0, data: [] };
    let count = 0;
    for (let a of events) {
      if (a) {
        let parameter = {
          name: a.name,
          nameEn: a.nameEn,
          key: a.name,
          show: true,
          checked: true
        };
        // parameter.key = parameter.name;
        temp_events[label.lbl_ud_all].data.push(parameter);
        count++;
      }
    }

    let group_events = [];
    for (let groupName of Object.keys(temp_events)) {
      group_events.push({ groupName: groupName, groupData: temp_events[groupName] });
    }

    this.parameters = group_events;
    let dataOfParams = [];

    for (let x of this.parameters) {
      x.groupData.data.forEach((y) => {
        if (y.checked) {
          dataOfParams.push(y.name);
        }
      });
    }
    this.selectGroup();
    // })();
  }

  /**
   * Selecting group of parameters
   */
  selectinggrpparameters(event) {
    this.logToConsoleInfo("Start => udcs_event_select.selectinggrpparameters");
    event.stopPropagation();
    let count = 0;
    this.parameters[event.currentTarget.dataset.groupindex].groupData.checked = event.currentTarget.checked;
    for (let a of this.parameters[parseInt(event.currentTarget.dataset.groupindex)].groupData.data) {
      a.checked = event.currentTarget.checked;
      if (a.checked) {
        count++;
      }
    }
    // this.selectOptionValueParameter = label.lbl_parameters;
    this.selectedParaIds_size = count;
    if (event.currentTarget.checked) {
      this.parameters[parseInt(event.currentTarget.dataset.groupindex)].groupData.eventscount = this.parameters[parseInt(event.currentTarget.dataset.groupindex)].groupData.data.length;
    } else {
      this.parameters[parseInt(event.currentTarget.dataset.groupindex)].groupData.eventscount = 0;
    }
    this.updateSelectedParaIds();
    this.logToConsoleInfo("End => udcs_event_select.selectinggrpparameters");
  }

  /**
   * Get selected count of event category
   */
  updateSelectedParaIds() {
    this.logToConsoleInfo("Start => udcs_event_select.updateSelectedParaIds");
    this.selectedParameterIds = {};
    let temp_selectedParaIds = {};
    for (let a of this.parameters) {
      for (let b of a.groupData.data) {
        if (b.checked) {
          temp_selectedParaIds[b.paraId] = "";
        }
      }
    }
    this.selectedParameterIds = temp_selectedParaIds;
    this.logToConsoleInfo("End => udcs_event_select.updateSelectedParaIds");
  }

  /**
   * Function of selecting individual parameter
   */
  selectingevent(event) {
    event.stopPropagation();
    this.parameters[event.currentTarget.dataset.groupindex].groupData.data[event.currentTarget.dataset.vhindex].checked = event.currentTarget.checked;
    let count = 0;
    for (let a of this.parameters[parseInt(event.currentTarget.dataset.groupindex)].groupData.data) {
      if (a.checked) {
        count++;
      }
    }
    this.selectedParaIds_size = count;
    if (count === this.parameters[parseInt(event.currentTarget.dataset.groupindex)].groupData.data.length) {
      this.parameters[event.currentTarget.dataset.groupindex].groupData.checked = true;
      this.parameters[parseInt(event.currentTarget.dataset.groupindex)].groupData.eventscount = this.parameters[parseInt(event.currentTarget.dataset.groupindex)].groupData.data.length;
    } else {
      this.parameters[event.currentTarget.dataset.groupindex].groupData.checked = false;
      this.parameters[parseInt(event.currentTarget.dataset.groupindex)].groupData.eventscount = count;
    }
    this.updateSelectedParaIds();
  }

  /**
   * Function of Searching parameter category
   */
  searchVechiles(event) {
    this.logToConsoleInfo("Start => udcs_event_select.searchVechiles");
    let searchText = event.currentTarget.value + "";
    searchText = searchText.trim().toLocaleLowerCase();
    let temp_events = [];
    for (let a of this.parameters) {
      a.groupData.data.map((b) => {
        if (searchText === "" || (b.name + "").toLocaleLowerCase().indexOf(searchText) > -1) {
          b.show = true;
          a.groupData.isChurnUp = false;
        } else {
          b.show = false;
        }
        if (searchText === "") {
          a.groupData.isChurnUp = true;
        }
        return b;
      });
      a.groupData.isChurnUp = a.groupData.data.filter((b) => b.show).length === a.groupData.data.length;

      temp_events.push(a);
    }
    this.parameters = temp_events;
    this.logToConsoleInfo("End => udcs_event_select.searchVechiles");
  }

  isRested = false;

  /**
   * Reset the paramter
   */
  @api
  reset(event) {
    this.logToConsoleInfo("Start => udcs_event_select.reset");
    event?.stopPropagation();
    this.isRested = true;
    this.selectedParameterIds = new Set();
    this.selectedParaIds_size = 0;
    try {
      this.template.querySelector("input.select").style.border = "none";
      this.template.querySelector(".flc_dd_search").value = "";
    } catch (error) {
      console.log(error);
    }
    let tempevents = JSON.parse(JSON.stringify(this.parameters));
    let temp_vh = [];
    for (let a of tempevents) {
      a.groupData.isChurnUp = true;
      a.groupData.checked = false;
      a.groupData.eventscount = 0;
      a.groupData.data.map((b) => {
        b.show = true;
        b.checked = false;
        return b;
      });
      temp_vh.push(a);
    }
    this.parameters = temp_vh;

    this.dispatchEvent(
      new CustomEvent("udcs_parameter_icon", {
        bubbles: true,
        detail: {
          data: "parameter"
        }
      })
    );
    this.isRested = false;
  }

  /**
   * Show and hide the paramter filter
   */
  showCheckboxes(e) {
    e.stopPropagation();
    // this.logToConsoleInfo("Start => udcs_event_select.showCheckboxes");
    this.template.querySelector(".backdrop").classList.toggle("hidden");
    if (this.isRested) {
      let tempevents = JSON.parse(JSON.stringify(this.parameters));
      for (let a of tempevents) {
        a.groupData.isChurnUp = true;
        a.groupData.checked = false;
        a.eventscount = 0;
        a.groupData.data.map((b) => {
          b.show = true;
          b.checked = false;
          return b;
        });
      }
      this.parameters = tempevents;
      this.isRested = false;
    }
    let dataOfParams = [];

    for (let x of this.parameters) {
      x.groupData.isChurnUp = true;
      x.groupData.data.forEach((y) => {
        y.show = true;
        if (y.checked) {
          dataOfParams.push(y.nameEn);
        }
      });
    }
    this.template.querySelector(".input_up_arrow img").classList.toggle("rotate");
    this.showPicklist = !this.showPicklist;
    if (this.showPicklist === false) {
      const selectValidate = new CustomEvent("udcs_selectdropdown_error", {
        bubbles: true,
        detail: {
          flag: this.selectedParaIds_size === 0,
          selectoptionvalueParameter: this.selectedParaIds_size,
          option: label.lbl_parameters
        }
      });

      this.dispatchEvent(selectValidate);

      this.dispatchEvent(
        new CustomEvent("udcs_selectdropdown", {
          bubbles: true,
          detail: {
            data: this.selectedParaIds_size,
            list: JSON.parse(JSON.stringify(dataOfParams))
          }
        })
      );
    }
    this.logToConsoleInfo("End => udcs_event_select.showCheckboxes");
  }

  focus() {
    this.template.querySelector(".flc_dd_search").focus();
  }

  /**
   * Display the number of parameters
   */
  @api
  selectGroup() {
    let count = 0;
    let dataOfParams = [];
    for (let a of this.parameters[0].groupData.data) {
      a.checked = true;
      if (a.checked) {
        dataOfParams.push(a.nameEn);
        count++;
      }
    }
    this.selectedParaIds_size = count;

    this.selectedParaIds_size = count;
    this.dispatchEvent(
      new CustomEvent("udcs_selectdropdown", {
        bubbles: true,
        detail: {
          data: count,
          list: JSON.parse(JSON.stringify(dataOfParams))
        }
      })
    );
  }

  //Default Utility function for development
  logToConsoleInfo(message) {
    if (isDebugMode) {
      console.log(message);
    }
  }
}