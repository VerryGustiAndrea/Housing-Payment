import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseInterceptors, UploadedFile, UploadedFiles, } from '@nestjs/common';
import { TagihanService } from './tagihan.service';
import { InboxService } from '../inbox/inbox.service';
import { CreateTagihanDto, CreateTagihanImage } from './dto/create-tagihan.dto';
import { UpdateTagihanDto } from './dto/update-tagihan.dto';
import { ApprovalTagihanDto } from './dto/approval-tagihan.dto';
import { CheckoutTagihanDto } from './dto/checkout-tagihan.dto';
import { Response, ErrorResponse, ErrorResponseCustom } from '../library';
import { DateOnlyDataType } from 'sequelize/types';

import {
  FileFieldsInterceptor,
  FileInterceptor,
} from '@nestjs/platform-express';



@Controller('tagihan')
export class TagihanController {
  constructor(private readonly tagihanService: TagihanService,
    private inboxService: InboxService) { }

  //ADMIN
  @Get('getlisttagihan')
  async getlisttagihan(@Query('date') date: string) {
    const response = await this.tagihanService.GetListTagihan(date);
    if (response.length) {
      if (response.length == 1) {
        return Response(response[0], 'Data ditemukan', true);
      } else {
        return Response(response, 'Data ditemukan', true);
      }
    } else {
      return Response(response, 'Data tidak ditemukan', false);
    }
  }

  @Get('getlisthistory')
  async getlisthistory(@Query('date') date: string,) {
    const response = await this.tagihanService.getlisthistory(date);
    if (response.length) {
      if (response.length == 1) {
        return Response(response[0], 'Data ditemukan', true);
      } else {
        return Response(response, 'Data ditemukan', true);
      }
    } else {
      return Response(response, 'Data tidak ditemukan', false);
    }
  }

  @Post('inputtagihan')
  async inputtagihan(@Body() createTagihanDto: CreateTagihanDto) {
    console.log(createTagihanDto)
    try {
      const response = await this.tagihanService.inputtagihan(createTagihanDto);
      return Response(response, 'Success Input Tagihan', true);
    } catch (error) {
      return ErrorResponse(error, 500, null)
    }
  }

  @Post('checkout/:id')
  async checkout(@Body() checkoutTagihanDto: CheckoutTagihanDto, @Param('id') id: number) {
    console.log(checkoutTagihanDto)
    try {
      const response = await this.tagihanService.checkout(checkoutTagihanDto, id);
      return Response(response, 'Success Input Tagihan', true);
    } catch (error) {
      return ErrorResponse(error, 500, null)
    }
  }

  // @Post('approval')
  // async approval(@Body() approvalTagihanDto: ApprovalTagihanDto) {

  //   try {
  //     let response = await this.tagihanService.approval(approvalTagihanDto);
  //     if (response.status == 1) {
  //       //respon error gagal update
  //       return ErrorResponseCustom("Status gagal di update", false, null)
  //     } else if (response.status == 0 || response.status == 2) {
  //       const dataInbox = {
  //         user_id: approvalTagihanDto.user_id,
  //         title: response.message,
  //         message: "",
  //         date: ""
  //       }
  //       if (response.status == 2) {
  //         dataInbox.message = `Pembayaran anda pada ${new Date().toDateString()} berhasil di terima. Terimkasih atas pembayaran anda.`
  //       } else if (response.status == 0) {
  //         dataInbox.message = `Pembayaran anda pada ${new Date().toDateString()} ditolak, dikarenakan bukti transfer tidak sesuai atau tidak valid, mohon upload dan konfirmasi kembali kepada admin. Terimakasih.`
  //       }
  //       //add notification
  //       await this.inboxService.inputinbox(dataInbox);
  //       //respon success update
  //       return Response(null, "Status berhasil di update", true);
  //     } else {
  //       //respon error gagal update
  //       return { status: 1, message: "Status gagal di update" }
  //     }
  //   } catch (error) {
  //     return ErrorResponseCustom("Status gagal di update", false, null)
  //   }
  // }

  //WARGA
  @Get('gettagihanwarga')
  async gettagihan(@Query('date') date: string, @Query('user_id') user_id: number) {
    const response = await this.tagihanService.GetTagihanWarga(date, user_id);
    if (response.length) {
      if (response.length == 1) {
        return Response(response[0], 'Data ditemukan', true);
      } else {
        return Response(response, 'Data ditemukan', true);
      }
    } else {
      return Response(response, 'Data tidak ditemukan', false);
    }
  }

  @Get('gethistorywarga')
  async gethistorywarga(@Query('date') date: string, @Query('user_id') user_id: number) {
    const response = await this.tagihanService.gethistorywarga(date, user_id);
    if (response.length) {
      if (response.length == 1) {
        return Response(response[0], 'Data ditemukan', true);
      } else {
        return Response(response, 'Data ditemukan', true);
      }
    } else {
      return Response(response, 'Data tidak ditemukan', false);
    }
  }

  @Post('uploadfbuktitransfer/:id_tagihan')
  @UseInterceptors(FileInterceptor('foto'))
  async uploadfbuktitransfer(
    @UploadedFile() file: CreateTagihanImage,
    @Param('id_tagihan') id_tagihan: string
  ) {
    if (!file) {
      return ErrorResponse('Error Image not found', 500, null);
    }
    const response = await this.tagihanService.uploadfbuktitransfer(file, id_tagihan);
    if (response === false) {
      return ErrorResponse('Error Insert Data', 500, null);
    } else {
      return Response(response, 'Success input bukti transfer', true);
    }
  }


  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tagihanService.findOne(+id);
  }

  @Post()
  create(@Body() createTagihanDto: CreateTagihanDto) {
    return this.tagihanService.create(createTagihanDto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTagihanDto: UpdateTagihanDto) {
    return this.tagihanService.update(+id, updateTagihanDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tagihanService.remove(+id);
  }
}
