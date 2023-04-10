"use strict";

//모듈
const express = require('express');
const app = express();
const fs = require("fs");
const cors = require("cors");
const bodyParser = require("body-parser");
const encoder = bodyParser.urlencoded();

const connection = require('./src/models/dbmodel/db');
const session = require('./src/models/dbmodel/session');
const adminLogin = require('./src/models/adminlogin');
const protectLogin = require('./src/models/protectlogin');


const patientjson = require('/Users/ddongs/Desktop/portfolio/Capstone_re/app/patient.json')
const sharejson = require('/Users/ddongs/Desktop/portfolio/Capstone_re/app/share.json');


//json 파싱
let json = JSON.stringify(patientjson);
let json1 = JSON.parse(json);

let share = JSON.stringify(sharejson);
let share1 = JSON.parse(share);


//라우팅
const home = require("./src/routes/home");

//앱 세팅
app.set("views", "./src/views");
app.set("view engine", "ejs");
app.use(express.static(`${__dirname}/src/public`));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use("/", home); // use -> 미들웨어 등록해주는 메소드.
app.use(session);

connection.connect((error)=>{
    if (error) throw error;
    console.log("connected");
});


//관리자 로그인
app.post("/",encoder, adminLogin, (req, res)=>{
    console.log("관리자 로그인 세션:", req.session);
});

//보호자 로그인
app.post("/index_p",encoder, protectLogin, (req, res)=>{
    console.log("보호자 로그인 세션:", req.session);
});

//관리사 회원가입
app.post("/signup", encoder, function(req, res){
    const center = req.body.center;
    const id = req.body.id;
    const pw = req.body.pw;
    const name = req.body.name;
    const registNum = req.body.registNum;
    const postNum = req.body.postNum;
    const adr = req.body.adr;
    const extraAdr = req.body.extraAdr;
    const detailAdr = req.body.detailAdr;
    const phoneNum = req.body.phoneNum;
    const pwCheck = req.body.pwCheck;

            if (!id){
                res.send(`<script>alert('아이디를 입력해주세요!');
                location.href='/signup'</script>`);
             }

            else if(pw !== pwCheck ){
                res.send(`<script>alert('비밀번호가 일치하지 않습니다!');
                location.href='/signup'</script>`);
            }

            else if(!name) {
                res.send(`<script>alert('이름을 입력해주세요!');
                location.href='/signup'</script>`);
                
            }
            else if(!registNum) {
                res.send(`<script>alert('주민번호를 입력해주세요!');
                location.href='/signup'</script>`);
               
            }
            else if(!postNum) {
                res.send(`<script>alert('주소를 입력해주세요!');
                location.href='/signup'</script>`);
               
            }
            else if(!phoneNum) {
                res.send(`<script>alert('연락처를 입력해주세요!');
                location.href='/signup'</script>`);
            }
               else {

    connection.query(`insert into user (center, id, pw, name, registNum, postNum, adr, extraAdr, detailAdr, phoneNum) 
    values ("${center}", "${id}", "${pw}", "${name}", "${registNum}", 
    "${postNum}", "${adr}", "${extraAdr}", "${detailAdr}", "${phoneNum}");`, function(error, results, fields){
        if (error) throw error         
            else {
                res.send(`<script>alert('회원가입이 완료되었습니다.');
                location.href='/'</script>`);
            }
        res.end();
    })
}
});

//보호자 회원가입

app.post("/signup_p", encoder, function(req, res){
    const center = req.body.center;
    const id = req.body.id;
    const pw = req.body.pw;
    const name = req.body.name;
    const silverName = req.body.silverName;
    const registNum = req.body.registNum;
    const postNum = req.body.postNum;
    const adr = req.body.adr;
    const extraAdr = req.body.extraAdr;
    const detailAdr = req.body.detailAdr;
    const phoneNum = req.body.phoneNum;
    const pwCheck = req.body.pwCheck;
    
            if (!id){
                res.send(`<script>alert('아이디를 입력해주세요!');
                location.href='/signup_p'</script>`);
             }

            else if(pw !== pwCheck ){
                res.send(`<script>alert('비밀번호가 일치하지 않습니다!');
                location.href='/signup_p'</script>`);
            }

            else if(!silverName) {
                res.send(`<script>alert('보호자 이름을 입력해주세요!');
                location.href='/signup_p'</script>`);
                
            }

            else if(!name) {
                res.send(`<script>alert('이름을 입력해주세요!');
                location.href='/signup_p'</script>`);
                
            }

            else if(!registNum) {
                res.send(`<script>alert('주민번호를 입력해주세요!');
                location.href='/signup_p'</script>`);
               
            }
            else if(!postNum) {
                res.send(`<script>alert('주소를 입력해주세요!');
                location.href='/signup_p'</script>`);
               
            }
            else if(!phoneNum) {
                res.send(`<script>alert('연락처를 입력해주세요!');
                location.href='/signup_p'</script>`);
            }
               else {

    connection.query(`insert into protect (center, id, pw, silverName, name, registNum, postNum, adr, extraAdr, detailAdr, phoneNum) 
    values ("${center}", "${id}", "${pw}", "${silverName}", "${name}", "${registNum}", 
    "${postNum}", "${adr}", "${extraAdr}", "${detailAdr}", "${phoneNum}");`, function(error, results, fields){
        if (error) throw error         
            else {
                res.send(`<script>alert('회원가입이 완료되었습니다.');
                location.href='/'</script>`);
            }

        res.end();
     })
}
});



//로그인 성공(관리자)
app.get("/list1", function(req, res){
    let output = "";
    let list ="";
    let list1 = "";
    if(req.session.name && req.session.info && req.session.workCount){
        let info = req.session.info;
        let json = JSON.stringify(info);
        let parseData = JSON.parse(json);
        for(let i=0; i<parseData.length; i++){
            fs.writeFileSync('patient.json', json);
        }
        connection.query(`SELECT * FROM patient WHERE shareName != '${req.session.name}';`, function(error, results, fields){
            let json = JSON.stringify(results);
            for(let i=0; i<results.length; i++){
               fs.writeFileSync('share.json', json);
            }
        });
        
        
        for(let i=0; i<2; i++){
            if(parseData[i].list.todo == null){
               list += `
               <li class="list-item">
                                <a href="/detail1?id=${parseData[i].id}" class="list-item__link">
                                    <em class="list-item__thumb" style="background:url('../../img/profile_sample.jpg')no-repeat center center / cover;"></em>
                                    <div class="list-item__text">
                                        <h5><b>${parseData[i].info.pname}</b>어르신</h5>
                                        <p>${parseData[i].info.padr} / ${parseData[i].info.page} / ${parseData[i].info.sex}</p>
                                    </div>
                                    <ul class="list-item__todo">
                                        <li><span>등록된 데이터가 없습니다</span></li>
                                    </ul>
                                </a>
                                <a href="tel:010-8300-7586" class="list-item__tel">전화걸기</a>
                            </li>`;
            } else {
               list += `
            <li class="list-item">
                                <a href="/detail1?id=${parseData[i].id}" class="list-item__link">
                                    <em class="list-item__thumb" style="background:url('../../img/profile_sample.jpg')no-repeat center center / cover;"></em>
                                    <div class="list-item__text">
                                        <h5><b>${parseData[i].info.pname}</b>어르신</h5>
                                        <p>${parseData[i].info.padr} / ${parseData[i].info.page} / ${parseData[i].info.sex}</p>
                                    </div>
                                    <ul class="list-item__todo">
                                        <li><span>${parseData[i].list.todo}</span></li>
                                    </ul>
                                </a>
                                <a href="tel:010-8300-7586" class="list-item__tel">전화걸기</a>
                            </li>`; 
            }
            
         }
         connection.query(`SELECT * from patient where shareName != "${req.session.name}";`, function(error, results, fields){
            if(error) throw error;
            if(results.length == 0){
                list1 += `
                <h5 class="mt30" style="text-align: center; font-size: 18px; font-weight: 400;">인수인계 사항이 없습니다!</h5>`
            } else {
                for(let i=0; i<2; i++){
                console.log(results[i].pname);
                if(results[i].todo == null){
                    list1 +=`
                    <li class="list-item">
                    <a href="/detail2?id=${results[i].shareID}" class="list-item__link">
                        <em class="list-item__thumb" style="background:url('../../img/profile_sample.jpg')no-repeat center center / cover;"></em>
                        <div class="list-item__text">
                            <h5><b>${results[i].pname}</b>어르신</h5>
                            <p>${results[i].padr} / ${results[i].page} / ${results[i].sex}</p>
                        </div>
                        <ul class="list-item__todo">
                            <li><span>등록된 데이터가 없습니다</span></li>
                        </ul>
                    </a>
                    <a href="#" class="list-item__tel">전화걸기</a>
                </li>
                    `
                } else {
                    list1 += `
            <li class="list-item">
                                <a href="/detail2?id=${results[i].shareID}" class="list-item__link">
                                    <em class="list-item__thumb" style="background:url('../../img/profile_sample.jpg')no-repeat center center / cover;"></em>
                                    <div class="list-item__text">
                                        <h5><b>${results[i].pname}</b>어르신</h5>
                                        <p>${results[i].padr} / ${results[i].page} / ${results[i].sex}</p>
                                    </div>
                                    <ul class="list-item__todo">
                                        <li><span>${results[i].todo}</span></li>
                                    </ul>
                                </a>
                                <a href="#" class="list-item__tel">전화걸기</a>
                            </li>`;
                        }
                   
                        
            }
            }
            
            output += `<!DOCTYPE HTML>
            <html xmlns="http://www.w3.org/1999/xhtml" xml:lang="ko" lang="ko">
            <head>
            <meta charset="utf-8">
            <meta name="HandheldFriendly" content="True">
            <meta name="MobileOptimized" content="320">
            <meta name="viewport" content="width=device-width, initial-scale=1, minimal-ui">
            <meta name="mobile-web-app-capable" content="yes">	
            <meta name="apple-mobile-web-app-capable" content="yes">
            <meta name="apple-mobile-web-app-status-bar-style" content="black">
            <meta name="format-detection" content="telephone=no">
            <meta name="Robots" content="ALL" />
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <title>생활관리사 맞춤 서비스</title>
            <link rel="stylesheet" type="text/css" href="css/style.css">
            </head>
            <body>
            <h1 id="title">생활관리사 맞춤 서비스</h1>
            
            
            <div id="wrap">
                <div id="gnb">
                    <h2 id="gnb-title">시니어리</h2>
                    <button id="gnb-menu"><span>메뉴</span></button>
                    <ul id="gnb-list">
                        <li><a href="list1">오늘업무</a></li>
                        <li><a href="workshare1">인수인계</a></li>
                        <li><a href="manage1">어르신 관리</a></li>
                        <li><a href="mypage1">마이페이지</a></li>
                        <li><a href="/logout">로그아웃</a></li>
                    </ul>
                </div>
                <div id="contents">
                    <div id="inner">
                        
                        <div class="list-myinfo">
                            <h4 class="list-myinfo__name"><b>${req.session.name}</b> 관리사님<br/>반갑습니다!</h4>				
                        </div>
                        <dl class="list-myinfo__list">
                            <dt>
                                <h5>오늘 업무</h5>
                                <p>총 <b>${req.session.workCount + share1.length}</b>건</p>
                            </dt>
                            <dd>
                                <ul>
                                    <li>
                                        <a href="fixwork1">
                                            <h5>고정 업무</h5>
                                            <p><b>${req.session.workCount}</b>건</p>
                                        </a>
                                    </li>
                                    <li>
                                        <a href="morework1">
                                            <h5>추가 업무</h5>
                                            <p><b>${share1.length}</b>건</p>
                                        </a>
                                    </li>
                                </ul>
                            </dd>
                        </dl>
            
            
                        <div class="list-title">
                            <h5>고정 업무</h5>
                            <a href="fixwork1">전체보기</a>
                        </div>
                        
                        <ul class="list-group">
                         ${list}
                        </ul>
            
            
            
                        <div class="list-title">
                            <h5>추가 업무</h5>
                            <a href="morework1">전체보기</a>
                        </div>
            
                        <ul class="list-group">
                            ${list1}
                        </ul>
            
                        <p class="page-copy">Copyright &copy; Dongs All Rights Reserved.</p>
            
                    </div><!--  inner -->
                </div><!--  content -->
            </div><!--  wrap -->
            
            
            
            
            <!-- JS -->
            <script src="js/jquery-2.2.1.min.js"></script>
            <script src="js/placeholders.min.js"></script>
            <script src="js/common.js"></script>
            <script>
            
            </script>
            </body>
            </html>
            `;

        res.send(output);
            
         });
         
       
    } 
});

//고정 업무 버튼 로직
app.get("/fixwork1", function(req, res){
    let output = "";
    let list ="";
    if(req.session.name && req.session.info && req.session.workCount){
        let info = req.session.info;
        let json = JSON.stringify(info);
        let parseData = JSON.parse(json);
        for(let i=0; i<req.session.info.length; i++){
            list += `
            <li class="list-item">
                                <a href="/detail1?id=${parseData[i].id}" class="list-item__link">
                                    <em class="list-item__thumb" style="background:url('../img/profile_sample.jpg')no-repeat center center / cover;"></em>
                                    <div class="list-item__text">
                                        <h5><b>${parseData[i].info.pname}</b>어르신</h5>
                                        <p>${parseData[i].info.padr} / ${parseData[i].info.page} / ${parseData[i].info.sex}</p>
                                    </div>
                                </a>
                                <a href="tel:010-8300-7586" class="list-item__tel">전화걸기</a>
                            </li>
            `;
        }
        output += `<!DOCTYPE HTML>
        <html xmlns="http://www.w3.org/1999/xhtml" xml:lang="ko" lang="ko">
        
        <head>
            <meta charset="utf-8">
            <meta name="HandheldFriendly" content="True">
            <meta name="MobileOptimized" content="320">
            <meta name="viewport" content="width=device-width, initial-scale=1, minimal-ui">
            <meta name="mobile-web-app-capable" content="yes">
            <meta name="apple-mobile-web-app-capable" content="yes">
            <meta name="apple-mobile-web-app-status-bar-style" content="black">
            <meta name="format-detection" content="telephone=no">
            <meta name="Robots" content="ALL" />
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <title>생활관리사 맞춤 서비스</title>
            <link rel="stylesheet" type="text/css" href="css/style.css">
        </head>
        
        <body>
            <h1 id="title">생활관리사 맞춤 서비스</h1>
        
        
            <div id="wrap">
                <div id="gnb">
                    <h2 id="gnb-title">고정 업무</h2>
                    <button id="gnb-menu"><span>메뉴</span></button>
                    <ul id="gnb-list">
                        <li><a href="list1">오늘업무</a></li>
                        <li><a href="workshare1">인수인계</a></li>
                        <li><a href="manage1">어르신 관리</a></li>
                        <li><a href="mypage1">마이페이지</a></li>
                        <li><a href="/">로그아웃</a></li>
                    </ul>
                </div>
                <div id="contents">
                    <div id="fix-inner">
                        <div class="list-area">
                        <ul class="list-group">
                            ${list}
                        </ul>
                    </div>
                    </div><!-- inner -->
                </div><!-- content -->
            </div><!-- wrap -->
        
        
        
        
            <!-- JS -->
            <script src="js/jquery-2.2.1.min.js"></script>
            <script src="js/placeholders.min.js"></script>
            <script src="js/common.js"></script>
            <script>
        
            </script>
        </body>
        
        </html>
        
            `;
        res.send(output);
}
});

//추가 업무 버튼 로직
app.get("/morework1", function(req, res){
    let output = "";
    let list = "";
    connection.query(`SELECT * from patient where manName != '${req.session.name}'`, function(error, results, fields){
        if (error) throw error;
        for(let i=0; i<share1.length; i++){
            list += `
            <li class="list-item">
                        <a href="/detail2?id=${share1[i].shareID}" class="list-item__link">
                            <em class="list-item__thumb" style="background:url('../../img/profile_sample.jpg')no-repeat center center / cover;"></em>
                            <div class="list-item__text">
                                <h5><b>${share1[i].pname}</b>어르신</h5>
                                <p>${share1[i].padr} / ${share1[i].page} / ${share1[i].sex}</p>
                            </div>
                        </a>
                        <a href="tel:010-8300-7586" class="list-item__tel">전화걸기</a>
                    </li>`
        }
        output += `
        <!DOCTYPE HTML>
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="ko" lang="ko">

<head>
    <meta charset="utf-8">
    <meta name="HandheldFriendly" content="True">
    <meta name="MobileOptimized" content="320">
    <meta name="viewport" content="width=device-width, initial-scale=1, minimal-ui">
    <meta name="mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="black">
    <meta name="format-detection" content="telephone=no">
    <meta name="Robots" content="ALL" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>생활관리사 맞춤 서비스</title>
    <link rel="stylesheet" type="text/css" href="css/style.css">
</head>

<body>
    <h1 id="title">생활관리사 맞춤 서비스</h1>


    <div id="wrap">
        <div id="gnb">
            <h2 id="gnb-title">추가 업무</h2>
            <button id="gnb-menu"><span>메뉴</span></button>
            <ul id="gnb-list">
                <li><a href="list1">오늘업무</a></li>
                <li><a href="workshare1">인수인계</a></li>
                <li><a href="manage1">어르신 관리</a></li>
                <li><a href="mypage1">마이페이지</a></li>
                <li><a href="/">로그아웃</a></li>
            </ul>
        </div>
        <div id="contents">
            <div id="more-inner">
                <div class="list-area">
                <ul class="list-group">
                    ${list}
                </ul>
            </div>
            </div><!-- inner -->
        </div><!-- content -->
    </div><!-- wrap -->




    <!-- JS -->
    <script src="js/jquery-2.2.1.min.js"></script>
    <script src="js/placeholders.min.js"></script>
    <script src="js/common.js"></script>
    <script>

    </script>
</body>

</html>`;
    
res.send(output);
    })
})


//상세페이지(고정업무)
app.get('/detail1', function(req, res){
    console.log(req.body);
    for(let i=0; i<json1.length; i++){
        if(json1[i].id == req.query.id){
            if (json1[i].list.todo == null && json1[i].list.memo == null){
                var output = `
                <!DOCTYPE HTML>
                <html xmlns="http://www.w3.org/1999/xhtml" xml:lang="ko" lang="ko">
                <head>
                <meta charset="utf-8">
                <meta name="HandheldFriendly" content="True">
                <meta name="MobileOptimized" content="320">
                <meta name="viewport" content="width=device-width, initial-scale=1, minimal-ui">
                <meta name="mobile-web-app-capable" content="yes">	
                <meta name="apple-mobile-web-app-capable" content="yes">
                <meta name="apple-mobile-web-app-status-bar-style" content="black">
                <meta name="format-detection" content="telephone=no">
                <meta name="Robots" content="ALL" />
                <meta http-equiv="X-UA-Compatible" content="IE=edge">
                <title>생활관리사 맞춤 서비스</title>
                <link rel="stylesheet" type="text/css" href="css/style.css">
                </head>
                <body>
                <h1 id="title">생활관리사 맞춤 서비스</h1>
        
        
                <div id="wrap">
                    <div id="gnb">
                        <a href="list1" id="gnb-back">뒤로</a>
                        <h2 id="gnb-title">${json1[i].info.pname} 어르신</h2>
                        <button id="gnb-menu"><span>메뉴</span></button>
                        <ul id="gnb-list">
                            <li><a href="list1">오늘업무</a></li>
                            <li><a href="workshare1">인수인계</a></li>
                            <li><a href="manage1">어르신 관리</a></li>
                            <li><a href="mypage1">마이페이지</a></li>
                            <li><a href="/">로그아웃</a></li>
                        </ul>
                    </div>
                    <div id="contents">
                        <div id="inner">
                            
                            <div class="list-myinfo">
                                <h1 id="querystring" style="display: none;">${req.query.id}</h1>
                                <div class="detail-info">
                                    <em class="detail-info__thumb" style="background:url('../img/profile_sample.jpg')no-repeat center center / cover;"></em>
                                    <div class="detail-info__name">
                                        <h5><b>${json1[i].info.pname}</b>어르신</h5>
                                        <p>${json1[i].info.padr} / ${json1[i].info.page} / ${json1[i].info.sex}</p>
                                    </div>
                                    <ul class="detail-info__btn">
                                        <li><button class="detail-info__call" onclick="location.href='tel:010-8300-7586'">전화걸기</button></li>
                                        <li><button class="detail-info__family" onclick="location.href='tel:010-8300-7586'">보호자연락</button></li>
                                        <li><button class="detail-info__location" onclick="location.href='map1?id=${req.query.id}'">위치정보</button></li>
                                    </ul>
                                    <div class="detail-info__complete">
                                        <button>방문완료</button>
                                        <!-- <button class="active">방문완료</button> -->
                                    </div>
                                </div>
                            </div>
        
                        
                            <div class="detail-title">
                                <h5>업무 계획</h5>
                            </div>
        
                            <ul class="detail-plan">
                                <li><input type="checkbox" name="todo" id="chk01" value="책읽기"/><label for="book">책 읽기</label></li>
                                <li><input type="checkbox" name="todo" id="chk02" value="환복"/><label for="chk02">환복</label></li>
                                <li><input type="checkbox" name="todo" id="chk03" value="목욕하기"/><label for="chk03">목욕 하기</label></li>
                                <li><input type="checkbox" name="todo" id="chk04" value="구강관리"/><label for="chk04">구강 관리</label></li>
                                <li><input type="checkbox" name="todo" id="chk05" value="식사하기"/><label for="chk05">식사 하기</label></li>
                                <li><input type="checkbox" name="todo" id="chk06" value="신체기능유지"/><label for="chk06">신체 기능 유지</label></li>
                                <li><input type="checkbox" name="todo" id="chk07" value="세면도움"/><label for="chk07">세면도움</label></li>
                                <li><input type="checkbox" name="todo" id="chk08" value="외출동행"/><label for="chk08">외출 동행</label></li>
                            </ul>
                            <div class="detail-title">
                                <h5>업무 목록</h5>               
                            </div>
                            <p class="mt10" style="text-align:center; font-size: 16px; ">등록된 업무가 없습니다!</p>
        
                            <div class="detail-title">
                                <h5>메모</h5>
                            </div>
                                <input type="textarea" class="detail-memo__textarea" name="memo" id="memo" cols="30" rows="10" class="detail-memo__textarea" placeholder="특이사항이나 메모 내용을 입력해주세요.">
                                
                                <div class="detail-memo__submit">
                                    <p><b>0</b> / 300자</p>
                                    <button onclick="submit()">저장하기</button>
                                </div>
                            
                            
                        
        
                            <p class="page-copy">Copyright &copy; Dongs All Rights Reserved.</p>
        
                        </div><!-- inner -->
                    </div><!-- content -->
                </div><!-- wrap -->
        
                </body>
        
        
                <!-- JS -->
                <script src="js/jquery-2.2.1.min.js"></script>
                <script src="js/placeholders.min.js"></script>
                <script src="js/common.js"></script>
                <script src="js/index.js"></script>
        
                </html>
                `
            }
            else if(json1[i].list.todo == null){
                var output = `
                        <!DOCTYPE HTML>
                    <html xmlns="http://www.w3.org/1999/xhtml" xml:lang="ko" lang="ko">
                    <head>
                    <meta charset="utf-8">
                    <meta name="HandheldFriendly" content="True">
                    <meta name="MobileOptimized" content="320">
                    <meta name="viewport" content="width=device-width, initial-scale=1, minimal-ui">
                    <meta name="mobile-web-app-capable" content="yes">	
                    <meta name="apple-mobile-web-app-capable" content="yes">
                    <meta name="apple-mobile-web-app-status-bar-style" content="black">
                    <meta name="format-detection" content="telephone=no">
                    <meta name="Robots" content="ALL" />
                    <meta http-equiv="X-UA-Compatible" content="IE=edge">
                    <title>생활관리사 맞춤 서비스</title>
                    <link rel="stylesheet" type="text/css" href="css/style.css">
                    </head>
                    <body>
                    <h1 id="title">생활관리사 맞춤 서비스</h1>


                    <div id="wrap">
                        <div id="gnb">
                            <a href="list1" id="gnb-back">뒤로</a>
                            <h2 id="gnb-title">${json1[i].info.pname} 어르신</h2>
                            <button id="gnb-menu"><span>메뉴</span></button>
                            <ul id="gnb-list">
                                <li><a href="list1">오늘업무</a></li>
                                <li><a href="workshare1">인수인계</a></li>
                                <li><a href="manage1">어르신 관리</a></li>
                                <li><a href="mypage1">마이페이지</a></li>
                                <li><a href="/">로그아웃</a></li>
                            </ul>
                        </div>
                        <div id="contents">
                            <div id="inner">
                                
                                <div class="list-myinfo">
                                    <h1 id="querystring" style="display: none;">${req.query.id}</h1>
                                    <div class="detail-info">
                                        <em class="detail-info__thumb" style="background:url('../img/profile_sample.jpg')no-repeat center center / cover;"></em>
                                        <div class="detail-info__name">
                                            <h5><b>${json1[i].info.pname}</b>어르신</h5>
                                            <p>${json1[i].info.padr} / ${json1[i].info.page} / ${json1[i].info.sex}</p>
                                        </div>
                                        <ul class="detail-info__btn">
                                            <li><button class="detail-info__call" onclick="location.href='tel:010-8300-7586'">전화걸기</button></li>
                                            <li><button class="detail-info__family" onclick="location.href='tel:010-8300-7586'">보호자연락</button></li>
                                            <li><button class="detail-info__location" onclick="map()">위치정보</button></li>
                                        </ul>
                                        <div class="detail-info__complete">
                                            <button>방문완료</button>
                                            <!-- <button class="active">방문완료</button> -->
                                        </div>
                                    </div>
                                </div>

                            
                                <div class="detail-title">
                                    <h5>업무 계획</h5>
                                </div>

                                <ul class="detail-plan">
                                    <li><input type="checkbox" name="todo" id="chk01" value="책읽기"/><label for="book">책 읽기</label></li>
                                    <li><input type="checkbox" name="todo" id="chk02" value="환복"/><label for="chk02">환복</label></li>
                                    <li><input type="checkbox" name="todo" id="chk03" value="목욕하기"/><label for="chk03">목욕 하기</label></li>
                                    <li><input type="checkbox" name="todo" id="chk04" value="구강관리"/><label for="chk04">구강 관리</label></li>
                                    <li><input type="checkbox" name="todo" id="chk05" value="식사하기"/><label for="chk05">식사 하기</label></li>
                                    <li><input type="checkbox" name="todo" id="chk06" value="신체기능유지"/><label for="chk06">신체 기능 유지</label></li>
                                    <li><input type="checkbox" name="todo" id="chk07" value="세면도움"/><label for="chk07">세면도움</label></li>
                                    <li><input type="checkbox" name="todo" id="chk08" value="외출동행"/><label for="chk08">외출 동행</label></li>
                                </ul>
                                <div class="detail-title">
                                    <h5>업무 목록</h5>               
                                </div>
                                <p class="mt10" style="text-align:center; font-size: 16px; ">등록된 업무가 없습니다!</p>

                                <div class="detail-title">
                                    <h5>메모</h5>
                                </div>
                                    <input type="textarea" class="detail-memo__textarea" name="memo" id="memo" cols="30" rows="10" class="detail-memo__textarea" placeholder="특이사항이나 메모 내용을 입력해주세요.">
                                    
                                    <div class="detail-memo__submit">
                                        <p><b>0</b> / 300자</p>
                                        <button onclick="submit()">저장하기</button>
                                    </div>
                                
                                
                            

                                <p class="page-copy">Copyright &copy; Dongs All Rights Reserved.</p>

                            </div><!-- inner -->
                        </div><!-- content -->
                    </div><!-- wrap -->

                    </body>


                    <!-- JS -->
                    <script src="js/jquery-2.2.1.min.js"></script>
                    <script src="js/placeholders.min.js"></script>
                    <script src="js/common.js"></script>
                    <script src="js/index.js"></script>

                    </html>
                `
            } else if(json1[i].list.memo == null) {
                var output = `
                <!DOCTYPE HTML>
        <html xmlns="http://www.w3.org/1999/xhtml" xml:lang="ko" lang="ko">
        <head>
        <meta charset="utf-8">
        <meta name="HandheldFriendly" content="True">
        <meta name="MobileOptimized" content="320">
        <meta name="viewport" content="width=device-width, initial-scale=1, minimal-ui">
        <meta name="mobile-web-app-capable" content="yes">	
        <meta name="apple-mobile-web-app-capable" content="yes">
        <meta name="apple-mobile-web-app-status-bar-style" content="black">
        <meta name="format-detection" content="telephone=no">
        <meta name="Robots" content="ALL" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <title>생활관리사 맞춤 서비스</title>
        <link rel="stylesheet" type="text/css" href="css/style.css">
        </head>
        <body>
        <h1 id="title">생활관리사 맞춤 서비스</h1>


        <div id="wrap">
            <div id="gnb">
                <a href="list1" id="gnb-back">뒤로</a>
                <h2 id="gnb-title">${json1[i].info.pname} 어르신</h2>
                <button id="gnb-menu"><span>메뉴</span></button>
                <ul id="gnb-list">
                    <li><a href="list1">오늘업무</a></li>
                    <li><a href="workshare1">인수인계</a></li>
                    <li><a href="manage1">어르신 관리</a></li>
                    <li><a href="mypage1">마이페이지</a></li>
                    <li><a href="/">로그아웃</a></li>
                </ul>
            </div>
            <div id="contents">
                <div id="inner">
                    
                    <div class="list-myinfo">
                        <h1 id="querystring" style="display: none;">${req.query.id}</h1>
                        <div class="detail-info">
                            <em class="detail-info__thumb" style="background:url('../img/profile_sample.jpg')no-repeat center center / cover;"></em>
                            <div class="detail-info__name">
                                <h5><b>${json1[i].info.pname}</b>어르신</h5>
                                <p>${json1[i].info.padr} / ${json1[i].info.page} / ${json1[i].info.sex}</p>
                            </div>
                            <ul class="detail-info__btn">
                                <li><button class="detail-info__call" onclick="location.href='tel:010-8300-7586'">전화걸기</button></li>
                                <li><button class="detail-info__family" onclick="location.href='tel:010-8300-7586'">보호자연락</button></li>
                                <li><button class="detail-info__location" onclick="map()">위치정보</button></li>
                            </ul>
                            <div class="detail-info__complete">
                                <button>방문완료</button>
                                <!-- <button class="active">방문완료</button> -->
                            </div>
                        </div>
                    </div>

                
                    <div class="detail-title">
                        <h5>업무 계획</h5>
                    </div>

                    <ul class="detail-plan">
                        <li><input type="checkbox" name="todo" id="chk01" value="책읽기"/><label for="book">책 읽기</label></li>
                        <li><input type="checkbox" name="todo" id="chk02" value="환복"/><label for="chk02">환복</label></li>
                        <li><input type="checkbox" name="todo" id="chk03" value="목욕하기"/><label for="chk03">목욕 하기</label></li>
                        <li><input type="checkbox" name="todo" id="chk04" value="구강관리"/><label for="chk04">구강 관리</label></li>
                        <li><input type="checkbox" name="todo" id="chk05" value="식사하기"/><label for="chk05">식사 하기</label></li>
                        <li><input type="checkbox" name="todo" id="chk06" value="신체기능유지"/><label for="chk06">신체 기능 유지</label></li>
                        <li><input type="checkbox" name="todo" id="chk07" value="세면도움"/><label for="chk07">세면도움</label></li>
                        <li><input type="checkbox" name="todo" id="chk08" value="외출동행"/><label for="chk08">외출 동행</label></li>
                    </ul>
                    <div class="detail-title">
                        <h5>업무 목록</h5>               
                    </div>
                    <p class="mt10" style="text-align:center; font-size: 16px; ">${json1[i].list.todo}</p>

                    <div class="detail-title">
                        <h5>메모</h5>
                    </div>
                        <input type="textarea" class="detail-memo__textarea" value="" name="memo" id="memo" cols="30" rows="10" class="detail-memo__textarea" placeholder="특이사항이나 메모 내용을 입력해주세요.">
                        
                        <div class="detail-memo__submit">
                            <p><b>0</b> / 300자</p>
                            <button onclick="submit()">저장하기</button>
                        </div>
                    
                    
                

                    <p class="page-copy">Copyright &copy; Dongs All Rights Reserved.</p>

                </div><!-- inner -->
            </div><!-- content -->
        </div><!-- wrap -->

        </body>


        <!-- JS -->
        <script src="js/jquery-2.2.1.min.js"></script>
        <script src="js/placeholders.min.js"></script>
        <script src="js/common.js"></script>
        <script src="js/index.js"></script>

        </html>
                `
            } else {
                var output =`
                <!DOCTYPE HTML>
        <html xmlns="http://www.w3.org/1999/xhtml" xml:lang="ko" lang="ko">
        <head>
        <meta charset="utf-8">
        <meta name="HandheldFriendly" content="True">
        <meta name="MobileOptimized" content="320">
        <meta name="viewport" content="width=device-width, initial-scale=1, minimal-ui">
        <meta name="mobile-web-app-capable" content="yes">	
        <meta name="apple-mobile-web-app-capable" content="yes">
        <meta name="apple-mobile-web-app-status-bar-style" content="black">
        <meta name="format-detection" content="telephone=no">
        <meta name="Robots" content="ALL" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <title>생활관리사 맞춤 서비스</title>
        <link rel="stylesheet" type="text/css" href="css/style.css">
        </head>
        <body>
        <h1 id="title">생활관리사 맞춤 서비스</h1>


        <div id="wrap">
            <div id="gnb">
                <a href="list1" id="gnb-back">뒤로</a>
                <h2 id="gnb-title">${json1[i].info.pname} 어르신</h2>
                <button id="gnb-menu"><span>메뉴</span></button>
                <ul id="gnb-list">
                    <li><a href="list1">오늘업무</a></li>
                    <li><a href="workshare1">인수인계</a></li>
                    <li><a href="manage1">어르신 관리</a></li>
                    <li><a href="mypage1">마이페이지</a></li>
                    <li><a href="/">로그아웃</a></li>
                </ul>
            </div>
            <div id="contents">
                <div id="inner">
                    
                    <div class="list-myinfo">
                        <h1 id="querystring" style="display: none;">${req.query.id}</h1>
                        <div class="detail-info">
                            <em class="detail-info__thumb" style="background:url('../img/profile_sample.jpg')no-repeat center center / cover;"></em>
                            <div class="detail-info__name">
                                <h5><b>${json1[i].info.pname}</b>어르신</h5>
                                <p>${json1[i].info.padr} / ${json1[i].info.page} / ${json1[i].info.sex}</p>
                            </div>
                            <ul class="detail-info__btn">
                                <li><button class="detail-info__call" onclick="location.href='tel:010-8300-7586'">전화걸기</button></li>
                                <li><button class="detail-info__family" onclick="location.href='tel:010-8300-7586'">보호자연락</button></li>
                                <li><button class="detail-info__location" onclick="location.href='map1?id=${req.query.id}'">위치정보</button></li>
                            </ul>
                            <div class="detail-info__complete">
                                <button>방문완료</button>
                                <!-- <button class="active">방문완료</button> -->
                            </div>
                        </div>
                    </div>

                
                    <div class="detail-title">
                        <h5>업무 계획</h5>
                    </div>

                    <ul class="detail-plan">
                        <li><input type="checkbox" name="todo" id="chk01" value="책읽기"/><label for="book">책 읽기</label></li>
                        <li><input type="checkbox" name="todo" id="chk02" value="환복"/><label for="chk02">환복</label></li>
                        <li><input type="checkbox" name="todo" id="chk03" value="목욕하기"/><label for="chk03">목욕 하기</label></li>
                        <li><input type="checkbox" name="todo" id="chk04" value="구강관리"/><label for="chk04">구강 관리</label></li>
                        <li><input type="checkbox" name="todo" id="chk05" value="식사하기"/><label for="chk05">식사 하기</label></li>
                        <li><input type="checkbox" name="todo" id="chk06" value="신체기능유지"/><label for="chk06">신체 기능 유지</label></li>
                        <li><input type="checkbox" name="todo" id="chk07" value="세면도움"/><label for="chk07">세면도움</label></li>
                        <li><input type="checkbox" name="todo" id="chk08" value="외출동행"/><label for="chk08">외출 동행</label></li>
                    </ul>
                    <div class="detail-title">
                        <h5>업무 목록</h5>               
                    </div>
                    <p class="mt10" style="text-align:center; font-size: 16px; ">${json1[i].list.todo}</p>

                    <div class="detail-title">
                        <h5>메모</h5>
                    </div>
                        <input type="textarea" class="detail-memo__textarea" value="${json1[i].list.memo}" name="memo" id="memo" cols="30" rows="10" class="detail-memo__textarea" placeholder="특이사항이나 메모 내용을 입력해주세요.">
                        
                        <div class="detail-memo__submit">
                            <p><b>0</b> / 300자</p>
                            <button onclick="submit()">저장하기</button>
                        </div>
                    
                    
                

                    <p class="page-copy">Copyright &copy; Dongs All Rights Reserved.</p>

                </div><!-- inner -->
            </div><!-- content -->
        </div><!-- wrap -->

        </body>


        <!-- JS -->
        <script src="js/jquery-2.2.1.min.js"></script>
        <script src="js/placeholders.min.js"></script>
        <script src="js/common.js"></script>
        <script src="js/index.js"></script>

        </html>
                `
            }
    res.send(output);

        };
    };
  });

//상세페이지(추가업무)
app.get('/detail2', function(req, res){
console.log(req.body);
for(let i=0; i<share1.length; i++){
    if(share1[i].shareID == req.query.id){
        if (share1[i].todo == null && share1[i].memo == null){
            var output = `
            <!DOCTYPE HTML>
                <html xmlns="http://www.w3.org/1999/xhtml" xml:lang="ko" lang="ko">
                <head>
                <meta charset="utf-8">
                <meta name="HandheldFriendly" content="True">
                <meta name="MobileOptimized" content="320">
                <meta name="viewport" content="width=device-width, initial-scale=1, minimal-ui">
                <meta name="mobile-web-app-capable" content="yes">	
                <meta name="apple-mobile-web-app-capable" content="yes">
                <meta name="apple-mobile-web-app-status-bar-style" content="black">
                <meta name="format-detection" content="telephone=no">
                <meta name="Robots" content="ALL" />
                <meta http-equiv="X-UA-Compatible" content="IE=edge">
                <title>생활관리사 맞춤 서비스</title>
                <link rel="stylesheet" type="text/css" href="css/style.css">
                </head>
                <body>
                <h1 id="title">생활관리사 맞춤 서비스</h1>


                <div id="wrap">
                    <div id="gnb">
                        <a href="list1" id="gnb-back">뒤로</a>
                        <h2 id="gnb-title">${share1[i].pname} 어르신</h2>
                        <button id="gnb-menu"><span>메뉴</span></button>
                        <ul id="gnb-list">
                            <li><a href="list1">오늘업무</a></li>
                            <li><a href="workshare1">인수인계</a></li>
                            <li><a href="manage1">어르신 관리</a></li>
                            <li><a href="mypage1">마이페이지</a></li>
                            <li><a href="/">로그아웃</a></li>
                        </ul>
                    </div>
                    <div id="contents">
                        <div id="inner">
                            
                            <div class="list-myinfo">
                                <h1 id="querystring" style="display: none;">${req.query.id}</h1>
                                <div class="detail-info">
                                    <em class="detail-info__thumb" style="background:url('../img/profile_sample.jpg')no-repeat center center / cover;"></em>
                                    <div class="detail-info__name">
                                        <h5><b>${share1[i].pname}</b>어르신</h5>
                                        <p>${share1[i].padr} / ${share1[i].page} / ${share1[i].sex}</p>
                                    </div>
                                    <ul class="detail-info__btn">
                                        <li><button class="detail-info__call" onclick="location.href='tel:010-8300-7586'">전화걸기</button></li>
                                        <li><button class="detail-info__family" onclick="location.href='tel:010-8300-7586'">보호자연락</button></li>
                                        <li><button class="detail-info__location" onclick="map()">위치정보</button></li>
                                    </ul>
                                    <div class="detail-info__complete">
                                        <button>방문완료</button>
                                        <!-- <button class="active">방문완료</button> -->
                                    </div>
                                </div>
                            </div>

                        
                            <div class="detail-title">
                                <h5>업무 계획</h5>
                            </div>

                            <ul class="detail-plan">
                                <li><input type="checkbox" name="todo" id="chk01" value="책읽기"/><label for="book">책 읽기</label></li>
                                <li><input type="checkbox" name="todo" id="chk02" value="환복"/><label for="chk02">환복</label></li>
                                <li><input type="checkbox" name="todo" id="chk03" value="목욕하기"/><label for="chk03">목욕 하기</label></li>
                                <li><input type="checkbox" name="todo" id="chk04" value="구강관리"/><label for="chk04">구강 관리</label></li>
                                <li><input type="checkbox" name="todo" id="chk05" value="식사하기"/><label for="chk05">식사 하기</label></li>
                                <li><input type="checkbox" name="todo" id="chk06" value="신체기능유지"/><label for="chk06">신체 기능 유지</label></li>
                                <li><input type="checkbox" name="todo" id="chk07" value="세면도움"/><label for="chk07">세면도움</label></li>
                                <li><input type="checkbox" name="todo" id="chk08" value="외출동행"/><label for="chk08">외출 동행</label></li>
                            </ul>
                            <div class="detail-title">
                                <h5>업무 목록</h5>               
                            </div>
                            <p class="mt10" style="text-align:center; font-size: 16px; ">등록된 업무가 없습니다!</p>

                            <div class="detail-title">
                                <h5>메모</h5>
                            </div>
                                <input type="textarea" class="detail-memo__textarea" name="memo" id="memo" cols="30" rows="10" class="detail-memo__textarea" placeholder="특이사항이나 메모 내용을 입력해주세요.">
                                
                                <div class="detail-memo__submit">
                                    <p><b>0</b> / 300자</p>
                                    <button onclick="shareSubmit()">저장하기</button>
                                </div>
                            
                            
                        

                            <p class="page-copy">Copyright &copy; Dongs All Rights Reserved.</p>

                        </div><!-- inner -->
                    </div><!-- content -->
                </div><!-- wrap -->

                </body>


                <!-- JS -->
                <script src="js/jquery-2.2.1.min.js"></script>
                <script src="js/placeholders.min.js"></script>
                <script src="js/common.js"></script>
                <script src="js/index.js"></script>

                </html>
            `
        }
        else if(share1[i].todo == null){
            var output = `
            <!DOCTYPE HTML>
                <html xmlns="http://www.w3.org/1999/xhtml" xml:lang="ko" lang="ko">
                <head>
                <meta charset="utf-8">
                <meta name="HandheldFriendly" content="True">
                <meta name="MobileOptimized" content="320">
                <meta name="viewport" content="width=device-width, initial-scale=1, minimal-ui">
                <meta name="mobile-web-app-capable" content="yes">	
                <meta name="apple-mobile-web-app-capable" content="yes">
                <meta name="apple-mobile-web-app-status-bar-style" content="black">
                <meta name="format-detection" content="telephone=no">
                <meta name="Robots" content="ALL" />
                <meta http-equiv="X-UA-Compatible" content="IE=edge">
                <title>생활관리사 맞춤 서비스</title>
                <link rel="stylesheet" type="text/css" href="css/style.css">
                </head>
                <body>
                <h1 id="title">생활관리사 맞춤 서비스</h1>


                <div id="wrap">
                    <div id="gnb">
                        <a href="list1" id="gnb-back">뒤로</a>
                        <h2 id="gnb-title">${share1[i].pname} 어르신</h2>
                        <button id="gnb-menu"><span>메뉴</span></button>
                        <ul id="gnb-list">
                            <li><a href="list1">오늘업무</a></li>
                            <li><a href="workshare1">인수인계</a></li>
                            <li><a href="manage1">어르신 관리</a></li>
                            <li><a href="mypage1">마이페이지</a></li>
                            <li><a href="/">로그아웃</a></li>
                        </ul>
                    </div>
                    <div id="contents">
                        <div id="inner">
                            
                            <div class="list-myinfo">
                                <h1 id="querystring" style="display: none;">${req.query.id}</h1>
                                <div class="detail-info">
                                    <em class="detail-info__thumb" style="background:url('../img/profile_sample.jpg')no-repeat center center / cover;"></em>
                                    <div class="detail-info__name">
                                        <h5><b>${share1[i].pname}</b>어르신</h5>
                                        <p>${share1[i].padr} / ${share1[i].page} / ${share1[i].sex}</p>
                                    </div>
                                    <ul class="detail-info__btn">
                                        <li><button class="detail-info__call" onclick="location.href='tel:010-8300-7586'">전화걸기</button></li>
                                        <li><button class="detail-info__family" onclick="location.href='tel:010-8300-7586'">보호자연락</button></li>
                                        <li><button class="detail-info__location" onclick="map()">위치정보</button></li>
                                    </ul>
                                    <div class="detail-info__complete">
                                        <button>방문완료</button>
                                        <!-- <button class="active">방문완료</button> -->
                                    </div>
                                </div>
                            </div>

                        
                            <div class="detail-title">
                                <h5>업무 계획</h5>
                            </div>

                            <ul class="detail-plan">
                                <li><input type="checkbox" name="todo" id="chk01" value="책읽기"/><label for="book">책 읽기</label></li>
                                <li><input type="checkbox" name="todo" id="chk02" value="환복"/><label for="chk02">환복</label></li>
                                <li><input type="checkbox" name="todo" id="chk03" value="목욕하기"/><label for="chk03">목욕 하기</label></li>
                                <li><input type="checkbox" name="todo" id="chk04" value="구강관리"/><label for="chk04">구강 관리</label></li>
                                <li><input type="checkbox" name="todo" id="chk05" value="식사하기"/><label for="chk05">식사 하기</label></li>
                                <li><input type="checkbox" name="todo" id="chk06" value="신체기능유지"/><label for="chk06">신체 기능 유지</label></li>
                                <li><input type="checkbox" name="todo" id="chk07" value="세면도움"/><label for="chk07">세면도움</label></li>
                                <li><input type="checkbox" name="todo" id="chk08" value="외출동행"/><label for="chk08">외출 동행</label></li>
                            </ul>
                            <div class="detail-title">
                                <h5>업무 목록</h5>               
                            </div>
                            <p class="mt10" style="text-align:center; font-size: 16px; ">등록된 업무가 없습니다!</p>

                            <div class="detail-title">
                                <h5>메모</h5>
                            </div>
                                <input type="textarea" class="detail-memo__textarea" name="memo" value="${share1[i].memo}" id="memo" cols="30" rows="10" class="detail-memo__textarea" placeholder="특이사항이나 메모 내용을 입력해주세요.">
                                
                                <div class="detail-memo__submit">
                                    <p><b>0</b> / 300자</p>
                                    <button onclick="shareSubmit()">저장하기</button>
                                </div>
                            
                            
                        

                            <p class="page-copy">Copyright &copy; Dongs All Rights Reserved.</p>

                        </div><!-- inner -->
                    </div><!-- content -->
                </div><!-- wrap -->

                </body>


                <!-- JS -->
                <script src="js/jquery-2.2.1.min.js"></script>
                <script src="js/placeholders.min.js"></script>
                <script src="js/common.js"></script>
                <script src="js/index.js"></script>

                </html>
            `
        } else if (share1[i].memo==null) {
            var output = `
            <!DOCTYPE HTML>
                <html xmlns="http://www.w3.org/1999/xhtml" xml:lang="ko" lang="ko">
                <head>
                <meta charset="utf-8">
                <meta name="HandheldFriendly" content="True">
                <meta name="MobileOptimized" content="320">
                <meta name="viewport" content="width=device-width, initial-scale=1, minimal-ui">
                <meta name="mobile-web-app-capable" content="yes">	
                <meta name="apple-mobile-web-app-capable" content="yes">
                <meta name="apple-mobile-web-app-status-bar-style" content="black">
                <meta name="format-detection" content="telephone=no">
                <meta name="Robots" content="ALL" />
                <meta http-equiv="X-UA-Compatible" content="IE=edge">
                <title>생활관리사 맞춤 서비스</title>
                <link rel="stylesheet" type="text/css" href="css/style.css">
                </head>
                <body>
                <h1 id="title">생활관리사 맞춤 서비스</h1>


                <div id="wrap">
                    <div id="gnb">
                        <a href="list1" id="gnb-back">뒤로</a>
                        <h2 id="gnb-title">${share1[i].pname} 어르신</h2>
                        <button id="gnb-menu"><span>메뉴</span></button>
                        <ul id="gnb-list">
                            <li><a href="list1">오늘업무</a></li>
                            <li><a href="workshare1">인수인계</a></li>
                            <li><a href="manage1">어르신 관리</a></li>
                            <li><a href="mypage1">마이페이지</a></li>
                            <li><a href="/">로그아웃</a></li>
                        </ul>
                    </div>
                    <div id="contents">
                        <div id="inner">
                            
                            <div class="list-myinfo">
                                <h1 id="querystring" style="display: none;">${req.query.id}</h1>
                                <div class="detail-info">
                                    <em class="detail-info__thumb" style="background:url('../img/profile_sample.jpg')no-repeat center center / cover;"></em>
                                    <div class="detail-info__name">
                                        <h5><b>${share1[i].pname}</b>어르신</h5>
                                        <p>${share1[i].padr} / ${share1[i].page} / ${share1[i].sex}</p>
                                    </div>
                                    <ul class="detail-info__btn">
                                        <li><button class="detail-info__call" onclick="location.href='tel:010-8300-7586'">전화걸기</button></li>
                                        <li><button class="detail-info__family" onclick="location.href='tel:010-8300-7586'">보호자연락</button></li>
                                        <li><button class="detail-info__location" onclick="map()">위치정보</button></li>
                                    </ul>
                                    <div class="detail-info__complete">
                                        <button>방문완료</button>
                                        <!-- <button class="active">방문완료</button> -->
                                    </div>
                                </div>
                            </div>

                        
                            <div class="detail-title">
                                <h5>업무 계획</h5>
                            </div>

                            <ul class="detail-plan">
                                <li><input type="checkbox" name="todo" id="chk01" value="책읽기"/><label for="book">책 읽기</label></li>
                                <li><input type="checkbox" name="todo" id="chk02" value="환복"/><label for="chk02">환복</label></li>
                                <li><input type="checkbox" name="todo" id="chk03" value="목욕하기"/><label for="chk03">목욕 하기</label></li>
                                <li><input type="checkbox" name="todo" id="chk04" value="구강관리"/><label for="chk04">구강 관리</label></li>
                                <li><input type="checkbox" name="todo" id="chk05" value="식사하기"/><label for="chk05">식사 하기</label></li>
                                <li><input type="checkbox" name="todo" id="chk06" value="신체기능유지"/><label for="chk06">신체 기능 유지</label></li>
                                <li><input type="checkbox" name="todo" id="chk07" value="세면도움"/><label for="chk07">세면도움</label></li>
                                <li><input type="checkbox" name="todo" id="chk08" value="외출동행"/><label for="chk08">외출 동행</label></li>
                            </ul>
                            <div class="detail-title">
                                <h5>업무 목록</h5>               
                            </div>
                            <p class="mt10" style="text-align:center; font-size: 16px; ">${share1[i].todo}</p>

                            <div class="detail-title">
                                <h5>메모</h5>
                            </div>
                                <input type="textarea" class="detail-memo__textarea" name="memo" id="memo" cols="30" rows="10" class="detail-memo__textarea" placeholder="특이사항이나 메모 내용을 입력해주세요.">
                                
                                <div class="detail-memo__submit">
                                    <p><b>0</b> / 300자</p>
                                    <button onclick="shareSubmit()">저장하기</button>
                                </div>
                            
                            
                        

                            <p class="page-copy">Copyright &copy; Dongs All Rights Reserved.</p>

                        </div><!-- inner -->
                    </div><!-- content -->
                </div><!-- wrap -->

                </body>


                <!-- JS -->
                <script src="js/jquery-2.2.1.min.js"></script>
                <script src="js/placeholders.min.js"></script>
                <script src="js/common.js"></script>
                <script src="js/index.js"></script>

                </html>
            `
        }

        else {
            var output = `
            <!DOCTYPE HTML>
            <html xmlns="http://www.w3.org/1999/xhtml" xml:lang="ko" lang="ko">
            <head>
            <meta charset="utf-8">
            <meta name="HandheldFriendly" content="True">
            <meta name="MobileOptimized" content="320">
            <meta name="viewport" content="width=device-width, initial-scale=1, minimal-ui">
            <meta name="mobile-web-app-capable" content="yes">	
            <meta name="apple-mobile-web-app-capable" content="yes">
            <meta name="apple-mobile-web-app-status-bar-style" content="black">
            <meta name="format-detection" content="telephone=no">
            <meta name="Robots" content="ALL" />
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <title>생활관리사 맞춤 서비스</title>
            <link rel="stylesheet" type="text/css" href="css/style.css">
            </head>
            <body>
            <h1 id="title">생활관리사 맞춤 서비스</h1>
    
    
            <div id="wrap">
                <div id="gnb">
                    <a href="list1" id="gnb-back">뒤로</a>
                    <h2 id="gnb-title">${share1[i].pname} 어르신</h2>
                    <button id="gnb-menu"><span>메뉴</span></button>
                    <ul id="gnb-list">
                        <li><a href="list1">오늘업무</a></li>
                        <li><a href="workshare1">인수인계</a></li>
                        <li><a href="manage1">어르신 관리</a></li>
                        <li><a href="mypage1">마이페이지</a></li>
                        <li><a href="/">로그아웃</a></li>
                    </ul>
                </div>
                <div id="contents">
                    <div id="inner">
                        
                        <div class="list-myinfo">
                            <h1 id="querystring" style="display: none;">${req.query.id}</h1>
                            <div class="detail-info">
                                <em class="detail-info__thumb" style="background:url('../img/profile_sample.jpg')no-repeat center center / cover;"></em>
                                <div class="detail-info__name">
                                    <h5><b>${share1[i].pname}</b>어르신</h5>
                                    <p>${share1[i].padr} / ${share1[i].page} / ${share1[i].sex}</p>
                                </div>
                                <ul class="detail-info__btn">
                                    <li><button class="detail-info__call" onclick="location.href='tel:010-8300-7586'">전화걸기</button></li>
                                    <li><button class="detail-info__family" onclick="location.href='tel:010-8300-7586'">보호자연락</button></li>
                                    <li><button class="detail-info__location" onclick="map()">위치정보</button></li>
                                </ul>
                                <div class="detail-info__complete">
                                    <button>방문완료</button>
                                    <!-- <button class="active">방문완료</button> -->
                                </div>
                            </div>
                        </div>
    
                    
                        <div class="detail-title">
                            <h5>업무 계획</h5>
                        </div>
    
                        <ul class="detail-plan">
                            <li><input type="checkbox" name="todo" id="chk01" value="책읽기"/><label for="book">책 읽기</label></li>
                            <li><input type="checkbox" name="todo" id="chk02" value="환복"/><label for="chk02">환복</label></li>
                            <li><input type="checkbox" name="todo" id="chk03" value="목욕하기"/><label for="chk03">목욕 하기</label></li>
                            <li><input type="checkbox" name="todo" id="chk04" value="구강관리"/><label for="chk04">구강 관리</label></li>
                            <li><input type="checkbox" name="todo" id="chk05" value="식사하기"/><label for="chk05">식사 하기</label></li>
                            <li><input type="checkbox" name="todo" id="chk06" value="신체기능유지"/><label for="chk06">신체 기능 유지</label></li>
                            <li><input type="checkbox" name="todo" id="chk07" value="세면도움"/><label for="chk07">세면도움</label></li>
                            <li><input type="checkbox" name="todo" id="chk08" value="외출동행"/><label for="chk08">외출 동행</label></li>
                        </ul>
                        <div class="detail-title">
                            <h5>업무 목록</h5>               
                        </div>
                        <p class="mt10" style="text-align:center; font-size: 16px; ">${share1[i].todo}</p>
    
                        <div class="detail-title">
                            <h5>메모</h5>
                        </div>
                            <input type="textarea" class="detail-memo__textarea" value="${share1[i].memo}" name="memo" id="memo" cols="30" rows="10" class="detail-memo__textarea" placeholder="특이사항이나 메모 내용을 입력해주세요.">
                            
                            <div class="detail-memo__submit">
                                <p><b>0</b> / 300자</p>
                                <button onclick="shareSubmit()">저장하기</button>
                            </div>
                        
                        
                    
    
                        <p class="page-copy">Copyright &copy; Dongs All Rights Reserved.</p>
    
                    </div><!-- inner -->
                </div><!-- content -->
            </div><!-- wrap -->
    
            </body>
    
    
            <!-- JS -->
            <script src="js/jquery-2.2.1.min.js"></script>
            <script src="js/placeholders.min.js"></script>
            <script src="js/common.js"></script>
            <script src="js/index.js"></script>
    
            </html>
            `;
        }
        res.send(output);
    }
}
});

// 어르신 거주지 지도 마커
app.get('/map1', function(req, res){
    for(let i=0; i<json1.length; i++){
        if(json1[i].id == req.query.id){
            var output = `
                <!DOCTYPE HTML>
            <html xmlns="http://www.w3.org/1999/xhtml" xml:lang="ko" lang="ko">

            <head>
                <meta charset="utf-8">
                <meta name="HandheldFriendly" content="True">
                <meta name="MobileOptimized" content="320">
                <meta name="viewport" content="width=device-width, initial-scale=1, minimal-ui">
                <meta name="mobile-web-app-capable" content="yes">
                <meta name="apple-mobile-web-app-capable" content="yes">
                <meta name="apple-mobile-web-app-status-bar-style" content="black">
                <meta name="format-detection" content="telephone=no">
                <meta name="Robots" content="ALL" />
                <meta http-equiv="X-UA-Compatible" content="IE=edge">
                <title>생활관리사 맞춤 서비스</title>
                <link rel="stylesheet" type="text/css" href="css/style.css">
            </head>

            <body>
                <h1 id="title">생활관리사 맞춤 서비스</h1>


                <div id="wrap">
                    <div id="gnb">
                        <h2 id="gnb-title">위치정보</h2>
                        <button id="gnb-menu"><span>메뉴</span></button>
                        <ul id="gnb-list">
                            <li><a href="list1">오늘업무</a></li>
                            <li><a href="workshare1">인수인계</a></li>
                            <li><a href="manage1">어르신 관리</a></li>
                            <li><a href="mypage1">마이페이지</a></li>
                            <li><a href="/">로그아웃</a></li>
                        </ul>
                    </div>
                    <div id="contents">
                        <div id="map-inner">
                            <div id="map" style="width:100%;height:800px;">

                            </div>
                        </div>
                    </div><!-- inner -->
                </div><!-- content -->
            </div><!-- wrap -->




                <!-- JS -->
                <script src="js/jquery-2.2.1.min.js"></script>
                <script src="js/placeholders.min.js"></script>
                <script src="js/common.js"></script>
                <script type="text/javascript" src="https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=se5rcmbh22&submodules=geocoder"></script>
                <script>
                    
                        let markers = new Array();
                        let infoWindows = new Array();

                    naver.maps.Service.fromAddrToCoord({ address: '${json1[i].info.padr}' }, function(status, response) {
                        if (status === naver.maps.Service.Status.ERROR) {
                            return alert('Something wrong!');
                        }

                        var map = new naver.maps.Map('map', {
                            center: new naver.maps.LatLng(response.result.items[0].point.y, response.result.items[0].point.x),
                            zoom: 18
                            });

                        var marker = new naver.maps.Marker({
                            position: new naver.maps.LatLng(response.result.items[0].point.y, response.result.items[0].point.x),
                            map: map
                        });

                        var infoWindow = new naver.maps.InfoWindow({
                            content: '<div style="width: 250px; text-align: center; padding:10px;"><b style="font-weight: 300; font-size: 18px;">' + '${json1[i].info.pname} '+ '${json1[i].info.page} '+ '${json1[i].info.sex}' + '<p style="font-size: 16px; font-weight: 400;">' + '${json1[i].info.padr}' + '</p>' + '</b></div>'
                        });

                        markers.push(marker);
                        infoWindows.push(infoWindow);

                        function getClickHandler(seq) {

                            return function(e) {  // 마커를 클릭하는 부분
                                var marker = markers[seq], // 클릭한 마커의 시퀀스로 찾는다.
                                    infoWindow = infoWindows[seq]; // 클릭한 마커의 시퀀스로 찾는다
                    
                                if (infoWindow.getMap()) {
                                    infoWindow.close();
                                } else {
                                    infoWindow.open(map, marker); // 표출
                                }
                            }
                        }
                    
                    for (var i=0, j=markers.length; i<j; i++) {
                        naver.maps.Event.addListener(markers[i], 'click', getClickHandler(i)); // 클릭한 마커 핸들러
                    }
                    });
                    



                
                </script>
            </body>

            </html>`;
            res.send(output);
        };
    };
});

//메모 및 할일 등록(고정업무)
app.post('/detail1', function(req, res){
    for(let i=0; i<json1.length; i++){
        if(json1[i].id == req.body.id){
            connection.query(`UPDATE patient SET todo = "${req.body.list}" where pname = "${json1[i].info.pname}"; UPDATE patient SET memo = "${req.body.memo}" where pname = "${json1[i].info.pname}"`, function(error, results, fields){
                if(error) throw error
            });
        }
    }
});

//메모 및 할일 등록(추가업무)
app.post('/detail2', function(req, res){
    console.log(req.body);
    for(let i=0; i<share1.length; i++){
        if(share1[i].shareID == req.body.id){
            connection.query(`UPDATE patient SET todo = "${req.body.list}" where pname = "${share1[i].pname}"; UPDATE patient SET memo = "${req.body.memo}" where pname = "${share1[i].pname}"`, function(error, results, fields){
                if(error) throw error;
            });
        }
    }
});

//마이페이지
app.get('/mypage1', function(req, res){
    let output = "";
    connection.query(`SELECT * FROM user WHERE name = "${req.session.name}"`, function(error, results, fields){
        if (error) throw error
        console.log("관리자 마이페이지 접속 쿼리 결과:", results);
        output += `
        <!DOCTYPE HTML>
        <html xmlns="http://www.w3.org/1999/xhtml" xml:lang="ko" lang="ko">
        
        <head>
            <meta charset="utf-8">
            <meta name="HandheldFriendly" content="True">
            <meta name="MobileOptimized" content="320">
            <meta name="viewport" content="width=device-width, initial-scale=1, minimal-ui">
            <meta name="mobile-web-app-capable" content="yes">
            <meta name="apple-mobile-web-app-capable" content="yes">
            <meta name="apple-mobile-web-app-status-bar-style" content="black">
            <meta name="format-detection" content="telephone=no">
            <meta name="Robots" content="ALL" />
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <title>생활관리사 맞춤 서비스</title>
            <link rel="stylesheet" type="text/css" href="css/style.css">
        </head>
        
        <body>
            <h1 id="title">생활관리사 맞춤 서비스</h1>
        
        
            <div id="wrap">
                <div id="gnb">
                    <h2 id="gnb-title">마이페이지</h2>
                    <button id="gnb-menu"><span>메뉴</span></button>
                    <ul id="gnb-list">
                        <li><a href="list1">오늘업무</a></li>
                        <li><a href="workshare1">인수인계</a></li>
                        <li><a href="manage1">어르신 관리</a></li>
                        <li><a href="mypage1">마이페이지</a></li>
                        <li><a href="/">로그아웃</a></li>
                    </ul>
                </div>
                <div id="contents">
                    <div id="inner">
                        <div class="profile">
                            <em class="profile-photo" style="background:url('../img/profile_sample.jpg') no-repeat center center / cover"></em>
                            <h5>${results[0].name}</h5>
                        </div>
                                <dl class="profile-list">
                                    <dt><i class="fa fa-phone" aria-hidden="true"></i>${results[0].phoneNum}</dt>
                                    <dd><i class="fa fa-building-o" aria-hidden="true"></i><a href="http://www.chonansenior.org/">${results[0].center}</a><i class="fa fa-angle-right" aria-hidden="true"></i></dd>
                                </dl>        
                        <div class="mypage-list">
                            <ul>
                               <li><a href="#">회원정보수정</a></li>
                               <li><a href="/deletelist1">인수인계 리스트 삭제</a></li>
                               <li><a href="#">설정</a></li>
                               <li><a href="/">로그아웃</a></li>
                               <li><a href="tel:010-8300-7586">1:1 전화문의</a></li>
                               <li><a href="#">앱 관리</a></li>
                            </ul>
                        </div>
                    </div><!-- inner -->
                </div><!-- content -->
            </div><!-- wrap -->
        
        
        
        
            <!-- JS -->
            <script src="js/jquery-2.2.1.min.js"></script>
            <script src="js/placeholders.min.js"></script>
            <script src="js/common.js"></script>
            <script>
        
            </script>
        </body>
        
        </html>
        `;
        res.send(output);
    });
});

//어르신관리
app.get('/manage1', function(req, res){
    let output = "";
    let list ="";
    if(req.session.name && req.session.info && req.session.workCount){
        let info = req.session.info;
        let json = JSON.stringify(info);
        let parseData = JSON.parse(json);
        for(let i=0; i<req.session.info.length; i++){
            list += `
            <li class="list-item">
                                <a href="/detail1?id=${parseData[i].id}" class="list-item__link">
                                    <em class="list-item__thumb" style="background:url('../img/profile_sample.jpg')no-repeat center center / cover;"></em>
                                    <div class="list-item__text">
                                        <h5><b>${parseData[i].info.pname}</b>어르신</h5>
                                        <p>${parseData[i].info.padr} / ${parseData[i].info.page} / ${parseData[i].info.sex}</p>
                                    </div>
                                </a>
                                <a href="tel:010-8300-7586" class="list-item__tel">전화걸기</a>
                            </li>
            `;
        };
        output += `<!DOCTYPE HTML>
        <html xmlns="http://www.w3.org/1999/xhtml" xml:lang="ko" lang="ko">
        
        <head>
            <meta charset="utf-8">
            <meta name="HandheldFriendly" content="True">
            <meta name="MobileOptimized" content="320">
            <meta name="viewport" content="width=device-width, initial-scale=1, minimal-ui">
            <meta name="mobile-web-app-capable" content="yes">
            <meta name="apple-mobile-web-app-capable" content="yes">
            <meta name="apple-mobile-web-app-status-bar-style" content="black">
            <meta name="format-detection" content="telephone=no">
            <meta name="Robots" content="ALL" />
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <title>생활관리사 맞춤 서비스</title>
            <link rel="stylesheet" type="text/css" href="css/style.css">
        </head>
        
        <body>
            <h1 id="title">생활관리사 맞춤 서비스</h1>
        
        
            <div id="wrap">
                <div id="gnb">
                    <h2 id="gnb-title">어르신 관리</h2>
                    <button id="gnb-menu"><span>메뉴</span></button>
                    <ul id="gnb-list">
                        <li><a href="list1">오늘업무</a></li>
                        <li><a href="workshare1">인수인계</a></li>
                        <li><a href="manage1">어르신 관리</a></li>
                        <li><a href="mypage1">마이페이지</a></li>
                        <li><a href="/">로그아웃</a></li>
                    </ul>
                </div>
                <div id="contents">
                    <div id="inner">
                        <div class="input-area">
                            <input type="search" id="input-task">
                            <label for="task-label">
                                <span>어르신 성함을 입력해주세요.<span>
                            </label>
                            <button class="search"><i class="fa fa-search" aria-hidden="true"></i></button>
                        </div>
                        <div class="list-area">
                        <ul class="list-group">
                           ${list}
        
                        </ul>
                    </div>
                        
        
        
                        <p class="page-copy">Copyright &copy; Dongs All Rights Reserved.</p>
        
                    </div><!-- inner -->
                </div><!-- content -->
            </div><!-- wrap -->
        
        
        
        
            <!-- JS -->
            <script src="js/jquery-2.2.1.min.js"></script>
            <script src="js/placeholders.min.js"></script>
            <script src="js/common.js"></script>
            <script>
        
            </script>
        </body>
        
        </html>
        
            `;
        res.send(output);
};
    
});

//인수인계
app.get('/workshare1', function(req, res){
    let output = "";
    let list = "";
    connection.query(`SELECT * from patient where manName = "${req.session.name}"`, function(eroor, results, fields){
         for(let i=0; i<json1.length; i++){
        list+=`<li>${json1[i].info.pname} 어르신 방문</label></li>`
    };

    output += `<!DOCTYPE HTML>
    <html xmlns="http://www.w3.org/1999/xhtml" xml:lang="ko" lang="ko">
    
    <head>
        <meta charset="utf-8">
        <meta name="HandheldFriendly" content="True">
        <meta name="MobileOptimized" content="320">
        <meta name="viewport" content="width=device-width, initial-scale=1, minimal-ui">
        <meta name="mobile-web-app-capable" content="yes">
        <meta name="apple-mobile-web-app-capable" content="yes">
        <meta name="apple-mobile-web-app-status-bar-style" content="black">
        <meta name="format-detection" content="telephone=no">
        <meta name="Robots" content="ALL" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <title>생활관리사 맞춤 서비스</title>
        <link rel="stylesheet" type="text/css" href="css/style.css">
    </head>
    
    <body>
        <h1 id="title">생활관리사 맞춤 서비스</h1>
    
    
        <div id="wrap">
            <div id="gnb">
                <h2 id="gnb-title">인수인계</h2>
                <button id="gnb-menu"><span>메뉴</span></button>
                <ul id="gnb-list">
                    <li><a href="list1">오늘업무</a></li>
                    <li><a href="workshare1">인수인계</a></li>
                    <li><a href="manage1">어르신 관리</a></li>
                    <li><a href="mypage1">마이페이지</a></li>
                    <li><a href="/">로그아웃</a></li>
                </ul>
            </div>
            <div id="contents">
                <div id="inner">
                    <div class="input-area">
                        <input type="search" id="input-task">
                        <label for="task-label">
                            <span>인수인계 할 관리사 명을 입력하세요.</span>
                        </label>
                        <button class="search"><i class="fa fa-search" aria-hidden="true"></i></button>
                    </div>
                    <div class="calender">
                        <div class="calender-inner">
                            <div class="calender-tb">
                                <button class="nav-btn go-today" onclick="goToday()">오늘 날짜로</button>
                                <div class="nav">
                                    <div><button class="nav-btn go-prev" onclick="prevMonth()">&lt;</button></div>
                                    <div class="year-month"><span class="year"></span><span class="month"></span></div>
                                    <div><button class="nav-btn go-next" onclick="nextMonth()">&gt;</button></div>
                                </div>
                                <div class="main">
                                    <div class="days">
                                        <div class="day">일</div>
                                        <div class="day">월</div>
                                        <div class="day">화</div>
                                        <div class="day">수</div>
                                        <div class="day">목</div>
                                        <div class="day">금</div>
                                        <div class="day">토</div>
                                    </div>
                                    <div class="dates"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="ws-title">
                        <h5 id="dayTitle"></h5>
                    </div>
                    <div class="ws-list-box">
                        <ul class="ws-plan">
                                ${list}
                        </ul>
                        <br>
                    
                        <button class="share" onclick="share()">업무공유</button>
                    </div>
    
    
                    <p class="page-copy">Copyright &copy; Dongs All Rights Reserved.</p>
    
                </div><!-- inner -->
            </div><!-- content -->
        </div><!-- wrap -->
    
    
    
    
        <!-- JS -->
        <script src="js/jquery-2.2.1.min.js"></script>
        <script src="js/placeholders.min.js"></script>
        <script src="js/common.js"></script>
        <script src="js/calender.js"></script>
        <script src="js/workshare.js"></script>
        <script>
    
        </script>
    </body>
    
    </html>`;
    res.send(output);
    });
});

//인수인계 기능
app.post('/workshare1', function(req, res){
    connection.query(`SELECT * FROM patient where manName = "${req.session.name}";`, function(error, results, fields){
        for(let i=0; i<json1.length; i++){
            connection.query(`UPDATE patient SET shareName = "${req.session.name}" where pname="${results[i].pname}";UPDATE patient SET shareID = "${i}" where pname="${results[i].pname}";`, function(error, results, fields){
                if(error) throw error;

            });
        };
       res.redirect('/list1');
    });
});

//인수인계 리스트 지우기
app.get('/deletelist1', function(req, res){
    connection.query(`SELECT * FROM patient where manName != "${req.session.name}";`, function(error, results, fields){
        if(error) throw error;
        for(let i=0; i<json1.length; i++){
            connection.query(`UPDATE patient SET shareName = null where pname = "${results[i].pname}";UPDATE patient SET shareID = null where pname = "${results[i].pname}";`, function(error, results, fields){
                if(error) throw error;
            });
        };
        res.redirect('/list1');
    });
});

//로그인 성공(보호자)
app.get("/mypage_p1", function(req, res){
    let output ="";
    console.log("보호자 로그인 성공 세션:", req.session);
    if(req.session.name && req.session.sname && req.session.pnum){
        output += `<!DOCTYPE HTML>
        <html xmlns="http://www.w3.org/1999/xhtml" xml:lang="ko" lang="ko">
        
        <head>
            <meta charset="utf-8">
            <meta name="HandheldFriendly" content="True">
            <meta name="MobileOptimized" content="320">
            <meta name="viewport" content="width=device-width, initial-scale=1, minimal-ui">
            <meta name="mobile-web-app-capable" content="yes">
            <meta name="apple-mobile-web-app-capable" content="yes">
            <meta name="apple-mobile-web-app-status-bar-style" content="black">
            <meta name="format-detection" content="telephone=no">
            <meta name="Robots" content="ALL" />
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <title>생활관리사 맞춤 서비스</title>
            <link rel="stylesheet" type="text/css" href="css/style.css">
        </head>
        
        <body>
            <h1 id="title">생활관리사 맞춤 서비스</h1>
        
        
            <div id="wrap">
                <div id="gnb">
                    <h2 id="gnb-title">마이페이지</h2>
                    <button id="gnb-menu"><span>메뉴</span></button>
                    <ul id="gnb-list">
                        <li><a href="mypage_p">마이페이지</a></li>
                        <li><a href="/">로그아웃</a></li>
                    </ul>
                </div>
                <div id="contents">
                    <div id="inner">
                        <div class="profile">
                            <em class="profile-photo" style="background:url('../../img/profile_sample.jpg') no-repeat center center / cover"></em>
                            <h5>${req.session.name}</h5>
                        </div>
                                <dl class="profile-list">
                                    <dt><i class="fa fa-phone" aria-hidden="true"></i>${req.session.pnum}</dt>
                                    <dd><i class="fa fa-user" aria-hidden="true" style="float: left; padding-top: 7px;"></i><a href="#">${req.session.sname} 어르신</a><i class="fa fa-angle-right" aria-hidden="true"></i></dd>
                                </dl>        
                        <div class="mypage-list">
                            <ul>
                               <li><a href="#">회원정보수정</a></li>
                               <li><a href="/detail_info1">관리사 업무 현황</a></li>
                               <li><a href="#">설정</a></li>
                               <li><a href="/">로그아웃</a></li>
                               <li><a href="tel:010-8300-7586">1:1 전화문의</a></li>
                               <li><a href="#">앱 버전</a></li>
                            </ul>
                        </div>
                    </div><!-- inner -->
                </div><!-- content -->
            </div><!-- wrap -->
        
        
        
        
            <!-- JS -->
            <script src="js/jquery-2.2.1.min.js"></script>
            <script src="js/placeholders.min.js"></script>
            <script src="js/common.js"></script>
            <script>
        
            </script>
        </body>
        
        </html>`;
        res.send(output);
    }
    
});

//관리사 업무 현황(보호자)
app.get("/detail_info1", function(req, res){
    connection.query(`SELECT * FROM patient WHERE pname = '${req.session.sname}' and proName = '${req.session.name}'`, function(error, results, fields){
        if (error) throw error;
        
        if(results[0].todo == null && results[0].memo == null){
            let output=`
            <!DOCTYPE HTML>
        <html xmlns="http://www.w3.org/1999/xhtml" xml:lang="ko" lang="ko">
        
        <head>
            <meta charset="utf-8">
            <meta name="HandheldFriendly" content="True">
            <meta name="MobileOptimized" content="320">
            <meta name="viewport" content="width=device-width, initial-scale=1, minimal-ui">
            <meta name="mobile-web-app-capable" content="yes">
            <meta name="apple-mobile-web-app-capable" content="yes">
            <meta name="apple-mobile-web-app-status-bar-style" content="black">
            <meta name="format-detection" content="telephone=no">
            <meta name="Robots" content="ALL" />
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <title>생활관리사 맞춤 서비스</title>
            <link rel="stylesheet" type="text/css" href="css/style.css">
        </head>
        
        <body>
            <h1 id="title">생활관리사 맞춤 서비스</h1>
        
        
            <div id="wrap">
                <div id="gnb">
                    <h2 id="gnb-title">관리사 업무 현황</h2>
                    <button id="gnb-menu"><span>메뉴</span></button>
                    <ul id="gnb-list">
                        <li><a href="mypage_p1">마이페이지</a></li>
                        <li><a href="/">로그아웃</a></li>
                    </ul>
                </div>
                <div id="contents">
                    <div id="inner">
                        <div class="profile">
                            <em class="profile-photo" style="background:url('../../img/profile_sample.jpg') no-repeat center center / cover"></em>
                            <h5 class="mt5"><b>${req.session.sname}</b> 어르신</h5>
                            <br>
                        </div>
                                <dl class="profile-list">
                                    <dt><i class="fa fa-user" aria-hidden="true"></i>담당 관리사</dt>
                                    <dd>${results[0].manName}</dd>
                                </dl>        
                        <div class="mypage-list mt20" style="text-align: center;">
                            <dl>
                               <dt style="font-size: 20px; border-bottom: 1px solid #ddd; padding: 5px 8px; text-align: left;">할 일 리스트</dt>
                               <dd class="mt20" style="font-size: 16px; padding: 10px 5px;">등록된 할 일이 없습니다!</dd>
                            </dl>
                            <dl>
                                <dt class="mt40" style="font-size: 20px; border-bottom: 1px solid #ddd; padding: 5px 8px; text-align: left;">메모</dt>
                                <dd class="mt30" style="padding:30px; border: 1px solid #ddd; border-radius: 10px;">등록된 메모가 없습니다!</dd>
                            </dl>
                        </div>
                    </div><!-- inner -->
                </div><!-- content -->
            </div><!-- wrap -->
        
        
        
        
            <!-- JS -->
            <script src="js/jquery-2.2.1.min.js"></script>
            <script src="js/placeholders.min.js"></script>
            <script src="js/common.js"></script>
            <script>
        
            </script>
        </body>
        
        </html>
            `;
            res.send(output);
        } else if (results[0].todo == null){
            let output=`
            <!DOCTYPE HTML>
        <html xmlns="http://www.w3.org/1999/xhtml" xml:lang="ko" lang="ko">
        
        <head>
            <meta charset="utf-8">
            <meta name="HandheldFriendly" content="True">
            <meta name="MobileOptimized" content="320">
            <meta name="viewport" content="width=device-width, initial-scale=1, minimal-ui">
            <meta name="mobile-web-app-capable" content="yes">
            <meta name="apple-mobile-web-app-capable" content="yes">
            <meta name="apple-mobile-web-app-status-bar-style" content="black">
            <meta name="format-detection" content="telephone=no">
            <meta name="Robots" content="ALL" />
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <title>생활관리사 맞춤 서비스</title>
            <link rel="stylesheet" type="text/css" href="css/style.css">
        </head>
        
        <body>
            <h1 id="title">생활관리사 맞춤 서비스</h1>
        
        
            <div id="wrap">
                <div id="gnb">
                    <h2 id="gnb-title">관리사 업무 현황</h2>
                    <button id="gnb-menu"><span>메뉴</span></button>
                    <ul id="gnb-list">
                        <li><a href="mypage_p1">마이페이지</a></li>
                        <li><a href="/">로그아웃</a></li>
                    </ul>
                </div>
                <div id="contents">
                    <div id="inner">
                        <div class="profile">
                            <em class="profile-photo" style="background:url('../../img/profile_sample.jpg') no-repeat center center / cover"></em>
                            <h5 class="mt5"><b>${req.session.sname}</b> 어르신</h5>
                            <br>
                        </div>
                                <dl class="profile-list">
                                    <dt><i class="fa fa-user" aria-hidden="true"></i>담당 관리사</dt>
                                    <dd>${results[0].manName}</dd>
                                </dl>        
                        <div class="mypage-list mt20" style="text-align: center;">
                            <dl>
                               <dt style="font-size: 20px; border-bottom: 1px solid #ddd; padding: 5px 8px; text-align: left;">할 일 리스트</dt>
                               <dd class="mt20" style="font-size: 16px; padding: 10px 5px;">등록된 할 일이 없습니다!</dd>
                            </dl>
                            <dl>
                                <dt class="mt40" style="font-size: 20px; border-bottom: 1px solid #ddd; padding: 5px 8px; text-align: left;">메모</dt>
                                <dd class="mt30" style="padding:30px; border: 1px solid #ddd; border-radius: 10px;">${results[0].memo}</dd>
                            </dl>
                        </div>
                    </div><!-- inner -->
                </div><!-- content -->
            </div><!-- wrap -->
        
        
        
        
            <!-- JS -->
            <script src="js/jquery-2.2.1.min.js"></script>
            <script src="js/placeholders.min.js"></script>
            <script src="js/common.js"></script>
            <script>
        
            </script>
        </body>
        
        </html>
            `;
            res.send(output);
        } else if(results[0].memo == null){
            let output=`
            <!DOCTYPE HTML>
        <html xmlns="http://www.w3.org/1999/xhtml" xml:lang="ko" lang="ko">
        
        <head>
            <meta charset="utf-8">
            <meta name="HandheldFriendly" content="True">
            <meta name="MobileOptimized" content="320">
            <meta name="viewport" content="width=device-width, initial-scale=1, minimal-ui">
            <meta name="mobile-web-app-capable" content="yes">
            <meta name="apple-mobile-web-app-capable" content="yes">
            <meta name="apple-mobile-web-app-status-bar-style" content="black">
            <meta name="format-detection" content="telephone=no">
            <meta name="Robots" content="ALL" />
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <title>생활관리사 맞춤 서비스</title>
            <link rel="stylesheet" type="text/css" href="css/style.css">
        </head>
        
        <body>
            <h1 id="title">생활관리사 맞춤 서비스</h1>
        
        
            <div id="wrap">
                <div id="gnb">
                    <h2 id="gnb-title">관리사 업무 현황</h2>
                    <button id="gnb-menu"><span>메뉴</span></button>
                    <ul id="gnb-list">
                        <li><a href="mypage_p1">마이페이지</a></li>
                        <li><a href="/">로그아웃</a></li>
                    </ul>
                </div>
                <div id="contents">
                    <div id="inner">
                        <div class="profile">
                            <em class="profile-photo" style="background:url('../../img/profile_sample.jpg') no-repeat center center / cover"></em>
                            <h5 class="mt5"><b>${req.session.sname}</b> 어르신</h5>
                            <br>
                        </div>
                                <dl class="profile-list">
                                    <dt><i class="fa fa-user" aria-hidden="true"></i>담당 관리사</dt>
                                    <dd>${results[0].manName}</dd>
                                </dl>        
                        <div class="mypage-list mt20" style="text-align: center;">
                            <dl>
                               <dt style="font-size: 20px; border-bottom: 1px solid #ddd; padding: 5px 8px; text-align: left;">할 일 리스트</dt>
                               <dd class="mt20" style="font-size: 16px; padding: 10px 5px;">${results[0].todo}</dd>
                            </dl>
                            <dl>
                                <dt class="mt40" style="font-size: 20px; border-bottom: 1px solid #ddd; padding: 5px 8px; text-align: left;">메모</dt>
                                <dd class="mt30" style="padding:30px; border: 1px solid #ddd; border-radius: 10px;">등록된 메모가 없습니다!</dd>
                            </dl>
                        </div>
                    </div><!-- inner -->
                </div><!-- content -->
            </div><!-- wrap -->
        
        
        
        
            <!-- JS -->
            <script src="js/jquery-2.2.1.min.js"></script>
            <script src="js/placeholders.min.js"></script>
            <script src="js/common.js"></script>
            <script>
        
            </script>
        </body>
        
        </html>
            `;
            res.send(output);
        } else {
            let output=`
            <!DOCTYPE HTML>
        <html xmlns="http://www.w3.org/1999/xhtml" xml:lang="ko" lang="ko">
        
        <head>
            <meta charset="utf-8">
            <meta name="HandheldFriendly" content="True">
            <meta name="MobileOptimized" content="320">
            <meta name="viewport" content="width=device-width, initial-scale=1, minimal-ui">
            <meta name="mobile-web-app-capable" content="yes">
            <meta name="apple-mobile-web-app-capable" content="yes">
            <meta name="apple-mobile-web-app-status-bar-style" content="black">
            <meta name="format-detection" content="telephone=no">
            <meta name="Robots" content="ALL" />
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <title>생활관리사 맞춤 서비스</title>
            <link rel="stylesheet" type="text/css" href="css/style.css">
        </head>
        
        <body>
            <h1 id="title">생활관리사 맞춤 서비스</h1>
        
        
            <div id="wrap">
                <div id="gnb">
                    <h2 id="gnb-title">관리사 업무 현황</h2>
                    <button id="gnb-menu"><span>메뉴</span></button>
                    <ul id="gnb-list">
                        <li><a href="mypage_p1">마이페이지</a></li>
                        <li><a href="/">로그아웃</a></li>
                    </ul>
                </div>
                <div id="contents">
                    <div id="inner">
                        <div class="profile">
                            <em class="profile-photo" style="background:url('../../img/profile_sample.jpg') no-repeat center center / cover"></em>
                            <h5 class="mt5"><b>${req.session.sname}</b> 어르신</h5>
                            <br>
                        </div>
                                <dl class="profile-list">
                                    <dt><i class="fa fa-user" aria-hidden="true"></i>담당 관리사</dt>
                                    <dd>${results[0].manName}</dd>
                                </dl>        
                        <div class="mypage-list mt20" style="text-align: center;">
                            <dl>
                               <dt style="font-size: 20px; border-bottom: 1px solid #ddd; padding: 5px 8px; text-align: left;">할 일 리스트</dt>
                               <dd class="mt20" style="font-size: 16px; padding: 10px 5px;">${results[0].todo}</dd>
                            </dl>
                            <dl>
                                <dt class="mt40" style="font-size: 20px; border-bottom: 1px solid #ddd; padding: 5px 8px; text-align: left;">메모</dt>
                                <dd class="mt30" style="padding:30px; border: 1px solid #ddd; border-radius: 10px;">${results[0].memo}</dd>
                            </dl>
                        </div>
                    </div><!-- inner -->
                </div><!-- content -->
            </div><!-- wrap -->
        
        
        
        
            <!-- JS -->
            <script src="js/jquery-2.2.1.min.js"></script>
            <script src="js/placeholders.min.js"></script>
            <script src="js/common.js"></script>
            <script>
        
            </script>
        </body>
        
        </html>
            `;
            res.send(output);
        }
    });
});

//로그아웃(관리자)
app.get("/logout", function(req, res) {
    var session = req.session;
    delete session.name, session.info, session.isLogined;
    req.session.save(() => {
        res.redirect('/');
    });
});


//로그아웃(보호자)
app.get("/list1", function(req, res) {
    delete req.session.name;
    delete req.session.sname;
    delete req.session.pnum;
    req.session.save(() => {
        res.redirect('/');
    });
});


//로그인 성공(보호자)
app.get("/index_p", function(req, res){
    res.sendFile(__dirname + "/mypage_p");
});


//관리자 회원가입 성공
app.get("/", function(req, res){
    res.sendFile(__dirname + "/");
});

//보호자 회원가입 성공

app.get("/index_p", function(req, res){

    res.sendFile(__dirname + "/");
});




module.exports = app;

