/**
 * Sets up the sheet headers for tracking app metrics.
 */
function setupSheet() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var headers = ['Date', 'App ID', 'Platform', 'Downloads', 'Active Users', 'Revenue Ads', 'Revenue IAP', 'Rating', 'Crashes'];
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
}

/**
 * Fetches metrics from the Play Store and App Store and logs them to the sheet.
 * You must set script properties PLAY_API_KEY, APP_ID, APPLE_API_KEY, and APPLE_APP_ID.
 */
function fetchMetrics() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var now = new Date();
  
  // TODO: Replace with API calls to fetch real metrics.
  var row = [now, 'com.example.app', 'Android', 0, 0, 0.0, 0.0, 0.0, 0];
  sheet.appendRow(row);
}

/**
 * Helper to format dates for API queries.
 */
function formatDate(date) {
  return Utilities.formatDate(date, Session.getScriptTimeZone(), 'yyyy-MM-dd');
}
