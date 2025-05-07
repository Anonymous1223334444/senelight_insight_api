import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { ObjectType, Field, ID } from '@nestjs/graphql';
import { ImpactType } from 'src/impact-types/entities/impact-type.entity';
import { Report } from 'src/reports/entities/report.entity';
import { Outage } from 'src/outages/entities/outage.entity';

@ObjectType()
@Entity('users')
export class User {
    @Field(() => ID)
    @PrimaryGeneratedColumn()
    id: number;  
    
    @Field()
    @Column({ length: 100 }) 
    name: string;
    
    @Field()
    @Column({ unique: true, length: 255 })
    email: string;
    
    @Field({ nullable: true }) 
    @Column({ nullable: true, length: 20 })
    phone: string;
    
    @Column({select: false, length: 255 })
    password: string;
    
    @Field()
    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;
    
    @Field()
    @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updatedAt: Date;

    @OneToMany(() => Report, report => report.user)
    reports: Report[];

    @OneToMany(() => ImpactType, impactType => impactType.user)
    impactTypes: ImpactType[];

    @OneToMany(() => Outage, outage => outage.user)
    outages: Outage[];
}