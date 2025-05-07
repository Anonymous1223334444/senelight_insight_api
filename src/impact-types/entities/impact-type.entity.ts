import { ObjectType, Field, ID } from '@nestjs/graphql';
import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  ManyToOne, 
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn
} from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { Report } from 'src/reports/entities/report.entity';

@ObjectType()
@Entity('impact_types')
export class ImpactType {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column({ length: 100 })
  name: string;

  @Field()
  @Column({ length: 8 }) 
  emoji: string;

  @Field()
  @Column()
  userId: number;

  @Field(() => User)
  @ManyToOne(() => User, user => user.impactTypes, {
    onDelete: 'CASCADE'
  })
  user: User;

  @Field()
  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Field()
  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @OneToMany(() => Report, report => report.impactType)
  reports: Report[];
}