import { TiemstampEntity } from "src/generics/tiemstamp.entity";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('skill')
export class SkillEntity extends TiemstampEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    designation: string;
}