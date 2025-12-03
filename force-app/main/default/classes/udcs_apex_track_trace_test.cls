@isTest
public with sharing class udcs_apex_track_trace_test {
  @testSetup
  static void setup() {
    udcs_apex_test_data_factory.InitialData();
  }
  @isTest
  static void gettraceSummaryTest() {
    System.runAs([SELECT Id, Name, profile.name FROM user WHERE profile.name = 'My UD Fleet User' AND IsActive = true LIMIT 1][0]) {
      Test.startTest();
      Test.setMock(HttpCalloutMock.class, new udcs_apex_http_callout_mock());
      String response = udcs_apex_track_trace.gettraceSummary('2022-05-01T00:00:00.000Z', '2022-05-01T01:13:00.000Z', '["JNCU-104501"]', '', true);
      Test.stopTest();
      System.debug(response);
    }

  }
  @isTest
  static void gettraceSummaryTestSys() {
    // System.runas([select Id,Name, profile.name from user where profile.name='My UD Fleet User' limit 1][0]){
    Test.startTest();
    Test.setMock(HttpCalloutMock.class, new udcs_apex_http_callout_mock());
    String response = udcs_apex_track_trace.gettraceSummary('2022-05-01T00:00:00.000Z', '2022-05-01T01:13:00.000Z', '["JNCU-104501"]', '', true);
    Test.stopTest();
    System.debug(response);
    // }
  }
  //-----------
  @isTest
  static void getTrackingEventsHistory() {
    System.runAs([SELECT Id, Name, profile.name FROM user WHERE profile.name = 'My UD Fleet User' AND IsActive = true LIMIT 1][0]) {
      Test.startTest();
      Test.setMock(HttpCalloutMock.class, new udcs_apex_http_callout_mock());
      String response = udcs_apex_track_trace.getTrackingEventsHistory('0', '2022-05-01T00:00:00.000Z', '2022-05-01T01:13:00.000Z', '["JNCU-104501"]', '', '', true);
      Test.stopTest();
      System.debug(response);
    }

  }
  @isTest
  static void getTrackingEventsHistorySys() {
    // System.runas([select Id,Name, profile.name from user where profile.name='My UD Fleet User' limit 1][0]){
    Test.startTest();
    Test.setMock(HttpCalloutMock.class, new udcs_apex_http_callout_mock());
    String response = udcs_apex_track_trace.getTrackingEventsHistory('0', '2022-05-01T00:00:00.000Z', '2022-05-01T01:13:00.000Z', '["JNCU-104501"]', '', '', true);
    Test.stopTest();
    System.debug(response);
    // }
  }
  @isTest
  static void trackingEventDetails() {
    Test.startTest();
    Test.setMock(HttpCalloutMock.class, new udcs_apex_http_callout_mock());
    udcs_apex_track_trace.trackingEventDetails();
    Test.stopTest();
  }
  @isTest
  static void getTrackingEventsHistoryExport() {
    Test.startTest();
    Test.setMock(HttpCalloutMock.class, new udcs_apex_http_callout_mock());
    udcs_apex_track_trace.getTrackingEventsHistoryExport('chassisId', 'startDateTime', 'endDateTime', 'triggerTypes', 'dataItems', '', '', '', '', '');
    Test.stopTest();
  }

  @isTest
  static void getTnuOdometer() {
    Test.startTest();
    Test.setMock(HttpCalloutMock.class, new udcs_apex_http_callout_mock());
    udcs_apex_track_trace.getTnuOdometer('userTimezone', 'chassisId');
    Test.stopTest();
  }

  public class CommunitiesLandingControllerMock implements HttpCalloutMock {
    public HTTPResponse respond(HTTPRequest req) {
      HttpResponse res = new HttpResponse();
      res.setHeader('Content-Type', 'application/xml');
      if (req.getEndpoint().endsWith('/tncrepo/useragreement/user')) {
        res.setBody('{"status":"Agree","application":"MUF","version":1,"updatedTime":"2022-11-08T11:05:08.280Z"}');
      } else {
        res.setBody(
          '{"sub":"auth0&#124;62a99a402f19a1c3b6b08a76","nickname":"muf.fouser.test","name":"muf.fouser.test@gmail.com","picture":"https://s.gravatar.com/avatar/d36871c51e7d315fe52b3401f51f31e9?s=480&r=pg&d=https%3A%2F%2Fcdn.auth0.com%2Favatars%2Fmu.png","updated_at":"2022-12-07T07:44:51.241Z","email":"muf.fouser.test@gmail.com","email_verified":false,"http://udcs.customclaims.net/userinfo":{"contact":"+81 1234567890","firstName":"MUF","lastName":"FOUser","locale":"en_GB","measurement":"METRIC","role":"Fleet_Operator","userIdentifier":"31150D6884A044F5AD514993452C0FA1"}}'
        );
      }

      res.setStatusCode(200);
      return res;
    }
  }
}