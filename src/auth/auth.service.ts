import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { UserEntity } from 'src/user/user.entity';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(UserEntity)
        private userRepository: Repository<UserEntity>
    ) { }

    async getUserQuery() {
        const user = await this.userRepository.query('SELECT * FROM NHANVIEN')
        return user
    }
}