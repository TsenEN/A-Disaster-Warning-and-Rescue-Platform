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

let Kaohsiung_Area_Rain_Data;
let Kaohsiung_Area_Rain_Detail = [];
const Kaohsiung_Area_Rain_List = document.getElementById('card-area');

$(document).ready(function () {
  // 取得政府開放平台的雨量資料
  $.ajax({
    url: "https://opendata.cwb.gov.tw/api/v1/rest/datastore/O-A0002-001?Authorization=CWB-60F77B1A-3D8B-468E-9D93-3FD7846A88C5&format=JSON",
    method: "GET",
    dataType: "json",
    success: function (re) {
      Kaohsiung_Area_Rain_Data = re.records.location;
      addDetailData();
      showDetailData();
    }
  });
});

// 擷取所需的雨量資料加入陣列
function addDetailData(){
  Kaohsiung_Area_Rain_Data.forEach(function (item) {
    if (item.parameter[0].parameterValue == "高雄市"){
      let obj = {};
      obj.administration = item.parameter[2].parameterValue;
      obj.locationName = item.locationName;
      obj.tenMinute = item.weatherElement[2].elementValue;
      obj.threeHour = item.weatherElement[3].elementValue;
      obj.daily = item.weatherElement[6].elementValue;
      Kaohsiung_Area_Rain_Detail.push(obj);
    };
  });
};

// 呈現在html畫面上
function showDetailData(){
  let str = '';
  Kaohsiung_Area_Rain_Detail.forEach(function (item) {                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       
      str += `<div class="col-3">
        <ul class="card list-group mt-3">
          <li class="card-body list-group-item">
            <h5 class="card-title text-center text-bold">${item.locationName}</h5>
            <h6 class="card-text text-center text-muted">${item.administration}</h6>
          </li>
          <li class="card-body list-group-item text-center">
            <h6 class="card-title">10分鐘累積雨量</h6>
            <p class="card-text text-secondary">${item.tenMinute}</p>
          </li>
          <li class="card-body list-group-item text-center">
            <h6 class="card-title">3小時累積雨量</h6>
            <p class="card-text text-secondary">${item.threeHour}</p>
          </li>
          <li class="card-body list-group-item text-center">
            <h6 class="card-title">日累積雨量</h6>
            <p class="card-text text-secondary">${item.daily}</p>
          </li>
        </ul>
      </div>`;
  });
  Kaohsiung_Area_Rain_List.innerHTML = str;
};




