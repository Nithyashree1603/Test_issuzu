/**
 * Stub Apex class for udcs_apex_connect
 * Provides user information and connection methods
 */
global class udcs_apex_connect {
    
    @AuraEnabled(cacheable=true)
    global static UserInfo userInfo() {
        UserInfo userInfo = new UserInfo();
        userInfo.fleetName = 'Default Fleet';
        userInfo.userName = UserInfo.getName();
        userInfo.userEmail = UserInfo.getUserEmail();
        userInfo.currentMarketName = 'US';
        return userInfo;
    }
    
    global class UserInfo {
        @AuraEnabled
        public String fleetName { get; set; }
        
        @AuraEnabled
        public String userName { get; set; }
        
        @AuraEnabled
        public String userEmail { get; set; }
        
        @AuraEnabled
        public String currentMarketName { get; set; }
    }
}
