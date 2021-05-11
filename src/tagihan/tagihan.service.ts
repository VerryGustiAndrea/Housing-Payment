import { Injectable } from '@nestjs/common';
import { CreateTagihanDto, CreateTagihanImage } from './dto/create-tagihan.dto';
import { UpdateTagihanDto } from './dto/update-tagihan.dto';
import { ApprovalTagihanDto } from './dto/approval-tagihan.dto';
import { CheckoutTagihanDto } from './dto/checkout-tagihan.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Tagihan } from './tagihan.model';
import response from 'src/library/response';
const { Op } = require("sequelize");
// import fs from 'fs';
var fs = require('fs');


@Injectable()
export class TagihanService {
  constructor(
    @InjectModel(Tagihan)
    private tagihanModel: typeof Tagihan,
  ) { }

  //ADMIN
  GetListTagihan(date: string): Promise<Tagihan[]> {
    const date1 = new Date(date) //date
    const date2 = new Date(new Date(date).setMonth(new Date(date).getMonth() + 1)) //date + 1 month
    return this.tagihanModel.findAll({
      where: {
        date: {
          [Op.between]: [date1, date2],
        }
      }
    });
  }

  getlisthistory(date: string): Promise<Tagihan[]> {
    const date1 = new Date(date) //date
    const date2 = new Date(new Date(date).setMonth(new Date(date).getMonth() + 1)) //date + 1 month
    return this.tagihanModel.findAll({
      where: {
        [Op.and]: [{
          date: {
            [Op.between]: [date1, date2],
          }
        }, { [Op.or]: [{ status: 1 }, { status: 2 }], }]
      }
    });
  }

  async inputtagihan(createTagihanDto: CreateTagihanDto) {
    const createdTagihan = new this.tagihanModel({
      user_id: createTagihanDto.user_id,
      stan_meter_awal: createTagihanDto.stan_meter_awal,
      stan_meter_akhir: createTagihanDto.stan_meter_akhir,
      penggunaan: createTagihanDto.penggunaan,
      tagihan_air: createTagihanDto.tagihan_air,
      sampah: createTagihanDto.sampah,
      keamanan: createTagihanDto.keamanan,
      admin: createTagihanDto.admin,
      sub_total_tagihan: createTagihanDto.sub_total_tagihan,
      denda: createTagihanDto.denda,
      grand_total: createTagihanDto.grand_total,
      date: new Date(),
      status: 0,
    })
    try {
      await createdTagihan.save()
      return createdTagihan
    } catch (error) {
      throw new Error(error);
    }
  }

  async checkout(checkoutTagihanDto: CheckoutTagihanDto, id: number) {
    const data = {
      session_id: checkoutTagihanDto.session_id,
      url: checkoutTagihanDto.url
    }
    try {
      await this.tagihanModel.update(data, { where: { id: id } });
      return data
    } catch (error) {
      throw new Error(error);
    }
  }

  // async approval(approvalTagihanDto: ApprovalTagihanDto) {
  //   const data = {
  //     id: approvalTagihanDto.tagihan_id,
  //     status: approvalTagihanDto.status
  //   }
  //   //check tagihan
  //   const check = await this.tagihanModel.findAll({ where: { id: approvalTagihanDto.tagihan_id } })
  //   //return respon kadarluarsa (tagihan tidak dieksekusi)
  //   if (check[0].status == 0 || check[0].status == 2) {
  //     return { status: 1, message: "Status gagal di update" }
  //   }

  //   //update tagihan
  //   const response = await this.tagihanModel.update(data, { where: { id: approvalTagihanDto.tagihan_id } });
  //   if (response[0] == 1) {
  //     if (approvalTagihanDto.status == 2) {
  //       return { status: 2, message: "Pembayaran sukses!" }
  //     } else {
  //       return { status: 0, message: "Pembayaran ditolak!" }
  //     }
  //   } else {
  //     return { status: 1, message: "Status gagal di update" }
  //   }
  // }



  //WARGA
  GetTagihanWarga(date: string, user_id: number): Promise<Tagihan[]> {
    const date1 = new Date(date) //date
    const date2 = new Date(new Date(date).setMonth(new Date(date).getMonth() + 1)) //date + 1 month
    return this.tagihanModel.findAll({
      where: {
        [Op.and]: [{
          date: {
            [Op.between]: [date1, date2],
          }
        }, { user_id: user_id }, { status: 0 }]
      }
    });
  }

  gethistorywarga(date: string, user_id: number): Promise<Tagihan[]> {
    const date1 = new Date(date) //date
    const date2 = new Date(new Date(date).setMonth(new Date(date).getMonth() + 1)) //date + 1 month
    return this.tagihanModel.findAll({
      where: {
        [Op.and]: [{
          date: {
            [Op.between]: [date1, date2],
          }
        }, { user_id: user_id }, { [Op.or]: [{ status: 1 }, { status: 2 }], }]
      }
    });
  }

  async uploadfbuktitransfer(file: CreateTagihanImage, id_tagihan: string) {

    const response = await this.tagihanModel.findAll({
      where: {
        id: id_tagihan
      }
    });

    const updatedTagihan = {
      user_id: response[0].user_id,
      stan_meter_awal: response[0].stan_meter_awal,
      stan_meter_akhir: response[0].stan_meter_akhir,
      penggunaan: response[0].penggunaan,
      tagihan_air: response[0].tagihan_air,
      sampah: response[0].sampah,
      keamanan: response[0].keamanan,
      admin: response[0].admin,
      sub_total_tagihan: response[0].sub_total_tagihan,
      denda: response[0].denda,
      grand_total: response[0].grand_total,
      date: response[0].date,
      status: 1,
      foto: process.env.PATH_IMAGE + new Date().valueOf() + file.originalname.replace(new RegExp(" ", "g"), "-"),
    }

    const data = {
      foto: process.env.PATH_IMAGE + new Date().valueOf() + file.originalname.replace(new RegExp(" ", "g"), "-"),
      status: 1
    }

    try {
      const execute = await this.tagihanModel.update(data, { where: { id: id_tagihan } });
      const imagePath = `images/buktiTransfer/${new Date().valueOf()}${file.originalname.replace(new RegExp(" ", "g"), "-")}`;
      fs.writeFile("./src/" + imagePath, file.buffer, function (err) {
        if (err) {
          return console.log(err);
        }
        console.log("The file was saved!");
      });
      return updatedTagihan
    } catch (error) {
      console.log(error)
      return false
    }



  }

  findOne(id: number) {
    return `This action returns a #${id} tagihan`;
  }

  create(createTagihanDto: CreateTagihanDto) {
    return 'This action adds a new tagihan';
  }

  update(id: number, updateTagihanDto: UpdateTagihanDto) {
    return `This action updates a #${id} tagihan`;
  }

  remove(id: number) {
    return `This action removes a #${id} tagihan`;
  }
}
