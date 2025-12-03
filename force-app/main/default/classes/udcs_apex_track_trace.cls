global class udcs_apex_track_trace extends udcs_apex_service_base {
    @AuraEnabled(cacheable=true)
    global static string gettraceSummary(string rangeType, string startRange, string endRange, string chassisId, Boolean mapScreen) {
      udcs_apex_udcs_domain.Token accessToken = (udcs_apex_udcs_domain.Token) udcs_apex_session_cache_manager.getAccessToken();
      String fleetIdentifier = ((udcs_apex_udcs_domain.AccessToken) (accessToken.decodedToken)).currentScope.fleetIdentifier;
      String InitialAccessToken = udcs_apex_session_cache_manager.getUDCSTokenString();
  
      udcs_apex_request_params requestParams = new udcs_apex_request_params();
      string requestBody;
      requestParams.EndPoint = udcs_apex_config_manager.getEndPointURL(udcs_apex_config_manager.Endpoint.TRACESUMMARYV3);
      requestBody =
        '{"mapScreen":'+mapScreen+',"rangeType": "' +
        rangeType +
        '","chassisId": "' +
        chassisId +
        '","startRange": "' +
        startRange +
        '","endRange": "' +
        endRange +
        '","language": "en_GB","fleetIdentifier": "' +
        fleetIdentifier +
        '"}';
      requestParams.Body = requestBody;
      requestParams.Method = 'POST';
      requestParams.ContentType = 'application/json';
      requestParams.Token = InitialAccessToken;
      requestParams.APIErrorCode = udcs_apex_error_codes.TRACESUMMARY;
      requestParams.Accept = '*/*';
      HTTPResponse response = execute(requestParams);
      return response.getBody();
    }
  
    @AuraEnabled(cacheable=true)
    public static string getTraceSummaryNew(String reqBody) {
      udcs_apex_request_params requestParams = new udcs_apex_request_params();
  
      requestParams.EndPoint = udcs_apex_config_manager.getEndPointURL(udcs_apex_config_manager.Endpoint.TRACESUMMARYV3);
      requestParams.Method = 'POST';
      requestParams.Accept = '*/*';
      requestParams.ContentType = 'application/vnd.com.ud.cs.trackingandutilization-repository.TraceSummaryRequest.v1.0+json';
      requestParams.Token = null;
  
      requestParams.Body = reqBody;
  
      requestParams.APIErrorCode = udcs_apex_error_codes.FLEETUSAGEREPORT;
  
      HTTPResponse response = execute(requestParams);
  
      return response.getBody();
    }
  
    @AuraEnabled(cacheable=true)
    global static string getTrackingEventsHistory(string offset, string rangeType, string startRange, string endRange, string chassisId, string truckId, Boolean mapScreen) {
      udcs_apex_udcs_domain.UserCustomInfo userInfo = (udcs_apex_udcs_domain.UserCustomInfo) udcs_apex_session_cache_manager.getUserInfo();
      String currentFleetName = userInfo.currentFleet != null ? userInfo.currentFleet.nodeName : '';
      String countryCode = userInfo.currentMarket != null ? userInfo.currentMarket.nodeName : '';
      String triggerTypes =
        '[' +
        '"IGNITION_ON",' +
        '"IGNITION_OFF",' +
        '"DRIVER_LOGIN",' +
        '"DRIVER_LOGOUT",' +
        '"PERIODIC",' +
        '"PERIODIC_WITH_ENGINE_ON",' +
        '"PERIODIC_WITH_DISTANCE",' +
        '"MOVEMENT",' +
        '"NO_MOVEMENT",' +
        '"SEATBELT_STATUS_WHILE_MOVING",' +
        '"OVERSPEEDING",' +
        '"OVERREVVING_STATUS",' +
        '"HARSH_ACCELERATION",' +
        '"HARSH_DECELERATION",' +
        '"FUELLEVEL_CHANGED_WHILE_STOPPED",' +
        '"FUELLEVEL_CHANGED_WHILE_STOPPED_POSITIVE",' +
        '"FUELLEVEL_CHANGED_WHILE_STOPPED_NEGATIVE",' +
        '"IDLING",' +
        '"SEATBELT_STATUS_WHILE_MOVING_ENGAGED",' +
        '"SEATBELT_STATUS_WHILE_MOVING_DISENGAGED",' +
        '"OVERSPEEDING_STARTED",' +
        '"OVERSPEEDING_ENDED",' +
        '"OVERREVVING_STATUS_STARTED",' +
        '"OVERREVVING_STATUS_ENDED",' +
        '"IDLING_STARTED",' +
        '"IDLING_ENDED",' +
        '"COLLISION_MITIGATION_WARNING",' +
        '"ADBLUELEVEL_LOW"' +
        ']';
      udcs_apex_request_params requestParams = new udcs_apex_request_params();
      string requestBody;
      requestBody =
        '{"language": "en_GB", "mapScreen":'+mapScreen+',"chassisId": "' +
        chassisId +
        '","truckId": "' +
        truckId +
        '","rangeType": "' +
        rangeType +
        '","startRange": "' +
        startRange +
        '","endRange": "' +
        endRange +
        '","countryCode": "' +
        countryCode +
        '","timeType": "TRIGGER_TIME",' +
        '"fuelType": "DIESEL",' +
        '"sort": "DESC",' +
        '"dataItemNames": ["adBlueLevel","totalFuelLevel","totalConsumption","lovEngineTime","lovVehicleDistance","speed","adBlueLevelLowIndicator","location","position","wiperIndicator","fuelLevelChangedWhileStopped"],' +
        '"triggerTypes":' +
        triggerTypes +
        ',"pagination": {"limit": 5000,"offset": "' +
        offset +
        '","totalCount": 0}}';
  
      requestParams.EndPoint = udcs_apex_config_manager.getEndPointURL(udcs_apex_config_manager.Endpoint.TRACKINGEVENTSHISTORYV3);
      requestParams.Method = 'POST';
      requestParams.Body = requestBody;
      // requestParams.Token = InitialAccessToken;
      requestParams.ContentType = 'application/json';
      requestParams.Accept = '*/*';
      requestParams.APIErrorCode = udcs_apex_error_codes.TRACKINGEVENTSHISTORY;
      HTTPResponse response = execute(requestParams);
      return response.getBody();
    }
  
    @AuraEnabled(cacheable=true)
    global static string trackingEventDetails() {
      String InitialAccessToken = udcs_apex_session_cache_manager.getUDCSTokenString();
  
      udcs_apex_request_params requestParams = new udcs_apex_request_params();
      string requestUrl = udcs_apex_config_manager.getEndPointURL(udcs_apex_config_manager.Endpoint.TRACKINGEVENTSDETAILS);
      requestUrl += '?language=' + udcs_apex_config_manager.languageLongFormate();
      requestParams.EndPoint = requestUrl;
      requestParams.Method = 'GET';
      requestParams.ContentType = 'application/json';
      requestParams.Token = InitialAccessToken;
      requestParams.APIErrorCode = udcs_apex_error_codes.TRACKINGEVENTSDETAILS;
      HTTPResponse response = execute(requestParams);
      return response.getBody();
    }
  
    @AuraEnabled(cacheable=true)
    global static string getTrackingEventsHistoryExport(
      String chassisId,
      String truckId,
      String vehicleSpec,
      String startRange,
      String endRange,
      String triggerTypes,
      String dataItems,
      String userTimeZone,
      String registrationNumber,
      String rangeType
    ) {
      udcs_apex_udcs_domain.Token accessToken = (udcs_apex_udcs_domain.Token) udcs_apex_session_cache_manager.getAccessToken();
      String fleetIdentifier = ((udcs_apex_udcs_domain.AccessToken) (accessToken.decodedToken)).currentScope.fleetIdentifier;
      String initialAccessToken = udcs_apex_session_cache_manager.getUDCSTokenString();
      String fleetName = ((udcs_apex_udcs_domain.AccessToken) (accessToken.decodedToken)).currentScope.fleetName;
  
      udcs_apex_udcs_domain.UserCustomInfo userInfo = (udcs_apex_udcs_domain.UserCustomInfo) udcs_apex_session_cache_manager.getUserInfo();
      String currentFleetName = userInfo.currentFleet != null ? userInfo.currentFleet.nodeName : '';
      String countryCode = userInfo.currentMarket != null ? userInfo.currentMarket.nodeName : '';
  
      udcs_apex_request_params requestParams = new udcs_apex_request_params();
  
      string requestBody =
        '{"mapScreen": true,"language":"' +
        udcs_apex_config_manager.languageLongFormate() +
        '","chassisId":"' +
        chassisId +
        '","rangeType":"' +
        rangeType +
        '","startRange":"' +
        startRange +
        '","endRange":"' +
        endRange +
        '","timeType":"' +
        'TRIGGER_TIME' +
        '","fuelType":"' +
        'DIESEL' +
        '","dataItemNames":' +
        dataItems +
        ',"triggerTypes":' +
        triggerTypes +
        ',"truckId":"' +
        truckId +
        '","sort":"' +
        'DESC' +
        '","countryCode":"' +
        countryCode +
        '","fleetName":"' +
        currentFleetName +
        '","userTimeZone":"' +
        userTimeZone +
        '","registrationNumber":"' +
        registrationNumber +
        '","vehicleSpec":"' +
        vehicleSpec +
        '"}';
  
      System.debug('>>>>>>>>>>>> ' + requestBody);
  
      requestParams.Body = requestBody;
      requestParams.EndPoint = udcs_apex_config_manager.getEndPointURL(udcs_apex_config_manager.Endpoint.TRACKINGEVENTSHISTORYREPORTV3); //'https://qa.api.telematics.udtrucks.com/trackingEvents/trackingEventsHistoryReport';
      requestParams.ContentType = 'application/json';
      requestParams.Token = initialAccessToken;
      requestParams.Method = 'POST';
      requestParams.APIErrorCode = udcs_apex_error_codes.TRACKINGEVENTSHISTORYREPORT;
  
      HTTPResponse response = execute(requestParams);
      return response.getBody();
    }
  
    @AuraEnabled(cacheable=true)
    public static string getTnuOdometer(String userTimezone, String chassisId) {
      udcs_apex_request_params requestParams = new udcs_apex_request_params();
  
      requestParams.EndPoint = udcs_apex_config_manager.getEndPointURL(udcs_apex_config_manager.Endpoint.TNUODOMETEREV3) + chassisId + '?userTimezone=' + userTimezone;
      requestParams.Method = 'GET';
      requestParams.Accept = '*/*';
      requestParams.Token = null;
      requestParams.APIErrorCode = 'TRP-101';
  
      HTTPResponse response = execute(requestParams);
  
      return response.getBody();
    }
  }