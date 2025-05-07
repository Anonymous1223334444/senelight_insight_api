import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ObjectType, Field, ID, Float } from '@nestjs/graphql';
import { User } from 'src/users/entities/user.entity';
import { ImpactType } from 'src/impact-types/entities/impact-type.entity';
import { NetworkStatus } from 'src/enums/network-status.enum';

@ObjectType()
@Entity('reports')
export class Report {
    @Field(() => ID)
    @PrimaryGeneratedColumn()
    id: number;

    @Field()
    @Column({ length: 255 })
    description: string;

    @Field()
    @Column({ type: 'text', nullable: true })
    sentimentText: string;

    @Field(() => Float, { nullable: true })
    @Column('decimal', { precision: 15, scale: 10, nullable: true })
    latitude: number;

    @Field(() => Float, { nullable: true })
    @Column('decimal', { precision: 15, scale: 10, nullable: true })
    longitude: number;

    @Field()
    @Column()
    impactTypeId: number;

    @Field()
    @Column()
    userId: number;

    @Field(() => NetworkStatus)
    @Column({
        type: 'enum',
        enum: NetworkStatus,
        default: NetworkStatus.PENDING
    })
    networkStatus: NetworkStatus;

    @Field()
    @CreateDateColumn()
    reportDate: Date;

    @Field()
    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;
  
    @Field()
    @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updatedAt: Date;

    @ManyToOne(() => ImpactType, impactType => impactType.reports)
    impactType: ImpactType;

    @ManyToOne(() => User, user => user.reports)
    user: User;
}