import { TiemstampEntity } from "src/generics/tiemstamp.entity";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { CvEntity } from "./cv.entity";


@Entity("user")
export class UserEntity extends TiemstampEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    username: string;

    @Column()
    email: string;

    @Column()
    password: string;

    @Column()
    cvs: CvEntity[];
}