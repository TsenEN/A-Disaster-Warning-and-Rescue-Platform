// Curl

// curl -X GET "https://opendata.cwb.gov.tw/api/v1/rest/datastore/O-A0002-001?Authorization=CWB-60F77B1A-3D8B-468E-9D93-3FD7846A88C5&format=JSON&elementName=HOUR_24" -H  "accept: application/json"

// Request URL
// https://opendata.cwb.gov.tw/api/v1/rest/datastore/O-A0002-001?Authorization=CWB-60F77B1A-3D8B-468E-9D93-3FD7846A88C5&format=JSON&elementName=HOUR_24

// Response headers

// access-control-allow-origin: * 
//  connection: keep-alive 
//  content-encoding: gzip 
//  content-type: application/json;charset=utf-8 
//  date: Fri,26 Mar 2021 09:12:33 GMT 
//  transfer-encoding: chunked 

var $content = $('#content');
$.get('https://opendata.cwb.gov.tw/api/v1/rest/datastore/O-A0002-001?Authorization=CWB-60F77B1A-3D8B-468E-9D93-3FD7846A88C5&format=JSON&elementName=HOUR_24',function(e){
  e.forEach(function(o){
    if(o.County=='高雄市'){
      console.log(o);
      $content.append('< '+o.SiteName+' > PM2.5:'+o['PM2.5']+', PM10:'+o.PM10+'<br/>');
    }
  });
});