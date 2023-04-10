  /* 인수인계 캘린더 이벤트 */
 
let year = document.querySelector('.year');
let month = document.querySelector('.month');

  let listRendering = (e) => {
    let dayTitle = document.getElementById('dayTitle');
    let state = e.target.className;
    let dayHTML = '';
    let resultHTML = '';
  
    dayHTML += `${year.textContent} ${month.textContent} ${e.target.textContent}일`;

    if(state == otherDay.mode){
       
      for(i=0; i<todayList.length; i++){
        resultHTML += `
                <li><input type="checkbox" name="chk" id="chk${i+9}" checked /><label for="chk${i+9}">${todayList[i].name} 어르신 방문</label></li>
                `;
      };
      
    } else if(state == otherMonthDay.mode){
        
      for(i=0; i<otherList.length; i++){
        resultHTML += `
                <li><input type="checkbox" name="chk" id="chk${i+9}" checked /><label for="chk${i+9}">${otherList[i].name} 어르신 방문</label></li>
                `;

      }
    } else if(state == today.mode){
        
      for(i=0; i<thisList.length; i++){
        resultHTML += `
                <li><input type="checkbox" name="chk" id="chk${i+9}" checked /><label for="chk${i+9}">${thisList[i].name} 어르신 방문</label></li>
                `;

      }
    }
    document.querySelector('.ws-plan').innerHTML = resultHTML;
    dayTitle.innerHTML = dayHTML;
};

let share = () => {
  const req = {
    share: true,
  }
  fetch('/workshare1', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(req),
  });
  alert("인수인계 되었습니다!");
  window.location='/list1';
}


