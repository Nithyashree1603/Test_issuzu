// Stub module for udcs_lwc_utils - provides utility functions
export const dateUtil = {
  getUtcOffset: () => '+00:00',
  formatDate: (date) => new Date(date).toLocaleDateString()
};

export const libraries = {
  moment: {
    v1_0: 'https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.29.1/moment.min.js'
  },
  xlsx: {
    bundle_js: 'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js'
  }
};

export const icons = {
  common: {
    hamburger: {
      turquoise: ''
    },
    cross: {
      dim_10_x_10: ''
    },
    search: {
      dark_gray: ''
    },
    prev_icon: '',
    prevs_icon: '',
    next_icon: '',
    nexts_icon: '',
    export: {
      turquoise: '',
      light_gray: ''
    },
    ascending: '',
    no_records_found: ''
  },
  track: {
    status: {
      moving: '',
      igntion_on: '',
      igntion_off: '',
      non_comm: '',
      no_data: ''
    },
    directions: {}
  }
};

export const isDebugMode = () => false;

export const setStyle = (element, action, value) => {
  if (!element) return;
  if (action === 'toggleClass') {
    element.classList.toggle(value);
  } else if (action === 'addClassList') {
    element.classList.add(value);
  } else if (action === 'removeClassList') {
    element.classList.remove(value);
  }
};

export const mobileDeviceCheck = () => {
  const ua = navigator.userAgent;
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua);
};

export const getLocalFormatedDateTimeInHH = (date) => {
  return new Date(date).toLocaleString();
};

export const getLocalFormatedDate = (date) => {
  return new Date(date).toLocaleDateString();
};

export const getCountryName = (countryCode) => {
  return countryCode || 'Unknown';
};

export const vehicleDataTransform = (data) => {
  if (data && data.value && Array.isArray(data.value.records)) {
    return data.value.records;
  }
  return [];
};

export const getLocalNumber = (num) => {
  if (typeof num === 'number') {
    return num.toLocaleString();
  }
  return num;
};

export const getLocalNumberWithDecimal = (num) => {
  if (typeof num === 'number') {
    return num.toLocaleString(undefined, { minimumFractionDigits: 2 });
  }
  return num;
};

export const stringUtils = {
  trim: (str) => str ? str.trim() : '',
  isEmpty: (str) => !str || str.trim() === ''
};

export const sendEventToGA4 = (eventName, data = {}) => {
  // Stub GA4 event tracking
  console.log('GA4 Event:', eventName, data);
};

export const getFeatureVisibilityData = () => {
  return {
    maps: true,
    export: true,
    geofence: true
  };
};
