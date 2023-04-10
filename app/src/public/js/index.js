"use strict";
/* 라디오버튼 선택여부 회원가입 페이지 이동 */

let manage = document.getElementById('rdo01');
let protect = document.getElementById('rdo02');
let signUp = document.querySelector('.sign-up');
	
	function crossPage() {
		
		if(manage.checked == true && protect.checked == false){
			location.href='/signup';
		}
		else if(protect.checked == true && manage.checked== false){
			location.href='/signup_p';
		};
	};

	/* 로그인 기능 */

	const id = document.querySelector('#id'),
		  pw = document.querySelector('#pw'),
		center = document.querySelector('#select_center'),
		loginBtn = document.querySelector('#login-button'),
		loginBtn2 = document.querySelector('#login-button2');

	let radioArea = document.getElementById("rdo_area");
	
	function radio(event) {
		radioArea.innerText = event.target.value;
		console.log(radioArea.textContent)
		}
	
		/* 인수인계 */
	
	function submit(){
		let checkedList = document.querySelectorAll('input[name="todo"]:checked')
		let values = [];
		let id = document.getElementById('querystring');
		checkedList.forEach((e) => {
			values.push(e.value);
		});
		const req = {
			memo: memo.value,
			list: values,
			id: id.textContent,
		}
		fetch('/detail1', {
			method: 'post',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(req),
		});
		alert("저장되었습니다!");
		window.location='/list1'
	}

	function shareSubmit(){
		let checkedList = document.querySelectorAll('input[name="todo"]:checked')
		let values = [];
		let id = document.getElementById('querystring');
		checkedList.forEach((e) => {
			values.push(e.value);
		});
		const req = {
			memo: memo.value,
			list: values,
			id: id.textContent,
		}
		fetch('/detail2', {
			method: 'post',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(req),
		});
		alert("저장되었습니다!");
		window.location='/list1'
	}

	/* 맵 api */
	function map() {
		const req = {
			test: "test",
		};
		fetch('/map1', {
			method: 'get',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(req),
		});
		window.location='/map1';
	}



      