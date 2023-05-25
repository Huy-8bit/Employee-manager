import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { UserService } from "./user.service";
import { UserEntity } from "./user.entity";

@Controller('users')
export class UserController {
    constructor(private userService: UserService) { }

    @Post('login')
    login(@Body() body: { username: string, password: string }) {
        const res = this.userService.login(body);
        return res
    }

    @Get('')
    getUser() {
        const res = this.userService.getUserQuery();
        return res
    }

    @Get('user-oracle')
    getOracleUser() {
        const res = this.userService.getUserOraleQuery();
        return res
    }

    @Get('tables')
    getTablePrivs() {
        const res = this.userService.getAllTable();
        return res
    }

    @Get('tabs')
    getTabPrivs() {
        const res = this.userService.getTabPrivsQuery();
        return res
    }

    @Get('tabs/:id')
    getTabPrivsById(@Param() params: any) {
        const { id } = params
        const res = this.userService.getTabPrivsByIdQuery(id);
        return res
    }

    @Get('roles')
    getRolePrivs() {
        const res = this.userService.getRolePrivsQuery();
        return res
    }

    @Get('roles/:id')
    get(@Param() params: any) {
        const { id } = params
        const res = this.userService.getRolePrivsByIdQuery(id);
        return res
    }

    @Get('dba-sys-privs')
    getBDASysPrivs() {
        const res = this.userService.getBDASysPrivsQuery();
        return res
    }

    @Get('dba-sys-privs/:id')
    getBDASysPrivsByUserId(@Param() params: any) {
        const res = this.userService.getBDASysPrivsQueryById(params.id);
        return res
    }

    @Get('privilege')
    getPrivilege() {
        return ['SELECT', 'UPDATE', 'DELETE', 'INSERT']
    }

    @Post('insert')
    insertUser(@Body() body: UserEntity) {
        const res = this.userService.insertUserQuery(body);
        return res
    }

    @Post('create-user-db')
    createUserInDB(@Body() body: any) {
        const res = this.userService.createUserInDBQuery(body);
        return res
    }

    @Post('drop-user-db')
    dropUserInDB(@Body() body: any) {
        const res = this.userService.dropUserInDBQuery(body);
        return res
    }

    @Post('grant-role')
    grantRoleUser(@Body() body: { userId: string, role: string, isAdminOption?: boolean }) {
        const res = this.userService.grantRoleUserQuery(body);
        return res
    }

    @Post('revoke-role')
    revokeRoleUser(@Body() body: { userId: string, role: string }) {
        const res = this.userService.revokeRoleUserQuery(body);
        return res
    }

    @Post('grant-table')
    grantTableUser(@Body() body: { userId: string, privilege: string, table: string, isGrantOption: boolean }) {
        const res = this.userService.grantTableUserQuery(body);
        return res
    }

    @Post('revoke-table')
    revokeTableUser(@Body() body: { userId: string, privilege: string, table: string }) {
        const res = this.userService.revokeTableUserQuery(body);
        return res
    }

    @Post('create-role')
    createRole(@Body() body: { role: string }) {
        const res = this.userService.createRoleQuery(body);
        return res
    }

    @Post('drop-role')
    dropRole(@Body() body: { role: string }) {
        const res = this.userService.dropRoleQuery(body);
        return res
    }

    /////////////////////////// NV
    @Get('nv/info/:username')
    nvInfo(@Param() params: any) {
        const { username } = params
        const res = this.userService.nvInfoQuery(username);
        return res
    }

    @Get('nv/dean')
    nvInfo1(@Param() params: any) {
        const { username } = params
        const res = this.userService.nvDeAnQuery(username);
        return res
    }

    @Get('nv/phongban')
    nvInfo2(@Param() params: any) {
        const { username } = params
        const res = this.userService.nvPhongBanQuery(username);
        return res
    }

    @Post('nv/update-info')
    nvUpdate(@Body() body: any) {
        const res = this.userService.nvInfoMutation(body);
        return res
    }

    /////////////////////////// QLTT
    @Get('qltt/nhanvien/:username')
    qlttNhanvienInfo(@Param() params: any) {
        const { username } = params
        const res = this.userService.qlttNhanvienInfoQuery(username);
        return res
    }

    @Get('qltt/phancong/:username')
    qlttPhanCongInfo(@Param() params: any) {
        const { username } = params
        const res = this.userService.qlttPhanCongInfoQuery(username);
        return res
    }

    /////////////////////////// TRG DEAN
    @Post('trgda/dean/insert')
    trgdaInsert(@Body() body: any) {
        const res = this.userService.trgdaInsertMutation(body);
        return res
    }

    @Post('trgda/dean/update')
    trgdaUpdate(@Body() body: any) {
        const res = this.userService.trgdaUpdateMutation(body);
        return res
    }

    @Post('trgda/dean/delete')
    trgdaDelete(@Body() body: any) {
        const res = this.userService.trgdaDeleteMutation(body);
        return res
    }

    /////////////////////////// NHAN SU
    @Post('ns/nhanvien/insert')
    nsNhanVienInsert(@Body() body: any) {
        const res = this.userService.nsNhanVienInsertMutation(body);
        return res
    }

    @Post('ns/nhanvien/update')
    nsNhanVienUpdate(@Body() body: any) {
        const res = this.userService.nsNhanVienUpdateMutation(body);
        return res
    }

    @Post('ns/phongban/insert')
    nsPhongBanInsert(@Body() body: any) {
        const res = this.userService.nsInsertPhongBanMutation(body);
        return res
    }

    @Post('ns/phongban/update')
    nsPhongBanUpdate(@Body() body: any) {
        const res = this.userService.nsUpdatePhongBanMutation(body);
        return res
    }

    @Post('custom')
    custom(@Body() body: { username: string, query: string }) {
        const res = this.userService.customQuery(body);
        return res
    }
}