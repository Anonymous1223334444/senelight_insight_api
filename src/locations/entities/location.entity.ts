import { ObjectType, Field, ID, Float } from '@nestjs/graphql';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Point } from 'geojson';

@ObjectType()
@Entity('locations')
export class Location {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  name: string;

  @Field()
  @Column()
  district: string;

  @Field(() => Float, { nullable: true })
  @Column('float', { nullable: true })
  get latitude(): number | null {
    if (this.point) {
      return this.point.coordinates[1];
    }
    return null;
  }

  @Field(() => Float, { nullable: true })
  @Column('float', { nullable: true })
  get longitude(): number | null {
    if (this.point) {
      return this.point.coordinates[0];
    }
    return null;
  }

  @Column({
    type: 'geography',
    spatialFeatureType: 'Point',
    srid: 4326,
    nullable: true
  })
  point: Point;

  @Field()
  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Field()
  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}