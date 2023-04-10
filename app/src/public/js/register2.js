"use strict"

	/* 회원가입 기능 */
    const id = document.querySelector('#ID'),
        pw = document.querySelector('#PW'),
        pwCheck = document.querySelector('#PW_check'),
        checkArea = document.querySelector('.PW_check_label'),
        name = document.querySelector('#signup-form__name'),
        silverName = document.querySelector('#signup-form__pname'),
        registNum = document.querySelector('#signup-form__RN'),
        postCode = document.querySelector('#postcode'),
        adr = document.querySelector('#address'),
        extraAdr = document.querySelector('#extraAddress'),
        detailAdr = document.querySelector('#detailAddress'),
        phoneNum = document.querySelector('#signup-form__tel'),
        center = document.querySelector('#select_center'),
        signupBtn = document.querySelector('#signup-button');

    /* 비밀번호 일치여부 */
    function Check() {
            if(pw.value!='' && pwCheck.value!='') {
                if(pw.value==pwCheck.value) { 
                    checkArea.innerHTML='비밀번호가 일치합니다.';
                    checkArea.style.color='blue';
            } else { 
                checkArea.innerHTML='비밀번호가 일치하지 않습니다.'; 
                checkArea.style.color='red';
            }
        }
    }
