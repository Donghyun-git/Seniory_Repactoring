const connection = require("./dbmodel/db");

const protectLoginRequest = (req, res) => {
    const { center, id, pw } = req.body;

    connection.query
    ('select center, id, pw, name, silverName, phoneNum from protect where center = ? and id = ? and pw = ?;',
    [center, id, pw], 
    (err, results, fields) => {
        if(err) throw new Error(err);

            if (results.length > 0){
                
                 for(let i=0; i<results.length; i++){
                    if(results[i] !==undefined){
                        req.session.name = results[i].name;
                        req.session.sname = results[i].silverName;
                        req.session.pnum = results[i].phoneNum;
                        req.session.isLogined = true;
                        req.session.save(() => {
                            res.redirect('/mypage_p1');
                        });
                    }
                }
            } else {
                res.send(`<script>alert('로그인에 실패하였습니다! 사용자 정보를 다시 확인해주세요!');
                location.href='/index_p'</script>`);
            }
        });
}

module.exports = protectLoginRequest;