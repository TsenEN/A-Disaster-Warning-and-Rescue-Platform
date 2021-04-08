$(document).ready(function () {

    let str = '';
    let data;
    let Kaohsiung = [];
    const kaohsiung = document.getElementById('kaohsiung');
    
    function addKaohsiungData(){
      data.forEach(function (item) {
        if (item.parameter[0].parameterValue == "高雄市" && item.parameter[2].parameterValue == "前鎮區"){
          console.log(item);
          let obj = {};
          obj.administration = item.parameter[2].parameterValue;
          obj.locationName = item.locationName;
          obj.tenMinute = item.weatherElement[2].elementValue;
          obj.threeHour = item.weatherElement[3].elementValue;
          obj.daily = item.weatherElement[6].elementValue;
          Kaohsiung.push(obj);
        };
      });
      console.log(Kaohsiung);
    };
    
    function showKaohsiungData(){
      Kaohsiung.forEach(function (item) {
        str += `
          <h5 class="card-title">高雄市</h5>
          <h6 class="card-subtitle mb-2 text-muted">10分鐘平均累積雨量</h6>
          <p class="card-text text-primary">${item.tenMinute}</p>
          <h6 class="card-subtitle mb-2 text-muted">3小時平均累積雨量</h6>
          <p class="card-text text-primary">${item.threeHour}</p>
          <h6 class="card-subtitle mb-2 text-muted">日平均累積雨量</h6>
          <p class="card-text text-primary">${item.daily}</p>
          <a href="getRainFrame.html" class="card-link btn btn-primary text-white">查看各地區</a>      
          `                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                
      });
    };
    
    $.ajax({
      url: "https://opendata.cwb.gov.tw/api/v1/rest/datastore/O-A0002-001?Authorization=CWB-60F77B1A-3D8B-468E-9D93-3FD7846A88C5&format=JSON",
      method: "GET",
      dataType: "json",
      success: function (re) {
        console.log(re);
        data = re.records.location;
        addKaohsiungData();
        showKaohsiungData();
        kaohsiung.innerHTML = str;
      }
    });
  });
  