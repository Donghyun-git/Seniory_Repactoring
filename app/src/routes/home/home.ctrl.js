"use strict";

const output = {
    index: (req, res) => {
        res.render("home/index");
    },
    list: (req, res) => {
        res.render("home/list");
    },
    signup: (req, res) => {
        res.render("home/signup");
    },
    signup_p: (req, res) => {
        res.render("home/signup_p");
    },
    calender: (req, res) => {
        res.render("home/calender");
    },
    detail: (req, res) => {
        res.render("home/detail");
    },
    fixwork: (req, res) => {
        res.render("home/fixwork");
    },
    manage: (req, res) => {
        res.render("home/manage");
    },
    map: (req, res) => {
        res.render("home/map");
    },
    modify: (req, res) => {
        res.render("home/modify");
    },
    morework: (req, res) => {
        res.render("home/morework");
    },
    mypage: (req, res) => {
        res.render("home/mypage");
    },
    workshare: (req, res) => {
        res.render("home/workshare");
    },
};




module.exports = {
    output
};



