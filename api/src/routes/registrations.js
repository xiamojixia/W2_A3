const express = require('express');
const router = express.Router();
const {
  GetRegistrations,
  CreateRegistration,
  UpdateRegistration,
  DeleteRegistration,
  CheckRegistrationInfo,           // 新增导入
  CreateRegistrationWithVerification // 新增导入
} = require('../controllers/registrationsController');

// 原有的路由
router.get('/', GetRegistrations);
router.post('/', CreateRegistration);
router.put('/:id', UpdateRegistration);
router.delete('/:id', DeleteRegistration);

// 新增的注册相关路由
router.post('/check-info', CheckRegistrationInfo);                    // 检查信息是否重复
router.post('/register-with-verification', CreateRegistrationWithVerification); // 带验证码的注册

module.exports = router;