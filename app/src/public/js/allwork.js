/* 종합업무 캘린더 이벤트 */
 
let year = document.querySelector('.year');
let month = document.querySelector('.month');

  let listRendering = (e) => {
    let calVal = document.querySelectorAll('.date');
    console.log(calVal.textContent);
};

function workList() {
    
  const req = {
    
  }
  fetch('/calender1', {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(req),
  });
}


