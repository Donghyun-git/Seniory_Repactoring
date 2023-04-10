let date = new Date();

let y = date.getFullYear();
let m = date.getMonth();
let d = date.getDate();


document.getElementById('dayTitle').textContent = `${y}년 ${m + 1}월 ${d}일`;

const renderCalender = () => {
const viewYear = date.getFullYear();
const viewMonth = date.getMonth();

document.querySelector('.year').textContent = `${viewYear}년`;
document.querySelector('.month').textContent = ` ${viewMonth + 1}월`;
const prevLast = new Date(viewYear, viewMonth, 0);
const thisLast = new Date(viewYear, viewMonth + 1, 0 /*day*/); //지난달 마지막날 데이터 가져옴

const PLDate = prevLast.getDate();
const PLDay = prevLast.getDay();

const TLDate = thisLast.getDate();
const TLDay = thisLast.getDay(); 

const prevDates = [];
const thisDates = [...Array(TLDate + 1).keys()].slice(1);
const nextDates = [];

if (PLDay !== 6) {
    for (let i = 0; i < PLDay + 1; i++) {
      prevDates.unshift(PLDate - i);
    }
  }
  
  for (let i = 1; i < 7 - TLDay; i++) {
    nextDates.push(i);
  }

const dates = prevDates.concat(thisDates, nextDates);

const firstDateIndex = dates.indexOf(1);
const lastDateIndex = dates.lastIndexOf(TLDate);

dates.forEach((date, i) => {
    const condition = i >= firstDateIndex && i < lastDateIndex + 1
                      ? 'this'
                      : 'other';

    dates[i] = `<div class="date"><div class="c-1"></div><span class="${condition}">${date}</span></div>`;
  })

document.querySelector('.dates').innerHTML = dates.join(''); 

const today = new Date();
  if (viewMonth === today.getMonth() && viewYear === today.getFullYear()) {
    for (let date of document.querySelectorAll('.this')) {
      if (+date.innerText === today.getDate()) {
        date.classList.add('today');
        break;
      }
    }
  }

console.log(TLDate)
};

renderCalender();

const prevMonth = () => {
    date.setDate(1);
    date.setMonth(date.getMonth() - 1);
    renderCalender();
  };
  
  const nextMonth = () => {
    date.setDate(1);
    date.setMonth(date.getMonth() + 1);
    renderCalender();
  };
  
  const goToday = () => {
    date = new Date();
    renderCalender();
  };




          
  /* function randomIDGenerate(){
    return '_' + Math.random().toString(36).substr(2, 9);
  }; */



 
