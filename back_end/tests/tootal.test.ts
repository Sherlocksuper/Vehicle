describe('total test', function () {
    //执行testVehicle.test.ts中的所有测试用例
    require('./testVehicle.test');
    //执行testProject.test.ts中的所有测试用例
    require('./testProject.test');
    //执行testUser.testObjectN.ts中的所有测试用例
    require('./testObjectN.test');
});