"use strict";


const express = require("express");
const router = express.Router();

const ctrl = require("./home.ctrl");
const user = require("./user2.ctrl");

// 관리자
router.get("/", ctrl.output.index);
router.get("/list", ctrl.output.list);
router.get("/signup", ctrl.output.signup);
router.get("/calender", ctrl.output.calender);
router.get("/detail", ctrl.output.detail);
router.get("/fixwork", ctrl.output.fixwork);
router.get("/manage", ctrl.output.manage);
router.get("/map", ctrl.output.map);
router.get("/modify", ctrl.output.modify);
router.get("/morework", ctrl.output.morework);
router.get("/mypage", ctrl.output.mypage);
router.get("/workshare", ctrl.output.workshare);

// 유저
router.get("/signup_p", user.output.signup_p);
router.get("/index_p", user.output.index_p);
router.get("/manage", user.output.manage);
router.get("/map", user.output.map);
router.get("/modify_p", user.output.modify_p);
router.get("/mypage_p", user.output.mypage_p);
router.get("/detail-info", user.output.detail_info);


module.exports = router;