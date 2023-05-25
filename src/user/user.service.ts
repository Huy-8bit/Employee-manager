import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { UserEntity } from './user.entity';
import { Repository } from 'typeorm';
import _, { initial } from 'lodash';
import { errorType } from 'src/errors/oralce.error';
import { createNewDataSource } from 'src/database';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserEntity)
        private userRepository: Repository<UserEntity>,
    ) { }

    async login({ username, password }) {
        try {
            const db = await createNewDataSource(username, password)
            await db.query(`ALTER SESSION SET "_ORACLE_SCRIPT"=TRUE`)
            const res = await db.query(`SELECT * FROM USER_ROLE_PRIVS`)
            return {
                status: 'completed',
                username: username,
                role: username === 'PRO' ? 'DBA' : res[0].GRANTED_ROLE,
            }
        } catch (error) {
            return errorType({ error })
        }
    }

    async getUserQuery() {
        try {
            const res = await this.userRepository.query(`SELECT * FROM NHANVIEN`)
            return res.sort(((a: any, b: any) => a.MANV - b.MANV))

        } catch (error) {
            return errorType({ error })
        }
    }

    async getUserOraleQuery() {
        try {
            await this.userRepository.query(`ALTER SESSION SET "_ORACLE_SCRIPT"=TRUE`)
            const res = await this.userRepository.query(`SELECT * FROM all_users`)
            return res.sort(((a: any, b: any) => a.USERNAME - b.USERNAME))

        } catch (error) {
            return errorType({ error })
        }
    }

    async getAllTable() {
        try {
            await this.userRepository.query(`ALTER SESSION SET "_ORACLE_SCRIPT"=TRUE`)
            const res = await this.userRepository.query(`SELECT owner, table_name FROM all_tables where owner = 'PRO'`)
            return res.map((r: any) => r.TABLE_NAME)
        } catch (error) {
            return errorType({ error })
        }
    }

    async getTabPrivsQuery() {
        try {
            await this.userRepository.query(`ALTER SESSION SET "_ORACLE_SCRIPT"=TRUE`)
            const res = await this.userRepository.query(`SELECT * FROM USER_TAB_PRIVS`)
            return res
        } catch (error) {
            return errorType({ error })
        }
    }

    async getTabPrivsByIdQuery(userId: string) {
        try {
            await this.userRepository.query(`ALTER SESSION SET "_ORACLE_SCRIPT"=TRUE`)
            const res = await this.userRepository.query(`SELECT * FROM USER_TAB_PRIVS WHERE GRANTEE = :userId`, [userId.toUpperCase()])
            return res
        } catch (error) {
            return errorType({ error, userId })
        }
    }

    async getRolePrivsQuery() {
        try {
            await this.userRepository.query(`ALTER SESSION SET "_ORACLE_SCRIPT"=TRUE`)
            const res = await this.userRepository.query(`SELECT * FROM USER_ROLE_PRIVS`)
            return res

        } catch (error) {
            return errorType({ error })
        }
    }

    async getRolePrivsByIdQuery(userId: string) {
        try {
            await this.userRepository.query(`ALTER SESSION SET "_ORACLE_SCRIPT"=TRUE`)
            const res = await this.userRepository.query(`SELECT * FROM DBA_ROLE_PRIVS WHERE GRANTEE = :userId`, [userId])
            return res
        } catch (error) {
            return errorType({ error, userId })
        }
    }

    async getBDASysPrivsQuery() {
        try {
            await this.userRepository.query(`ALTER SESSION SET "_ORACLE_SCRIPT"=TRUE`)
            const res = await this.userRepository.query(`SELECT * FROM DBA_SYS_PRIVS`)
            return res.sort(((a: any, b: any) => a.GRANTEE - b.GRANTEE))
        } catch (error) {
            return errorType({ error })
        }
    }

    async getBDASysPrivsQueryById(userId: string) {
        try {
            await this.userRepository.query(`ALTER SESSION SET "_ORACLE_SCRIPT"=TRUE`)
            const res = await this.userRepository.query(`SELECT * FROM DBA_SYS_PRIVS WHERE GRANTEE = :userId`, [userId.toUpperCase()])
            return res.sort(((a: any, b: any) => a.GRANTEE - b.GRANTEE))
        } catch (error) {
            return errorType({ error, userId })
        }
    }

    async insertUserQuery(user: UserEntity) {
        try {
            await this.userRepository.query(`ALTER SESSION SET "_ORACLE_SCRIPT"=TRUE`)
            await this.userRepository.save(user)
            return {
                status: 'completed',
                message: 'Insert success'
            }
        } catch (error) {
            return errorType({ error })
        }
    }

    async createUserInDBQuery({ userId }) {
        try {
            await this.userRepository.query(`ALTER SESSION SET "_ORACLE_SCRIPT"=TRUE`)
            await this.userRepository.query(`CREATE USER "${userId}" IDENTIFIED BY ${userId}`)
            return {
                status: 'completed',
                message: 'Create success'
            }
        } catch (error) {
            return errorType({ error, userId })
        }
    }


    async dropUserInDBQuery({ userId }) {
        try {
            await this.userRepository.query(`ALTER SESSION SET "_ORACLE_SCRIPT"=TRUE`)
            await this.userRepository.query(`DROP USER "${userId}" CASCADE`)
            return {
                status: 'completed',
                message: 'Drop success'
            }
        } catch (error) {
            return errorType({ error, userId })
        }
    }

    async grantRoleUserQuery({ userId, role, isAdminOption = false }) {
        try {
            await this.userRepository.query(`ALTER SESSION SET "_ORACLE_SCRIPT"=TRUE`)
            await this.userRepository.query(`GRANT ${role} TO "${userId}" ${isAdminOption ? `WITH ADMIN OPTION` : ``}`)
            return {
                status: 'completed',
                message: 'Grant success',
                newData: await this.getRolePrivsByIdQuery(userId)
            }
        } catch (error) {
            return errorType({ error, role, userId })
        }
    }

    async revokeRoleUserQuery({ userId, role }) {
        try {
            await this.userRepository.query(`ALTER SESSION SET "_ORACLE_SCRIPT"=TRUE`)
            await this.userRepository.query(`REVOKE ${role} FROM "${userId}"`)
            return {
                status: 'completed',
                message: 'Revoke success',
                newData: await this.getRolePrivsByIdQuery(userId)
            }
        } catch (error) {
            return errorType({ error, role, userId })
        }
    }

    async grantTableUserQuery({ userId, table, privilege, isGrantOption = false }) {
        try {
            await this.userRepository.query(`ALTER SESSION SET "_ORACLE_SCRIPT"=TRUE`)
            await this.userRepository.query(`GRANT ${privilege} ON ${table} TO "${userId}" ${isGrantOption ? `WITH GRANT OPTION` : ``}`)
            return {
                status: 'completed',
                message: 'Grant success',
                newData: await this.getTabPrivsByIdQuery(userId)
            }
        } catch (error) {
            return errorType({ error, privilege, userId, table })
        }
    }

    async revokeTableUserQuery({ userId, table, privilege }) {
        try {
            await this.userRepository.query(`ALTER SESSION SET "_ORACLE_SCRIPT"=TRUE`)
            await this.userRepository.query(`REVOKE ${privilege} ON ${table} FROM "${userId}"`)
            return {
                status: 'completed',
                message: 'Revoke success',
                newData: await this.getTabPrivsByIdQuery(userId)
            }
        } catch (error) {
            return errorType({ error, privilege, userId, table })
        }
    }

    async createRoleQuery({ role }) {
        try {
            await this.userRepository.query(`ALTER SESSION SET "_ORACLE_SCRIPT"=TRUE`)
            await this.userRepository.query(`CREATE ROLE :role`, [role])
            return {
                status: 'completed',
                message: 'Create role success',
            }
        } catch (error) {
            return errorType({ error, role })
        }
    }

    async dropRoleQuery({ role }) {
        try {
            await this.userRepository.query(`ALTER SESSION SET "_ORACLE_SCRIPT"=TRUE`)
            await this.userRepository.query(`DROP ROLE ${role}`)
            return {
                status: 'completed',
                message: 'Drop role success',
            }
        } catch (error) {
            return errorType({ error, role })
        }
    }

    async nvInfoQuery(username: string) {
        try {
            const db = await createNewDataSource(username, "123456")
            await db.query(`ALTER SESSION SET "_ORACLE_SCRIPT"=TRUE`)
            const res = await db.query(`SELECT * FROM PRO.CS1_SELECT`)
            return res
        } catch (error) {
            return errorType({ error })
        }
    }

    async nvDeAnQuery(username: string) {
        try {
            await this.userRepository.query(`ALTER SESSION SET "_ORACLE_SCRIPT"=TRUE`)
            const res = await this.userRepository.query(`SELECT * FROM PRO.DEAN`)
            return res
        } catch (error) {
            return errorType({ error })
        }
    }

    async nvPhongBanQuery(username: string) {
        try {
            await this.userRepository.query(`ALTER SESSION SET "_ORACLE_SCRIPT"=TRUE`)
            const res = await this.userRepository.query(`SELECT * FROM PRO.PHONGBAN`)
            return res
        } catch (error) {
            return errorType({ error })
        }
    }

    async nvInfoMutation({ username, ...data }: any) {
        try {
            const db = await createNewDataSource(username, "123456")
            await db.query(`UPDATE PRO.CS1_UPDATE SET NGAYSINH = :NGAYSINH, DIACHI = :DIACHI, SODT = :SODT`, [data.NGAYSINH, data.DIACHI, data.SODT])
            return {
                status: 'completed'
            }
        } catch (error) {
            return errorType({ error })
        }
    }

    async qlttNhanvienInfoQuery(username: string) {
        try {
            const db = await createNewDataSource(username, "123456")
            await db.query(`ALTER SESSION SET "_ORACLE_SCRIPT"=TRUE`)
            const res = await db.query(`SELECT * FROM PRO.CS2_SELECT`)
            return res.sort(((a: any, b: any) => a.MANV - b.MANV))
        } catch (error) {
            return errorType({ error })
        }
    }

    async qlttPhanCongInfoQuery(username: string) {
        try {
            const db = await createNewDataSource(username, "123456")
            await db.query(`ALTER SESSION SET "_ORACLE_SCRIPT"=TRUE`)
            const res = await db.query(`SELECT * FROM PRO.CS2_SELECT_PC`)
            return res.sort(((a: any, b: any) => a.MANV - b.MANV))
        } catch (error) {
            return errorType({ error })
        }
    }


    async trgdaInsertMutation({ username, ...data }: any) {
        try {
            const db = await createNewDataSource(username, "123456")
            await db.query(`INSERT INTO PRO.DEAN (TENDA, NGAYBD, PHONG) VALUES (:TENDA, :NGAYBD, :PHONG)`, [data.TENDA, data.NGAYBD, data.PHONG])
            return {
                status: 'completed'
            }
        } catch (error) {
            return errorType({ error })
        }
    }

    async trgdaUpdateMutation({ username, ...data }: any) {
        try {
            const db = await createNewDataSource(username, "123456")
            await db.query(`UPDATE PRO.DEAN SET TENDA = :TENDA, NGAYBD = :NGAYBD, PHONG = :PHONG WHERE MADA = :MADA`, [data.TENDA, data.NGAYBD, data.PHONG, data.MADA])
            return {
                status: 'completed'
            }
        } catch (error) {
            return errorType({ error })
        }
    }

    async trgdaDeleteMutation({ username, ...data }: any) {
        try {
            const db = await createNewDataSource(username, "123456")
            await db.query(`DELETE FROM PRO.DEAN WHERE MADA = :MADA`, [data.MADA])
            return {
                status: 'completed'
            }
        } catch (error) {
            return errorType({ error })
        }
    }

    async nsNhanVienInsertMutation({ username, TENNV, PHAI, NGAYSINH, DIACHI, SODT, VAITRO, MANQL, PHG }: any) {
        try {
            const db = await createNewDataSource(username, "123456")
            await db.query(`INSERT INTO PRO.CS5_INSERT_UPDATE (TENNV, PHAI, NGAYSINH, DIACHI, SODT, VAITRO, MANQL, PHG) VALUES (:TENNV, :PHAI, :NGAYSINH, :DIACHI, :SODT, :VAITRO, :MANQL, :PHG)`, [TENNV, PHAI, NGAYSINH, DIACHI, SODT, VAITRO, MANQL, PHG])
            return {
                status: 'completed'
            }
        } catch (error) {
            return errorType({ error })
        }
    }

    async nsNhanVienUpdateMutation({ username, MANV, TENNV, PHAI, NGAYSINH, DIACHI, SODT, VAITRO, MANQL, PHG }: any) {
        try {
            const db = await createNewDataSource(username, "123456")
            await db.query(`UPDATE PRO.CS5_INSERT_UPDATE SET TENNV = :TENNV, PHAI = :PHAI, NGAYSINH = :NGAYSINH, DIACHI = :DIACHI, SODT = :SODT, VAITRO = :VAITRO, MANQL = :MANQL, PHG = :PHG WHERE MANV = :MANV`, [TENNV, PHAI, NGAYSINH, DIACHI, SODT, VAITRO, MANQL, PHG, MANV])
            return {
                status: 'completed'
            }
        } catch (error) {
            return errorType({ error })
        }
    }

    async nsInsertPhongBanMutation({ username, TENPB, TRPHG }: any) {
        try {
            const db = await createNewDataSource(username, "123456")
            await db.query(`INSERT INTO PRO.PHONGBAN (TENPB, TRPHG) VALUES (:TENPB, :TRPHG)`, [TENPB, TRPHG])
            return {
                status: 'completed'
            }
        } catch (error) {
            return errorType({ error })
        }
    }

    async nsUpdatePhongBanMutation({ username, MAPB, TENPB, TRPHG }: any) {
        try {
            const db = await createNewDataSource(username, "123456")
            await db.query(`UPDATE PRO.PHONGBAN SET TENPB = :TENPB, TRPHG = :TRPHG WHERE MAPB = :MAPB`, [TENPB, TRPHG, MAPB])
            return {
                status: 'completed'
            }
        } catch (error) {
            return errorType({ error })
        }
    }

    async customQuery({ username, query }) {
        try {
            const db = await createNewDataSource(username, "123456")
            await db.query(`ALTER SESSION SET "_ORACLE_SCRIPT"=TRUE`)
            const res = db.query((`${query}`))
            return res
        } catch (error) {
            return errorType({ error })
        }
    }
}