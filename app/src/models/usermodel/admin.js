const connection = require('../dbmodel/db');

class AdminModel {
  getAdminInfo({ center, id, pw }) {
    return new Promise((resolve, reject) => {
      const query =
        "SELECT center, id, pw, name FROM user WHERE center = ? AND id = ? AND pw = ?;";
      connection.query(query, [center, id, pw], (err, results, fields) => {
        if (err) {
          reject(new Error(err));
        } else {
          resolve(results);
        }
      });
    })
      .then((res) => {
        if (res.length === 0) {
          return false;
        } else {
            console.log("클래스에서 보내는 메세지",res);
          return res;
        }
      });
  }

  getPatientList(adminInfo) {
    const name = adminInfo[0].name;
    return new Promise((resolve, reject) => {
        const query = 
        "SELECT user.name, patient.pname, patient.page, patient.sex, patient.pregistNum, patient.ppostNum, patient.padr, patient.pcenter, patient.memo, patient.todo, patient.shareName, patient.shareID FROM user INNER JOIN patient ON user.name = patient.manName WHERE user.name = ?;";

        connection.query(query, [name], (err, results, fields) => {
            if(err) {
                reject(new Error(err));
            } else {
                const info = results.map((result, index) => ({
                  id: index,
                  info: {
                    pname: result.pname,
                    page: result.page,
                    sex: result.sex,
                    padr: result.padr,
                  },
                  list: {
                    memo: result.memo,
                    todo: result.todo,
                  },
                  share: {
                    shareName: result.shareName,
                    shareID: result.shareID,
                  },
                }));
                
                resolve({
                    name: name,
                    info: info,
                    workCount: info.length
                });
            };
        });
    });
  };
};


module.exports = AdminModel;