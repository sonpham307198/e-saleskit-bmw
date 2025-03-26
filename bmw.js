var SHEET_NAME = "D";
var SHEET_NAME2 = "C";
var SHEET_NAME3 = "M";
var SCRIPT_PROP = PropertiesService.getScriptProperties();
 function test2() {
   //getMyFilesFromDrive(0,'1lSmDwjeOegmKCrvfr4q3UmIpAnV--GNB');
   var a = 'https://drive.google.com/drive/folders/16LQsRv45ucMX78FoF1_QY-e5-IO3xn28';
   if (a.indexOf('folder')>0) {
    //  getMyFilesFromDrive(0,a.substring(33, 33));
    Logger.log('folder');
    Logger.log(a.substring(39, 72));
  } else if (a.length==33){
   Logger.log(a);
    ///getMyFilesFromDrive(0,a);
  }
 }
function onOpen() {
  SpreadsheetApp.getUi() // Or DocumentApp or SlidesApp or FormApp.
      .createMenu('MMIS')
      .addItem('Get Link', 'openDialog')
      .addToUi();
}

function openDialog() {
 var ui = SpreadsheetApp.getUi();
var response = ui.prompt('Link cần lấy thông tin:');

// Process the user's response.
if (response.getSelectedButton() == ui.Button.OK) {
  Logger.log('The user\'s name is %s.', response.getResponseText());
  var a = response.getResponseText();
  if (a.indexOf('folder')>0) {
    getMyFilesFromDrive(0,a.substring(39, 72));
    //Logger.log(a.substring(33, 33));
  } else if (a.length==33){
   //Logger.log(a);
    getMyFilesFromDrive(0,a);
  }
  
} else {
  Logger.log('The user clicked the close button in the dialog\'s title bar.');
}
}
function getMyFilesFromDrive(root,id) {
var rootFol = DriveApp.getFolderById(id);
var myFols = rootFol.getFolders();
var myFiles = rootFol.getFiles();
var activeSpreadsheet = SpreadsheetApp.getActiveSpreadsheet();
if(root==0) {
root=id;

var sheet = activeSpreadsheet.getSheetByName('getlink');
} else {
var sheet = activeSpreadsheet.getSheetByName('getlink');
}
    if (sheet == null) {
      sheet = activeSpreadsheet.insertSheet();
      sheet.setName('getlink');
    }
      
 //sheet.clear();
 //var rows = [];
 //rows.push(["Name","ID", "Url"]);
 while(myFiles.hasNext()) {
  
   var file = myFiles.next();
   if(file != null) {
     sheet.appendRow([ new Date(),root, rootFol.getName(), file.getName(),file.getId(), file.getMimeType()]);
   }
 }
 console.log(myFols);

   while(myFols.hasNext()) {
   var fol = myFols.next();
   if(fol != null) {
     //sheet.appendRow([ file.getName(),file.getId(), file.getUrl()]);
     getMyFilesFromDrive(root,fol.getId());
   }
 }


 //sheet.getRange(1,1,rows.length,3).setValues(rows);
}

function doGet(e){
  return handleResponse(e);
}
 
function doPost(e){
  return handleResponse(e);
}
function thongsokythuat (id) {

}

function handleResponse(e) {

  var lock = LockService.getPublicLock();
  lock.waitLock(30000); 
  try {
    var doc = SpreadsheetApp.openById(SCRIPT_PROP.getProperty("key"));
    var sheet = doc.getSheetByName(SHEET_NAME); 
     var sheet2 = doc.getSheetByName(SHEET_NAME2); 
         var sheet3 = doc.getSheetByName(SHEET_NAME3); 
      var list = sheet.getRange(2,1,sheet.getLastRow()-1,sheet.getLastColumn()).getValues();
     var list2 = sheet2.getRange(2,1,sheet2.getLastRow()-1,sheet2.getLastColumn()).getValues();
var list3 = sheet3.getRange(2,1,sheet3.getLastRow()-1,sheet3.getLastColumn()).getValues();
      var str = JSON.stringify(list);
     var str2 = JSON.stringify(list2);
     var str3 = JSON.stringify(list3);
     str = '{"detail":' + str + ',"car":'+str2 + ',"image":'+str3 +'}';
          Logger.log(str);
    return ContentService
          .createTextOutput(str)
          .setMimeType(ContentService.MimeType.JSON);
    
  } catch(e){
    // if error return this
    return ContentService.createTextOutput(JSON.stringify({"result":"error", "error": e})).setMimeType(ContentService.MimeType.JSON);
    //return ContentService.createTextOutput(xproduct.length);
  } finally { //release lock
    lock.releaseLock();
  }
}
function test() {
  getdetail("3-series");
}
function getdetail(id) {
  var doc = SpreadsheetApp.openById(SCRIPT_PROP.getProperty("key"));
  var sheet2 = doc.getSheetByName("detail");
    var list2 = sheet2.getRange(2,1,sheet2.getLastRow()-1,sheet2.getLastColumn()).getValues();
    var lastRow2 = sheet2.getLastRow();
    var str2="";
    str2="";
    str2 += '"details":[';
     for (y=0;y<lastRow2-1;y++) {
       if (list2[y][0]==id) {
            str2 += '"https://drive.google.com/uc?export=view&id=' + list2[y][2] + '",';
        }
     }
     str2 = str2.substring(0,str2.length-1);
     str2 += ']';
     Logger.log(str2);
     return str2;
}
function setup() {
    var doc = SpreadsheetApp.getActiveSpreadsheet();
    SCRIPT_PROP.setProperty("key", doc.getId());
}

function FROM_UNIX_EPOCH(epoch_in_secs) {
  return new Date(epoch_in_secs * 1000);  // Convert to milliseconds
}
