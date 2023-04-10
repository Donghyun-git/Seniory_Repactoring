const AdminModel = require('./usermodel/admin');
const admin = new AdminModel();

const adminLoginRequest = async (req, res) => {
  const adminInfo = await admin.getAdminInfo(req.body);
  const patientList = await admin.getPatientList(adminInfo);
  const session = req.session;

  console.log("조인확인", patientList);

  if(adminInfo === false) {
    res.send(`
    <script>alert('로그인에 실패하였습니다! 사용자 정보를 다시 확인해주세요!'); location.href='/'</script>
    `);
    return;
  }
  
  session.name = patientList.name;
  session.isLogined = true;
  session.info = patientList.info;
  session.workCount = patientList.workCount;
  session.save(() => {
    res.redirect("/list1");
  });
}

module.exports = adminLoginRequest;
