import { Module, forwardRef } from '@nestjs/common';
import { TagihanService } from './tagihan.service';
import { TagihanController } from './tagihan.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Tagihan } from './tagihan.model';
import { InboxModule } from '../inbox/inbox.module';

@Module({
  imports: [SequelizeModule.forFeature([Tagihan]), forwardRef(() => InboxModule)],
  controllers: [TagihanController],
  providers: [TagihanService]
})
export class TagihanModule { }
