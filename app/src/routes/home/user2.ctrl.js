"use strict"


const output = {
    index_p: (req, res) => {
        res.render("home/index_p");
    },
    list: (req, res) => {
        res.render("home/list");
    },
    signup_p: (req, res) => {
        res.render("home/signup_p");
    },
    manage: (req, res) => {
        res.render("home/manage");
    },
    map: (req, res) => {
        res.render("home/map");
    },
    modify_p: (req, res) => {
        res.render("home/modify_p");
    },
    mypage_p: (req, res) => {
        res.render("home/mypage_p");
    },
    detail_info: (req, res) => {
        res.render("home/detail-info");
    },
};


module.exports = {
    output,
};