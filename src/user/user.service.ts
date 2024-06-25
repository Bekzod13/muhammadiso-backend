import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService
  )
  {}
  async create(createUserDto: any) {
    const email = createUserDto.email;

    const check = await this.prisma.user.findFirst({
      where: {
        email: email
      }
    });

    if(check) throw new BadRequestException("User already exists");

    return await this.prisma.user.create({
      data: {...createUserDto, token: this.generateRandomString()}
    });
  }

  async findAll() {
    return await this.prisma.user.findMany({
      include: {
        role: true
      }
    });
  }

  async findOne(id: number) {
    const check = await this.prisma.user.findUnique({
      where: {
        id: Number(id)
      }
    });

    if(!check) throw new BadRequestException("User not found");

    return check;
  }

  async update(id: number, updateUserDto: any) {

    const check = await this.prisma.user.findUnique({
      where: {
        id
      }
    });

    if(!check) throw new NotFoundException("User not found");

    return await this.prisma.user.update({
      where: {
        id
      }, 
      data: updateUserDto
    });
  }

  async remove(id: number) {
    const check = await this.prisma.user.findUnique({
      where: {
        id
      }
    });

    if(!check) throw new NotFoundException("User not found");

    return await this.prisma.user.delete({
      where: {
        id
      }
    });
  }

  generateRandomString() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    const charactersLength = characters.length;
    for (let i = 0; i < 40; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}
}
