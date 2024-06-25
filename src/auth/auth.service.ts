import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class AuthService {
    constructor(
        private readonly prisma: PrismaService
    ){}

    async login(email: string, password: string)
    {
        const check = await this.prisma.user.findFirst({
            where: {
                email
            }
        });

        if(!check) throw new NotFoundException("User not found")

        if(password === check.password && check.password !== '')
        {
            return check;
        }
         
        throw new BadRequestException("Password is wrong")
    }
}
