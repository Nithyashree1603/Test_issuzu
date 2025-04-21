/* eslint-disable @lwc/lwc/no-async-operation */
/* eslint-disable no-undef */
import { LightningElement, track, api } from "lwc";
import { loadScript } from "lightning/platformResourceLoader";
import user_Info from "@salesforce/apex/udcs_apex_connect.userInfo";
import label from "./udcs_lwc_fleetstatus_overview_export_translation";
import { executeParallelActions } from "c/udcs_lwc_ui_service";
import { dateUtil, libraries } from "c/udcs_lwc_utils";

const NUM_COLUMNS = 14;

export default class Udcs_lwc_fleetstatus_overview_export extends LightningElement {
  librariesLoaded = false;
  libraries = libraries;
  fleetName = "";
  timezone = "";
  label = label;
  isLoaded = false;
  @track xlsData = []; // store all tables data
  @api allTrackEvents = [];
  action_data = [];

  connectedCallback() {
    (async () => {
      await Promise.allSettled([loadScript(this, this.libraries.xlsx.bundle_js), loadScript(this, this.libraries.moment.v1_0)]);
      await executeParallelActions([user_Info()], this);
      let result = this.action_data[0];
      if (result.status === "fulfilled") {
        let userData = result.value;
        this.fleetName = userData.fleetName;
      } else {
        console.log(result.reason);
      }
    })();

    this.timezone = dateUtil.getUtcOffset();
  }
  download() {
    try {
      this.isLoaded = true;
      setTimeout(() => {
        let xlsData = [
          [
            {
              v: "",
              t: "s",
              s: {
                font: {
                  name: "Calibri",
                  sz: 12,
                  color: { rgb: "FFFFFFFF" },
                  bold: true
                }
              }
            },
            {
              v: label.lbl_ud_udconnectedservices,
              t: "s",
              s: {
                font: {
                  name: "Calibri",
                  sz: 14,
                  color: { rgb: "FFFFFFFF" },
                  bold: true
                },
                fill: { fgColor: { rgb: "008295" } },
                border: {
                  left: {
                    style: "thin",
                    color: { rgb: "00000000" }
                  },
                  right: {
                    style: "thin",
                    color: { rgb: "00000000" }
                  },
                  top: {
                    style: "thin",
                    color: { rgb: "00000000" }
                  },
                  bottom: {
                    style: "thin",
                    color: { rgb: "00000000" }
                  }
                }
              }
            },
            {
              v: "",
              t: "s",
              s: {
                font: {
                  name: "Calibri",
                  sz: 20,
                  color: { rgb: "FFFFFFFF" }
                },
                fill: { fgColor: { rgb: "008295" } }
              }
            },
            {
              v: "",
              t: "s",
              s: {
                font: {
                  name: "Calibri",
                  sz: 20,
                  color: { rgb: "FFFFFFFF" }
                },
                fill: { fgColor: { rgb: "008295" } }
              }
            },
            {
              v: "",
              t: "s",
              s: {
                font: {
                  name: "Calibri",
                  sz: 20,
                  color: { rgb: "FFFFFFFF" }
                },
                fill: { fgColor: { rgb: "008295" } }
              }
            },
            {
              v: "",
              t: "s",
              s: {
                font: {
                  name: "Calibri",
                  sz: 20,
                  color: { rgb: "FFFFFFFF" }
                },
                fill: { fgColor: { rgb: "008295" } }
              }
            },
            {
              v: "",
              t: "s",
              s: {
                font: {
                  name: "Calibri",
                  sz: 20,
                  color: { rgb: "FFFFFFFF" }
                },
                fill: { fgColor: { rgb: "008295" } }
              }
            },
            {
              v: "",
              t: "s",
              s: {
                font: {
                  name: "Calibri",
                  sz: 20,
                  color: { rgb: "FFFFFFFF" }
                },
                fill: { fgColor: { rgb: "008295" } }
              }
            },
            {
              v: "",
              t: "s",
              s: {
                font: {
                  name: "Calibri",
                  sz: 20,
                  color: { rgb: "FFFFFFFF" }
                },
                fill: { fgColor: { rgb: "008295" } }
              }
            },
            {
              v: "",
              t: "s",
              s: {
                font: {
                  name: "Calibri",
                  sz: 20,
                  color: { rgb: "FFFFFFFF" }
                },
                fill: { fgColor: { rgb: "008295" } }
              }
            },
            {
              v: "",
              t: "s",
              s: {
                font: {
                  name: "Calibri",
                  sz: 20,
                  color: { rgb: "FFFFFFFF" }
                },
                fill: { fgColor: { rgb: "008295" } }
              }
            },
            {
              v: "",
              t: "s",
              s: {
                font: {
                  name: "Calibri",
                  sz: 20,
                  color: { rgb: "FFFFFFFF" }
                },
                fill: { fgColor: { rgb: "008295" } }
              }
            },
            {
              v: "",
              t: "s",
              s: {
                font: {
                  name: "Calibri",
                  sz: 20,
                  color: { rgb: "FFFFFFFF" }
                },
                fill: { fgColor: { rgb: "008295" } }
              }
            },
            {
              v: "",
              t: "s",
              s: {
                font: {
                  name: "Calibri",
                  sz: 20,
                  color: { rgb: "FFFFFFFF" }
                },
                fill: { fgColor: { rgb: "008295" } }
              }
            }
          ],
          [
            {
              v: "",
              t: "s",
              s: {
                font: {
                  name: "Calibri",
                  sz: 12,
                  color: { rgb: "FFFFFFFF" }
                }
              }
            },
            {
              v: label.lbl_ud_FleetStatusOverview,
              t: "s",
              s: {
                font: {
                  name: "Calibri",
                  sz: 11,
                  color: { rgb: "00829b" },
                  bold: true
                }
              },
              border: {},
              fill: {
                fgColor: {
                  rgb: "FFFFFF"
                }
              }
            },
            {
              v: "",
              t: "s",
              s: {
                font: {
                  name: "Calibri",
                  sz: 10,
                  color: { rgb: "008295" },
                  bold: true
                }
              }
            },
            {
              v: "",
              t: "s",
              s: {
                font: {
                  name: "Calibri",
                  sz: 10,
                  color: { rgb: "008295" },
                  bold: true
                }
              }
            },
            {
              v: "",
              t: "s",
              s: {
                font: {
                  name: "Calibri",
                  sz: 10,
                  color: { rgb: "008295" },
                  bold: true
                }
              }
            },
            {
              v: "",
              t: "s",
              s: {
                font: {
                  name: "Calibri",
                  sz: 10,
                  color: { rgb: "008295" },
                  bold: true
                }
              }
            },
            {
              v: "",
              t: "s",
              s: {
                font: {
                  name: "Calibri",
                  sz: 10,
                  color: { rgb: "008295" },
                  bold: true
                }
              }
            },
            {
              v: "",
              t: "s",
              s: {
                font: {
                  name: "Calibri",
                  sz: 10,
                  color: { rgb: "008295" },
                  bold: true
                }
              }
            },
            {
              v: "",
              t: "s",
              s: {
                font: {
                  name: "Calibri",
                  sz: 10,
                  color: { rgb: "008295" },
                  bold: true
                }
              }
            },
            {
              v: "",
              t: "s",
              s: {
                font: {
                  name: "Calibri",
                  sz: 10,
                  color: { rgb: "008295" },
                  bold: true
                }
              }
            },
            {
              v: "",
              t: "s",
              s: {
                font: {
                  name: "Calibri",
                  sz: 10,
                  color: { rgb: "008295" },
                  bold: true
                }
              }
            },
            {
              v: "",
              t: "s",
              s: {
                font: {
                  name: "Calibri",
                  sz: 10,
                  color: { rgb: "008295" },
                  bold: true
                }
              }
            },
            {
              v: "",
              t: "s",
              s: {
                font: {
                  name: "Calibri",
                  sz: 10,
                  color: { rgb: "000000" }
                }
              }
            }
          ],
          [
            {
              v: "",
              t: "s",
              s: {
                font: {
                  name: "Calibri",
                  sz: 12,
                  color: { rgb: "FFFFFFFF" }
                }
              }
            },
            {
              v: label.lbl_UD_ReportCreated + "(UTC + 5:30)",
              t: "s",
              s: {
                font: {
                  name: "Calibri",
                  sz: 9,
                  color: { rgb: "FFFFFFFF" },
                  bold: true
                },
                alignment: { horizontal: "left", vertical: "center" },
                fill: { fgColor: { rgb: "008295" } },
                border: {
                  left: {
                    style: "thin",
                    color: { rgb: "00000000" }
                  },
                  right: {
                    style: "thin",
                    color: { rgb: "00000000" }
                  },
                  top: {
                    style: "thin",
                    color: { rgb: "00000000" }
                  },
                  bottom: {
                    style: "thin",
                    color: { rgb: "00000000" }
                  }
                }
              }
            },
            {
              v: dateUtil.getLocalFormattedDateTimeInHH(new Date()),
              t: "s",
              s: {
                font: {
                  name: "Calibri",
                  sz: 10,
                  color: { rgb: "000000" }
                },
                alignment: { vertical: "center" },
                fill: { fgColor: { rgb: "F2F2F2" } },
                border: {
                  left: {
                    style: "thin",
                    color: { rgb: "00000000" }
                  },
                  right: {
                    style: "thin",
                    color: { rgb: "00000000" }
                  },
                  top: {
                    style: "thin",
                    color: { rgb: "00000000" }
                  },
                  bottom: {
                    style: "thin",
                    color: { rgb: "00000000" }
                  }
                }
              }
            },
            {
              v: this.label.lbl_UD_FleetName + "",
              t: "s",
              s: {
                font: {
                  name: "Calibri",
                  sz: 9,
                  color: { rgb: "FFFFFFFF" },
                  bold: true
                },
                alignment: { horizontal: "left", vertical: "center" },
                fill: { fgColor: { rgb: "008295" } },
                border: {
                  left: {
                    style: "thin",
                    color: { rgb: "00000000" }
                  },
                  right: {
                    style: "thin",
                    color: { rgb: "00000000" }
                  },
                  top: {
                    style: "thin",
                    color: { rgb: "00000000" }
                  },
                  bottom: {
                    style: "thin",
                    color: { rgb: "00000000" }
                  }
                }
              }
            },
            {
              v: this.fleetName,
              t: "s",
              s: {
                font: {
                  name: "Calibri",
                  sz: 10,
                  color: { rgb: "000000" }
                },
                alignment: { vertical: "center" },
                fill: { fgColor: { rgb: "F2F2F2" } },
                border: {
                  left: {
                    style: "thin",
                    color: { rgb: "00000000" }
                  },
                  right: {
                    style: "thin",
                    color: { rgb: "00000000" }
                  },
                  top: {
                    style: "thin",
                    color: { rgb: "00000000" }
                  },
                  bottom: {
                    style: "thin",
                    color: { rgb: "00000000" }
                  }
                }
              }
            }
          ],
          // [
          //   {
          //     v: this.label.lbl_UD_ReportCreated + ":",
          //     t: "s",
          //     s: {
          //       font: {
          //         name: "Calibri",
          //         sz: 10,
          //         color: { rgb: "FFFFFFFF" }
          //       },
          //       fill: { fgColor: { rgb: "008295" } },
          //       border: {
          //         left: {
          //           style: "thin",
          //           color: { rgb: "00000000" }
          //         },
          //         right: {
          //           style: "thin",
          //           color: { rgb: "00000000" }
          //         },
          //         top: {
          //           style: "thin",
          //           color: { rgb: "00000000" }
          //         },
          //         bottom: {
          //           style: "thin",
          //           color: { rgb: "00000000" }
          //         }
          //       }
          //     }
          //   },
          //   {
          //     v: moment().format("DD/MM/YYYY HH:mm"),
          //     t: "s",
          //     s: {
          //       font: {
          //         name: "Calibri",
          //         sz: 10,
          //         color: { rgb: "000000" }
          //       },
          //       fill: { fgColor: { rgb: "F2F2F2" } },
          //       border: {
          //         left: {
          //           style: "thin",
          //           color: { rgb: "00000000" }
          //         },
          //         right: {
          //           style: "thin",
          //           color: { rgb: "00000000" }
          //         },
          //         top: {
          //           style: "thin",
          //           color: { rgb: "00000000" }
          //         },
          //         bottom: {
          //           style: "thin",
          //           color: { rgb: "00000000" }
          //         }
          //       }
          //     }
          //   }
          // ],
          [],
          [
            {
              v: "",
              t: "s",
              s: {
                font: {
                  name: "Calibri",
                  sz: 12,
                  color: { rgb: "FFFFFFFF" }
                }
              }
            },
            {
              v: "Events Details",
              t: "s",
              s: {
                font: {
                  name: "Calibri",
                  sz: 11,
                  color: { rgb: "00829b" },
                  bold: true
                }
              }
            }
          ],
          [
            {
              v: "",
              t: "s",
              s: {
                font: {
                  name: "Calibri",
                  sz: 12,
                  color: { rgb: "FFFFFFFF" }
                }
              }
            },
            {
              v: `${label.lbl_date_time} (UTC${this.timezone})`,
              t: "s",
              s: {
                font: {
                  name: "Calibri",
                  sz: 9,
                  color: { rgb: "FFFFFFFF" },
                  bold: true
                },
                alignment: { vertical: "center", horizontal: "center", wrapText: true },
                fill: { fgColor: { rgb: "008295" } },
                border: {
                  left: {
                    style: "thin",
                    color: { rgb: "00000000" }
                  },
                  right: {
                    style: "thin",
                    color: { rgb: "00000000" }
                  },
                  top: {
                    style: "thin",
                    color: { rgb: "00000000" }
                  },
                  bottom: {
                    style: "thin",
                    color: { rgb: "00000000" }
                  }
                }
              }
            },
            {
              v: this.label.lbl_chassisid,
              t: "s",
              s: {
                font: {
                  name: "Calibri",
                  sz: 9,
                  color: { rgb: "FFFFFFFF" },
                  bold: true
                },
                alignment: { vertical: "center", horizontal: "center", wrapText: true },
                fill: { fgColor: { rgb: "008295" } },
                border: {
                  left: {
                    style: "thin",
                    color: { rgb: "00000000" }
                  },
                  right: {
                    style: "thin",
                    color: { rgb: "00000000" }
                  },
                  top: {
                    style: "thin",
                    color: { rgb: "00000000" }
                  },
                  bottom: {
                    style: "thin",
                    color: { rgb: "00000000" }
                  }
                }
              }
            },
            {
              v: this.label.lbl_reg_no,
              t: "s",
              s: {
                font: {
                  name: "Calibri",
                  sz: 9,
                  color: { rgb: "FFFFFFFF" },
                  bold: true
                },
                fill: { fgColor: { rgb: "008295" } },
                border: {
                  left: {
                    style: "thin",
                    color: { rgb: "00000000" }
                  },
                  right: {
                    style: "thin",
                    color: { rgb: "00000000" }
                  },
                  top: {
                    style: "thin",
                    color: { rgb: "00000000" }
                  },
                  bottom: {
                    style: "thin",
                    color: { rgb: "00000000" }
                  }
                },
                alignment: { vertical: "center", horizontal: "center", wrapText: true }
              }
            },
            {
              v: this.label.lbl_ud_TruckID,
              t: "s",
              s: {
                font: {
                  name: "Calibri",
                  sz: 9,
                  color: { rgb: "FFFFFFFF" },
                  bold: true
                },
                fill: { fgColor: { rgb: "008295" } },
                border: {
                  left: {
                    style: "thin",
                    color: { rgb: "00000000" }
                  },
                  right: {
                    style: "thin",
                    color: { rgb: "00000000" }
                  },
                  top: {
                    style: "thin",
                    color: { rgb: "00000000" }
                  },
                  bottom: {
                    style: "thin",
                    color: { rgb: "00000000" }
                  }
                },
                alignment: { vertical: "center", horizontal: "center", wrapText: true }
              }
            },
            {
              v: label.lbl_ud_vehicle_specification,
              t: "s",
              s: {
                font: {
                  name: "Calibri",
                  sz: 9,
                  color: { rgb: "FFFFFFFF" },
                  bold: true
                },
                fill: { fgColor: { rgb: "008295" } },
                alignment: { vertical: "center", horizontal: "center", wrapText: true },
                border: {
                  left: {
                    style: "thin",
                    color: { rgb: "00000000" }
                  },
                  right: {
                    style: "thin",
                    color: { rgb: "00000000" }
                  },
                  top: {
                    style: "thin",
                    color: { rgb: "00000000" }
                  },
                  bottom: {
                    style: "thin",
                    color: { rgb: "00000000" }
                  }
                }
              }
            },
            {
              v: this.label.lbl_ud_driver,
              t: "s",
              s: {
                font: {
                  name: "Calibri",
                  sz: 9,
                  color: { rgb: "FFFFFFFF" },
                  bold: true
                },
                alignment: { vertical: "center", horizontal: "center", wrapText: true },
                fill: { fgColor: { rgb: "008295" } },
                border: {
                  left: {
                    style: "thin",
                    color: { rgb: "00000000" }
                  },
                  right: {
                    style: "thin",
                    color: { rgb: "00000000" }
                  },
                  top: {
                    style: "thin",
                    color: { rgb: "00000000" }
                  },
                  bottom: {
                    style: "thin",
                    color: { rgb: "00000000" }
                  }
                }
              }
            },
            {
              v: this.label.lbl_fuellevel_pr,
              t: "s",
              s: {
                font: {
                  name: "Calibri",
                  sz: 9,
                  color: { rgb: "FFFFFFFF" },
                  bold: true
                },
                alignment: { vertical: "center", horizontal: "center", wrapText: true },
                fill: { fgColor: { rgb: "008295" } },
                border: {
                  left: {
                    style: "thin",
                    color: { rgb: "00000000" }
                  },
                  right: {
                    style: "thin",
                    color: { rgb: "00000000" }
                  },
                  top: {
                    style: "thin",
                    color: { rgb: "00000000" }
                  },
                  bottom: {
                    style: "thin",
                    color: { rgb: "00000000" }
                  }
                }
              }
            },
            {
              v: this.label.lbl_adbluelevel_pr,
              t: "s",
              s: {
                font: {
                  name: "Calibri",
                  sz: 9,
                  color: { rgb: "FFFFFFFF" },
                  bold: true
                },
                alignment: { vertical: "center", horizontal: "center", wrapText: true },
                fill: { fgColor: { rgb: "008295" } },
                border: {
                  left: {
                    style: "thin",
                    color: { rgb: "00000000" }
                  },
                  right: {
                    style: "thin",
                    color: { rgb: "00000000" }
                  },
                  top: {
                    style: "thin",
                    color: { rgb: "00000000" }
                  },
                  bottom: {
                    style: "thin",
                    color: { rgb: "00000000" }
                  }
                }
              }
            },
            {
              v: this.label.lbl_speed_km_h,
              t: "s",
              s: {
                font: {
                  name: "Calibri",
                  sz: 9,
                  color: { rgb: "FFFFFFFF" },
                  bold: true
                },
                alignment: { vertical: "center", horizontal: "center", wrapText: true },
                fill: { fgColor: { rgb: "008295" } },
                border: {
                  left: {
                    style: "thin",
                    color: { rgb: "00000000" }
                  },
                  right: {
                    style: "thin",
                    color: { rgb: "00000000" }
                  },
                  top: {
                    style: "thin",
                    color: { rgb: "00000000" }
                  },
                  bottom: {
                    style: "thin",
                    color: { rgb: "00000000" }
                  }
                }
              }
            },
            {
              v: this.label.lbl_ud_odometer_km,
              t: "s",
              s: {
                font: {
                  name: "Calibri",
                  sz: 9,
                  color: { rgb: "FFFFFFFF" },
                  bold: true
                },
                alignment: { vertical: "center", horizontal: "center", wrapText: true },
                fill: { fgColor: { rgb: "008295" } },
                border: {
                  left: {
                    style: "thin",
                    color: { rgb: "00000000" }
                  },
                  right: {
                    style: "thin",
                    color: { rgb: "00000000" }
                  },
                  top: {
                    style: "thin",
                    color: { rgb: "00000000" }
                  },
                  bottom: {
                    style: "thin",
                    color: { rgb: "00000000" }
                  }
                }
              }
            },
            {
              v: this.label.lbl_UD_Enginehours_hh_mm,
              t: "s",
              s: {
                font: {
                  name: "Calibri",
                  sz: 9,
                  color: { rgb: "FFFFFFFF" },
                  bold: true
                },
                alignment: { vertical: "center", horizontal: "center", wrapText: true },
                fill: { fgColor: { rgb: "008295" } },
                border: {
                  left: {
                    style: "thin",
                    color: { rgb: "00000000" }
                  },
                  right: {
                    style: "thin",
                    color: { rgb: "00000000" }
                  },
                  top: {
                    style: "thin",
                    color: { rgb: "00000000" }
                  },
                  bottom: {
                    style: "thin",
                    color: { rgb: "00000000" }
                  }
                }
              }
            },
            {
              v: this.label.lbl_vehiclestatus,
              t: "s",
              s: {
                font: {
                  name: "Calibri",
                  sz: 9,
                  color: { rgb: "FFFFFFFF" },
                  bold: true
                },
                alignment: { vertical: "center", horizontal: "center", wrapText: true },
                fill: { fgColor: { rgb: "008295" } },
                border: {
                  left: {
                    style: "thin",
                    color: { rgb: "00000000" }
                  },
                  right: {
                    style: "thin",
                    color: { rgb: "00000000" }
                  },
                  top: {
                    style: "thin",
                    color: { rgb: "00000000" }
                  },
                  bottom: {
                    style: "thin",
                    color: { rgb: "00000000" }
                  }
                }
              }
            },
            {
              v: this.label.lbl_location,
              t: "s",
              s: {
                font: {
                  name: "Calibri",
                  sz: 10,
                  color: { rgb: "FFFFFFFF" },
                  bold: true
                },
                alignment: { vertical: "center", horizontal: "center", wrapText: true },
                fill: { fgColor: { rgb: "008295" } },
                border: {
                  left: {
                    style: "thin",
                    color: { rgb: "00000000" }
                  },
                  right: {
                    style: "thin",
                    color: { rgb: "00000000" }
                  },
                  top: {
                    style: "thin",
                    color: { rgb: "00000000" }
                  },
                  bottom: {
                    style: "thin",
                    color: { rgb: "00000000" }
                  }
                }
              }
            }
          ]
        ];
        let tempAllTrackEvents = JSON.parse(JSON.stringify(this.allTrackEvents));
        tempAllTrackEvents.sort((a, b) => {
          if (a.chassisNumber < b.chassisNumber) {
            return -1;
          }
          if (a.chassisNumber > b.chassisNumber) {
            return 1;
          }
          return 0;
        });
        for (let a of tempAllTrackEvents) {
          let rowData = [];
          rowData.push({});
          rowData.push({
            v: a.formattedTriggerDateTime,
            t: "s",
            s: {
              font: {
                name: "Calibri",
                sz: 10,
                color: { rgb: "000000" }
              },
              fill: { fgColor: { rgb: "F2F2F2" } },
              border: {
                left: {
                  style: "thin",
                  color: { rgb: "00000000" }
                },
                right: {
                  style: "thin",
                  color: { rgb: "00000000" }
                },
                top: {
                  style: "thin",
                  color: { rgb: "00000000" }
                },
                bottom: {
                  style: "thin",
                  color: { rgb: "00000000" }
                }
              }
            }
          });
          rowData.push({
            v: a.chassisNumber,
            t: "s",
            s: {
              font: {
                name: "Calibri",
                sz: 10,
                color: { rgb: "000000" }
              },
              fill: { fgColor: { rgb: "F2F2F2" } },
              border: {
                left: {
                  style: "thin",
                  color: { rgb: "00000000" }
                },
                right: {
                  style: "thin",
                  color: { rgb: "00000000" }
                },
                top: {
                  style: "thin",
                  color: { rgb: "00000000" }
                },
                bottom: {
                  style: "thin",
                  color: { rgb: "00000000" }
                }
              }
            }
          });
          rowData.push({
            v: a.registrationNumber === "" ? "-" : a.registrationNumber,
            t: "s",
            s: {
              font: {
                name: "Calibri",
                sz: 10,
                color: { rgb: "000000" }
              },
              fill: { fgColor: { rgb: "F2F2F2" } },
              border: {
                left: {
                  style: "thin",
                  color: { rgb: "00000000" }
                },
                right: {
                  style: "thin",
                  color: { rgb: "00000000" }
                },
                top: {
                  style: "thin",
                  color: { rgb: "00000000" }
                },
                bottom: {
                  style: "thin",
                  color: { rgb: "00000000" }
                }
              }
            }
          });
          rowData.push({
            v: a.truckId,
            t: "s",
            s: {
              font: {
                name: "Calibri",
                sz: 10,
                color: { rgb: "000000" }
              },
              fill: { fgColor: { rgb: "F2F2F2" } },
              border: {
                left: {
                  style: "thin",
                  color: { rgb: "00000000" }
                },
                right: {
                  style: "thin",
                  color: { rgb: "00000000" }
                },
                top: {
                  style: "thin",
                  color: { rgb: "00000000" }
                },
                bottom: {
                  style: "thin",
                  color: { rgb: "00000000" }
                }
              }
            }
          });
          rowData.push({
            v: a.vehicleSpec,
            t: "s",
            s: {
              font: {
                name: "Calibri",
                sz: 10,
                color: { rgb: "000000" }
              },
              fill: { fgColor: { rgb: "F2F2F2" } },
              border: {
                left: {
                  style: "thin",
                  color: { rgb: "00000000" }
                },
                right: {
                  style: "thin",
                  color: { rgb: "00000000" }
                },
                top: {
                  style: "thin",
                  color: { rgb: "00000000" }
                },
                bottom: {
                  style: "thin",
                  color: { rgb: "00000000" }
                }
              }
            }
          });
          rowData.push({
            v: a.driverName === "-" ? `${label.lbl_ud_UnknownDriver}` : a.driverName,
            t: "s",
            s: {
              font: {
                name: "Calibri",
                sz: 10,
                color: { rgb: "000000" }
              },
              fill: { fgColor: { rgb: "F2F2F2" } },
              border: {
                left: {
                  style: "thin",
                  color: { rgb: "00000000" }
                },
                right: {
                  style: "thin",
                  color: { rgb: "00000000" }
                },
                top: {
                  style: "thin",
                  color: { rgb: "00000000" }
                },
                bottom: {
                  style: "thin",
                  color: { rgb: "00000000" }
                }
              }
            }
          });
          rowData.push({
            v: a.diesel,
            t: "s",
            s: {
              font: {
                name: "Calibri",
                sz: 10,
                color: { rgb: "000000" }
              },
              fill: { fgColor: { rgb: "F2F2F2" } },
              border: {
                left: {
                  style: "thin",
                  color: { rgb: "00000000" }
                },
                right: {
                  style: "thin",
                  color: { rgb: "00000000" }
                },
                top: {
                  style: "thin",
                  color: { rgb: "00000000" }
                },
                bottom: {
                  style: "thin",
                  color: { rgb: "00000000" }
                }
              },
              alignment: { horizontal: "right" }
            }
          });
          rowData.push({
            v: a.Adblue,
            t: "s",
            s: {
              font: {
                name: "Calibri",
                sz: 10,
                color: { rgb: "000000" }
              },
              fill: { fgColor: { rgb: "F2F2F2" } },
              border: {
                left: {
                  style: "thin",
                  color: { rgb: "00000000" }
                },
                right: {
                  style: "thin",
                  color: { rgb: "00000000" }
                },
                top: {
                  style: "thin",
                  color: { rgb: "00000000" }
                },
                bottom: {
                  style: "thin",
                  color: { rgb: "00000000" }
                }
              },
              alignment: { horizontal: "right" }
            }
          });
          rowData.push({
            v: a.wheelBasedSpeed,
            t: "s",
            s: {
              font: {
                name: "Calibri",
                sz: 10,
                color: { rgb: "000000" }
              },
              fill: { fgColor: { rgb: "F2F2F2" } },
              border: {
                left: {
                  style: "thin",
                  color: { rgb: "00000000" }
                },
                right: {
                  style: "thin",
                  color: { rgb: "00000000" }
                },
                top: {
                  style: "thin",
                  color: { rgb: "00000000" }
                },
                bottom: {
                  style: "thin",
                  color: { rgb: "00000000" }
                }
              },
              alignment: { horizontal: "right" }
            }
          });
          rowData.push({
            v: a.Odometer,
            t: "s",
            s: {
              font: {
                name: "Calibri",
                sz: 10,
                color: { rgb: "000000" }
              },
              fill: { fgColor: { rgb: "F2F2F2" } },
              border: {
                left: {
                  style: "thin",
                  color: { rgb: "00000000" }
                },
                right: {
                  style: "thin",
                  color: { rgb: "00000000" }
                },
                top: {
                  style: "thin",
                  color: { rgb: "00000000" }
                },
                bottom: {
                  style: "thin",
                  color: { rgb: "00000000" }
                }
              },
              alignment: { horizontal: "right" }
            }
          });
          rowData.push({
            v: a.enginehours,
            t: "s",
            s: {
              font: {
                name: "Calibri",
                sz: 10,
                color: { rgb: "000000" }
              },
              fill: { fgColor: { rgb: "F2F2F2" } },
              border: {
                left: {
                  style: "thin",
                  color: { rgb: "00000000" }
                },
                right: {
                  style: "thin",
                  color: { rgb: "00000000" }
                },
                top: {
                  style: "thin",
                  color: { rgb: "00000000" }
                },
                bottom: {
                  style: "thin",
                  color: { rgb: "00000000" }
                }
              },
              alignment: { horizontal: "right" }
            }
          });
          rowData.push({
            v: a.fleetStatusLabel,
            t: "s",
            s: {
              font: {
                name: "Calibri",
                sz: 10,
                color: { rgb: "000000" }
              },
              fill: { fgColor: { rgb: "F2F2F2" } },
              border: {
                left: {
                  style: "thin",
                  color: { rgb: "00000000" }
                },
                right: {
                  style: "thin",
                  color: { rgb: "00000000" }
                },
                top: {
                  style: "thin",
                  color: { rgb: "00000000" }
                },
                bottom: {
                  style: "thin",
                  color: { rgb: "00000000" }
                }
              }
            }
          });
          //rowData.push({ v: a.reverseGeoAddress, t: "s", s: { alignment: { horizontal: "left" } } });
          rowData.push({
            v: a.reverseGeoAddress === "" ? "-" : a.reverseGeoAddress,
            t: "s",
            s: {
              font: {
                name: "Calibri",
                sz: 10,
                color: { rgb: "000000" }
              },
              fill: { fgColor: { rgb: "F2F2F2" } },
              border: {
                left: {
                  style: "thin",
                  color: { rgb: "00000000" }
                },
                right: {
                  style: "thin",
                  color: { rgb: "00000000" }
                },
                top: {
                  style: "thin",
                  color: { rgb: "00000000" }
                },
                bottom: {
                  style: "thin",
                  color: { rgb: "00000000" }
                }
              }
            }
          });
          xlsData.push(rowData);
        }
        this.xlsData = xlsData;
        // console.log("XLSX", XLSX.utils);
        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.aoa_to_sheet(this.xlsData);
        let dataCount = {};
        for (let i = 0; i < NUM_COLUMNS; i++) {
          dataCount[i] = [];
        }
        for (let a of this.xlsData) {
          let count = 0;
          for (let b of a) {
            if (typeof b === "object" && b !== null) {
              dataCount[count].push(String(b.v).length);
            } else {
              dataCount[count].push(String(b).length);
            }
            count++;
          }
        }
        let wsCols = [];
        for (let i = 0; i < NUM_COLUMNS; i++) {
          try {
            wsCols.push({
              wch: dataCount[i]
                .sort(function (a, b) {
                  return a - b;
                })
                .reverse()[0]
            });
          } catch (error) {
            console.log(error);
            wsCols.push({ wch: 30 });
          }
        }
        ws["!cols"] = wsCols;
        ws["!rows"] = [{}, {}, {}, {}, {}, { hpt: 30 }];
        XLSX.utils.book_append_sheet(wb, ws, label.lbl_ud_FleetStatusOverview);
        XLSX.writeFile(wb, label.lbl_ud_Fleet + "_" + label.lbl_ud_status + "_" + label.lbl_ud_report + "_" + moment().format("DD_MM_YYYY_HH_mm") + ".xlsx");
        this.isLoaded = false;
      }, 1000);
    } catch (error) {
      console.log(error);
    }
  }
}