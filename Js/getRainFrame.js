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

// var $content = $('#content');
// $.get('https://opendata.cwb.gov.tw/api/v1/rest/datastore/O-A0002-001?Authorization=CWB-60F77B1A-3D8B-468E-9D93-3FD7846A88C5&format=JSON&elementName=HOUR_24',function(e){
//   e.forEach(function(o){
//     if(o.County=='高雄市'){
//       console.log(o);
//       $content.append('< '+o.SiteName+' > PM2.5:'+o['PM2.5']+', PM10:'+o.PM10+'<br/>');
//     }
//   });
// });

let data;
let Kaohsiung = [];
const list = document.querySelector('#card-area');
let str = '';

$.ajax({
  url: "https://opendata.cwb.gov.tw/api/v1/rest/datastore/O-A0002-001?Authorization=CWB-60F77B1A-3D8B-468E-9D93-3FD7846A88C5&format=JSON",
  method: "GET",
  dataType: "json",
  success: function (re, i) {
    console.log(re); 
    data=re.records.location;
    addData();
    showData();
  }
});

function addData(){
  data.forEach(function (item) {
    if (item.parameter[0].parameterValue == "高雄市"){
      let obj = {};
      obj.administration = item.parameter[2].parameterValue;
      obj.locationName = item.locationName;
      obj.tenMinute = item.weatherElement[2].elementValue;
      obj.threeHour = item.weatherElement[3].elementValue;
      obj.daily = item.weatherElement[6].elementValue;
      Kaohsiung.push(obj);
    };
  });
};

function showData(){
  Kaohsiung.forEach(function (item) {                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       
      str += `<div class="col-3">
        <ul class="card list-group border-primary">
          <li class="card-body list-group-item">
            <h5 class="card-title">${item.locationName}</h5>
            <p class="card-text">${item.administration}</p>
          </li>
          <li class="card-body list-group-item text-center">
            <h5 class="card-title">10分鐘累積雨量</h5>
            <p class="card-text">${item.tenMinute}</p>
          </li>
          <li class="card-body list-group-item text-center">
            <h5 class="card-title">3小時累積雨量</h5>
            <p class="card-text">${item.threeHour}</p>
          </li>
          <li class="card-body list-group-item text-center">
            <h5 class="card-title">日累積雨量</h5>
            <p class="card-text">${item.daily}</p>
          </li>
        </ul>
      </div>`;
  });
  list.innerHTML = str;
};



