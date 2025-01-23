function traceSummary(that, result) {
  let temp = new Map();
  for (let a of result.summaries) {
    temp.set(a.itemName, a);
  }
  let data = temp.get("Distance Covered");
  if (data) {
    let evd_temp = parseFloat(data.itemValue).toFixed(2);
    evd_temp = isNaN(evd_temp) ? "-" : evd_temp.toLocaleString() + ` km`; //data.measurementSystem
    that.summaryDistanceCovered = evd_temp;
  } else {
    that.summaryDistanceCovered = "-";
  }
  data = temp.get("Total Fuel Consumed");
  if (data) {
    let evd_temp = parseFloat(data.itemValue).toFixed(2);
    evd_temp = isNaN(evd_temp) ? "-" : parseFloat(evd_temp).toLocaleString() + ` L`; //data.measurementSystem
    that.summaryTotalFuelConsumed = evd_temp;
  } else {
    that.summaryTotalFuelConsumed = "-";
  }
  data = temp.get("Total Engine Hours");
  if (data) {
    let evd_temp = data.itemValue.split(":");
    evd_temp = evd_temp[0] + "h " + evd_temp[1] + "m";
    that.summaryTotalEH = evd_temp;
  } else {
    that.summaryTotalEH = "-";
  }
  data = temp.get("Total Fuel Efficiency");
  if (data) {
    let evd_temp = parseFloat(data.itemValue).toFixed(2);
    evd_temp = isNaN(evd_temp) ? "-" : parseFloat(evd_temp).toLocaleString() + ` km/L`; //data.measurementSystem);
    that.summaryTotalFE = evd_temp;
  } else {
    that.summaryTotalFE = "-";
  }

  data = temp.get("Maximum Speed");
  if (data) {
    let evd_temp = parseFloat(data.itemValue).toFixed(0);
    evd_temp = isNaN(evd_temp) ? "-" : parseFloat(evd_temp).toLocaleString() + ` km/h`; // data.measurementSystem
    that.summaryMaximumSpeed = evd_temp;
  } else {
    that.summaryMaximumSpeed = "-";
  }
}
export default { traceSummary };