import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ObjectType, Field, ID, Float } from '@nestjs/graphql';
import { User } from 'src/users/entities/user.entity';
import { Point } from 'geojson';

@ObjectType()
@Entity('outages')
export class Outage {
    @Field(() => ID)
    @PrimaryGeneratedColumn()
    id: number;

    @Field()
    @Column({ length: 255 })
    description: string;

    @Field(() => Float, { nullable: true })
    @Column('float', { nullable: true })
    get latitude(): number | null {
        if (this.location) {
            return this.location.coordinates[1];
        }
        return null;
    }

    @Field(() => Float, { nullable: true })
    @Column('float', { nullable: true })
    get longitude(): number | null {
        if (this.location) {
            return this.location.coordinates[0];
        }
        return null;
    }

    @Column({
        type: 'geography',
        spatialFeatureType: 'Point',
        srid: 4326,
        nullable: true
    })
    location: Point;

    @Field()
    @Column()
    reportCount: number;

    @Field()
    @Column()
    resolvedStatus: boolean;

    @Field()
    @Column()
    userId: number;

    @Field()
    @CreateDateColumn()
    startDate: Date;

    @Field({ nullable: true })
    @Column({ nullable: true })
    endDate: Date;

    @Field()
    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;
  
    @Field()
    @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updatedAt: Date;

    @ManyToOne(() => User, user => user.outages)
    user: User;
}