import { Entity, Column, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/users.entity';
export enum MemberStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

@Entity()
export class Member {
  @PrimaryColumn()
  id: string; // this can match userId or your membershipNumber

  @Column()
  userId: string;

  @Column()
  membershipNumber: string;

  @Column()
  phone: string;

  @Column({ type: 'enum', enum: MemberStatus, default: MemberStatus.ACTIVE })
  status: MemberStatus;

  @Column({ type: 'int', default: 5 })
  borrowingLimit: number;

   @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;
}
