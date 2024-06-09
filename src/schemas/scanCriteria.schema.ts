import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { ScanCriteriaDto } from 'src/dto/scanCriteria.dto';

export type ScanCriteriaDocument = HydratedDocument<ScanCriteria>;

@Schema()
export class ScanCriteria {

    @Prop({ required: true })
    status: string;

    @Prop({ required: true })
    owner: string;

    @Prop({ required: true })
    createdAt: Date;

    @Prop({ required: false })
    updatedAt: Date;

    @Prop({ required: false })
    lastScannedAt: Date;

    @Prop({ required: false })
    lastTriggeredAt: Date;

    @Prop({ required: false })
    name: string;

    @Prop({ required: false })
    minTVL: number;

    @Prop({ required: false })
    maxTVL: number;

    @Prop({ required: false })
    minAPYPercent: number;

    @Prop({ required: false })
    networks:string[];

    @Prop({ required: false })
    mandatoryRiskLevel:string[];
}

export const ScanCriteriaSchema = SchemaFactory.createForClass(ScanCriteria);