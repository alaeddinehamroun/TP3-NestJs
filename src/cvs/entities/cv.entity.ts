import { TiemstampEntity } from "src/generics/tiemstamp.entity";
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { SkillEntity } from "./skill.entity";
import { UserEntity } from "./user.entity";

@Entity('cv')
export class CvEntity extends TiemstampEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    firstname: string;

    @Column()
    age: number;

    @Column()
    cin: number;

    @Column()
    job: string;

    @Column()
    path: string;

    @ManyToMany(() => SkillEntity)
    @JoinTable({
        name: "cv_skills",
        joinColumn: {
            name: "cv",
            referencedColumnName: "id"
        },
        inverseJoinColumn: {
            name: "skill",
            referencedColumnName: "id"
        }
    })
    skills: SkillEntity[];

    @ManyToOne(() => UserEntity, (user: UserEntity) => user.cvs, { eager: true })
    user: UserEntity

}
