import { Controller, Get } from "@nestjs/common";
import { UserService } from "src/user/user.service";
import { AuthService } from "./auth.service";

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Get('login')
    getUser() {
        const rawData = this.authService.getUserQuery();
        return rawData
    }
}