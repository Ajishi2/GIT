import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number; // Use a non-nullable type without `!`

  @Column({ type: 'varchar', length: 255 })
  username!: string; // Required field

  @Column({ type: 'varchar', length: 255, nullable: true })
  location?: string | null; // Optional field

  @Column({ type: 'varchar', length: 255, nullable: true })
  blog?: string | null; // Optional field

  @Column({ type: 'text', nullable: true })
  bio?: string | null; // Optional field

  @Column({ type: 'int', default: 0 })
  followers!: number; // Default value

  @Column({ type: 'int', default: 0 })
  following!: number; // Default value

  @Column({ type: 'int', default: 0 })
  public_repos!: number; // Default value

  @Column({ type: 'int', default: 0 })
  public_gists!: number; // Default value

  @Column({ type: 'boolean', default: true })
  isActive!: boolean; // Default value
}