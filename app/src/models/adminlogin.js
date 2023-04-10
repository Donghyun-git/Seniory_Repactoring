const connection = require('./dbmodel/db');


const adminLoginRequest = (req, res) => {
  const { center, id, pw } = req.body;

  connection.query(
    "SELECT center, id, pw, name FROM user WHERE center = ? AND id = ? AND pw = ?;",
    [center, id, pw],
    function (error, results, fields) {
      if (error) throw error;

      if (results.length == 0) {
        res.send(
          `<script>alert('로그인에 실패하였습니다! 사용자 정보를 다시 확인해주세요!'); location.href='/'</script>`
        );
        return;
      }

      const name = results[0].name;

      connection.query(
        "SELECT user.name, patient.pname, patient.page, patient.sex, patient.pregistNum, patient.ppostNum, patient.padr, patient.pcenter, patient.memo, patient.todo, patient.shareName, patient.shareID FROM user INNER JOIN patient ON user.name = patient.manName WHERE user.name = ?;",
        [name],
        function (error, results, fields) {
          if (error) throw error;

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

          req.session.name = name;
          req.session.isLogined = true;
          req.session.info = info;
          req.session.workCount = info.length;
          req.session.save(() => {
            res.redirect("/list1");
          });
        }
      );
    }
  );
}

module.exports = adminLoginRequest;
