import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm'

@Entity({ name: 'NHANVIEN' })
export class UserEntity {
    @PrimaryGeneratedColumn()
    MANV: number

    @Column()
    TENNV: string

    @Column()
    PHAI: string

    @Column({ type: 'date' })
    NGAYSINH: string

    @Column()
    DIACHI: string

    @Column()
    SODT: string

    @Column()
    LUONG: number

    @Column()
    PHUCAP: number

    @Column()
    VAITRO: string

    @Column()
    MANQL: number

    @Column()
    PHG: number
} 
